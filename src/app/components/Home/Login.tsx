'use client';

import LoginContent from './LoginContent';
import { Flex } from '@radix-ui/themes';
import FanggleLogo from '@svg/FanggleLogo';

const Login = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="between"
      className="h-[100vh]"
    >
      <Flex
        align="center"
        justify="center"
        height="100%"
        className="pb-[100px]"
      >
        <FanggleLogo />
      </Flex>
      <LoginContent />
    </Flex>
  );
};

export default Login;
