'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { KEYUTIL, Signature } from 'jsrsasign';
// import { useRouter } from 'next/navigation';
import { DocumentOption } from './interface/documentOption';
import { TemplateOption } from './interface/templateOption';
import { SignitureBody, Credentials } from './interface/auth';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    EformSignDocument: any;
    EformSignTemplate: any;
  }
}

// tntnteoskfk@gmail.com
// tlsghk6970!AA
export default function EformSignPage() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [signature, setSignature] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [execution_time, setExecution_time] = useState('');

  // const router = useRouter();

  // 아래의 키 정보는 디비에서 관리해야함.
  // eformsign signature 검증유형의 api key
  const apiKey = 'cc9a25be-ffbd-40c7-bdaa-56134cda4c48';
  // eformsign signature 검증유형의 secret key
  const secretKey =
    '3041020100301306072a8648ce3d020106082a8648ce3d030107042730250201010420c4cee584ca0dccae20342cb95d2c5924874de37137bd750a97b41633bedcf1a5';

  const createTemplateWithUnstructuredFormOption: TemplateOption = {
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

  const signTemplateByTemplateIdOption: DocumentOption = {
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
      template_id: '', // template id 입력(필수!)
    },
  };

  // jsrsasign 사용하여 서명 생성
  const createSignature = async () => {
    try {
      const execution_time = Date.now() + '';
      const privateKey = KEYUTIL.getKeyFromPlainPrivatePKCS8Hex(secretKey);

      const _signature = new Signature({ alg: 'SHA256withECDSA' });
      _signature.init(privateKey);
      _signature.updateString(execution_time);

      const signature = _signature.sign();

      setSignature(signature);
      setExecution_time(execution_time);
      return {
        signature: signature,
        execution_time: execution_time,
      } as unknown as SignitureBody;
    } catch (error) {
      console.error(error);
    }
  };

  // Next.js에서 환경에 따라 Base64 인코딩
  const encodeToBase64 = (str: string) => {
    if (typeof window === 'undefined')
      // Node.js 환경
      return Buffer.from(str).toString('base64');

    return btoa(str); // 브라우저 환경
  };

  // 서명키를 사용하여 이폼사인에서 발급받은 Access Token을 요청
  async function getAccessTokenFromEformsign(param: SignitureBody) {
    // 1. Authorize: 이폼사인에서 발급받은 API 키를 Base64로 인코딩한 값 입력
    const authorizeValue = encodeToBase64(apiKey);

    // 2. Header: 생성한 서명값(eformsign_signature) (* 참고: API 키 발급 시 설정한 검증유형에 따라 다름)
    const headers = {
      Accept: 'application/json;charset=utf-8',
      eformsign_signature: param.signature,
      Authorization: 'Bearer ' + authorizeValue, // ! API 키를 Base64로 인코딩한 값 앞에 'Bearer ' 추가헤야 동작함!
      'Content-Type': 'application/json;charset=utf-8',
    };

    try {
      // 3. Request body: 서명 생성 시간(execution_time)과 계정 ID(member_id) 입력
      const response = await axios.post(
        'https://api.eformsign.com/v2.0/api_auth/access_token',
        {
          execution_time: param.execution_time,
          member_id: 'tntnteoskfk@gmail.com',
        },
        { headers }
      );
      console.log('서명 데이터:', response.data as Credentials);
      setAccessToken(response.data.oauth_token.access_token);
      setRefreshToken(response.data.oauth_token.refresh_token);
    } catch (error) {
      console.error('서명 생성 중 오류:', error);
    }
  }

  // eslint-disable-next-line no-unused-vars
  async function refreshAccessToken() {
    // 헤더 설정
    const headers = {
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json;charset=utf-8',
    };

    try {
      const response = await axios.post(
        `https://api.eformsign.com/v2.0/api_auth/refresh_token?refresh_token=${refreshToken}`,
        {}, // POST 요청 본문은 비워두거나 필요한 다른 데이터를 포함시킵니다.
        { headers }
      );

      console.log('새로고침된 토큰 데이터:', response.data);
      setRefreshToken(response.data.oauth_token.refresh_token);
    } catch (error) {
      console.error('토큰 새로고침 중 오류:', error);
    }
  }

  // 서명키를 사용하여 이폼사인에서 발급받은 Access Token을 요청
  async function getDocumentList() {
    // 1. Authorize: 이폼사인에서 발급받은 API 키를 Base64로 인코딩한 값 입력
    const authorizeValue = encodeToBase64(apiKey);
    console.log(authorizeValue);
    // 2. Header: 생성한 서명값(eformsign_signature) (* 참고: API 키 발급 시 설정한 검증유형에 따라 다름)
    // eslint-disable-next-line no-unused-vars
    const headers = {
      Accept: 'application/json;charset=utf-8',
      // eformsign_signature: signature,
      Authorization: 'Bearer ' + authorizeValue, // ! API 키를 Base64로 인코딩한 값 앞에 'Bearer ' 추가헤야 동작함!
      'Content-Type': 'application/json;charset=utf-8',
    };

    try {
      // const response = await axios.get(
      //   'https://api.eformsign.com/v2.0/api/documents',
      //   {
      //     params: {
      //       include_fields: true,
      //       include_histories: true,
      //       include_previous_status: true,
      //       include_next_status: true,
      //     },
      //     headers: headers,
      //   }
      // );Y2M5YTI1YmUtZmZiZC00MGM3LWJkYWEtNTYxMzRjZGE0YzQ4
      const response = await axios.get(
        'https://api.eformsign.com/v2.0/api/forms',
        { headers }
      );
      console.log('문서목록');
      console.log(response.data); // 응답 데이터를 콘솔에 출력
      console.log(response.data);
      console.table(response.data);
      console.table(response.data.data);
    } catch (error) {
      console.error('문서 목록요청 오류 :', error);
    }
  }

  const successSendDocs = () => {
    alert('문서 전송에 성공하였습니다.');
    // router.push('/', { scroll: false });
    getDocumentList();
  };

  const successCreateTemplate = async (response) => {
    if (response.type === 'template') {
      alert(
        '템플릿 생성되었습니다.\n' +
          '- document_id : ' +
          response.template_id +
          '\n- title : ' +
          response.template_name
      );
      await signDocsByTemplateId(response.template_id);
    }
  };
  const success_callback = (func: any) => async (response) => {
    if (response.code == '-1') func(response);
  };

  const error_callback = (response) => {
    alert(response.message);
  };

  const action_callback = (response) => {
    console.table(response.data);
  };

  const signDocsByTemplateId = async (template_id: string) => {
    alert('진입성공');
    if (window.EformSignDocument) {
      const eformsign = new window.EformSignDocument();

      signTemplateByTemplateIdOption.mode.template_id = template_id;

      await eformsign.document(
        signTemplateByTemplateIdOption,
        'eformsign_iframe',
        success_callback(successSendDocs),
        error_callback,
        action_callback
      );
      await eformsign.open();
    }
  };

  const createTemplateWithMyOwnDocs = async () => {
    if (window.EformSignTemplate) {
      const eformsign = new window.EformSignTemplate();

      await eformsign.template(
        createTemplateWithUnstructuredFormOption,
        'eformsign_iframe',
        success_callback(successCreateTemplate),
        error_callback,
        action_callback
      );
      await eformsign.open();
    }
  };

  useEffect(() => {
    // 1. 서명 생성
    // 2. 서명키를 사용하여 이폼사인에서 발급받은 Access Token을 요청
    // 3. 내 문서로 템플릿 생성
    createSignature().then((data: SignitureBody) =>
      getAccessTokenFromEformsign(data).then(() => {
        createTemplateWithMyOwnDocs();
        getDocumentList();
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
