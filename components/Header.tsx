"use client";

import { useState } from "react";
import { Search, ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Mujer", href: "/catalogo?categoria=mujer" },
  { label: "Hombre", href: "/catalogo?categoria=hombre" },
  { label: "Infantil", href: "/catalogo?categoria=infantil" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Moldes Moy</span>
        </Link>

        {/* Categories - shared */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions — desktop */}
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <Search size={18} strokeWidth={1.75} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar patrones..."
              className={styles.searchInput}
            />
          </div>

          <Link href="/carrito" className={styles.bagButton} aria-label="Carrito de compras">
            <ShoppingBag size={22} strokeWidth={1.75} />
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>
        </div>

        {/* Mobile right side */}
        <div className={styles.mobileActions}>
          <button className={styles.mobileSearchButton} aria-label="Buscar">
            <Search size={20} strokeWidth={1.75} />
          </button>

          <Link href="/carrito" className={styles.bagButton} aria-label="Carrito de compras">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>

          <button
            className={styles.menuButton}
            aria-label={menuOpen ? "Cerrar menú de categorías" : "Abrir menú de categorías"}
            aria-expanded={menuOpen}
            aria-controls="mobile-categories-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <X size={22} strokeWidth={1.5} />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-categories-menu"
        className={`${styles.mobileMenuWrap} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Categorías principales">
          <p className={styles.mobileNavTitle}>Categorías</p>
          <Link
            href="/catalogo"
            className={`${styles.mobileNavLink} ${styles.mobileNavLinkAll}`}
            onClick={() => setMenuOpen(false)}
          >
            Ver todo el catálogo
            <ChevronRight size={16} strokeWidth={2} />
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <ChevronRight size={16} strokeWidth={2} />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
