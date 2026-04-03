import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductsGrid from "@/components/ProductsGrid";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero */}
      {/* <section className={styles.hero}>
        <div className={styles.heroImage} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>NUEVA COLECCIÓN</span>
          <h1 className={styles.heroTitle}>
            El Guardarropa<br />de la Costurera Moderna
          </h1>
          <p className={styles.heroSubtitle}>
            Patrones de costura digitales para la creadora<br />
            contemporánea. Descarga, imprime y crea.
          </p>
          CTA buttons — comentado temporalmente
          <div className={styles.heroButtons}>
            <Link href="/tienda" className={styles.heroButtonPrimary}>
              Ver Novedades
            </Link>
            <Link href="/lookbook" className={styles.heroButtonSecondary}>
              Ver Lookbook
            </Link>
          </div>
        </div>
      </section> */}

      {/* Destacados */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Nuevos Ingresos</h2>
              <p className={styles.sectionSubtitle}>Patrones frescos añadidos esta semana</p>
            </div>
            <Link href="/catalogo" className={styles.viewAll}>
              Ver Todos <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>

          <ProductsGrid params={{ featured: true }} />
        </div>
      </section>

      {/* Comunidad / Newsletter */}
      {/* <section className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <Mail size={32} strokeWidth={1} className={styles.newsletterIcon} />
          <h2 className={styles.newsletterTitle}>Únete a la Comunidad</h2>
          <p className={styles.newsletterSubtitle}>
            Suscríbete a nuestro boletín para recibir alertas de nuevos patrones,
            consejos de costura y un 15% de descuento en tu primer pedido.
          </p>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className={styles.newsletterInput}
            />
            <button type="submit" className={styles.newsletterButton}>
              Suscribirse
            </button>
          </form>
        </div>
      </section> */}
    </main>
  );
}
