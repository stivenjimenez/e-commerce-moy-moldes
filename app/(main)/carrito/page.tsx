"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Lock, Zap, Headphones } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";
import styles from "./carrito.module.css";

const CATEGORY_COLORS: Record<string, string> = {
  mujer: "#7AB2B2",
  hombre: "#088395",
  infantil: "#EBF4F6",
};

const WHATSAPP_NUMBER = "573134942823";

function buildWhatsAppMessage(
  items: ReturnType<typeof useCart>["items"],
  total: number
): string {
  const lines = items
    .map(
      (item) =>
        `• ${item.product.name}${item.quantity > 1 ? ` x${item.quantity}` : ""} — $${formatPrice(item.product.price * item.quantity)}`
    )
    .join("\n");

  const msg = `Hola! Quiero confirmar mi pedido de Moldes Moy:\n\n${lines}\n\nTotal: $${formatPrice(total)}\n\nMis datos: `;
  return encodeURIComponent(msg);
}

export default function CarritoPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const { products: catalogProducts } = useProducts();
  const imageByProductId = useMemo(
    () =>
      new Map(
        catalogProducts.map((product) => [product.id, product.images[0] ?? ""])
      ),
    [catalogProducts]
  );

  const total = subtotal;

  if (items.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <ShoppingBag size={48} strokeWidth={1} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
            <p className={styles.emptyText}>
              Agrega moldes desde el catálogo para comenzar tu pedido.
            </p>
            <Link href="/catalogo" className={styles.emptyLink}>
              Ver catálogo
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(items, total)}`;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Tu Carrito</h1>
          <p className={styles.subtitle}>Revisa tus moldes antes de finalizar.</p>
        </div>

        <div className={styles.layout}>
          {/* ─── Items list ─────────────────────────────────── */}
          <div className={styles.itemsSection}>
            <div className={styles.tableHeader}>
              <span className={styles.colProduct}>PRODUCTO</span>
              <span className={styles.colPrice}>PRECIO</span>
              <span className={styles.colQty}>CANTIDAD</span>
              <span className={styles.colTotal}>TOTAL</span>
            </div>

            <div className={styles.itemsList}>
              {items.map(({ product, quantity }) => {
                const bgColor = CATEGORY_COLORS[product.category] ?? "#7AB2B2";
                const productImage =
                  product.images?.[0] ??
                  imageByProductId.get(product.id) ??
                  "";

                return (
                  <div key={product.id} className={styles.item}>
                    <div className={styles.itemImage} style={{ backgroundColor: bgColor }}>
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className={styles.itemImageTag}
                          loading="lazy"
                        />
                      ) : (
                        <svg width="28" height="28" viewBox="0 0 64 64" fill="none" opacity={0.3}>
                          <path
                            d="M20 20 L32 12 L44 20 L44 44 L32 52 L20 44 Z"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Name + meta */}
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{product.name}</span>
                      <span className={styles.itemMeta}>DXF Pro Editable • Todas las tallas</span>
                    </div>

                    {/* Price */}
                    <span className={styles.itemPrice}>${formatPrice(product.price)}</span>

                    {/* Qty controls */}
                    <div className={styles.qtyControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Reducir cantidad"
                      >
                        <Minus size={12} strokeWidth={2} />
                      </button>
                      <span className={styles.qtyValue}>{quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={12} strokeWidth={2} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className={styles.itemTotal}>
                      ${formatPrice(product.price * quantity)}
                    </span>

                    {/* Remove */}
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`Eliminar ${product.name}`}
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                );
              })}
            </div>

            <p className={styles.deliveryNote}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Todos los patrones se envían por email inmediatamente tras confirmar el pago.
            </p>
          </div>

          {/* ─── Order summary ───────────────────────────────── */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>${formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Descuento</span>
                <span className={styles.summaryDiscount}>-$0.00</span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span className={styles.summaryTotalLabel}>Total</span>
              <span className={styles.summaryTotalValue}>${formatPrice(total)}</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L0 24l6.335-1.51A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.727.889.924-3.618-.234-.373A9.787 9.787 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
              </svg>
              Finalizar vía WhatsApp
            </a>

            <p className={styles.whatsappHelp}>
              Al hacer clic se abrirá WhatsApp con tu pedido pre-llenado. Una asesora confirmará el pago y enviará los archivos al instante.
            </p>

            <div className={styles.trustIcons}>
              <Lock size={18} strokeWidth={1.5} className={styles.trustIcon} />
              <Zap size={18} strokeWidth={1.5} className={styles.trustIcon} />
              <Headphones size={18} strokeWidth={1.5} className={styles.trustIcon} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
