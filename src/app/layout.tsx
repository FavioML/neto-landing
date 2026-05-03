import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-6M907HW1YM";
const ADS_ID = "AW-8115117081";
const META_PIXEL_ID = "1510666681068015";
const POSTHOG_KEY = "phc_oWcB57kywdubiAVa2ewYF32YBDFzgPxMoKWPQaPuE8Jb";
const POSTHOG_HOST = "https://us.i.posthog.com";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const SHARED_DESCRIPTION =
  "Asistente financiero por WhatsApp para Perú. Registra gastos en lenguaje natural, lee fotos de Yape/Plin y te da un dashboard completo. Gratis. Sin descargar apps, sin contraseñas bancarias.";

export const metadata: Metadata = {
  metadataBase: new URL("https://neto.pe"),
  title: "Neto — Ordena tu plata sin mover un dedo",
  description: SHARED_DESCRIPTION,
  keywords:
    "finanzas personales Peru, asistente financiero WhatsApp, control de gastos Peru, Yape BCP Interbank BBVA, gastos hormiga, ahorro Peru",
  openGraph: {
    title: "Neto — Ordena tu plata sin mover un dedo",
    description: SHARED_DESCRIPTION,
    url: "https://neto.pe",
    type: "website",
    locale: "es_PE",
    siteName: "Neto",
    images: [
      {
        url: "https://neto.pe/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Neto — Ordena tu plata sin mover un dedo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neto — Ordena tu plata sin mover un dedo",
    description: SHARED_DESCRIPTION,
    images: ["https://neto.pe/og-default.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://neto.pe" },
  icons: {
    icon: [
      { url: "/neto-icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/neto-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to analytics origins to reduce connection latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href={POSTHOG_HOST} />
        {/* llms.txt: curated description for AI models */}
        <link rel="alternate" type="text/plain" href="/llms.txt" />

        {/* GA4 + Google Ads — single gtag.js loader covers both IDs */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){window.dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('config', '${GA_ID}');
            window.gtag('config', '${ADS_ID}');
          `}
        </Script>

        {/* PostHog — product analytics, heatmaps, session replay, A/B testing */}
        <Script id="posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init Ie Ts Ms capture Ee calculateEventProperties Os register register_once register_for_session unregister unregister_for_session Rs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getPersonProperties getRawPersonProperties getRawGroupProperties getSessionProperty createPersonProfile generateRecordingURL Vs Fs $s registerForSurvey registerSurveyEventListener removeSurveyEventListener captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            window.posthog.init('${POSTHOG_KEY}', {
              api_host: '${POSTHOG_HOST}',
              defaults: '2025-05-24',
              person_profiles: 'identified_only',
              capture_pageview: 'history_change',
              capture_pageleave: true,
              autocapture: true,
              session_recording: { maskAllInputs: true },
              loaded: function(ph){ ph.register({ app: 'neto-landing' }); }
            });
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            window.fbq('init', '${META_PIXEL_ID}');
            window.fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="noise-bg">
        {/* Meta Pixel noscript fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
