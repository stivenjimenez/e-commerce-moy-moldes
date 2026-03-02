"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import type { Product, UseProductsParams } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";
import styles from "./ProductsGrid.module.css";

interface ProductsGridProps {
  // Option A: fetch internally
  params?: UseProductsParams;
  // Option B: receive data externally (catalog page)
  products?: Product[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function ProductsGrid({
  params,
  products: externalProducts,
  isLoading: externalLoading,
  isError: externalError,
}: ProductsGridProps) {
  // Disable internal fetch when external data is provided
  const internal = useProducts(externalProducts !== undefined ? null : params);

  const products = externalProducts ?? internal.products;
  const isLoading = externalLoading ?? internal.isLoading;
  const isError = externalError ?? internal.isError;

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonInfo}>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className={styles.error}>
        No se pudieron cargar los productos. Intenta de nuevo.
      </p>
    );
  }

  if (products.length === 0) {
    return <p className={styles.empty}>No hay productos disponibles.</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <Link
          href={`/productos/${product.slug}`}
          key={product.id}
          className={styles.card}
        >
          <div className={styles.imageWrapper}>
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className={styles.image}
                loading="lazy"
              />
            ) : (
              <div
                className={styles.imagePlaceholder}
                style={{
                  backgroundColor:
                    product.category === "mujer"
                      ? "#7AB2B2"
                      : product.category === "hombre"
                      ? "#088395"
                      : "#EBF4F6",
                }}
              />
            )}
            {product.badge && (
              <span className={styles.badge}>{product.badge}</span>
            )}
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{product.name}</span>
            <span className={styles.price}>
              ${formatPrice(product.price)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
