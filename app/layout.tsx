import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import './globals.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { ClerkProvider } from '@clerk/nextjs';

import Header from './_components/Header';
import Footer from './_components/Footer';

const theme = createTheme({
  primaryColor: 'indigo',
});

export const metadata: Metadata = {
  title: 'Ratings',
  description: 'Rate everything.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <MantineProvider theme={theme}>
            <div className=" h-screen">
              <div className=" h-full flex flex-col">
                <Header></Header>
                <main className=" h-full p-4 md:px-20">{children}</main>
                <Footer></Footer>
              </div>
            </div>
          </MantineProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
