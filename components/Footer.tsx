import { Camera, AtSign } from "lucide-react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>Moldes Moy</span>
            </Link>
            <p className={styles.tagline}>
              Empoderando a creadoras para construir el guardarropa que aman,
              una costura a la vez.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <Camera size={16} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Correo" className={styles.socialLink}>
                <AtSign size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>TIENDA</h4>
            <ul className={styles.columnList}>
              <li><Link href="/nuevos-ingresos" className={styles.columnLink}>Nuevos Ingresos</Link></li>
              <li><Link href="/tops-blusas" className={styles.columnLink}>Tops y Blusas</Link></li>
              <li><Link href="/pantalones" className={styles.columnLink}>Pantalones</Link></li>
              <li><Link href="/vestidos" className={styles.columnLink}>Vestidos</Link></li>
              <li><Link href="/abrigos" className={styles.columnLink}>Abrigos</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>SOPORTE</h4>
            <ul className={styles.columnList}>
              <li><Link href="/preguntas" className={styles.columnLink}>Preguntas Frecuentes</Link></li>
              <li><Link href="/guia-impresion" className={styles.columnLink}>Guía de Impresión</Link></li>
              <li><Link href="/tabla-tallas" className={styles.columnLink}>Tabla de Tallas</Link></li>
              <li><Link href="/contacto" className={styles.columnLink}>Contáctanos</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>LEGAL</h4>
            <ul className={styles.columnList}>
              <li><Link href="/privacidad" className={styles.columnLink}>Política de Privacidad</Link></li>
              <li><Link href="/terminos" className={styles.columnLink}>Términos de Servicio</Link></li>
              <li><Link href="/devoluciones" className={styles.columnLink}>Política de Devoluciones</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>© 2024 Pattern Studio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
