# Checklist antes de publicar

**Ya no quedan placeholders: todos los textos están escritos.** Lo que sigue son
borradores míos para que tengas de dónde agarrarte — tu trabajo ahora es leerlos
y cambiar los que no suenen a vos.

---

## 1. Revisar los textos

En `src/content/letter.js` y `src/content/finalWish.js` dejé **versiones
alternativas comentadas** debajo de cada texto (las líneas que empiezan con `//`).
Si te gusta más una de esas, borrá la que está activa y descomentá la otra.

- [ ] `src/content/letter.js` → `recipientInitial`: **cambiar la `'X'` por la inicial de tu hermana** ← lo único que sí o sí hay que tocar
- [ ] `src/content/letter.js` → página 1, la dedicatoria (hay 2 versiones alternativas)
- [ ] `src/content/letter.js` → página 2, el poema (hay 2 versiones alternativas)
- [ ] `src/content/letter.js` → `storySections`: los 3 textos del scroll (cada uno con 1 alternativa)
- [ ] `src/content/finalWish.js` → el deseo final (hay 3 versiones alternativas)
- [ ] `src/content/finalWish.js` → la firma: dice "Con todo mi cariño, tu hermano"
- [ ] `index.html` → el `<title>` y la `<meta name="description">`

---

## 2. Revisar los captions de las fotos

Las 16 fotos ya están en `public/media/photos/` y **ya no tienen años ni fechas**:
el orden de la línea de tiempo es simplemente el orden en que están escritas en
`src/content/photos.js`. Si querés mover una foto de lugar, cortá su bloque y
pegalo donde quieras.

- [ ] Leer los 16 `caption` y cambiar los que no te gusten. Los escribí a partir
      de cómo vos nombraste cada archivo, así que el dato es tuyo, pero la
      redacción es mía.
- [ ] Revisar que el **orden** sea el correcto (yo lo armé de más antigua a más
      reciente según lo que decían los nombres).
- [ ] Revisar el campo `stage` de cada foto (`peques` / `ninez` / `adolescencia` / `ahora`).
- [ ] Los `alt` (para lectores de pantalla) ya están escritos; ajustalos si
      describen mal la foto.

### Mapa de qué foto es cuál

| Archivo | Etapa | Era tu archivo… |
| --- | --- | --- |
| `peques-01.jpg` | peques | muy chiquitos |
| `peques-02.jpg` | peques | foto de toda la familia cuando estábamos pequeños |
| `peques-03.jpg` | peques | yo y mi hermana pequeños |
| `peques-04.jpg` | peques | mi hermanita sola en la playa pequeñita |
| `ninez-01.jpg` | niñez | viaje a las ruedas en Opico, no se quería subir pero yo la hice subirse |
| `ninez-02.jpg` | niñez | viaje a las ruedas p2 |
| `ninez-03.jpg` | niñez | pintamos mi cuarto |
| `ninez-04.jpg` | niñez | salimos con mi mamá |
| `adolescencia-01.jpg` | adolescencia | día de la graduación de mi hermana de noveno grado |
| `adolescencia-02.jpg` | adolescencia | salimos a comer a Metrocentro Lourdes |
| `adolescencia-03.jpg` | adolescencia | salimos a Metro p2, tenía el cabello largo yo |
| `adolescencia-04.jpg` | adolescencia | para pandemia salimos con mamá p2 |
| `adolescencia-05.jpg` | adolescencia | le tomé una foto cuando madrugó a clases |
| `ahora-01.jpg` | ahora | la llevé a comer a mi trabajo Pizza Hut el día de la inauguración |
| `ahora-02.jpg` | ahora | me subió a su estado y me puso que no soy normal |
| `ahora-03.jpg` | ahora | WhatsApp Image (la más reciente) |

Las originales, con sus nombres largos, quedaron guardadas en `_originales/`
(esa carpeta no se sube a GitHub). Si algo sale mal, están ahí.

### Peso de las fotos

Pesan 3,5 MB en total. Funciona, pero en datos móviles va a tardar. Tres pasan
el límite recomendado de 300 KB:

- [ ] `peques-02.jpg` — 530 KB
- [ ] `ahora-02.jpg` — 349 KB
- [ ] `adolescencia-05.jpg` — 347 KB

Comprimilas en <https://squoosh.app> (MozJPEG, calidad ~80, ancho máx. 1600 px).
Las demás están bien.

---

## 3. Música

- [ ] Poner el archivo en `public/media/music/bg.mp3` (ese nombre exacto)
- [ ] Borrar `public/media/music/LEEME.txt`

Mientras no exista el mp3, el botón ♪ se ve apagado y deshabilitado.
Si no querés música, dejalo así: no molesta.

---

## 4. Antes de publicar

- [ ] Crear el repo **privado** `carta-virtual-cumpleanos` en GitHub
- [ ] `git push -u origin main`
- [ ] Conectar el repo en <https://app.netlify.com> (Add new site → Import an
      existing project → GitHub). La configuración ya viene en `netlify.toml`.
- [ ] Abrir el link que te da Netlify en **tu celular** y recorrer todo

> El `base` de `vite.config.js` ya está en `/`, que es lo que corresponde para
> Netlify y Vercel. Solo hay que cambiarlo si te pasás a GitHub Pages.

---

## 5. Prueba final (hacela en el celular)

- [ ] El sobre se abre al tocarlo
- [ ] Se pasan las páginas de la carta con ◀ ▶
- [ ] El botón "Sigamos…" desbloquea el scroll
- [ ] Las secciones aparecen con fade al bajar
- [ ] El carousel se desliza con el dedo
- [ ] Tocar un punto de la barra salta a esa foto
- [ ] El título de la etapa cambia (Peques → Niñez → Adolescencia → Ahora)
- [ ] Tocar una foto la abre en grande, y se cierra con la ✕
- [ ] Al llegar al final cae el confetti
- [ ] "Reproducir de nuevo" vuelve al sobre
- [ ] La música suena al tocar el botón ♪

---

## Opcional

- [ ] Generar las versiones `@2x` de las fotos y poner `USAR_2X = true`
      en `src/lib/assets.js` (ver el README)
- [ ] Agregar una tercera página a la carta en `src/content/letter.js`
- [ ] Cambiar los colores en `tailwind.config.js` (`oro`, `rosa`, `noche`, `violeta`)
