'use client';

import React, { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';

const AuthSession = ({ children }: PropsWithChildren) => (
  <SessionProvider>{children}</SessionProvider>
);

export default AuthSession;
