import type { Metadata } from "next";
import "./globals.css";

const geistSans = { variable: "" };
const geistMono = { variable: "" };
const roboto = { variable: "" };
const inter = { variable: "" };
const playfairDisplay = { variable: "" };
const notoSansTelugu = { variable: "" };

import Providers from "@/components/Providers";
import { getSiteSettingsAction } from "@/app/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsAction();
  const favicon = settings?.general?.siteFavicon || settings?.general?.siteLogo || "/logo.png";
  const siteName = settings?.general?.siteName || "Students Hub";
  const title = settings?.seo?.metaTitle || `${siteName} - Latest Education, Jobs & Tech`;
  const description = settings?.seo?.metaDescription || settings?.general?.siteTagline || "Learn • Grow • Build a Better Future";

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: settings?.seo?.metaKeywords,
    icons: {
      icon: [{ url: favicon }],
      shortcut: [{ url: favicon }],
      apple: [{ url: favicon }],
    },
    openGraph: {
      title,
      description,
      images: settings?.seo?.ogImage ? [{ url: settings.seo.ogImage }] : [{ url: "/logo.png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettingsAction();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${inter.variable} ${playfairDisplay.variable} ${notoSansTelugu.variable} h-full antialiased font-sans`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers initialSettings={settings}>{children}</Providers>
      </body>
    </html>
  );
}

