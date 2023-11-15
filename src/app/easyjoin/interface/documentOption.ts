// eslint-disable-next-line no-unused-vars
export interface DocumentOption {
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
