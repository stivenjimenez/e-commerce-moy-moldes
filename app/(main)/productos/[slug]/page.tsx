import { notFound } from "next/navigation";
import type { Metadata } from "next";
import data from "@/data/products.json";
import type { Product } from "@/hooks/useProducts";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return data.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} — Moldes Moy`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = data.products.find((p) => p.slug === slug) as Product | undefined;
  if (!product) notFound();

  // Same subcategory first, then fill from same category
  const sameSubcat = data.products.filter(
    (p) => p.subcategory === product.subcategory && p.slug !== product.slug
  ) as Product[];

  const fillers = data.products.filter(
    (p) =>
      p.category === product.category &&
      p.slug !== product.slug &&
      !sameSubcat.some((r) => r.slug === p.slug)
  ) as Product[];

  const related = [...sameSubcat, ...fillers].slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
