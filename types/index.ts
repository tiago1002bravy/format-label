export type TenantKey = string;

export interface TenantMappings {
  [label: string]: string; // label normalizada -> ID do ClickUp
}

export interface TenantConfig {
  name: string;
  mappings: TenantMappings;
}

export interface TenantsFileSchema {
  [tenantKey: TenantKey]: TenantConfig;
}

export interface LabelRequestBody {
  inputValue: string;
}

export type LabelResponseBody = string[];

export interface ApiErrorBody {
  error: string;
  details?: unknown;
}


