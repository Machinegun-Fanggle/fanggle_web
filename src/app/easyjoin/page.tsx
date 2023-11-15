'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { KEYUTIL, Signature } from 'jsrsasign';
export {}; // 이 라인을 추가하여 파일을 모듈로 만들어야 합니다.

// eformsign 라이브러리 타입 정의를 여기에 추가하거나, 제공되는 타입을 import합니다.
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    EformSignDocument: any; // 'any' 대신에 EformSignDocument의 실제 타입을 사용해야 합니다.
    EformSignTemplate: any; // 'any' 대신에 EformSignTemplate의 실제 타입을 사용해야 합니다.
  }
}

// interface DocumentOption {
//   company: {
//     id: string;
//     country_code: string;
//     user_key: string;
//   };
//   user: {
//     type: string;
//     template_type?: string;
//     id: string;
//     access_token: string;
//     refresh_token: string;
//     external_token: string;
//     external_user_info: {
//       name: string;
//     };
//   };
//   // 나머지 옵션 타입을 여기에 정의...
// }

interface TemplateOption {
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

interface SignitureBody {
  signature: string;
  execution_time: number;
}

interface ApiKeyInfo {
  name: string;
  alias: string;
  company: CompanyDetails;
}

interface CompanyDetails {
  company_id: string;
  name: string;
  api_url: string;
}

interface OAuthTokenInfo {
  expires_in: number;
  token_type: string;
  refresh_token: string;
  access_token: string;
}

interface Credentials {
  api_key: ApiKeyInfo;
  oauth_token: OAuthTokenInfo;
}

// tntnteoskfk@gmail.com
// tlsghk6970!AA
export default function EformSignPage() {
  const privateKeyHex =
    '3041020100301306072a8648ce3d020106082a8648ce3d030107042730250201010420c4cee584ca0dccae20342cb95d2c5924874de37137bd750a97b41633bedcf1a5';

  // eslint-disable-next-line no-unused-vars
  let accessToken = '';
  // eslint-disable-next-line no-unused-vars
  let refreshToken = '';
  const test = async () => {
    try {
      const execution_time = Date.now() + '';
      // User-Data-Here
      const privateKey = KEYUTIL.getKeyFromPlainPrivatePKCS8Hex(privateKeyHex);

      // Sign
      const s_sig = new Signature({ alg: 'SHA256withECDSA' });
      s_sig.init(privateKey);
      s_sig.updateString(execution_time);
      const signature = s_sig.sign();

      console.log('execution_time:', execution_time);
      console.log('signature:', signature);

      return {
        signature: signature,
        execution_time: execution_time,
      } as unknown as SignitureBody;
      // 응답으로 서명 데이터 반환
    } catch (error) {
      console.error(error);
    }
  };

  async function postAccessToken(param: SignitureBody) {
    // 1. Authorize: 이폼사인에서 발급받은 API 키를 Base64로 인코딩한 값 입력
    // 2. Header: 생성한 서명값(eformsign_signature) (* 참고: API 키 발급 시 설정한 검증유형에 따라 다름)
    // 3. Request body: 서명 생성 시간(execution_time)과 계정 ID(member_id) 입력
    const postData = {
      execution_time: param.execution_time, // 현재 시각을 사용합니다.
      member_id: 'tntnteoskfk@gmail.com',
    };

    // 'Authorize' 값을 Base64로 인코딩합니다.
    // const authorizeValue = Buffer.from(
    //   'cc9a25be-ffbd-40c7-bdaa-56134cda4c48'
    // ).toString('base64');

    // const authorizeValue = btoa('cc9a25be-ffbd-40c7-bdaa-56134cda4c48');

    // Next.js에서 환경에 따라 Base64 인코딩
    const encodeToBase64 = (str) => {
      // Node.js 환경
      if (typeof window === 'undefined') {
        return Buffer.from(str).toString('base64');
      }
      // 브라우저 환경
      return btoa(str);
    };

    const authorizeValue = encodeToBase64(
      'cc9a25be-ffbd-40c7-bdaa-56134cda4c48'
    );

    const headers = {
      Accept: 'application/json;charset=utf-8',
      eformsign_signature: param.signature,
      Authorization: 'Bearer ' + authorizeValue,
      'Content-Type': 'application/json;charset=utf-8',
    };

    console.log(param.execution_time + ',,,' + param.signature);
    try {
      const response = await axios.post(
        'https://api.eformsign.com/v2.0/api_auth/access_token',
        postData,
        { headers }
      );
      console.log('서명 데이터:', response.data as Credentials);
      accessToken = response.data.oauth_token.access_token;
      refreshToken = response.data.oauth_token.refresh_token;
    } catch (error) {
      console.error('서명 생성 중 오류:', error);
    }
  }

  // async function refreshAccessToken() {
  //   // 헤더 설정
  //   const headers = {
  //     Accept: 'application/json;charset=utf-8',
  //     'Content-Type': 'application/json;charset=utf-8',
  //   };

  //   try {
  //     const response = await axios.post(
  //       `https://api.eformsign.com/v2.0/api_auth/refresh_token?refresh_token=${refreshToken}`,
  //       {}, // POST 요청 본문은 비워두거나 필요한 다른 데이터를 포함시킵니다.
  //       { headers }
  //     );

  //     console.log('새로고침된 토큰 데이터:', response.data);
  //     refreshToken = response.data.oauth_token.refresh_token;
  //   } catch (error) {
  //     console.error('토큰 새로고침 중 오류:', error);
  //   }
  // }

  //   const handleDocument = async () => {
  //     if (window.EformSignDocument) {
  //       const eformsign = new window.EformSignDocument();

  //       const document_option: DocumentOption = {
  //         company: {
  //           id: process.env.COMPANY_ID,
  //           country_code: 'kr',
  //           user_key: '',
  //         },
  //         user: {
  //           type: '01',
  //           template_type: 'unstructured_form',
  //           id: 'tntnteoskfk@gmail.com',
  //           access_token: '',
  //           refresh_token: '',
  //           external_token: '',
  //           external_user_info: {
  //             name: '',
  //           },
  //         },
  //       };
  //       const success_callback = (response) => {
  //         console.log(response.code);
  //         if (response.code == '-1') {
  //           console.log(response.document_id);
  //           console.log(response.field_values['company_name']);
  //           console.log(response.field_values['position']);
  //         }
  //       };

  //       const error_callback = (response) => {
  //         console.log(response.code);
  //         alert(response.message);
  //       };

  //       const action_callback = (response) => {
  //         console.table(response.data);
  //       };

  //       eformsign.document(
  //         document_option,
  //         'eformsign_iframe',
  //         success_callback,
  //         error_callback,
  //         action_callback
  //       );
  //       eformsign.open();
  //     }
  //   };

  const handleTemplate = async () => {
    console.log('진입성공');
    if (window.EformSignTemplate) {
      const eformsign = new window.EformSignTemplate();

      const template_option: TemplateOption = {
        company: {
          id: 'a3d3398c6b6e4537a4863ad26981463d', // Company ID 입력
          country_code: 'kr', // 국가 코드 입력 (ex: kr)
          user_key: 'tntnteoskfk@gmail.com', // 임베딩한 고객 측 시스템에 로그인한 사용자의 unique key. 브라우저 쿠키의 이폼사인 로그인 정보와 비교
        },

        mode: {
          type: '01', // 01 : 생성
          template_type: 'unstructured_form', // form : 템플릿 관리, unstructured_form: 내 파일로 문서 작성
        },
        layout: {
          lang_code: 'ko', // 이폼사인 언어. ko, en, ja
          header: true, // 상단바 (푸른색) 표시 여부. 미표시 시 액션 버튼을 통해 전송 등 동작 가능
          footer: false, // 하단바 (이폼사인 로고, 언어 설정 등) 표시 여부.
        },
        user: {
          id: 'tntnteoskfk@gmail.com',
          access_token: accessToken, // Access Token 입력 (OpenAPI Access Token 참조)
          refresh_token: refreshToken, // Refresh Token 입력 (OpenAPI Access Token 참조)
        },
        // prefill: {
        //   template_name: '템플릿 임베딩 테스트_신규',
        //   fields: [
        //     {
        //       id: '텍스트 1',
        //       value: '가나다',
        //       enabled: true,
        //       required: true,
        //     },
        //     {
        //       id: '텍스트 2',
        //       value: '라마바',
        //       enabled: true,
        //       required: true,
        //     },
        //   ],
        //   step_settings: [
        //     {
        //       step_type: '05', // 05: 참여자, 06: 검토자
        //       step_name: '참여자 2',
        //       use_mail: true,
        //       use_sms: true,
        //       use_alimtalk: true,
        //       recipients: [
        //         {
        //           id: 'test2@forcs.com',
        //           name: 'John Doe',
        //         },
        //         {
        //           id: '5a3e47a2f5a04909836ddf4189d10fc4',
        //           name: '그룹3',
        //         },
        //       ],
        //       auth: {
        //         valid: {
        //           day: '7',
        //           hour: '7',
        //         },
        //       },
        //       additional_auth: {
        //         // 추가 인증 수단
        //         use_pincode: true, //이메일/SMS 핀코드 인증
        //         use_pincode_result: true, //문서 최종 완료 시 이메일/SMS 핀코드 인증 사용
        //         use_mobile_verifyAuth: true, //휴대폰 본인 확인
        //         use_mobile_verifyAuth_result: true, //문서 최종 완료 시 휴대폰 본인 확인 사용
        //       },
        //     },
        //   ],
        //   is_form_id_numbering: false,
        //   disabled_form_id: true,
        //   quick_processing: false,
        // },
        // template_file: {
        //   name: '첨부테스트.pdf',
        //   mime: '@file/octet-stream',
        //   data: 'JVBERi0xLjUNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhrby1LUikgL1N0cnVjdFRyZWVSb290IDE1IDAgUi...',
        // },
      };

      const success_callback = (response) => {
        if (response.type === 'template') {
          console.log(response.template_id);
          console.log(response.template_name);
          console.table(response.step_settings);
          if ('-1' == response.code) {
            alert(
              '템플릿 생성되었습니다.\n' +
                '- document_id : ' +
                response.template_id +
                '\n- title : ' +
                response.template_name
            );
          } else {
            alert(
              '템플릿 생성에 실패하였습니다.\n' +
                '- code : ' +
                response.code +
                '\n- message : ' +
                response.message
            );
          }
        }
        // window.close();
        console.log(response);
      };

      const error_callback = (response) => {
        alert(
          '템플릿 생성에 실패하였습니다.\n' +
            '- code : ' +
            response.code +
            '\n- message : ' +
            response.message
        );
        console.log(response.code);
        console.log(response.message);
        console.log(response);
        // window.close();
      };

      const action_callback = (response) => {
        console.table(response.data);
        console.log(response);
      };

      eformsign.template(
        template_option,
        'eformsign_iframe',
        success_callback,
        error_callback,
        action_callback
      );
      eformsign.open();
      console.log('됐나?');
    }
  };

  useEffect(() => {
    test().then((data: SignitureBody) =>
      postAccessToken(data).then(() => {
        // handleDocument();
        handleTemplate();
      })
    );
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Script
        src="https://www.eformsign.com/plugins/jquery/jquery.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://www.eformsign.com/lib/js/efs_embedded_v2.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('eformsign script loaded');
        }}
      />
      <Script
        src="https://www.eformsign.com/lib/js/efs_embedded_form.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('eformsign script loaded');
        }}
      />

      <iframe
        id="eformsign_iframe"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
