import Kakao from '@public/kakao.png';
import Naver from '@public/naver.png';
import Image from 'next/image';
import { Flex } from '@radix-ui/themes';

const LoginContent = () => {
  return (
    <Flex direction="column" align="center" className="pb-[135px] gap-y-[28px]">
      <div className="rounded-[8px] text-default font-bold shadow-md px-[24px] py-[12px]">
        소셜로그인으로 빠르게 팽글하세요!
      </div>

      <div className="flex gap-x-[9px]">
        <button>
          <Image src={Kakao} alt="kakao" />
        </button>
        <button>
          <Image src={Naver} alt="kakao" />
        </button>
      </div>
    </Flex>
  );
};

export default LoginContent;
