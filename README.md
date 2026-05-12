# NutriTrack+ 🥗

NutriTrack+ es una PWA (Progressive Web App) premium y moderna diseñada para el seguimiento nutricional inteligente. Utiliza Inteligencia Artificial (Google Gemini) para generar planes alimenticios personalizados y se integra con APIs globales como USDA y Open Food Facts para ofrecer datos precisos de calorías y macronutrientes.

![License](https://img.shields.io/badge/license-Apache--2.0-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-orange)

## ✨ Características Principales

- **Dashboard Visual:** Resumen diario de calorías, proteínas, carbohidratos, grasas y agua con un diseño futurista.
- **Buscador de Alimentos Inteligente:** Integración con **USDA FoodData Central** y **Open Food Facts** para encontrar productos de todo el mundo.
- **Planificador AI:** Generación de menús semanales personalizados mediante **Google Gemini AI** basados en tus objetivos.
- **Modo Offline:** Funciona sin conexión gracias a Service Workers e IndexedDB.
- **Tracker de Macronutrientes:** Control estricto de tus metas diarias con barras de progreso animadas.
- **Registro de Hidratación:** Seguimiento fácil de tu consumo de agua diario.
- **Diseño Mobile-First:** Experiencia premium similar a una app nativa con animaciones fluidas y glassmorphism.

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + TypeScript
- **Estilos:** Tailwind CSS (Vite Discovery)
- **Animaciones:** Motion (framer-motion)
- **Base de Datos Local:** IndexedDB (vía `idb`)
- **Iconos:** Lucide React
- **Gráficos:** Recharts
- **IA:** Google Gemini API
- **APIs de Nutrición:** USDA API & Open Food Facts API

## 🚀 Instalación y Desarrollo Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/nutritrack-plus.git
   cd nutritrack-plus
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz y añade tus API Keys:
   ```env
   GEMINI_API_KEY="TU_API_KEY_DE_GOOGLE_AI_STUDIO"
   VITE_USDA_API_KEY="TU_API_KEY_DE_USDA"
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

## 📦 Despliegue en GitHub Pages

Esta aplicación está configurada para desplegarse fácilmente en GitHub Pages.

### Paso 1: Configurar el Base Path
Si tu repositorio **no** está en la raíz de tu dominio (ej: `usuario.github.io/proyecto/`), debes editar `vite.config.ts`:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/nombre-de-tu-repo/', // Añade esta línea
  // ... resto de la configuración
})
```

### Paso 2: Desplegar
Ejecuta el siguiente comando para compilar y subir a la rama `gh-pages`:

```bash
npm run deploy
```

La aplicación se construirá en la carpeta `dist/` y se subirá automáticamente.

## 📱 Instalación PWA

Al ser una Progressive Web App, puedes instalarla en tu dispositivo:
- **En iOS (Safari):** Pulsa el botón "Compartir" y selecciona "Añadir a la pantalla de inicio".
- **En Android (Chrome):** Aparecerá un banner de instalación o puedes ir al menú y seleccionar "Instalar aplicación".

## 🔑 Obtención de API Keys

- **Gemini AI:** Obtenla gratis en [Google AI Studio](https://aistudio.google.com/).
- **USDA API:** Regístrate en [FDC USDA](https://fdc.nal.usda.gov/api-key-signup.html).
- **Open Food Facts:** No requiere API Key para búsquedas básicas.

## 📄 Licencia

Este proyecto está bajo la Licencia Apache 2.0. Consulta el archivo `LICENSE` para más detalles.

---
Desarrollado con ❤️ para una vida más saludable.
