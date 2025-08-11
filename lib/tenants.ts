import tenantsFile from "@/config/tenants.json";
import type { TenantsFileSchema, TenantConfig, TenantKey } from "@/types";

const tenants: TenantsFileSchema = tenantsFile as TenantsFileSchema;

export function getTenantConfig(tenant: TenantKey): TenantConfig | null {
  return tenants[tenant] ?? null;
}

export function listTenants(): string[] {
  return Object.keys(tenants);
}


