import { type ReactNode } from "react";
import Head from "next/head";
import DottedGridBackground from "../components/DottedGridBackground";
import clsx from "clsx";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}

const DefaultLayout = (props: LayoutProps) => {
  const description =
    "Assemble, configure, and deploy autonomous AI Agents in your browser.";
  return (
    <div
      className={clsx(
        "flex flex-col bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]",
        props.centered && "items-center justify-center"
      )}
    >
      <Head>
        <title>YouAgent</title>
        <meta name="description" content={description} />
        <meta name="twitter:site" content="@You.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YouAgent 🤖" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image:width" content="1280" />
        <meta name="twitter:image:height" content="640" />
        <meta
          property="og:title"
          content="YouAgent: Autonomous AI in your browser 🤖"
        />
        <meta
          property="og:description"
          content="Assemble, configure, and deploy autonomous AI Agents in your browser using the power of YouChat."
        />
        <meta property="og:url" content="https://youagent.betterapi.net/" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:type" content="website" />
        <meta
          name="google-site-verification"
          content="sG4QDkC8g2oxKSopgJdIe2hQ_SaJDaEaBjwCXZNkNWA"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <DottedGridBackground
        className={clsx("min-w-screen min-h-screen", props.className)}
      >
        {props.children}
      </DottedGridBackground>
    </div>
  );
};

export default DefaultLayout;
