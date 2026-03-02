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

function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];

  return images
    .filter((image): image is string => typeof image === "string")
    .map((image) => image.trim())
    .filter(Boolean);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const products = readProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    const updated: Product = {
      ...products[index],
      ...body,
      id,
      price: Number(body.price ?? products[index].price),
      images:
        body.images === undefined
          ? products[index].images
          : normalizeImages(body.images),
      badge: body.badge || null,
    };

    products[index] = updated;
    writeProducts(products);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar el producto" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = readProducts();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    writeProducts(filtered);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar el producto" }, { status: 500 });
  }
}
