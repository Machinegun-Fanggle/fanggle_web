import React from 'react';
import { useSession } from 'next-auth/react';

import Login from './Login';

const Home = () => {
  const { status } = useSession();
  console.log({ status });

  if (status === 'authenticated') {
    return <Login />;
  }
};

export default Home;
