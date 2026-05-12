# NutriTrack+

NutriTrack+ es una PWA con React + Vite para seguimiento nutricional y planificación semanal de comidas.

## Instalación local

1. Clonar:
```bash
git clone https://github.com/ximosa/NutriTrack-.git
cd NutriTrack-
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear `.env` a partir de `.env.example` y completar valores:
```env
VITE_USDA_API_KEY="TU_API_KEY_USDA"
VITE_AI_PROXY_URL="https://tu-backend.example.com/api/weekly-plan"
```

4. Ejecutar en desarrollo:
```bash
npm run dev
```

## Despliegue en GitHub Pages (sin workflow)

Este proyecto ya está configurado con `gh-pages` y script de despliegue.

```bash
npm run deploy
```

Ese comando compila `dist/` y lo publica en la rama `gh-pages`.

Configuración usada:
- Repositorio: `ximosa/NutriTrack-`
- `base` de Vite: `/NutriTrack-/`

URL final:
- `https://ximosa.github.io/NutriTrack-/`

## Variables de entorno y seguridad

Importante:
- Todo lo que se compile en una app Vite frontend puede inspeccionarse en el navegador.
- No pongas claves privadas en `.env` del frontend.

Seguro en frontend:
- Valores públicos como `VITE_USDA_API_KEY` (o usar `DEMO_KEY` de fallback).
- URLs públicas como `VITE_AI_PROXY_URL`.

Nunca en frontend:
- `GEMINI_API_KEY`, claves secretas de OpenAI, contraseñas de base de datos, tokens admin.

Arquitectura recomendada:
1. Guardar la clave privada de Gemini en un backend (Vercel Functions, Netlify Functions, Cloudflare Workers, Render, etc.).
2. Exponer un endpoint tipo `POST /api/weekly-plan`.
3. Hacer que el frontend llame a ese endpoint usando `VITE_AI_PROXY_URL`.

## Notas

- `.env` está ignorado por git.
- `.env.example` sí se versiona como plantilla.
