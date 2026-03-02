# agents.md — Descripción del Proyecto

## Proyecto

**moy-moldes** es una aplicación web construida con Next.js App Router.

---

## Stack Tecnológico

### Framework
- **Next.js 16.1.6** con App Router
- **React 19.2.3**
- **TypeScript 5** en modo estricto

### Estilos
- **CSS Modules** — cada componente tiene su propio archivo `.module.css` colocado junto al componente
- **Sin librerías de UI externas** — todos los componentes son hechos in-house
- **Sin Tailwind CSS** ni ningún otro framework de utilidades CSS
- Las variables globales de color y tipografía se definen en `app/globals.css`
- El reset CSS base se encuentra en `app/reset.css`
- **Sin dark mode** — el proyecto es exclusivamente light mode, no usar `@media (prefers-color-scheme: dark)`
- **Mobile-first y totalmente responsive** — todos los componentes y páginas deben adaptarse a cualquier tamaño de pantalla

### Iconos
- **lucide-react 0.575.0** — única librería de iconos permitida
- Importar solo los iconos necesarios: `import { IconName } from "lucide-react"`

### Formularios
- **react-hook-form** — para el manejo de todos los formularios
- Usar `useForm`, `register`, `handleSubmit` y `formState.errors` como patrón estándar
- Validaciones declaradas directamente en `register` o mediante `resolver` con zod si el esquema es complejo

### Fetching de Datos
- **swr** — para todas las peticiones de datos del lado cliente
- Siempre usar un custom hook en `hooks/` que encapsule la llamada (ej: `hooks/useProducts.ts`)
- El `fetcher` base es `(url: string) => fetch(url).then(res => res.json())`
- Los endpoints actuales son rutas de Next.js en `app/api/` que consumen `data/products.json`
- Cuando se integre un backend real, solo se cambia la URL base en el hook — el componente no cambia
- Patrón estándar:
  ```ts
  import useSWR from "swr"
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const { data, error, isLoading } = useSWR<Tipo[]>(url, fetcher)
  ```

### Datos / Mock
- Los productos están en `data/products.json` como fuente de verdad temporal
- Estructura de producto: `id`, `slug`, `name`, `description`, `price`, `images[]`, `sizes[]`, `category`, `subcategory`, `featured`, `badge`
- Categorías: `mujer` | `hombre` | `infantil`
- Subcategorías mujer: `blusas`, `vestidos`, `pantalones`, `faldas`, `ropa-interior`, `deportivos`, `abrigos`
- Subcategorías hombre: `camisas`, `pantalones`, `deportivos`, `ropa-interior`, `abrigos`
- Subcategorías infantil: `nina`, `nino`, `bebe`, `deportivos`
- La propiedad `featured: true` hace que el producto aparezca en la sección "Nuevos Ingresos" del home

### Estado Global
- **zustand** — para el manejo de estado global
- Cada dominio tiene su propio store en `store/` (ej: `store/useAuthStore.ts`, `store/useCartStore.ts`)
- Los stores se crean con `create` de zustand y se tipan explícitamente

---

## Estructura de Carpetas

```
moy-moldes/
├── app/                    # App Router de Next.js
│   ├── globals.css         # Variables CSS globales y estilos base
│   ├── reset.css           # CSS Reset
│   ├── layout.tsx          # Layout raíz
│   └── page.tsx            # Página principal
├── components/             # Componentes reutilizables in-house
│   └── [ComponentName]/
│       ├── index.tsx
│       └── [ComponentName].module.css
├── store/                  # Stores de Zustand
│   └── use[Domain]Store.ts
├── hooks/                  # Custom hooks
├── types/                  # Tipos y interfaces TypeScript
└── public/                 # Assets estáticos
```

---

## Convenciones

### Componentes
- Un componente por archivo
- Nombre en **PascalCase**: `ProductCard.tsx`
- El archivo CSS Module lleva el mismo nombre: `ProductCard.module.css`
- No usar librerías de UI externas (no MUI, no Shadcn, no Chakra, etc.)

### CSS Modules
- Clases en **camelCase**: `.cardTitle`, `.primaryButton`
- No usar clases globales dentro de módulos salvo casos excepcionales con `:global()`
- **Responsive obligatorio**: cada componente debe incluir sus propios `@media` queries en el mismo `.module.css`
- Breakpoints de referencia:
  - Mobile: `max-width: 480px`
  - Tablet: `max-width: 768px`
  - Desktop wide: `min-width: 1200px`
- Diseño **mobile-first**: escribir estilos base para móvil y escalar con `min-width` cuando aplique

### Iconos (lucide-react)
- Siempre tipar el tamaño con la prop `size` y el color con `color` o via CSS
- Ejemplo: `<ShoppingCart size={20} />`

### Formularios (react-hook-form)
- Un hook `useForm` por formulario
- Manejar errores mostrando mensajes bajo cada campo
- Ejemplo básico:
  ```tsx
  const { register, handleSubmit, formState: { errors } } = useForm()
  ```

### Estado Global (zustand)
- Prefijo `use` en el nombre del store: `useCartStore`
- Definir el tipo del estado e interfaces antes del store
- Seleccionar solo los valores necesarios al consumir el store para evitar re-renders innecesarios
- Ejemplo básico:
  ```ts
  import { create } from "zustand"

  interface CartStore {
    items: Product[]
    addItem: (item: Product) => void
  }

  export const useCartStore = create<CartStore>((set) => ({
    items: [],
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  }))
  ```

---

## Lo que NO se usa en este proyecto

| Librería / Práctica         | Alternativa utilizada         |
|-----------------------------|-------------------------------|
| Tailwind CSS                | CSS Modules                   |
| MUI / Shadcn / Chakra       | Componentes in-house          |
| Redux / Jotai / Recoil      | Zustand                       |
| Formik / native forms       | React Hook Form               |
| Font Awesome / react-icons  | lucide-react                  |
