import { Flex } from '@radix-ui/themes';
import { signIn } from 'next-auth/react';

import KakaoCircle from '@svg/KakaoCircle';
import NaverCircle from '@svg/NaverCircle';

const LoginContent = () => {
  return (
    <Flex direction="column" align="center" className="pb-[135px] gap-y-[28px]">
      <div className="rounded-[8px] text-default font-bold shadow-md px-[24px] py-[12px]">
        소셜로그인으로 빠르게 팽글하세요!
      </div>

      {/* svg 정책 및 ghost 버튼이 미비하여 임시 작성 됨 */}
      <div className="flex gap-x-[9px]">
        <button onClick={() => signIn('kakao')}>
          <KakaoCircle />
        </button>
        <button onClick={() => signIn('naver')}>
          <NaverCircle />
        </button>
      </div>
    </Flex>
  );
};

export default LoginContent;
