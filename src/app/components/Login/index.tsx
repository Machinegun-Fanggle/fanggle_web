import Image from 'next/image';

import Logo from '@public/fanggle_logo.svg';
import LoginContent from './LoginContent';
import { Flex } from '@radix-ui/themes';

const Login = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="between"
      className="h-[100vh] pt-[243px]"
    >
      <Image src={Logo} alt="logo.svg" />
      <LoginContent />
    </Flex>
  );
};

export default Login;
