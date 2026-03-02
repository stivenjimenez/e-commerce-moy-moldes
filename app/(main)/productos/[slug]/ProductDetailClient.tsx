"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Check,
} from "lucide-react";
import type { Product } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";
import styles from "./page.module.css";
import { useCart } from "@/contexts/CartContext";

const CATEGORY_COLORS: Record<string, string> = {
  mujer: "#7AB2B2",
  hombre: "#088395",
  infantil: "#EBF4F6",
};

const CATEGORY_LABELS: Record<string, string> = {
  mujer: "Mujer",
  hombre: "Hombre",
  infantil: "Infantil",
};

const INCLUDES_TEXT = `• Archivo DXF Pro editable listo para personalización
• Instrucciones de costura paso a paso en español
• Diagrama de piezas y marcas de costuras
• Tabla de medidas y guía de tallas
• Acceso de descarga inmediata tras el pago`;

const FABRIC_TEXT = `Recomendamos telas de tejido plano con ligero peso y buena caída: lino, popelín de algodón, viscosa o mezclas similares. Evita telas muy gruesas o con mucho cuerpo.

Cantidad aproximada: 1.5 – 2.5 m dependiendo de la talla seleccionada.`;

interface AccordionItem {
  key: string;
  label: string;
  content: string;
}

function ImageGallery({
  product,
}: {
  product: Product;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const bgColor = CATEGORY_COLORS[product.category] ?? "#7AB2B2";
  const hasImages = product.images.length > 0;

  const thumbCount = hasImages ? product.images.length : 4;
  const thumbIndices = Array.from({ length: thumbCount }, (_, i) => i);
  const activeImage = hasImages
    ? product.images[Math.min(activeIndex, product.images.length - 1)]
    : null;

  return (
    <div className={styles.gallery}>
      {/* Main image */}
      <div
        className={styles.mainImage}
        style={{ backgroundColor: bgColor }}
        aria-label={`Imagen principal de ${product.name}`}
      >
        {product.badge && (
          <span className={styles.imageBadge}>{product.badge}</span>
        )}
        {activeImage ? (
          <img
            src={activeImage}
            alt={product.name}
            className={styles.mainProductImage}
          />
        ) : (
          <div className={styles.imagePlaceholderIcon}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              opacity={0.25}
            >
              <path
                d="M32 4C18 4 8 16 8 32s10 28 24 28 24-12 24-28S46 4 32 4z"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M20 20 L32 12 L44 20 L44 44 L32 52 L20 44 Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className={styles.thumbnails}>
        {thumbIndices.map((i) => (
          <button
            key={i}
            className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Ver imagen ${i + 1}`}
          >
            {product.images[i] ? (
              <img
                src={product.images[i]}
                alt={`${product.name} ${i + 1}`}
                className={styles.thumbImage}
              />
            ) : (
              <div
                className={styles.thumbInner}
                style={{
                  backgroundColor:
                    i % 2 === 0
                      ? bgColor
                      : `color-mix(in srgb, ${bgColor} 70%, white)`,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function AccordionSection({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={styles.accordion}>
      <button className={styles.accordionHeader} onClick={onToggle}>
        <span className={styles.accordionLabel}>{item.label}</span>
        {isOpen ? (
          <ChevronUp size={16} strokeWidth={1.5} />
        ) : (
          <ChevronDown size={16} strokeWidth={1.5} />
        )}
      </button>
      {isOpen && (
        <div className={styles.accordionBody}>
          <p className={styles.accordionText}>{item.content}</p>
        </div>
      )}
    </div>
  );
}

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(
    new Set(["descripcion"])
  );
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const accordions: AccordionItem[] = [
    {
      key: "descripcion",
      label: "Descripción",
      content: product.description,
    },
    {
      key: "telas",
      label: "Telas Recomendadas",
      content: FABRIC_TEXT,
    },
    {
      key: "incluye",
      label: "¿Qué Incluye?",
      content: INCLUDES_TEXT,
    },
  ];

  function toggleAccordion(key: string) {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* ─── Breadcrumb ─────────────────────────────────── */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Inicio
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link
            href={`/catalogo?categoria=${product.category}`}
            className={styles.breadcrumbLink}
          >
            {categoryLabel}
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* ─── Main grid ──────────────────────────────────── */}
        <div className={styles.productGrid}>
          {/* Left: gallery */}
          <ImageGallery product={product} />

          {/* Right: info */}
          <div className={styles.productInfo}>
            <div className={styles.infoHeader}>
              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.productSubtitle}>Patrón DXF Pro Editable</p>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>
                ${formatPrice(product.price)}
              </span>
            </div>

            {/* Sizes */}
            <div className={styles.sizesSection}>
              <div className={styles.sizesHeader}>
                <span className={styles.sizesLabel}>TALLAS DISPONIBLES</span>
                <span className={styles.sizesNote}>Incluidas en el archivo</span>
              </div>
              <div className={styles.sizesGrid}>
                {product.sizes.map((size) => (
                  <span key={size} className={styles.sizeTag}>
                    {size}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
              <button
                className={`${styles.addToCartButton} ${added ? styles.addToCartButtonAdded : ""}`}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <Check size={18} strokeWidth={2} />
                    ¡Añadido al carrito!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} strokeWidth={1.5} />
                    Añadir al Carrito — ${formatPrice(product.price)}
                  </>
                )}
              </button>
            </div>

            {/* Accordions */}
            <div className={styles.accordions}>
              {accordions.map((item) => (
                <AccordionSection
                  key={item.key}
                  item={item}
                  isOpen={openAccordions.has(item.key)}
                  onToggle={() => toggleAccordion(item.key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Related products ────────────────────────────── */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>También te puede gustar</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/productos/${p.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImageWrapper}>
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className={styles.relatedImage}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={styles.relatedImage}
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[p.category] ?? "#7AB2B2",
                        }}
                      />
                    )}
                    {p.badge && (
                      <span className={styles.relatedBadge}>{p.badge}</span>
                    )}
                  </div>
                  <div className={styles.relatedInfo}>
                    <span className={styles.relatedName}>{p.name}</span>
                    <span className={styles.relatedPrice}>
                      ${formatPrice(p.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
