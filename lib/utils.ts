import type { TenantMappings } from "@/types";

export function normalizeLabel(raw: string): string {
  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function splitAndNormalize(input: string): string[] {
  const normalizedSeparators = input.replace(/Ω/g, ",");
  return normalizedSeparators
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildNormalizationIndex(mappings: TenantMappings): Map<string, string> {
  const index = new Map<string, string>();
  for (const [label, id] of Object.entries(mappings)) {
    index.set(normalizeLabel(label), id);
  }
  return index;
}

export function findIdsForLabels(labels: string[], mappings: TenantMappings): string[] {
  const index = buildNormalizationIndex(mappings);
  const ids: string[] = [];

  for (const label of labels) {
    const normalized = normalizeLabel(label);
    const exact = index.get(normalized);
    if (exact) {
      ids.push(exact);
      continue;
    }

    // Similaridade simples: começa com / inclui
    let matchedId: string | undefined;
    for (const [key, value] of index.entries()) {
      if (key === normalized || key.startsWith(normalized) || key.includes(normalized)) {
        matchedId = value;
        break;
      }
    }
    if (matchedId) {
      ids.push(matchedId);
    }
  }

  return ids;
}

export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    },
    ...init,
  });
}

export function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}


