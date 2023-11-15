// eslint-disable-next-line no-unused-vars
export interface TemplateOption {
  company: {
    id: string;
    country_code: string;
    user_key: string;
  };
  mode: {
    type: string;
    template_id?: string;
    template_type: string;
  };
  layout?: {
    lang_code: string;
    header: boolean;
    footer: boolean;
  };
  user?: {
    id: string;
    access_token: string;
    refresh_token: string;
  };
  prefill?: {
    template_name: string;
    fields: Array<{
      id: string;
      value: string;
      enabled: boolean;
      required: boolean;
    }>;
    step_settings: Array<{
      step_type: string;
      step_name: string;
      use_mail: boolean;
      use_sms: boolean;
      use_alimtalk: boolean;
      recipients: Array<{
        id: string;
        name: string;
      }>;
      auth: {
        valid: {
          day: string;
          hour: string;
        };
      };
      additional_auth: {
        use_pincode: boolean;
        use_pincode_result: boolean;
        use_mobile_verifyAuth: boolean;
        use_mobile_verifyAuth_result: boolean;
      };
    }>;
    is_form_id_numbering: boolean;
    disabled_form_id: boolean;
    quick_processing: boolean;
  };
  template_file?: {
    name: string;
    mime: string;
    data: string;
  };
}
