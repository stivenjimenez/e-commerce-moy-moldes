import { Download, Layers, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductsGrid from "@/components/ProductsGrid";
import styles from "./page.module.css";

const features = [
  {
    icon: <Download size={18} strokeWidth={1.5} />,
    title: "Descarga Inmediata",
    description:
      "Recibe tu molde en archivo DXF Pro al instante después del pago, sin costos de envío ni esperas.",
  },
  {
    icon: <Layers size={18} strokeWidth={1.5} />,
    title: "Todas las Tallas en un Archivo",
    description:
      "Cada molde incluye todas las tallas disponibles dentro del mismo archivo DXF Pro para trabajar con más facilidad.",
  },
  {
    icon: <Gift size={18} strokeWidth={1.5} />,
    title: "Primer Trazo de Muestra Gratis",
    description:
      "Con la compra del molde recibes un primer trazo de muestra sin costo para validar y empezar con confianza.",
  },
];

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

      {/* Por qué patrones digitales */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <div className={styles.whyContent}>
              <h2 className={styles.whyTitle}>¿Por qué elegir patrones digitales?</h2>
              <p className={styles.whyDescription}>
                Nuestros moldes digitales están listos para descargar en formato DXF
                Pro. Compras, descargas y comienzas a trabajar en minutos, con todas
                las tallas disponibles en un solo archivo.
              </p>
              <ul className={styles.featureList}>
                {features.map((feature) => (
                  <li key={feature.title} className={styles.featureItem}>
                    <span className={styles.featureIcon}>{feature.icon}</span>
                    <div>
                      <h4 className={styles.featureTitle}>{feature.title}</h4>
                      <p className={styles.featureDescription}>{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.whyImage}>
              <Image
                src="/hero.png"
                alt="Patrón digital de costura"
                fill
                className={styles.whyImageMedia}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </div>
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
