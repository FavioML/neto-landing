import dynamic from "next/dynamic";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BankTicker from "@/components/landing/BankTicker";
import IntroBlock from "@/components/landing/IntroBlock";

const FugasSection = dynamic(() => import("@/components/landing/FugasSection"));
const BentoShowcase = dynamic(() => import("@/components/landing/BentoShowcase"));
const EspaciosSection = dynamic(() => import("@/components/landing/EspaciosSection"));
const DebtSection = dynamic(() => import("@/components/landing/DebtSection"));
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"));
const GmailTrust = dynamic(() => import("@/components/landing/GmailTrust"));
const Security = dynamic(() => import("@/components/landing/Security"));
const Testimonials = dynamic(() => import("@/components/landing/Testimonials"));
const Pricing = dynamic(() => import("@/components/landing/Pricing"));
const FinalCTA = dynamic(() => import("@/components/landing/FinalCTA"));
const Footer = dynamic(() => import("@/components/landing/Footer"));
const StickyCTA = dynamic(() => import("@/components/landing/StickyCTA"));
const ExitIntent = dynamic(() => import("@/components/landing/ExitIntent"));

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Neto",
  url: "https://neto.pe",
  logo: {
    "@type": "ImageObject",
    url: "https://neto.pe/neto-icon.png",
    width: 512,
    height: 512,
  },
  description:
    "Asistente financiero personal por WhatsApp para el mercado peruano. Categoriza gastos con IA, crea presupuestos y te ayuda a ahorrar.",
  areaServed: { "@type": "Country", name: "Peru" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+51-933-014-505",
      contactType: "customer support",
      availableLanguage: "Spanish",
      contactOption: "TollFree",
    },
    {
      "@type": "ContactPoint",
      email: "hola@neto.pe",
      contactType: "customer support",
      availableLanguage: "Spanish",
    },
  ],
  sameAs: [
    "https://www.instagram.com/neto_peru/",
    "https://www.facebook.com/Neto.peruapp/",
    "https://www.tiktok.com/@neto_peru",
  ],
  founder: {
    "@type": "Organization",
    name: "Vortik",
    url: "https://vortik.dev",
  },
  foundingLocation: {
    "@type": "Place",
    name: "Lima, Perú",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Neto",
  url: "https://neto.pe",
  description:
    "Neto lee tus correos bancarios, categoriza tus gastos automáticamente y te da un dashboard completo por WhatsApp.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://neto.pe/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Neto",
  url: "https://neto.pe",
  description:
    "Asistente financiero personal por WhatsApp para el mercado peruano. Lee tus correos bancarios, categoriza gastos automáticamente con IA y calcula tu score financiero 0-100. Sin contraseñas bancarias.",
  operatingSystem: "Web, Android, iOS",
  applicationCategory: "FinanceApplication",
  inLanguage: "es-PE",
  screenshot: {
    "@type": "ImageObject",
    url: "https://neto.pe/og-default.jpg",
    width: 1200,
    height: 630,
  },
  author: {
    "@type": "Organization",
    name: "Vortik",
    url: "https://vortik.dev",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Plan Gratis",
      price: "0",
      priceCurrency: "PEN",
      availability: "https://schema.org/InStock",
      url: "https://neto.pe/#precios",
    },
    {
      "@type": "Offer",
      name: "Plan Pro",
      price: "10",
      priceCurrency: "PEN",
      availability: "https://schema.org/InStock",
      url: "https://neto.pe/#precios",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "10",
        priceCurrency: "PEN",
        unitCode: "MON",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationJsonLd,
            websiteJsonLd,
            softwareJsonLd,
          ]),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <BankTicker />
        <IntroBlock />
        <FugasSection />
        <BentoShowcase />
        <EspaciosSection />
        <DebtSection />
        <HowItWorks />
        <GmailTrust />
        <Security />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTA />
      <ExitIntent />
    </>
  );
}
