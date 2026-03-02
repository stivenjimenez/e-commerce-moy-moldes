import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { Product } from "@/hooks/useProducts";

const DATA_PATH = path.join(process.cwd(), "data/products.json");

function readProducts(): Product[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw).products as Product[];
}

function writeProducts(products: Product[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ products }, null, 2), "utf-8");
}

function generateId(products: Product[]): string {
  const nums = products
    .map((p) => parseInt(p.id.replace("prod-", ""), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `prod-${String(next).padStart(3, "0")}`;
}

function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];

  return images
    .filter((image): image is string => typeof image === "string")
    .map((image) => image.trim())
    .filter(Boolean);
}

export async function GET() {
  try {
    const products = readProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "No se pudo leer el catálogo" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = readProducts();

    const newProduct: Product = {
      id: generateId(products),
      sku: body.sku || String(Math.floor(100000 + Math.random() * 900000)),
      slug: body.slug,
      name: body.name,
      description: body.description ?? "",
      price: Number(body.price),
      images: normalizeImages(body.images),
      sizes: body.sizes ?? [],
      category: body.category,
      subcategory: body.subcategory ?? "",
      fabric: body.fabric,
      featured: body.featured ?? false,
      badge: body.badge || null,
    };

    writeProducts([...products, newProduct]);
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo crear el producto" }, { status: 500 });
  }
}
