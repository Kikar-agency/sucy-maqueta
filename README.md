# Sucy · web

Sitio estático (HTML, CSS y JS sin dependencias). No hace falta compilar nada.

| Ruta | Qué es |
| --- | --- |
| `/` | Home para el consumidor final |
| `/mayoristas/` | Página para comercios |
| `/pedidos/` | Lista de precios y pedidos por WhatsApp |

## Publicar en Cloudflare Pages
1. Subí esta carpeta a un repositorio de GitHub.
2. En Cloudflare → Workers & Pages → Create → Pages → Connect to Git, elegí el repo.
3. Framework preset: **None**. Build command: vacío. Output directory: `/`.
4. Cuando esté publicado, en Custom domains sumá `sucy.com.ar` y `www.sucy.com.ar`.

## Publicar en GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `root`. Las rutas usan `/` absoluto, así que funciona con dominio propio. Si se publica en `usuario.github.io/repo` hay que configurar el dominio propio primero.

## Qué falta cargar después de la sesión
- `assets/video/dron.mp4`: toma continua del dron. El hero la avanza con el scroll. Para que avance suave, exportarla con keyframes seguidos:
  `ffmpeg -i dron-original.mp4 -an -vf scale=1920:-2 -c:v libx264 -preset veryfast -crf 26 -g 6 -movflags +faststart dron.mp4`
- Tour 360°: en `index.html`, reemplazar el contenido de `<div class="tour">` por el `<iframe>` del tour (Kuula, Momento360 o Pannellum).
- Video institucional: en `index.html`, sección «Por qué elegirnos», reemplazar la imagen por el `<video>` (está comentado).
- Reseñas de Google: reemplazar las tarjetas vacías.
- Mapa: hoy muestra comercios de ejemplo (`assets/js/home.js`, lista `COMERCIOS`). Falta la base real de puntos de venta.
- Fotos de producto: reemplazar los archivos de `assets/img/` con el mismo nombre.
- WhatsApp comercial: en `mayoristas/index.html` y en el panel de pedidos.

## Precios de `/pedidos/`
La lista se edita en el panel del catálogo en Claude (pegar la lista semanal → revisar → Publicar). Esta copia tiene los precios del momento en que se exportó. Para actualizar la web hay que volver a exportar `pedidos/index.html` desde el catálogo.

## Fuentes
Oswald y Source Serif 4, alojadas en `assets/fonts/` (licencia SIL OFL, ver los .txt).
