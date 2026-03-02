"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductsGrid from "@/components/ProductsGrid";
import styles from "./catalog.module.css";

const categoryLabels: Record<string, string> = {
  mujer: "Mujer",
  hombre: "Hombre",
  infantil: "Infantil",
};

const subcategoryLabels: Record<string, string> = {
  blusas: "Blusas",
  vestidos: "Vestidos",
  pantalones: "Pantalones",
  faldas: "Faldas",
  "ropa-interior": "Ropa Interior",
  deportivos: "Deportivos",
  abrigos: "Abrigos",
  camisas: "Camisas",
  nina: "Niña",
  nino: "Niño",
  bebe: "Bebé",
};

const sortOptions = [
  { value: "default", label: "Más Recientes" },
  { value: "precio-asc", label: "Precio: Menor a Mayor" },
  { value: "precio-desc", label: "Precio: Mayor a Menor" },
  { value: "nombre-az", label: "Nombre: A-Z" },
];

export default function CatalogClient() {
  const searchParams = useSearchParams();

  const categoria = searchParams.get("categoria") as
    | "mujer"
    | "hombre"
    | "infantil"
    | null;

  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [fabric, setFabric] = useState<"plano" | "punto" | null>(null);
  const [sort, setSort] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { products: allProducts, isLoading, isError } = useProducts();

  // Filter by category from URL
  const categoryFiltered = useMemo(
    () =>
      categoria
        ? allProducts.filter((p) => p.category === categoria)
        : allProducts,
    [allProducts, categoria]
  );

  // Subcategory counts
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of categoryFiltered) {
      counts[p.subcategory] = (counts[p.subcategory] ?? 0) + 1;
    }
    return counts;
  }, [categoryFiltered]);

  // Fabric counts
  const fabricCounts = useMemo(() => {
    const counts = { plano: 0, punto: 0 };
    for (const p of categoryFiltered) {
      counts[p.fabric] = (counts[p.fabric] ?? 0) + 1;
    }
    return counts;
  }, [categoryFiltered]);

  // Apply filters + sort
  const filtered = useMemo(() => {
    let result = categoryFiltered;
    if (subcategory) result = result.filter((p) => p.subcategory === subcategory);
    if (fabric) result = result.filter((p) => p.fabric === fabric);

    if (sort === "precio-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "precio-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === "nombre-az")
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [categoryFiltered, subcategory, fabric, sort]);

  const subcategoryKeys = Object.keys(subcategoryCounts);
  const hasSidebar = subcategoryKeys.length > 1;

  const pageTitle = categoria ? categoryLabels[categoria] : "Todos los Patrones";
  const pageSubtitle = `${filtered.length} patrón${filtered.length !== 1 ? "es" : ""} disponible${filtered.length !== 1 ? "s" : ""}`;

  const hasActiveFilters = subcategory || fabric;

  function clearFilters() {
    setSubcategory(null);
    setFabric(null);
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Inicio</Link>
            <span className={styles.breadcrumbSep}>/</span>
            {categoria ? (
              <>
                <Link href="/catalogo" className={styles.breadcrumbLink}>Catálogo</Link>
                <span className={styles.breadcrumbSep}>/</span>
                <span className={styles.breadcrumbCurrent}>{categoryLabels[categoria]}</span>
              </>
            ) : (
              <span className={styles.breadcrumbCurrent}>Catálogo</span>
            )}
          </nav>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.layout} ${!hasSidebar ? styles.layoutFull : ""}`}>
          {/* Sidebar */}
          {hasSidebar && (
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </button>

              {/* Subcategorías */}
              <div className={styles.sidebarSection}>
                <h3 className={styles.sidebarLabel}>SUBCATEGORÍA</h3>
                <ul className={styles.filterList}>
                  <li>
                    <button
                      className={`${styles.filterItem} ${!subcategory ? styles.filterItemActive : ""}`}
                      onClick={() => { setSubcategory(null); setSidebarOpen(false); }}
                    >
                      <span>Todos</span>
                      <span className={styles.filterCount}>{categoryFiltered.length}</span>
                    </button>
                  </li>
                  {subcategoryKeys.map((sub) => (
                    <li key={sub}>
                      <button
                        className={`${styles.filterItem} ${subcategory === sub ? styles.filterItemActive : ""}`}
                        onClick={() => { setSubcategory(sub); setSidebarOpen(false); }}
                      >
                        <span>{subcategoryLabels[sub] ?? sub}</span>
                        <span className={styles.filterCount}>{subcategoryCounts[sub]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tipo de tela */}
              <div className={styles.sidebarSection}>
                <h3 className={styles.sidebarLabel}>TIPO DE TELA</h3>
                <ul className={styles.filterList}>
                  <li>
                    <button
                      className={`${styles.filterItem} ${!fabric ? styles.filterItemActive : ""}`}
                      onClick={() => setFabric(null)}
                    >
                      <span>Todos</span>
                      <span className={styles.filterCount}>{categoryFiltered.length}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`${styles.filterItem} ${fabric === "plano" ? styles.filterItemActive : ""}`}
                      onClick={() => setFabric(fabric === "plano" ? null : "plano")}
                    >
                      <span>Plano</span>
                      <span className={styles.filterCount}>{fabricCounts.plano}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`${styles.filterItem} ${fabric === "punto" ? styles.filterItemActive : ""}`}
                      onClick={() => setFabric(fabric === "punto" ? null : "punto")}
                    >
                      <span>Punto</span>
                      <span className={styles.filterCount}>{fabricCounts.punto}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </aside>
          )}

          {sidebarOpen && (
            <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
          )}

          {/* Main */}
          <main className={styles.main}>
            <div className={styles.topBar}>
              <div className={styles.topBarLeft}>
                {hasSidebar && (
                  <button className={styles.filterToggle} onClick={() => setSidebarOpen(true)}>
                    <SlidersHorizontal size={16} strokeWidth={1.5} />
                    Filtros
                  </button>
                )}
                <div>
                  <h1 className={styles.pageTitle}>{pageTitle}</h1>
                  <p className={styles.pageSubtitle}>{pageSubtitle}</p>
                </div>
              </div>
              <div className={styles.sortWrapper}>
                <label className={styles.sortLabel}>Ordenar:</label>
                <div className={styles.sortSelect}>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className={styles.select}
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className={styles.selectIcon} />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className={styles.chips}>
                {subcategory && (
                  <span className={styles.chip}>
                    {subcategoryLabels[subcategory] ?? subcategory}
                    <button className={styles.chipRemove} onClick={() => setSubcategory(null)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {fabric && (
                  <span className={styles.chip}>
                    {fabric === "plano" ? "Plano" : "Punto"}
                    <button className={styles.chipRemove} onClick={() => setFabric(null)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button className={styles.clearAll} onClick={clearFilters}>
                  Limpiar Filtros
                </button>
              </div>
            )}

            <ProductsGrid
              products={filtered}
              isLoading={isLoading}
              isError={isError}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
