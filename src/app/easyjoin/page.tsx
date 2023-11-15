'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { KEYUTIL, Signature } from 'jsrsasign';
export {}; // 이 라인을 추가하여 파일을 모듈로 만들어야 합니다.

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    EformSignDocument: any; // 'any' 대신에 EformSignDocument의 실제 타입을 사용해야 합니다.
    EformSignTemplate: any; // 'any' 대신에 EformSignTemplate의 실제 타입을 사용해야 합니다.
  }
}

// eslint-disable-next-line no-unused-vars
interface DocumentOption {
  company: {
    id: string; // Company ID 입력 (회사 관리 - 회사 정보에서 확인)
    country_code?: string; // 국가 코드 입력 (예: kr, 회사 관리 - 회사 정보의 국가에 대한 코드를 지정. 비필수이나, 입력 시 빠른 open이 가능함)
    user_key?: string; // 임베딩한 고객 측 시스템에 로그인한 사용자의 unique key. 브라우저 쿠키의 이폼사인 로그인 정보와 비교 (임베딩하는 고객사의 시스템에서 해당 유저가 누구인지를 명확히 설정하기 위해 eformsign에 넘겨주는 사용자 계정 정보임브라우저에 이미 로그인 정보가 있을 경우, 해당 key와 비교하여 일치하지 않는 경우 로그아웃 처리됨)
  };
  user?: {
    type: string; // 사용자 구분 (01: 회사 멤버, 02: 외부 작성자)
    id?: string; // 사용자 ID(사용자 ID/이메일 입력)
    access_token?: string; // Access Token 입력 (eformsign API 사용하기 - Access Token 발급 참조)
    refresh_token?: string; // Refresh Token 입력 (eformsign API 사용하기 - Access Token 발급 참조)
    external_token?: string; // 외부자 처리 시 사용자를 인증할 External Token 입력 (Webhook에서 제공, 멤버가 아닌 사용자가 문서 작성 또는 처리 시 필수 입력)
    external_user_info?: {
      name: string; // 외부자 처리 시 외부자 이름 입력 (멤버가 아닌 사용자가 문서 작성 또는 처리 시 필수 입력)
    };
  };
  mode: {
    type: string; // 모드 (01: 새 문서 작성, 02: 문서 처리, 03: 문서 미리보기)
    template_id: string; // template id 입력
    document_id?: string; // document_id 입력, 문서 처리, 미리 보기 시 필수 입력
  };
  layout?: {
    lang_code: string; // 이폼사인 언어 설정 (ko: 한국어, en: 영어, ja: 일본어)
    header?: boolean; // 헤더(상단바) 표시 여부. 미입력 시 기본값: true. 헤더 미표시(false) 시 ‘전송’ 등의 기능 버튼도 표시되지 않으므로, 별도로 기능 버튼을 생성해주어야 함(화면 로드 시_액션 버튼 생성 참조)
    footer?: boolean; // 푸터 표시 여부. 미입력 시 기본값: true
  };
  prefill?: {
    document_name?: string; // 문서 제목 입력
    fields?: {
      // 필드 설정 Object의 목록
      id?: string; // 필드명, 필드 설정 Object내에서는 필수 (필드명을 기준으로 설정 적용)
      value?: string; // 필드값, -지정하지 않을 경우, 신규 작성 시 템플릿 설정의 필드 설정 옵션을 따름-설정할 경우, 템플릿 설정의 필드 설정보다 우선 순위 높음
      enabled?: boolean; // 활성화 여부, -지정하지 않을 경우, 템플릿 설정의 항목 제어 옵션에 따름-설정할 경우, 템플릿 설정의 항목 제어 옵션보다 우선 순위 높음
      required?: boolean; // 필수 여부, -지정하지 않을 경우, 템플릿 설정의 항목 제어 옵션에 따름-설정할 경우, 템플릿 설정의 항목 제어 옵션보다 우선 순위 높음
    }[];
    recipients?: {
      // 수신자 정보 Object의 목록
      step_idx?: string; // 워크플로우 순서. 수신자가 있을 경우 2부터 시작, recipients 내 각 객체에 필수 설정되어야 함, 첫 번째 수신자: “2”, 두 번째 이후 수신자: 순서에 따라 1씩 증가
      step_type?: string; // 워크플로우 수신자 유형, recipients 내 각 객체에 필수 설정되어야 함-기존 워크플로우: “01”(완료), “02”(결재), “03”(외부 수신자), “04”(내부 수신자)-신규 워크플로우: “01”(완료), “05”(참여자), “06”(검토자)
      recipient_type?: string; // 수신자 구분. step_type이 02(결재), 03(외부 수신자), 04(내부 수신자)인 경우에만 필수 입력, 01: 수신자가 회사 멤버인 경우, 02: 외부 수신자인 경우
      name?: string; // 수신자 이름
      id?: string; // 수신자 ID/이메일
      email?: string; // 이메일 주소. 외부 수신자의 이메일 주소 입력, step_type이 03(외부 수신자)인 경우에만 사용-외부 수신자의 이메일 주소 입력
      sms?: string; // 수신자 핸드폰 번호
      use_mail?: boolean; // 이메일 발송 여부, step_type이 05(참여자) 혹은 06(검토자)인 경우에만 사용
      use_sms?: boolean; // SMS 발송 여부, step_type이 05(참여자) 혹은 06(검토자)인 경우에만 사용
      auth?: {
        // 본인 확인 및 문서 전송 기한 정보
        password?: string; // 워크플로우 설정에서 문서 열람 전 본인확인 설정 - 본인확인 정보에 체크한 경우 비밀번호 입력
        password_hint?: string; // 위 조건에 따라 비밀번호를 입력한 경우, 비밀번호 힌트
        valid?: {
          // 미 입력시 기본값: 0일 0시간 (멤버의 경우 무제한, 외부 수신자의 경우 화면 상에서 재입력 필요)
          day?: number; // 문서 전송 기한 (일)
          hour?: number; // 문서 전송 기한 (시간)
        };
      };
    }[];
    comment?: string; // 메시지. 다음 수신자에게 전달할 메시지
  };
  return_fields?: string[]; // Success Callback에서 값을 확인할 수 있도록 넘겨줄 필드명 (문서 작성 및 수정 후, 사용자가 작성한 필드의 내용을 Response를 통해 전달할 항목을 지정합니다.미 지정시 기본 필드만 제공합니다.mode.type이 “03”일 경우(문서 미리보기 시)에는 작동하지 않습니다.)
}

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

  // eslint-disable-next-line no-unused-vars
  const handleDocument = async () => {
    if (window.EformSignDocument) {
      const eformsign = new window.EformSignDocument();

      const document_option: DocumentOption = {
        company: {
          id: '', // Company ID 입력
          country_code: '', // 국가 코드 입력 (ex: kr)
          user_key: '', // 임베딩한 고객 측 시스템에 로그인한 사용자의 unique key. 브라우저 쿠키의 이폼사인 로그인 정보와 비교
        },
        user: {
          type: '01', // 사용자 구분 (01: 멤버, 02: 외부자)
          id: 'test1@forcs.com', // 사용자 ID(이메일)
          access_token: '', // Access Token 입력 (eformsign API 사용하기 - Access Token 발급 참조)
          refresh_token: '', // Refresh Token 입력 (eformsign API 사용하기 - Access Token 발급 참조)
          external_token: '', // 외부자 처리 시 사용자를 인증할 External Token 입력 (Webhook에서 제공)
          external_user_info: {
            name: '', // 외부자 처리 시 외부자 이름 입력
          },
        },
        mode: {
          type: '02', // 모드 (01: 새 문서 작성, 02: 문서 처리, 03: 문서 미리보기)
          template_id: '', // template id 입력
          document_id: '', // document_id 입력
        },
        layout: {
          lang_code: 'ko', // 이폼사인 언어. ko, en, ja
        },
        prefill: {
          document_name: '', // 문서 제목 입력
          fields: [
            {
              id: '고객명', // 필드명
              value: '홍길동', // 필드값
              enabled: true, // 활성화 여부
              required: true, // 필수 여부
            },
          ],
          recipients: [
            {
              step_idx: '2', // 워크플로우 순서. 수신자가 있을 경우 2부터 시작
              step_type: '06', // 단계 종류. 05: 참여자, 06: 검토자
              name: '김테스트', // 수신자 이름
              id: 'test@forcs.com', // 수신자 ID/이메일
              sms: '01023456789', // 수신자 핸드폰 번호
              use_mail: true, // 이메일 알림 사용 여부
              use_sms: true, // SMS 알림 사용 여부
              auth: {
                password: '', // 워크플로우 설정에서 문서 열람 전 본인확인 설정 - 본인확인 정보에 체크한 경우 비밀번호 입력
                password_hint: '', // 위 조건에 따라 비밀번호를 입력한 경우, 비밀번호 힌트
                valid: {
                  day: 7, // 문서 전송 기한 (일)
                  hour: 0, // 문서 전송 기한 (시간)
                },
              },
            },
          ],
          comment: '여기에 코멘트 입력', // 메시지
        },
        return_fields: ['고객명'], // Success Callback에서 값을 확인할 수 있도록 넘겨줄 필드명
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
  };

  const handleTemplate = async () => {
    console.log('진입성공');
    if (window.EformSignTemplate) {
      const eformsign = new window.EformSignTemplate();

      console.log(
        'EformSignTemplate의 타입을 까보자!!!!!!!!!!!!!!!!!!!!!!!!!!'
      );
      console.log(eformsign);
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
