'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { KEYUTIL, Signature } from 'jsrsasign';
import { useRouter } from 'next/navigation';
import { DocumentOption } from './documentOption';
import { TemplateOption } from './templateOption';
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    EformSignDocument: any;
    EformSignTemplate: any;
  }
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
  const router = useRouter();

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

  // Next.js에서 환경에 따라 Base64 인코딩
  const encodeToBase64 = (str) => {
    if (typeof window === 'undefined')
      // Node.js 환경
      return Buffer.from(str).toString('base64');

    return btoa(str); // 브라우저 환경
  };

  async function postAccessToken(param: SignitureBody) {
    // 1. Authorize: 이폼사인에서 발급받은 API 키를 Base64로 인코딩한 값 입력
    // 2. Header: 생성한 서명값(eformsign_signature) (* 참고: API 키 발급 시 설정한 검증유형에 따라 다름)
    // 3. Request body: 서명 생성 시간(execution_time)과 계정 ID(member_id) 입력

    // 'Authorize' 값을 Base64로 인코딩합니다.
    // const authorizeValue = Buffer.from(
    //   'cc9a25be-ffbd-40c7-bdaa-56134cda4c48'
    // ).toString('base64');

    // const authorizeValue = btoa('cc9a25be-ffbd-40c7-bdaa-56134cda4c48');

    const authorizeValue = encodeToBase64(
      'cc9a25be-ffbd-40c7-bdaa-56134cda4c48'
    );

    const headers = {
      Accept: 'application/json;charset=utf-8',
      eformsign_signature: param.signature,
      Authorization: 'Bearer ' + authorizeValue,
      'Content-Type': 'application/json;charset=utf-8',
    };

    try {
      const response = await axios.post(
        'https://api.eformsign.com/v2.0/api_auth/access_token',
        {
          execution_time: param.execution_time, // 현재 시각을 사용합니다.
          member_id: 'tntnteoskfk@gmail.com',
        },
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

  // eslint-disable-next-line no-unused-vars
  const handleDocument = async (template_id: string, document_id: string) => {
    if (window.EformSignDocument) {
      const eformsign = new window.EformSignDocument();

      const document_option: DocumentOption = {
        company: {
          id: 'a3d3398c6b6e4537a4863ad26981463d', // Company ID 입력
          country_code: 'kr', // 국가 코드 입력 (ex: kr)
          user_key: 'tntnteoskfk@gmail.com', // 임베딩한 고객 측 시스템에 로그인한 사용자의 unique key. 브라우저 쿠키의 이폼사인 로그인 정보와 비교        },
        },
        user: {
          type: '01',
          id: 'tntnteoskfk@gmail.com',
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        mode: {
          type: '01', // 모드 (01: 새 문서 작성, 02: 문서 처리, 03: 문서 미리보기)
          template_id: template_id, // template id 입력
          // document_id: '', // document_id 입력
        },
        return_fields: ['고객명'], // Success Callback에서 값을 확인할 수 있도록 넘겨줄 필드명
      };

      const success_callback = async (response) => {
        if (response.code == '-1') {
          alert('문서 전송에 성공하였습니다.');
          router.push('/', { scroll: false });
        }
      };

      const error_callback = (response) => {
        alert(response.message);
      };

      const action_callback = (response) => {
        console.table(response.data);
      };

      eformsign.document(
        document_option,
        'eformsign_iframe',
        success_callback,
        error_callback,
        action_callback
      );
      eformsign.open();
    }
  };

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
  };

  const handleTemplate = async () => {
    if (window.EformSignTemplate) {
      const eformsign = new window.EformSignTemplate();

      const success_callback = (response) => {
        if (response.type === 'template') {
          if ('-1' == response.code) {
            alert(
              '템플릿 생성되었습니다.\n' +
                '- document_id : ' +
                response.template_id +
                '\n- title : ' +
                response.template_name
            );
            handleDocument(response.template_id, response.template_name);
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
      };

      const error_callback = (response) => {
        alert(
          '템플릿 생성에 실패하였습니다.\n' +
            '- code : ' +
            response.code +
            '\n- message : ' +
            response.message
        );
      };

      const action_callback = (response) => {
        console.table(response.data);
      };

      eformsign.template(
        template_option,
        'eformsign_iframe',
        success_callback,
        error_callback,
        action_callback
      );
      await eformsign.open();
    }
  };

  useEffect(() => {
    test().then((data: SignitureBody) =>
      postAccessToken(data).then(() => {
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
