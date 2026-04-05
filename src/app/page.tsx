import dynamic from "next/dynamic";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BankTicker from "@/components/landing/BankTicker";

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
  logo: "https://neto.pe/neto-icon.png",
  description:
    "Asistente financiero personal por WhatsApp para el mercado peruano. Categoriza gastos con IA, crea presupuestos y te ayuda a ahorrar.",
  areaServed: { "@type": "Country", name: "Peru" },
  sameAs: [
    "https://www.instagram.com/neto_peru/",
    "https://www.facebook.com/Neto.peruapp/",
    "https://www.tiktok.com/@neto_peru",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Neto",
  url: "https://neto.pe",
  description:
    "Neto lee tus correos bancarios, categoriza tus gastos automáticamente y te da un dashboard completo por WhatsApp.",
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Neto",
  operatingSystem: "Web, WhatsApp",
  applicationCategory: "FinanceApplication",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PEN",
      name: "Plan Gratis",
    },
    {
      "@type": "Offer",
      price: "10",
      priceCurrency: "PEN",
      name: "Plan Pro",
      billingIncrement: "P1M",
    },
  ],
  aggregateRating: undefined,
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
