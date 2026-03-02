import { NextRequest, NextResponse } from "next/server";
import data from "@/data/products.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const featured = searchParams.get("featured");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const sort = searchParams.get("sort");

  let products = data.products;

  if (featured === "true") {
    products = products.filter((p) => p.featured === true);
  }

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (subcategory) {
    products = products.filter((p) => p.subcategory === subcategory);
  }

  if (sort === "precio-asc") {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sort === "precio-desc") {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sort === "nombre-az") {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  }

  return NextResponse.json(products);
}
