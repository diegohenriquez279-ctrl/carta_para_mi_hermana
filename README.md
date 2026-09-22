# Carta virtual de cumpleaños

Una carta mágica interactiva: sobre que se abre → carta con páginas → scroll narrativo →
línea de tiempo de fotos → deseo final con confetti.

---

## Arrancar el proyecto

```bash
npm install
```

```bash
npm run dev
```

Se abre en <http://localhost:5173>. Cualquier cambio que guardes se ve al instante.

> ⚠️ **No uses Live Server ni abras `index.html` con doble click.** Esto es un
> proyecto de React: el archivo `src/main.jsx` está escrito en JSX y el navegador
> no lo entiende solo — necesita que Vite lo compile al vuelo. Si lo abrís de otra
> forma vas a ver una página en blanco (o el cartel de aviso que dejé adentro de
> `index.html`). Siempre `npm run dev`.

Para ver cómo queda la versión final (la que se sube):

```bash
npm run build
```

```bash
npm run preview
```

---

## Qué archivo tocar para cada cosa

| Quiero cambiar…                        | Archivo                          |
| -------------------------------------- | -------------------------------- |
| La dedicatoria y el poema              | `src/content/letter.js`          |
| La inicial del sello del sobre         | `src/content/letter.js` (`recipientInitial`) |
| Los textos del scroll narrativo        | `src/content/letter.js` (`storySections`) |
| Las fotos, etapas y captions           | `src/content/photos.js`          |
| El deseo final y la firma              | `src/content/finalWish.js`       |
| Los colores y tipografías              | `tailwind.config.js`             |
| El título de la pestaña del navegador  | `index.html`                     |

**No hace falta tocar ningún componente para personalizar el contenido.**

---

## Convención de nombres de fotos

Las fotos van en `public/media/photos/` con este formato:

```
etapa-NN.jpg
```

- `etapa` = `peques`, `ninez`, `adolescencia` o `ahora`.
- `NN` = número correlativo dentro de esa etapa, con dos dígitos (`01`, `02`, `03`…).
- Ejemplos: `peques-01.jpg`, `ninez-03.jpg`, `ahora-02.jpg`.

**No hay años ni fechas en ningún lado.** El orden de la línea de tiempo sale
únicamente del orden en que están escritas las fotos en `src/content/photos.js`:
si querés mover una foto de lugar, cortá su bloque y pegalo donde quieras.

Requisitos de cada foto:

| Cosa            | Valor                                     |
| --------------- | ----------------------------------------- |
| Formato         | `.jpg`                                    |
| Peso            | menos de **300 KB**                       |
| Lado más largo  | máximo **1600 px**                        |

### Agregar una foto nueva

1. Copiala a `public/media/photos/` con el nombre `etapa-NN.jpg`.
2. Agregá su bloque en `src/content/photos.js`, en el lugar que le toca dentro
   de la secuencia:

```js
{
  src: '/media/photos/adolescencia-06.jpg',
  stage: 'adolescencia',          // 'peques' | 'ninez' | 'adolescencia' | 'ahora'
  caption: 'Lo que quiero que se lea debajo de la foto',
  alt: 'Descripción para lectores de pantalla',
},
```

Las etapas se agrupan solas a partir del campo `stage`: no hay que tocar nada más.

### Cómo comprimir las fotos

La opción más fácil, sin instalar nada: <https://squoosh.app> (elegí MozJPEG,
calidad ~80, y bajá el ancho a 1600 px).

---

## TODO: versiones `@2x` para pantallas retina

El código ya está preparado, pero **está desactivado** porque todavía no
existen los archivos.

Para activarlo:

1. Generá, al lado de cada foto, su versión del doble de tamaño:

   ```
   public/media/photos/peques-01.jpg      ← ~800 px de ancho
   public/media/photos/peques-01@2x.jpg   ← ~1600 px de ancho
   ```

   Con ImageMagick, parado en `public/media/photos`:

   ```bash
   for f in *.jpg; do n="${f%.jpg}"; magick "$f" -resize 1600x1600\> -quality 82 "$n@2x.jpg"; magick "$f" -resize 800x800\> -quality 82 "$n.jpg"; done
   ```

2. Poné `USAR_2X = true` en `src/lib/assets.js`.

Si lo dejás en `false` todo funciona igual, solo que con una sola versión de
cada imagen.

---

## Música de fondo

Poné tu canción en `public/media/music/bg.mp3` (ese nombre exacto).

Arranca **siempre en silencio**, a propósito: los navegadores bloquean el audio
automático, y además no querés que le suene música de golpe si abre la carta con
gente al lado. Ella la activa con el botón flotante ♪ de abajo a la derecha.

Si el archivo no existe, el botón se muestra apagado y deshabilitado — la página
no se rompe.

---

## Publicar el sitio

El repo es **privado**, así que las fotos no quedan expuestas en GitHub.
El sitio se publica con Netlify (o Vercel), que sí puede construir repos
privados gratis.

Ya dejé la configuración lista: `netlify.toml` y `vercel.json` le dicen a cada
plataforma cómo compilar el proyecto, así que no hay que configurar nada a mano.

### Con Netlify (recomendado)

1. Entrá a <https://app.netlify.com> e iniciá sesión con tu cuenta de GitHub.
2. **Add new site → Import an existing project → GitHub**.
3. Autorizá a Netlify y elegí el repo `carta-virtual-cumpleanos`.
4. El comando de build y la carpeta ya vienen cargados desde `netlify.toml`
   (`npm run build` y `dist`). Dale a **Deploy**.
5. En un par de minutos te da un link tipo `algo-random.netlify.app`.
   Podés cambiarle el nombre en **Site configuration → Change site name**.

### Con Vercel

1. Entrá a <https://vercel.com/new> con tu cuenta de GitHub.
2. Importá el repo `carta-virtual-cumpleanos`.
3. Detecta Vite solo. Dale a **Deploy**.

### Cada vez que cambies algo

```bash
git add . && git commit -m "Cambio los textos"
```

```bash
git push
```

Netlify y Vercel reconstruyen el sitio solas con cada push. No hace falta
`npm run deploy` (ese script es solo por si algún día te pasás a GitHub Pages).

> **Sobre la privacidad:** el repo es privado, pero **el link del sitio es
> público** — cualquiera que lo tenga puede abrirlo. No queda indexado en Google
> ni es adivinable, pero si se lo pasás a alguien, esa persona puede pasárselo a
> otra. Tenelo en cuenta antes de compartirlo en un grupo grande.

---

## Estructura

```
src/
  App.jsx                  Las 3 fases: sobre → carta → historia
  main.jsx
  index.css                Tailwind + estilos base y utilidades propias
  components/
    ParticlesBg.jsx        Fondo global de partículas
    Envelope.jsx           Sobre cerrado con glow, click abre
    LetterBook.jsx         Libro con páginas navegables (flip 3D)
    ScrollStory.jsx        Secciones con fade-in al scroll
    Timeline.jsx           Línea de tiempo cronológica de fotos
    PhotoCard.jsx          Tarjeta de foto con su caption
    Lightbox.jsx           Click en foto → verla grande
    FinalWish.jsx          Pantalla final con confetti
    MusicToggle.jsx        Botón flotante de música
    LottieDecor.jsx        Adornos animados (regalo y corazón)
  content/
    letter.js              Carta + secciones del scroll
    photos.js              Fotos de la línea de tiempo
    finalWish.js           Deseo final
  hooks/
    useInView.js           Detecta cuándo algo entra en pantalla
    usePrefersReducedMotion.js
  lib/
    assets.js              Rutas de /public + helper @1x/@2x
netlify.toml               Cómo compila Netlify (no hay que tocarlo)
vercel.json                Cómo compila Vercel (no hay que tocarlo)
public/
  media/
    photos/                Las fotos
    music/bg.mp3           La música (falta ponerla)
    lottie/                Animaciones del regalo y el corazón
```

---

## Accesibilidad

Está contemplado y conviene no romperlo al editar:

- **Teclado**: ← → para pasar páginas de la carta y fotos del carousel, Esc para
  cerrar el visor de fotos. El foco se ve siempre con un borde dorado.
- **Lectores de pantalla**: todas las imágenes tienen `alt` (si dejás el campo
  vacío en `photos.js` se genera uno automático, pero es mejor que lo escribas),
  y los botones de ícono tienen `aria-label`.
- **`prefers-reduced-motion`**: si el sistema pide menos movimiento, se reducen
  las partículas, el flip 3D pasa a ser un fade simple y no se tira confetti.

---

## Stack

Vite + React + Tailwind · framer-motion · @tsparticles · embla-carousel ·
lottie-react · canvas-confetti · howler · gh-pages
