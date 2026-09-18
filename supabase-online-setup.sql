-- MA DIGITAL SHOP — mise en place du catalogue en ligne
-- A exécuter dans Supabase > SQL Editor.

alter table public.products add column if not exists slug text;
alter table public.products add column if not exists icon text default '✦';

-- Rend les anciens enregistrements compatibles avec le nouvel Admin.
update public.products set slug = 'legacy-' || id::text where slug is null;

create unique index if not exists products_slug_key on public.products(slug);

alter table public.products enable row level security;

revoke insert, update, delete on public.products from anon;
grant insert, update, delete on public.products to authenticated;

drop policy if exists "Admin can read all products" on public.products;
drop policy if exists "Admin can insert products" on public.products;
drop policy if exists "Admin can update products" on public.products;
drop policy if exists "Admin can delete products" on public.products;

create policy "Admin can read all products" on public.products for select to authenticated using ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);
create policy "Admin can insert products" on public.products for insert to authenticated with check ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);
create policy "Admin can update products" on public.products for update to authenticated using ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid) with check ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);
create policy "Admin can delete products" on public.products for delete to authenticated using ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);

-- Stockage public des images produits. Les uploads restent réservés à l'admin.
insert into storage.buckets (id, name, public) values ('product-images','product-images',true) on conflict (id) do update set public=true;

drop policy if exists "Public can read product images" on storage.objects;
drop policy if exists "Admin can upload product images" on storage.objects;
drop policy if exists "Admin can update product images" on storage.objects;
drop policy if exists "Admin can delete product images" on storage.objects;

create policy "Public can read product images" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
create policy "Admin can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);
create policy "Admin can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and (select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid) with check (bucket_id = 'product-images' and (select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);
create policy "Admin can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and (select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);

-- Catalogue initial MA DIGITAL SHOP
insert into public.products (slug,name,subtitle,category,badge,price,image_url,description,available,featured,sort_order,icon) values
('netflix-complet-1m','Netflix Premium 1 Mois Compte Complet','Netflix','streaming','Netflix',2500,'assets/products/netflix.jpg','4K 4 écrans livraison WhatsApp',true,true,1,'N'),
('netflix-prive-1m','Netflix Premium 1 Mois Profil Privé','Netflix','streaming','Netflix',2500,'assets/products/netflix.jpg','1 profil PIN Full HD/4K',true,false,2,'N'),
('netflix-complet-3m','Netflix 3 Mois Compte Complet','Netflix','streaming','Netflix',6500,'assets/products/netflix.jpg','Offre économique',true,false,3,'N'),
('prime-complet-1m','Prime Video 1 Mois Compte Complet','Prime Video','streaming','Prime Video',2500,'assets/products/prime-video.jpg','Films et séries Amazon',true,true,4,'P'),
('prime-prive-1m','Prime Video 1 Mois Profil Privé','Prime Video','streaming','Prime Video',2500,'assets/products/prime-video.jpg','Profil personnel sécurisé',true,false,5,'P'),
('prime-3m','Prime Video 3 Mois','Prime Video','streaming','Prime Video',6000,'assets/products/prime-video.jpg','Avec bonus Prime Gaming',true,false,6,'P'),
('crunchy-1m','Crunchyroll Premium 1 Mois','Crunchyroll','streaming','Crunchyroll',2500,'assets/products/crunchyroll.jpg','Animes VOSTFR sans pub',true,true,7,'C'),
('crunchy-3m','Crunchyroll Premium 3 Mois','Crunchyroll','streaming','Crunchyroll',6000,'assets/products/crunchyroll.jpg','Idéal fans d''animes',true,false,8,'C'),
('canal-access-1m','Canal+ Access 1 Mois','Canal+','streaming','Canal+',3000,'assets/products/canal-plus.jpg','Réabonnement décodeur',true,false,9,'C'),
('canal-evasion-1m','Canal+ Évasion 1 Mois','Canal+','streaming','Canal+',5000,'assets/products/canal-plus.jpg','Novelas sport jeunesse',true,false,10,'C'),
('canal-tout-1m','Canal+ Tout Canal 1 Mois','Canal+','streaming','Canal+',10500,'assets/products/canal-plus.jpg','Toutes chaînes + foot',true,false,11,'C'),
('canal-express','Canal+ Réabonnement Express','Canal+','streaming','Canal+',500,'assets/products/canal-plus.jpg','Activation 30 min',true,false,12,'C'),
('fc26','EA SPORTS FC 26','Jeu PC','gaming','Sport',null,'assets/products/fc26.jpg','Jeu de football sur PC. Prix sur demande.',true,false,13,'FC'),
('efootball','eFootball / PES','Jeu PC','gaming','Sport',null,'assets/products/efootball-pes.jpg','Football sur PC. Prix sur demande.',true,false,14,'⚽'),
('gta-v','Grand Theft Auto V','PC • Open World','gaming','Action',null,'assets/products/gta-v.png','Action et monde ouvert. Prix sur demande.',true,false,15,'V'),
('gta-vice-city','GTA Vice City','PC • Open World','gaming','Action',null,'assets/products/gta-v.jpg','Action et aventure dans Vice City.',true,false,16,'VC'),
('gta-san-andreas','GTA San Andreas','PC • Open World','gaming','Action',null,'assets/products/gta-san-andreas.jpg','Action et aventure en monde ouvert.',true,false,17,'SA'),
('call-of-duty','Call of Duty','Jeu PC • FPS','gaming','FPS',null,'assets/products/call-of-duty.jpg','FPS et action sur PC.',true,false,18,'COD'),
('sleeping-dogs','Sleeping Dogs','PC • Action','gaming','Action',null,'assets/products/sleeping-dogs.jpg','Action et aventure en monde ouvert.',true,false,19,'SD'),
('mafia','Mafia','PC • Action/Aventure','gaming','Aventure',null,'assets/products/mafia-definitive-edition.jpg','Action et aventure.',true,false,20,'M'),
('mafia-ii','Mafia II','PC • Action/Aventure','gaming','Aventure',null,'assets/products/mafia-ii.jpg','Action et aventure.',true,false,21,'M2'),
('red-dead-2','Red Dead Redemption 2','PC • Open World','gaming','Aventure',null,'assets/products/red-dead-redemption-2.jpg','Action, aventure et monde ouvert.',true,false,22,'RDR2'),
('cyberpunk-2077','Cyberpunk 2077','PC • RPG','gaming','RPG',null,'assets/products/cyberpunk-2077.jpg','RPG et monde ouvert.',true,false,23,'2077'),
('windows-11','Windows 11','Système d''exploitation','software','Windows',null,'assets/products/windows-11.jpg','Licence et édition à confirmer.',true,false,24,'11'),
('windows-10','Windows 10','Système d''exploitation','software','Windows',null,'assets/products/windows-10.jpg','Licence et édition à confirmer.',true,false,25,'10'),
('microsoft-365','Microsoft 365 / Office','Bureautique & productivité','software','Microsoft',null,'assets/products/microsoft-365.jpg','Outils de bureautique et de productivité.',true,false,26,'365'),
('photoshop','Adobe Photoshop','Création graphique','software','Adobe',null,'assets/products/adobe-photoshop.jpg','Retouche photo et création graphique.',true,false,27,'Ps'),
('illustrator','Adobe Illustrator','Design vectoriel','software','Adobe',null,'assets/products/adobe-illustrator.jpg','Illustration et design vectoriel.',true,false,28,'Ai'),
('premiere-pro','Adobe Premiere Pro','Montage vidéo','software','Adobe',null,'assets/products/adobe-premiere-pro.jpg','Montage vidéo.',true,false,29,'Pr'),
('after-effects','Adobe After Effects','Motion design','software','Adobe',null,'assets/products/adobe-after-effects.jpg','Motion design et effets visuels.',true,false,30,'Ae'),
('lightroom','Adobe Lightroom','Photo','software','Adobe',null,'assets/products/adobe-lightroom.jpg','Organisation et retouche photo.',true,false,31,'Lr'),
('macos-software','Logiciels macOS','Bibliothèque Mac','software','macOS',null,'assets/products/macos.jpg','Sélection de logiciels compatibles Mac.',true,false,32,'⌘'),
('security','Antivirus & Sécurité','Protection','software','Sécurité',null,'assets/products/antivirus-securite.jpg','Solutions de sécurité informatique.',true,false,33,'✓'),
('controller-wired','Manette PC Filaire','Manette','accessory','Manette',6000,'assets/products/controller-wired.jpg','Vibration Windows',true,false,34,'✦'),
('controller-bt','Manette Bluetooth Sans Fil','Manette','accessory','Manette',10000,'assets/products/controller-bt.jpg','PC Android PS3',true,false,35,'✦'),
('mouse-rgb','Souris Gamer RGB Filaire','Souris','accessory','Souris',5000,'assets/products/mouse-rgb.jpg','6400 DPI',true,false,36,'✦'),
('mouse-wireless','Souris Sans Fil Rechargeable','Souris','accessory','Souris',5500,'assets/products/mouse-wireless.jpg','Silencieuse',true,false,37,'✦'),
('keyboard-azerty','Clavier Gamer AZERTY RGB','Clavier','accessory','Clavier',9000,'assets/products/keyboard-azerty.jpg','Silencieux',true,false,38,'✦'),
('headset-mic','Casque Gamer avec Micro','Casque','accessory','Casque',7500,'assets/products/headset-mic.jpg','Jack + USB',true,false,39,'✦'),
('earbuds-gaming','Écouteurs Gaming','Audio','accessory','Audio',3500,'assets/products/earbuds-gaming.jpg','Pour Free Fire/PUBG',true,false,40,'✦'),
('mousepad-xxl','Tapis Souris XXL','Tapis','accessory','Tapis',4000,'assets/products/mousepad-xxl.jpg','70x30cm',true,false,41,'✦'),
('usb-32','Clé USB 32Go','Stockage','accessory','Stockage',4500,'assets/products/usb-32.jpg','SanDisk',true,false,42,'✦'),
('usb-64','Clé USB 64Go','Stockage','accessory','Stockage',6500,'assets/products/usb-64.jpg','SanDisk',true,false,43,'✦'),
('hdd-500','Disque Dur 500Go + films','Stockage','accessory','Stockage',18000,'assets/products/hdd-500.jpg','Rempli sur demande',true,false,44,'✦'),
('hdmi-15','Câble HDMI 1.5m','Câble','accessory','Câble',3000,'assets/products/hdmi-15.jpg','4K',true,false,45,'✦'),
('otg-usbc','Adaptateur OTG USB-C','Adaptateur','accessory','Adaptateur',1500,'assets/products/otg-usbc.jpg','Manette sur téléphone',true,false,46,'✦'),
('cooler-laptop','Refroidisseur PC Portable','PC','accessory','PC',8500,'assets/products/cooler-laptop.jpg','Anti-surchauffe',true,false,47,'✦'),
('speaker-mini','Haut-parleur Bluetooth Mini','Audio','accessory','Audio',8000,'assets/products/speaker-mini.jpg','SD + FM',true,false,48,'✦'),
('charger-25w','Chargeur Rapide 25W','Chargeur','accessory','Chargeur',4000,'assets/products/charger-25w.jpg','Samsung Tecno',true,false,49,'✦'),
('cable-typec-2m','Câble Type-C 2m tressé','Câble','accessory','Câble',2500,'assets/products/cable-typec-2m.jpg','Nylon',true,false,50,'✦'),
('power-strip','Multiprise Parasurtenseur','Électricité','accessory','Électricité',4500,'assets/products/power-strip.jpg','Protection Senelec',true,false,51,'✦'),
('usb-led','Lampe LED USB','Setup','accessory','Setup',3000,'assets/products/usb-led.jpg','Ambiance setup',true,false,52,'✦'),
('phone-stand','Support Téléphone Bureau','Support','accessory','Support',2500,'assets/products/phone-stand.jpg','Réglable',true,false,53,'✦')
on conflict (slug) do update set name=excluded.name,subtitle=excluded.subtitle,category=excluded.category,badge=excluded.badge,price=excluded.price,image_url=excluded.image_url,description=excluded.description,available=excluded.available,featured=excluded.featured,sort_order=excluded.sort_order,icon=excluded.icon,updated_at=now();
