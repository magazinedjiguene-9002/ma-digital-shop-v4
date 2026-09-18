# MA DIGITAL SHOP — Admin en ligne

Cette version conserve l'interface V4 et remplace le catalogue local par Supabase.

## 1. Supabase
1. Ouvrir SQL Editor.
2. Exécuter `supabase-online-setup.sql` une seule fois.
3. Le compte administrateur attendu est celui configuré dans les policies.

## 2. Fichiers
- `supabase-config.js` : URL + Publishable key.
- `admin.html` : connexion Supabase + gestion CRUD du catalogue.
- `app.js` : lecture publique du catalogue depuis Supabase, avec fallback local.
- `index.html` : charge Supabase avant `app.js`.

## 3. Images
Les images choisies depuis l'Admin sont envoyées dans le bucket public `product-images`; seuls les utilisateurs autorisés par la policy peuvent écrire.

## 4. Sécurité
Ne jamais mettre une Secret key / service_role dans le navigateur. Cette version utilise uniquement la Publishable key et RLS.

## 5. Déploiement
Remplacer les fichiers du dépôt GitHub par ceux de cette version, commit/push sur `main`, puis laisser Vercel déployer.
