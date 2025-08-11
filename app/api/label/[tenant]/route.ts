import { NextRequest } from "next/server";
import { getTenantConfig } from "@/lib/tenants";
import { corsHeaders, findIdsForLabels, jsonResponse, splitAndNormalize } from "@/lib/utils";
import type { ApiErrorBody, LabelRequestBody, LabelResponseBody } from "@/types";

export const runtime = "edge";

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: NextRequest, { params }: { params: { tenant: string } }): Promise<Response> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const tenant = params.tenant;

  try {
    const tenantConfig = getTenantConfig(tenant);
    if (!tenantConfig) {
      const body: ApiErrorBody = { error: "Tenant não encontrado" };
      return jsonResponse(body, { status: 404, headers: corsHeaders() });
    }

    // Validação e parsing do body
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      const body: ApiErrorBody = { error: "JSON inválido no corpo da requisição" };
      return jsonResponse(body, { status: 400, headers: corsHeaders() });
    }

    const body = json as Partial<LabelRequestBody>;
    if (!body || typeof body.inputValue !== "string" || body.inputValue.trim().length === 0) {
      const error: ApiErrorBody = { error: "Campo 'inputValue' é obrigatório e deve ser string não vazia" };
      return jsonResponse(error, { status: 400, headers: corsHeaders() });
    }

    const labels = splitAndNormalize(body.inputValue);
    const ids = findIdsForLabels(labels, tenantConfig.mappings);
    const response: LabelResponseBody = ids;
    const durationMs = Date.now() - start;
    console.log(JSON.stringify({ level: "info", requestId, tenant, durationMs, matched: ids.length }));
    return jsonResponse(response, { status: 200, headers: corsHeaders() });
  } catch (error) {
    const durationMs = Date.now() - start;
    console.error(JSON.stringify({ level: "error", requestId, tenant, durationMs, error: String(error) }));
    const body: ApiErrorBody = { error: "Erro interno" };
    return jsonResponse(body, { status: 500, headers: corsHeaders() });
  }
}


