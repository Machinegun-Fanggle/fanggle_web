import localFont from 'next/font/local';
import Script from 'next/script';

import '@public/styles.css';
import '@radix-ui/themes/styles.css';
import AuthSession from '@component/context/AuthSession';

const pretendard = localFont({
  src: [
    {
      path: '../../public/Pretendard-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font--pretendard',
});

import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pretendard.className} ${pretendard.variable}`}>
        <>
          <Script
            src="https://code.jquery.com/jquery-1.12.4.min.js"
            strategy="beforeInteractive"
          />
          <Script
            src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"
            strategy="beforeInteractive"
          />

          <AuthSession>
            {/* 임시 고정 레이아웃 */}
            {/* <div className="flex justify-center overflow-x-hidden h-full">
              <div className="min-w-[393px] max-w-[393px]">{children}</div>
            </div> */}
            {children}
          </AuthSession>
        </>
      </body>
    </html>
  );
}
