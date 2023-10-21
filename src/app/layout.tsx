import { Inter } from "next/font/google";
import Script from "next/script";
import { Theme } from "@radix-ui/themes"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en">
      <body className={inter.variable}>
        <>
          <Script src="https://code.jquery.com/jquery-1.12.4.min.js" strategy="beforeInteractive" />
          <Script src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js" strategy="beforeInteractive" />
          <Theme>
            {children}
          </Theme>
        </>
      </body>
    </html>
  );
}
