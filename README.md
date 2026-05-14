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

3. Crear `.env` a partir de `.env.example`.

4. Desarrollo local con API incluida:
```bash
npm run dev:vercel
```

Este comando levanta frontend + función `api/weekly-plan` en local.

## Despliegue en Vercel

1. Importa el repo `ximosa/NutriTrack-` en Vercel.
2. En `Project Settings > Environment Variables` añade:
- `GEMINI_API_KEY` (secreta, servidor)
- `VITE_USDA_API_KEY` (pública, frontend)
- `VITE_AI_PROXY_URL` (opcional; puedes dejarla vacía para usar `/api/weekly-plan`)
3. Deploy.

## Variables y seguridad

- `GEMINI_API_KEY` es privada: solo servidor (Vercel), nunca frontend.
- `VITE_*` se embebe en el bundle frontend y puede verse en navegador.
- Si no defines `VITE_AI_PROXY_URL`, el frontend usa por defecto `/api/weekly-plan`.

## Notas

- `.env` está ignorado por git.
- `.env.example` sí se versiona como plantilla.
