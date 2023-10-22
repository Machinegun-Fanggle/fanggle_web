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
      className="h-[100vh] pt-[243px]"
    >
      <FanggleLogo />
      <LoginContent />
    </Flex>
  );
};

export default Login;
