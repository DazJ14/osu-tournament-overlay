# Shinsei Kitsune Academy (SKA) - Tournament Overlay

Una versión refactorizada y modernizada del overlay de torneos de [Vietnam Community League (VCL)](https://github.com/vncommunityleague/vcl-overlay), reconstruida desde cero utilizando **Vue 3**, **Vite** y **Tailwind CSS**. 

Este proyecto utiliza [Z-Engine](https://www.npmjs.com/package/@fukutotojido/z-engine) para la lectura de datos de osu! en tiempo real y está diseñado para ser altamente modular, fácil de mantener y de personalizar.

---

## Novedades y Características

- **Migración a Vue 3:** El código original (Vanilla JS) fue reescrito en componentes de Vue 3 utilizando la *Composition API* y *Composables* para separar la lógica de la vista (`useMappool`, `useScore`, `useGameState`, etc.).
- **Estilos con Tailwind CSS:** Facilita enormemente la modificación del diseño y la responsividad de los elementos.
- **Panel de Debug Integrado:** Interfaz de desarrollo mejorada para simular el estado de la partida, los puntajes y probar el overlay sin necesidad de tener el cliente de osu! abierto.
- **Resolución Estándar:** Optimizado nativamente para una resolución de 1080p (`1920x1080`).

---

## Uso en Producción (Para Streamers y Organizers)

Si solo quieres usar el overlay en tu torneo y no planeas modificar el código (Esto es en caso que tengas la carpeta compilada, caso contrario, deberas ir a la seccion de [desarrollo](#desarrollo-y-entorno-local) y compilarla por tu cuenta):

1. Instala [tosu](https://github.com/tosuapp/tosu).
2. Descarga la última versión compilada (o compílala tú mismo leyendo la sección de Desarrollo).
3. Mueve el contenido de la carpeta compilada (`dist/`) a la carpeta `static/<Tu-carpeta>` dentro de tu instalación de `tosu`.
   La estructura debería verse así:
   ```text
   tosu/
   └── static/
       └── <Tu-carpeta>/
           ├── assets/
           ├── index.html
           └── data.json
4. Actualiza la información de los mapas en el archivo data.json según el mappool de tu torneo.

### Configuración en OBS
- Añade una nueva fuente de navegador (Browser Source) en OBS.
- **URL:** La URL es proporcionada dentro del cliente web de `tosu`, pero generalmente tiene un formato como el siguiente `http://127.0.0.1:24050/<Tu-carpeta>`
- **Ancho (Width):** `1920`
- **Alto (Height):** `1368`
- Haz clic derecho en la fuente de navegador y selecciona **Interactuar** (`Interact`) para abrir el panel de control del overlay.

### Controles del Mappool (Interacción en OBS)
- **Click Izquierdo:** Hacer un PICK para el equipo Izquierdo.
- **Shift + Click Izquierdo:** Hacer un BAN para el equipo Izquierdo.
- **Click Derecho:** Hacer un PICK para el equipo Derecho.
- **Shift + Click Derecho:** Hacer un BAN para el equipo Derecho.
- **Ctrl + Click (Izquierdo o Derecho):** Eliminar el pick/ban de ese mapa.

---

## Desarrollo y Entorno Local

Ya que el proyecto utiliza Vue y Vite, necesitas compilarlo antes de pasarlo a `tosu`.

### Prerrequisitos

- Bun (Recomendado) o en su defecto Node.js (`npm`/`yarn`).

### Levantar el entorno de desarrollo

1. Clona este repositorio:
```
git clone https://github.com/DazJ14/ska-overlay.git
cd ska-overlay
```
2. Instala las dependencias:
```
bun install
```
3. Inicia el servidor de desarrollo:
```
bun dev
```
4. Abre tu navegador en `http://localhost:5173`

### Compilar para Producción

Cuando termines de hacer tus cambios, ejecuta:
```
bun run build
```
Esto generará una carpeta `dist` con los archivos estáticos minificados y optimizados. Copia el contenido de esta carpeta a tu instancia de `tosu` como se explica en la sección de Instalación.