#!/bin/bash
echo "🚀 Déploiement FormaPro sur Vercel..."
echo ""

# Install vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Deploy with env vars
vercel deploy \
  --prod \
  --yes \
  --name "forma-whatsapp" \
  -e NEXT_PUBLIC_SUPABASE_URL="https://zixbpwwjweonianynvsq.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGJwd3dqd2VvbmlhbnludnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTYyOTQsImV4cCI6MjA5NTgzMjI5NH0.5ndkLhjM5v8xtW-BfenVwPEdQlQs_a6DWXXffCRD0N8" \
  --scope mrad-boops-projects

echo ""
echo "✅ Déploiement terminé !"
