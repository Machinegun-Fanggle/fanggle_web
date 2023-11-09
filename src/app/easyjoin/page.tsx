'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { KEYUTIL, Signature } from 'jsrsasign';
export {}; // 이 라인을 추가하여 파일을 모듈로 만들어야 합니다.

// eformsign 라이브러리 타입 정의를 여기에 추가하거나, 제공되는 타입을 import합니다.
declare global {
  interface Window {
    EformSignDocument: any; // 'any' 대신에 EformSignDocument의 실제 타입을 사용해야 합니다.
  }
}

interface DocumentOption {
  company: {
    id: string;
    country_code: string;
    user_key: string;
  };
  user: {
    type: string;
    id: string;
    access_token: string;
    refresh_token: string;
    external_token: string;
    external_user_info: {
      name: string;
    };
  };
  // 나머지 옵션 타입을 여기에 정의...
}

interface SignitureBody {
  signature: string;
  execution_time: number;
}
// tntnteoskfk@gmail.com
// tlsghk6970!A
export default function EformSignPage() {
  const privateKeyHex =
    '3041020100301306072a8648ce3d020106082a8648ce3d030107042730250201010420c4cee584ca0dccae20342cb95d2c5924874de37137bd750a97b41633bedcf1a5';

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

      console.log('!!!!!!!!!!!!!!!data:', execution_time);
      console.log('!!!!!!!!!!!!!!!eformsign_signature:', signature);

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
    const postData = {
      execution_time: param.execution_time, // 현재 시각을 사용합니다.
      member_id: 'tntnteoskfk@gmail.com',
    };

    // 1. Authorize: 이폼사인에서 발급받은 API 키를 Base64로 인코딩한 값 입력
    // 2. Header: 생성한 서명값(eformsign_signature) (* 참고: API 키 발급 시 설정한 검증유형에 따라 다름)
    // 3. Request body: 서명 생성 시간(execution_time)과 계정 ID(member_id) 입력

    // 'Authorize' 값을 Base64로 인코딩합니다.
    const authorizeValue = Buffer.from(
      'cc9a25be-ffbd-40c7-bdaa-56134cda4c48'
    ).toString('base64');

    console.log(param.execution_time + ',,,' + param.signature);
    try {
      const response = await axios.post(
        'https://api.eformsign.com/v2.0/api_auth/access_token',
        postData,
        {
          headers: {
            Authorize: authorizeValue, // Base64 인코딩된 'Authorize' 헤더를 추가합니다.
            Signature: param.signature, // 'Signature' 헤더에 인자로 받은 서명을 추가합니다.
          },
        }
      );
      console.log('서명 데이터:', response.data);
    } catch (error) {
      console.error('서명 생성 중 오류:', error);
    }
  }

  useEffect(() => {
    test().then((data: SignitureBody) => postAccessToken(data));

    if (window.EformSignDocument) {
      const eformsign = new window.EformSignDocument();

      const document_option: DocumentOption = {
        company: {
          id: process.env.COMPANY_ID,
          country_code: 'kr',
          user_key: '',
        },
        user: {
          type: '01',
          id: 'test@test.com',
          access_token: '',
          refresh_token: '',
          external_token: '',
          external_user_info: {
            name: '',
          },
        },
      };
      const success_callback = (response) => {
        console.log(response.code);
        if (response.code == '-1') {
          console.log(response.document_id);
          console.log(response.field_values['company_name']);
          console.log(response.field_values['position']);
        }
      };

      const error_callback = (response) => {
        console.log(response.code);
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

      <iframe
        id="eformsign_iframe"
        width="1920"
        height="1080"
        style={{ border: 0 }}
      />
    </div>
  );
}
