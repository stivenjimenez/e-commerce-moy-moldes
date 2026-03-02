"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Pencil, Trash2, Search, X, Check } from "lucide-react";
import type { Product } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";
import styles from "./admin.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["mujer", "hombre", "infantil"] as const;
const FABRICS = ["plano", "punto"] as const;
const BADGES = ["", "NUEVO", "MÁS VENDIDO", "SALE"] as const;
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2", "4", "6", "8", "10", "12", "Único"];

const CATEGORY_COLORS: Record<string, string> = {
  mujer: "#7AB2B2",
  hombre: "#088395",
  infantil: "#EBF4F6",
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function generateSku(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ─── Form types ───────────────────────────────────────────────────────────────

type ProductFormValues = {
  name: string;
  description: string;
  imagesText: string;
  price: number;
  category: Product["category"];
  subcategory: string;
  fabric: Product["fabric"];
  badge: string;
  slug: string;
  sku: string;
  featured: boolean;
  sizes: string[];
};

function parseImageUrls(input: string): string[] {
  return input
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ─── Drawer with react-hook-form ──────────────────────────────────────────────

function ProductDrawer({
  initial,
  onSave,
  onClose,
}: {
  initial: Product | null;
  onSave: (data: Omit<Product, "id"> & { id?: string }) => Promise<void>;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: initial
      ? {
          name: initial.name,
          description: initial.description,
          imagesText: initial.images.join("\n"),
          price: initial.price,
          category: initial.category,
          subcategory: initial.subcategory,
          fabric: initial.fabric,
          badge: initial.badge ?? "",
          slug: initial.slug,
          sku: initial.sku,
          featured: initial.featured,
          sizes: initial.sizes,
        }
      : {
          name: "",
          description: "",
          imagesText: "",
          price: 0,
          category: "mujer",
          subcategory: "",
          fabric: "plano",
          badge: "",
          slug: "",
          sku: generateSku(),
          featured: false,
          sizes: [],
        },
  });

  // Auto-generate slug from name (only on create)
  const watchedName = watch("name");
  useEffect(() => {
    if (!isEdit && watchedName) {
      setValue("slug", generateSlug(watchedName), { shouldValidate: false });
    }
  }, [watchedName, isEdit, setValue]);

  const watchedSizes = watch("sizes");

  function toggleSize(size: string) {
    const current = watchedSizes ?? [];
    setValue(
      "sizes",
      current.includes(size) ? current.filter((s) => s !== size) : [...current, size]
    );
  }

  async function onSubmit(values: ProductFormValues) {
    setSaving(true);
    setServerError("");
    try {
      const { imagesText, ...rest } = values;
      await onSave({
        ...rest,
        images: parseImageUrls(imagesText),
        badge: values.badge || null,
        ...(initial ? { id: initial.id } : {}),
      });
      onClose();
    } catch {
      setServerError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()} aria-label="Editor de producto">
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>
            {isEdit ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>

            {/* Name */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Nombre *</label>
              <input
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                placeholder="Blusa de Lino Manga Larga"
                {...register("name", { required: "El nombre es obligatorio" })}
              />
              {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
            </div>

            {/* Description */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Descripción</label>
              <textarea
                className={styles.textarea}
                rows={2}
                placeholder="Patrón de blusa holgada…"
                {...register("description")}
              />
            </div>

            {/* Images by URL */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Imágenes (URL, una por línea)</label>
              <textarea
                className={`${styles.textarea} ${errors.imagesText ? styles.inputError : ""}`}
                rows={3}
                placeholder={"https://ejemplo.com/imagen-1.jpg\nhttps://ejemplo.com/imagen-2.jpg"}
                {...register("imagesText", {
                  validate: (value) => {
                    const urls = parseImageUrls(value);
                    const hasInvalidUrl = urls.some((url) => !isValidHttpUrl(url));
                    return hasInvalidUrl ? "Todas las URLs deben iniciar con http:// o https://" : true;
                  },
                })}
              />
              {errors.imagesText && (
                <span className={styles.fieldError}>{errors.imagesText.message}</span>
              )}
            </div>

            {/* Price */}
            <div className={styles.field}>
              <label className={styles.label}>Precio (USD) *</label>
              <input
                className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
                type="number"
                min="0"
                step="0.01"
                {...register("price", {
                  required: "El precio es obligatorio",
                  min: { value: 0.01, message: "El precio debe ser mayor a 0" },
                  valueAsNumber: true,
                })}
              />
              {errors.price && <span className={styles.fieldError}>{errors.price.message}</span>}
            </div>

            {/* Category */}
            <div className={styles.field}>
              <label className={styles.label}>Categoría</label>
              <select className={styles.select} {...register("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div className={styles.field}>
              <label className={styles.label}>Subcategoría</label>
              <input
                className={styles.input}
                placeholder="blusas, vestidos…"
                {...register("subcategory")}
              />
            </div>

            {/* Fabric */}
            <div className={styles.field}>
              <label className={styles.label}>Tipo de tela</label>
              <select className={styles.select} {...register("fabric")}>
                {FABRICS.map((f) => (
                  <option key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Badge */}
            <div className={styles.field}>
              <label className={styles.label}>Badge</label>
              <select className={styles.select} {...register("badge")}>
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b || "— ninguno —"}
                  </option>
                ))}
              </select>
            </div>

            {/* Slug */}
            <div className={styles.field}>
              <label className={styles.label}>Slug (URL) *</label>
              <input
                className={`${styles.input} ${errors.slug ? styles.inputError : ""}`}
                placeholder="blusa-lino-manga-larga"
                {...register("slug", { required: "El slug es obligatorio" })}
              />
              {errors.slug && <span className={styles.fieldError}>{errors.slug.message}</span>}
            </div>

            {/* SKU */}
            <div className={styles.field}>
              <label className={styles.label}>SKU</label>
              <input className={styles.input} {...register("sku")} />
            </div>

            {/* Featured */}
            <div className={`${styles.field} ${styles.fieldCheck}`}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  {...register("featured")}
                />
                Destacado en inicio
              </label>
            </div>

            {/* Sizes — controlled via Controller */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Tallas disponibles</label>
              <Controller
                name="sizes"
                control={control}
                render={() => (
                  <div className={styles.sizesGrid}>
                    {ALL_SIZES.map((size) => (
                      <button
                        type="button"
                        key={size}
                        className={`${styles.sizeChip} ${
                          (watchedSizes ?? []).includes(size) ? styles.sizeChipActive : ""
                        }`}
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {serverError && <p className={styles.formError}>{serverError}</p>}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave(
    data: Omit<Product, "id"> & { id?: string }
  ) {
    if (data.id) {
      const res = await fetch(`/api/admin/products/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const updated: Product = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al crear");
      const created: Product = await res.json();
      setProducts((prev) => [...prev, created]);
    }
  }

  async function toggleFeatured(product: Product) {
    const updated = { ...product, featured: !product.featured };
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>{products.length} productos en el catálogo</p>
          </div>
          <button
            className={styles.newBtn}
            onClick={() => { setEditing(null); setModalOpen(true); }}
          >
            <Plus size={16} strokeWidth={2} />
            Nuevo Producto
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchBar}>
          <Search size={15} strokeWidth={1.5} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por nombre o subcategoría…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch("")}>
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {loading ? (
            <div className={styles.loadingRow}>Cargando productos…</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr className={styles.thead}>
                  <th className={styles.th}>Producto</th>
                  <th className={styles.th}>Categoría</th>
                  <th className={styles.th}>Precio</th>
                  <th className={styles.th}>Subcategoría</th>
                  <th className={styles.th}>Tela</th>
                  <th className={styles.th}>Badge</th>
                  <th className={styles.th}>Destacado</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyRow}>
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.productCell}>
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className={styles.productThumb}
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className={styles.categoryDot}
                              style={{ backgroundColor: CATEGORY_COLORS[product.category] ?? "#ccc" }}
                            />
                          )}
                          <div>
                            <span className={styles.productName}>{product.name}</span>
                            <span className={styles.productSku}>SKU {product.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.categoryBadge} ${styles[`cat_${product.category}`]}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.price}>${formatPrice(product.price)}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.muted}>{product.subcategory}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.muted}>{product.fabric}</span>
                      </td>
                      <td className={styles.td}>
                        {product.badge ? (
                          <span className={styles.badge}>{product.badge}</span>
                        ) : (
                          <span className={styles.muted}>—</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        <button
                          className={`${styles.featuredBtn} ${product.featured ? styles.featuredOn : ""}`}
                          onClick={() => toggleFeatured(product)}
                          aria-label={product.featured ? "Quitar destacado" : "Marcar destacado"}
                        >
                          <Check size={13} strokeWidth={2.5} />
                        </button>
                      </td>
                      <td className={styles.td}>
                        {deleteId === product.id ? (
                          <div className={styles.confirmDelete}>
                            <span className={styles.confirmText}>¿Eliminar?</span>
                            <button className={styles.confirmYes} onClick={() => handleDelete(product.id)}>
                              Sí
                            </button>
                            <button className={styles.confirmNo} onClick={() => setDeleteId(null)}>
                              No
                            </button>
                          </div>
                        ) : (
                          <div className={styles.actions}>
                            <button
                              className={styles.editBtn}
                              onClick={() => { setEditing(product); setModalOpen(true); }}
                              aria-label="Editar"
                            >
                              <Pencil size={14} strokeWidth={1.5} />
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => setDeleteId(product.id)}
                              aria-label="Eliminar"
                            >
                              <Trash2 size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProductDrawer
          initial={editing}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}
