'use client';

import React, { ReactNode } from 'react';
import NoSSRWrapper from '@src/app/NoSSRWrapper';

interface Props {
  children: ReactNode;
}
function Providers({ children }: Props) {
  return (
    <NoSSRWrapper>
      {/* <SessionProvider> */}
      {children}
      {/* </SessionProvider> */}
    </NoSSRWrapper>
  );
}

export default Providers;
