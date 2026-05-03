import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { WA_LINK } from "@/lib/constants";
import { getPost, getAllSlugs } from "@/lib/blog";
import { articleContent } from "@/lib/blog-content";

/* Static export: generate all blog slugs at build time */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const ogImage = post.ogImage ?? "https://neto.pe/og-default.jpg";

  return {
    title: `${post.title} — Neto`,
    description: post.description,
    keywords: post.keywords.join(", "),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      locale: "es_PE",
      siteName: "Neto",
      url: `https://neto.pe/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: { canonical: `https://neto.pe/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = articleContent[slug] ?? "";
  const ogImage = post.ogImage ?? "https://neto.pe/og-default.jpg";
  const postUrl = `https://neto.pe/blog/${post.slug}`;

  /* JSON-LD: BlogPosting + BreadcrumbList */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: postUrl,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "es-PE",
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    author: [
      {
        "@type": "Person",
        name: "Favio Mendoza",
        jobTitle: "Founder",
        worksFor: {
          "@type": "Organization",
          name: "Vortik",
          url: "https://vortik.dev",
        },
      },
      {
        "@type": "Organization",
        name: "Neto",
        url: "https://neto.pe",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Neto",
      url: "https://neto.pe",
      logo: {
        "@type": "ImageObject",
        url: "https://neto.pe/neto-icon.png",
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    keywords: post.keywords.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://neto.pe",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://neto.pe/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neto-bg pt-28 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]),
          }}
        />

        <article className="mx-auto max-w-[700px] px-6">
          {/* Breadcrumb */}
          <nav className="text-xs text-neto-txt3 mb-8 flex items-center gap-1.5">
            <Link
              href="/"
              className="hover:text-neto-txt transition-colors duration-200"
            >
              Inicio
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-neto-txt transition-colors duration-200"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-neto-txt2 truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <time className="text-xs text-neto-txt3 uppercase tracking-wider">
              Publicado el{" "}
              {new Date(post.date).toLocaleDateString("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {post.readingTime} lectura
            </time>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-3 leading-tight">
              {post.title}
            </h1>
            <p className="text-neto-txt3 mt-4 text-base leading-relaxed">
              {post.description}
            </p>
            <p className="text-xs text-neto-txt3 mt-4">
              Por <span className="text-neto-txt2 font-medium">Favio Mendoza</span>,
              founder de{" "}
              <a
                href="https://vortik.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neto-green hover:underline"
              >
                Vortik
              </a>
              {" · "}
              <span>
                Última actualización:{" "}
                {new Date(post.date).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </header>

          {/* Article body */}
          <div
            className="prose-neto"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-neto-green/20 bg-neto-bg2 p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Controla tus gastos automáticamente
            </h3>
            <p className="text-neto-txt3 text-sm mb-6 max-w-[400px] mx-auto">
              Mándale un mensaje o foto a Neto por WhatsApp. Categoriza con IA y
              te muestra todo en un dashboard. Sin apps, sin contraseñas bancarias.
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-neto-green px-6 py-3 text-sm font-semibold text-white hover:brightness-110 transition-all duration-200"
            >
              Empezar gratis por WhatsApp
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
