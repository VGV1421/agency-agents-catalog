# 🎭 The Agency — Catálogo Web

## Vista Previa Local

```bash
cd /root/.openclaw/workspace/agency-agents-catalog
python3 -m http.server 8080
# Abre http://localhost:8080
```

## Desplegar en Vercel (Gratis)

### Opción 1: Vercel Dashboard (Recomendado)

1. Ve a https://vercel.com/new
2. Importa el repo de GitHub (o sube los archivos manualmente)
3. ¡Listo! Vercel detecta HTML estático automáticamente

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /root/.openclaw/workspace/agency-agents-catalog
vercel --prod
```

### Opción 3: Netlify Drop (Alternativa)

1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `agency-agents-catalog`
3. ¡Listo! Te da una URL pública en segundos

## Estructura

```
agency-agents-catalog/
├── index.html      # Catálogo completo (99 agentes)
└── README.md       # Este archivo
```

## Personalización

Para cambiar precios, email de contacto, o añadir botones de compra reales:

1. Edita `index.html`
2. Busca la sección "Pricing" o "Contact"
3. Modifica los valores
4. Vuelve a desplegar

## Próximos Pasos

1. ✅ Ver la web localmente
2. ⏳ Desplegar en Vercel/Netlify
3. ⏳ Añadir links de compra reales (Gumroad, Stripe)
4. ⏳ Compartir en redes
