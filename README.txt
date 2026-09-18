MA DIGITAL SHOP — V3
=====================

OBJECTIF
- Petit projet e-commerce simple à lancer et à faire évoluer.
- Le site public reste léger : catalogue → panier → WhatsApp.
- Aucun paiement bancaire ni compte client dans cette version.

CONTENU
- index.html : boutique publique
- admin.html : gestion locale du catalogue
- products.json : catalogue initial V3
- app.js / styles.css : logique et design
- assets/logo.png : logo MA DIGITAL SHOP
- assets/products/ : visuels locaux des produits

FONCTIONS V3
- Design inspiré de la V2 conservée
- 4 catégories : Streaming, Gaming, Logiciels, Accessoires
- Streaming affiché à 2 500 FCFA
- Recherche globale + recherches par catégorie
- Filtres Gaming / Logiciels
- Panier avec quantités + / -
- Suppression d'articles et bouton vider le panier
- Total automatique quand les prix sont connus
- Commande individuelle ou panier via WhatsApp
- Compteur du panier dans l'en-tête
- Version mobile avec menu
- Catalogue V3 isolé du localStorage de la V2 pour éviter les conflits

WHATSAPP
Numéro configuré : +221 77 378 10 96

ADMINISTRATION
admin.html est une administration locale pour modifier le catalogue dans le navigateur.
Elle n'est PAS une vraie administration sécurisée côté serveur.
Ne l'utilisez pas comme panneau public contenant des informations sensibles.

IMAGES
Les visuels présents dans assets/products sont des visuels locaux de démonstration/présentation.
Pour une mise en ligne commerciale, remplacez-les par des images dont vous disposez des droits d'utilisation.
Les logos et marques restent la propriété de leurs titulaires respectifs.

MISE EN LIGNE
1. Tester index.html localement.
2. Mettre le dossier sur GitHub.
3. Déployer le dépôt sur Vercel.
4. Ajouter ensuite un nom de domaine si le projet commence à recevoir des commandes.

ÉVOLUTION POSSIBLE PLUS TARD
- vraie base de données
- vraie authentification admin
- gestion des commandes
- paiement en ligne
- upload sécurisé d'images
- statistiques


VISUELS V6
Les cartes produits utilisent désormais des visuels réels de marques/produits via des sources officielles ou des pages produit reconnues. Le site conserve un fallback vers les images de catégorie si une source distante est indisponible.
