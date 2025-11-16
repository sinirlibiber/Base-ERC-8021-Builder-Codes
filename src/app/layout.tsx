import type { Metadata } from "next";
import localFont from "next/font/local";
import '@coinbase/onchainkit/styles.css';
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";
import { ReadyNotifier } from "@/components/ready-notifier";
import { Providers } from "./providers";
import FarcasterWrapper from "@/components/FarcasterWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = cookies().get("x-request-id")?.value;

  return (
        <html lang="en">
          <head>
            {requestId && <meta name="x-request-id" content={requestId} />}
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {/* Do not remove this component, we use it to notify the parent that the mini-app is ready */}
            <ReadyNotifier />
            <Providers>
              
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      
            </Providers>
            <ResponseLogger />
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "ERC-8021 DApp Builder",
        description: "Create a DApp on the Base Network using ERC-8021 standards for seamless blockchain functionality and integration.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_2bfe2437-6333-41af-9d1b-98dc0f5a18ec-VSHW3tzabPCneSfL8I5EAEB5AJAjSp","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"ERC-8021 DApp Builder","url":"https://cage-mud-423.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
