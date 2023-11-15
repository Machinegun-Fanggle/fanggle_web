export interface SignitureBody {
  signature: string;
  execution_time: number;
}

export interface ApiKeyInfo {
  name: string;
  alias: string;
  company: CompanyDetails;
}

export interface CompanyDetails {
  company_id: string;
  name: string;
  api_url: string;
}

export interface OAuthTokenInfo {
  expires_in: number;
  token_type: string;
  refresh_token: string;
  access_token: string;
}

export interface Credentials {
  api_key: ApiKeyInfo;
  oauth_token: OAuthTokenInfo;
}
