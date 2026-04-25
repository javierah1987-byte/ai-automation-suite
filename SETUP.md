# 🚀 Setup en 3 pasos — AI Automation Suite

## Paso 1: Subir a GitHub (automático)

```bash
# Necesitas un GitHub Personal Access Token con permisos: repo, workflow
# Obtenerlo en: https://github.com/settings/tokens/new

GITHUB_TOKEN=ghp_XXXXXXXXXX \
GITHUB_USER=javierah1987-byte \
node push_to_github.js
```

El script:
- Crea el repo `ai-automation-suite` (privado)
- Sube todos los archivos automáticamente
- Muestra el link directo a Vercel al finalizar

## Paso 2: Desplegar en Vercel

1. Ve a https://vercel.com/new
2. Importa el repo `ai-automation-suite`
3. Añade las variables de entorno (mínimo requerido para funcionar):

| Variable | Dónde obtenerla |
|----------|----------------|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API |

4. Click "Deploy" → en 2 minutos tienes la URL productiva

## Paso 3: Inicializar base de datos

1. Ve a Supabase Dashboard > SQL Editor
2. Copia y ejecuta el contenido de `supabase/schema.sql`
3. Listo — todas las tablas creadas

## Variables opcionales (para módulos avanzados)

```env
RESEND_API_KEY=re_...          # Módulo email
DIALOG360_API_KEY=...          # Módulo WhatsApp
RECALL_AI_API_KEY=...          # Módulo reuniones online
GOOGLE_MAPS_API_KEY=...        # Módulo scraper
SUPABASE_SERVICE_ROLE_KEY=...  # Operaciones admin
```

## Coste mensual del stack (estimado)

- Vercel Pro: 20€/mes
- Supabase Pro: 25€/mes  
- Claude API: 100–400€/mes (variable por uso)
- **Total base: ~650–900€/mes**
- **Con 5 clientes: margen > 70%**

## Contacto

📧 info@tryvor.com
📞 +34 928 07 96 04
💬 WhatsApp: +34 645 08 10 15
