const WA="221773781096";
const STORAGE_CART="ma_cart_v3";
const FALLBACK=[];
let products=[];
let categories=[];
let cart=JSON.parse(localStorage.getItem(STORAGE_CART)||"[]");

const money=p=>p==null?"Prix sur demande":new Intl.NumberFormat("fr-FR").format(p)+" FCFA";
const label=c=>({streaming:"Streaming",gaming:"Gaming",software:"Logiciel",accessory:"Accessoire"}[c]||c);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
const attr=esc;

function wa(text){window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(text),"_blank","noopener,noreferrer")}
function productById(id){return products.find(p=>String(p.id)===String(id))}
function productImage(p){
  if(p.image) return `<img src="${attr(p.image)}" alt="${attr(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='assets/category-${p.category==='streaming'?'streaming':p.category==='gaming'?'gaming':p.category==='software'?'software':'accessories'}.jpg'">`;
  return "";
}
function openProductDetail(id){
  const p=productById(id);if(!p)return;
  const modal=document.getElementById("product-modal"),content=document.getElementById("product-detail-content"),title=document.getElementById("detail-title");
  if(!modal||!content)return;
  if(title)title.textContent=p.name;
  const info=promoInfo(p); const price=info.price==null?"Prix sur demande":money(info.price);
  const cat=label(p.category);
  const details=p.product_details||{};
  const detailItems=[
    ["Plateforme",details.platform],["Durée",details.duration],["Type d'accès",details.access],
    ["Écrans",details.screens],["Qualité",details.quality],["Appareils compatibles",details.devices],
    ["Livraison",details.delivery],["Délai indicatif",details.delay],["Paiement",details.payment],
    ["Compatibilité",details.compatibility],["Type de licence",details.license],["Prérequis",details.requirements],
    ["Marque",details.brand],["Modèle",details.model],["État",details.condition]
  ].filter(function(x){return x[1]});
  const related=products.filter(x=>x.id!==p.id&&x.category===p.category&&x.stock!==false).slice(0,4);
  const fallback="assets/category-"+(p.category==="streaming"?"streaming":p.category==="gaming"?"gaming":p.category==="software"?"software":"accessories")+".jpg";
  const image=p.image||fallback;
  const shareText="Bonjour MA DIGITAL SHOP 👋 Je souhaite avoir des informations sur : "+p.name;
  content.innerHTML=
    '<div class="product-detail">'
    +'<div class="product-detail-media">'
    +'<img id="detail-main-image" src="'+attr(image)+'" alt="'+attr(p.name)+'" loading="eager" onerror="this.onerror=null;this.src=\''+attr(fallback)+'\'">'
    +'<span class="detail-category">'+esc(cat)+'</span>'
    +(p.featured?'<span class="detail-popular">★ Populaire</span>':"")
    +'</div>'
    +'<div class="product-detail-info">'
    +'<span class="badge">'+esc(p.badge||cat)+'</span>'
    +'<h3>'+esc(p.name)+'</h3>'
    +'<p class="detail-subtitle">'+esc(p.subtitle||"")+'</p>'
    +'<p class="detail-description">'+esc(p.description||"")+'</p>'
    +'<div class="detail-price">'+(info.old!=null?'<strong>'+price+'</strong><del>'+money(info.old)+'</del><span class="promo-percent">-'+info.percent+'%</span>':price)+'</div>'
    +'<div class="detail-meta"><span>✓ Disponible</span><span>✓ Commande WhatsApp</span></div>'
    +(detailItems.length?'<div class="detail-specs"><h4>Informations du produit</h4><div class="detail-specs-grid">'+detailItems.map(function(x){return '<div class="detail-spec"><small>'+esc(x[0])+'</small><b>'+esc(x[1])+'</b></div>'}).join("")+'</div></div>':"")
    +'<div class="detail-quantity"><span>Quantité</span><div class="detail-qty"><button type="button" onclick="changeDetailQty(-1)">−</button><strong id="detail-qty-value">1</strong><button type="button" onclick="changeDetailQty(1)">+</button></div></div>'
    +'<div class="detail-actions"><button class="primary" onclick="addFromDetailQty(\''+attr(p.id)+'\')">Ajouter au panier</button><button class="outline" onclick="order(\''+attr(p.id)+'\')">Commander sur WhatsApp</button><button class="detail-share" onclick="shareProduct(\''+attr(p.id)+'\')">↗ Partager ce produit</button></div>'
    +'</div></div>'
    +(related.length?'<div class="related-products"><div class="related-head"><div><span class="pill">À DÉCOUVRIR</span><h4>Produits similaires</h4></div></div><div class="related-grid">'+related.map(function(x){return '<button type="button" class="related-card" onclick="openProductDetail(\''+attr(x.id)+'\')">'+productImage(x)+'<span><b>'+esc(x.name)+'</b><small>'+esc(x.price==null?"Prix sur demande":money(x.price))+'</small></span></button>'}).join("")+'</div></div>':"");
  modal.classList.add("open");
  window.detailQty=1;
}
function changeDetailQty(delta){window.detailQty=Math.max(1,Math.min(99,(window.detailQty||1)+delta));const el=document.getElementById("detail-qty-value");if(el)el.textContent=window.detailQty}
function addFromDetailQty(id){const qty=window.detailQty||1;for(let i=0;i<qty;i++)add(id);closeProductDetail()}
async function shareProduct(id){
  const p=productById(id);if(!p)return;
  const text="MA DIGITAL SHOP — "+p.name+"\n"+(p.price==null?"Prix sur demande":money(p.price));
  if(navigator.share){try{await navigator.share({title:p.name,text,url:window.location.href.split("#")[0]+"#produit-"+encodeURIComponent(p.id)});return}catch(e){}}
  if(navigator.clipboard){try{await navigator.clipboard.writeText(text+"\n"+window.location.href);const msg=document.getElementById("search-message");if(msg){msg.textContent="Lien du produit copié.";msg.classList.add("show");setTimeout(()=>msg.classList.remove("show"),2500)}return}catch(e){}}
  wa("Je suis intéressé par : "+p.name);
}

function addFromDetail(id){ add(id); closeProductDetail(); }
function closeProductDetail(){document.getElementById('product-modal')?.classList.remove('open')}

const FAVORITES_KEY="ma_favorites_v1";
let favorites=JSON.parse(localStorage.getItem(FAVORITES_KEY)||"[]");
function isFavorite(id){return favorites.includes(id)}
function toggleFavorite(id){
  favorites=isFavorite(id)?favorites.filter(x=>x!==id):[...favorites,id];
  localStorage.setItem(FAVORITES_KEY,JSON.stringify(favorites));
  renderHome();
  const p=productById(id);if(p)openProductDetail(id);
}
function favoriteButton(p){return '<button type="button" class="favorite-btn '+(isFavorite(p.id)?'active':'')+'" aria-label="'+(isFavorite(p.id)?'Retirer des favoris':'Ajouter aux favoris')+'" onclick="event.stopPropagation();toggleFavorite(\''+attr(p.id)+'\')">'+(isFavorite(p.id)?'♥':'♡')+'</button>'}

function isPromoActive(p){
  if(!p||!p.promo_active||p.promo_price==null||p.price==null||p.promo_price>=p.price)return false;
  const now=Date.now();
  if(p.promo_start&&new Date(p.promo_start).getTime()>now)return false;
  if(p.promo_end&&new Date(p.promo_end).getTime()<now)return false;
  return true;
}
function promoInfo(p){
  if(!isPromoActive(p))return {price:p.price,old:null,percent:0};
  const old=Number(p.price),price=Number(p.promo_price);
  return {price,old,percent:Math.max(0,Math.round((1-price/old)*100))};
}
function productPriceMarkup(p){
  const info=promoInfo(p);
  if(info.old==null)return '<div class="price">'+(info.price==null?'Sur demande':money(info.price))+'</div>';
  return '<div class="price promo-price"><strong>'+money(info.price)+'</strong><del>'+money(info.old)+'</del><span class="promo-percent">-'+info.percent+'%</span></div>';
}
function productCard(p){
  const disabled=p.stock===false,info=promoInfo(p);
  const detail="onclick=\"if(!event.target.closest('button'))openProductDetail('"+attr(p.id)+"')\"";
  return '<article class="card" '+detail+' tabindex="0" role="button">'+
    '<div class="visual '+(p.image?'has-image':'')+'">'+favoriteButton(p)+productImage(p)+'<div class="cover"><span>'+esc(p.icon||'✦')+'</span><b>'+esc(p.name)+'</b></div>'+(p.featured?'<span class="featured">Populaire</span>':'')+(info.old!=null?'<span class="promo-badge">-'+info.percent+'%</span>':'')+'</div>'+
    '<div class="body"><span class="badge">'+esc(p.badge||label(p.category))+'</span><h3>'+esc(p.name)+'</h3><p>'+esc(p.description||p.subtitle||'')+'</p>'+
      productPriceMarkup(p)+
      '<div class="row"><button '+(disabled?'disabled':'')+' onclick="add(\''+attr(p.id)+'\')">'+(disabled?'Indisponible':'Ajouter')+'</button><button class="buy" onclick="order(\''+attr(p.id)+'\')">WhatsApp</button></div>'+
    '</div></article>';
}
function getCatalogControls(cat){
  const prefix=cat;
  const id=cat+"-grid";
  const search=document.getElementById(prefix+"-search");
  const filter=document.getElementById(cat==="gaming"?"game-filter":cat==="software"?"software-filter":cat+"-filter");
  const min=document.getElementById(prefix+"-min");
  const max=document.getElementById(prefix+"-max");
  const sort=document.getElementById(prefix+"-sort");
  return {id,search,filter,min,max,sort};
}
function sortProducts(arr,sort){
  const copy=[...arr];
  if(sort==="price-asc")copy.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
  else if(sort==="price-desc")copy.sort((a,b)=>(b.price??-Infinity)-(a.price??-Infinity));
  else if(sort==="name-asc")copy.sort((a,b)=>a.name.localeCompare(b.name,"fr",{sensitivity:"base"}));
  else if(sort==="name-desc")copy.sort((a,b)=>b.name.localeCompare(a.name,"fr",{sensitivity:"base"}));
  else if(sort==="newest")copy.sort((a,b)=>(Number(b.sort_order)||0)-(Number(a.sort_order)||0));
  return copy;
}
function applyCatalogFilters(cat){
  const controls=getCatalogControls(cat);
  if(!controls.id)return;
  const q=(controls.search?.value||"").trim().toLowerCase();
  const filter=(controls.filter?.value||"").trim().toLowerCase();
  const min=controls.min?.value!==""?Number(controls.min.value):null;
  const max=controls.max?.value!==""?Number(controls.max.value):null;
  let arr=products.filter(p=>p.category===cat&&p.stock!==false);
  if(q)arr=arr.filter(p=>(p.name+" "+p.description+" "+p.subtitle+" "+p.badge).toLowerCase().includes(q));
  if(filter)arr=arr.filter(p=>(p.badge||"").toLowerCase()===filter || (p.subtitle||"").toLowerCase().includes(filter));
  if(min!==null&&!Number.isNaN(min))arr=arr.filter(p=>p.price!=null&&p.price>=min);
  if(max!==null&&!Number.isNaN(max))arr=arr.filter(p=>p.price!=null&&p.price<=max);
  arr=sortProducts(arr,controls.sort?.value||"");
  const el=document.getElementById(controls.id);
  if(el)el.innerHTML=arr.map(productCard).join("")||"<div class='empty'>Aucun produit ne correspond à ces critères.</div>";
}
function renderSection(cat,id,q="",filter=""){
  const el=document.getElementById(id);if(!el)return;
  let arr=products.filter(p=>p.category===cat&&p.stock!==false);
  if(q)arr=arr.filter(p=>(p.name+" "+p.description+" "+p.subtitle).toLowerCase().includes(q.toLowerCase()));
  if(filter)arr=arr.filter(p=>(p.badge||"")===filter);
  el.innerHTML=arr.map(productCard).join("")||"<div class='empty'>Aucun produit trouvé.</div>";
}

function renderFavorites(){
  const el=document.getElementById("favorites-grid");if(!el)return;
  const arr=favorites.map(id=>productById(id)).filter(Boolean).filter(p=>p.stock!==false);
  el.innerHTML=arr.length?arr.map(productCard).join(""):"<div class='empty'>Aucun favori pour le moment.</div>";
}
function renderFeatured(){const el=document.getElementById("featured-grid");if(!el)return;const arr=products.filter(p=>p.featured&&p.stock!==false).slice(0,6);el.innerHTML=arr.map(productCard).join("")||"<div class='empty'>Aucun produit phare pour le moment.</div>"}
function showAllFeatured(){const el=document.getElementById("featured-grid");const section=document.getElementById("produits-phares");if(!el||!section)return;const all=products.filter(p=>p.featured&&p.stock!==false);el.classList.toggle("featured-expanded");el.innerHTML=(el.classList.contains("featured-expanded")?all:all.slice(0,6)).map(productCard).join("");const btn=section.querySelector(".text-btn");if(btn)btn.textContent=el.classList.contains("featured-expanded")?"← Réduire la sélection":"Voir toute la sélection →"}

async function loadCategories(){
  try{
    const result=await window.supabaseClient.from("categories").select("id,name,description,image_url,sort_order,active").eq("active",true).order("sort_order",{ascending:true}).order("name",{ascending:true});
    if(result.error)throw result.error;
    categories=result.data||[];
  }catch(err){
    console.warn("Catégories Supabase indisponibles.",err);
    categories=[
      {id:"streaming",name:"Streaming",description:"Netflix, Prime Video, Crunchyroll et bien plus encore.",image_url:"assets/category-streaming.jpg"},
      {id:"gaming",name:"Gaming",description:"Jeux PC et bibliothèque gaming.",image_url:"assets/category-gaming.jpg"},
      {id:"software",name:"Logiciels",description:"Windows, Microsoft, Adobe, macOS et sécurité.",image_url:"assets/category-software.jpg"},
      {id:"accessory",name:"Accessoires",description:"Manettes, souris, claviers, casques et autres accessoires.",image_url:"assets/category-accessories.jpg"}
    ];
  }
  renderDynamicCategories();
}
function renderDynamicCategories(){
  const track=document.getElementById("category-track");
  const catalog=document.getElementById("dynamic-catalog");
  if(!track||!catalog)return;
  track.innerHTML="";
  catalog.innerHTML="";
  categories.forEach(function(cat,index){
    const link=document.createElement("a");
    link.className="cat cat-image";
    link.href="#"+cat.id;
    link.innerHTML="<img loading=\"lazy\" src=\""+attr(cat.image_url||"assets/logo.png")+"\" alt=\""+attr(cat.name)+"\"><div class=\"cat-content\"><h3>"+esc(cat.name)+"</h3><p>"+esc(cat.description||"Découvrez nos produits.")+"</p><span class=\"link\">Visiter la catégorie →</span></div>";
    track.appendChild(link);
    const section=document.createElement("section");
    section.className="section "+(index%2===0?"alt ":"")+"dynamic-category";
    section.id=cat.id;
    section.innerHTML="<div class=\"container\"><div class=\"head\"><div><h2>"+esc(cat.name)+"</h2><p class=\"dynamic-category-note\">"+esc(cat.description||"Découvrez nos produits.")+"</p></div><button class=\"text-btn category-visit\" type=\"button\">Voir tous les produits →</button></div><div class=\"products-carousel\"><button class=\"carousel-arrow\" type=\"button\">‹</button><div class=\"grid product-track\" id=\""+attr(cat.id)+"-grid\"></div><button class=\"carousel-arrow\" type=\"button\">›</button></div></div>";
    section.querySelector(".category-visit").onclick=function(){showAllCategory(cat.id)};
    const arrows=section.querySelectorAll(".carousel-arrow");
    arrows[0].onclick=function(){scrollTrack(cat.id+"-grid",-1)};
    arrows[1].onclick=function(){scrollTrack(cat.id+"-grid",1)};
    catalog.appendChild(section);
  });
  document.querySelectorAll("#streaming,#gaming,#logiciels,#accessoires").forEach(function(el){
    if(!el.classList.contains("dynamic-category"))el.style.display="none";
  });
  categories.forEach(function(cat){renderSection(cat.id,cat.id+"-grid")});
  initAutoTracks();
}

function renderHome(){
  renderFeatured();renderFavorites();
  categories.forEach(function(cat){renderSection(cat.id,cat.id+"-grid")});
  updateCartCount();
}
function renderFiltered(cat,id,searchId,filterId){renderSection(cat,id,document.getElementById(searchId)?.value||"",document.getElementById(filterId)?.value||"")}
function add(id){const p=productById(id);if(!p)return;const r=cart.find(x=>String(x.id)===String(id));r?r.qty++:cart.push({id:p.id,qty:1});saveCart();openCart()}
function changeQty(id,delta){const r=cart.find(x=>String(x.id)===String(id));if(!r)return;r.qty+=delta;if(r.qty<=0)cart=cart.filter(x=>String(x.id)!==String(id));saveCart()}
function removeItem(id){cart=cart.filter(x=>String(x.id)!==String(id));saveCart()}
function clearCart(){cart=[];saveCart()}
function saveCart(){localStorage.setItem(STORAGE_CART,JSON.stringify(cart));renderCart();updateCartCount()}
function updateCartCount(){const count=cart.reduce((s,r)=>s+r.qty,0);document.querySelectorAll("[data-cart-count]").forEach(el=>{el.textContent=count;el.classList.toggle("show",count>0)})}
function renderCart(){
  const el=document.getElementById("cart-lines"),totalEl=document.getElementById("cart-total"),clear=document.getElementById("clear-cart");if(!el)return;
  if(!cart.length){el.innerHTML="<div class='cart-empty'>🛒<strong>Votre panier est vide</strong><span>Ajoutez un produit pour commencer votre commande.</span></div>";totalEl.textContent="0 FCFA";if(clear)clear.hidden=true;return}
  if(clear)clear.hidden=false;let total=0;
  el.innerHTML=cart.map(r=>{const p=productById(r.id);if(!p)return"";const pi=promoInfo(p);if(pi.price!=null)total+=pi.price*r.qty;return `<div class="cartline"><div class="cart-product"><div class="cart-thumb">${productImage(p)}</div><div class="cart-product-info"><span class="badge">${esc(p.badge||label(p.category))}</span><b>${esc(p.name)}</b><small>${promoInfo(p).price==null?'Prix sur demande':money(promoInfo(p).price)}</small><div class="qty"><button aria-label="Diminuer la quantité" onclick="changeQty('${attr(p.id)}',-1)">−</button><span>${r.qty}</span><button aria-label="Augmenter la quantité" onclick="changeQty('${attr(p.id)}',1)">+</button></div></div></div><div class="cart-right"><strong>${promoInfo(p).price==null?'À confirmer':money(Number(promoInfo(p).price)*r.qty)}</strong><button class="remove" onclick="removeItem('${attr(p.id)}')">Supprimer</button></div></div>`}).join("");
  totalEl.textContent=total?money(total):"À confirmer";
}
function openCart(){document.getElementById("cart").classList.add("open");renderCart()}
function closeCart(){document.getElementById("cart").classList.remove("open")}
function order(id){const p=productById(id);if(!p)return;wa(`Bonjour MA DIGITAL SHOP 👋\n\nJe souhaite commander :\nProduit : ${p.name}\nCatégorie : ${label(p.category)}\nPrix affiché : ${promoInfo(p).price==null?"Prix sur demande":money(promoInfo(p).price)}\n\nMerci de m'indiquer la procédure de paiement.`)}
function checkout(){
  if(!cart.length)return;
  const modal=document.getElementById("checkout-modal");
  if(!modal)return;
  renderCheckoutSummary();
  const total=cart.reduce((sum,r)=>{const p=productById(r.id),pi=p&&promoInfo(p);return pi&&pi.price!=null?sum+Number(pi.price)*r.qty:sum},0);
  const hasUnknownPrice=cart.some(r=>{const p=productById(r.id);return p&&p.price==null});
  const totalEl=document.getElementById("checkout-total");
  if(totalEl)totalEl.textContent=hasUnknownPrice?"À confirmer":money(total);
  const error=document.getElementById("checkout-error");
  if(error){error.hidden=true;error.textContent=""}
  modal.classList.add("open");
  document.getElementById("customer-name")?.focus();
}

function renderCheckoutSummary(){
  const el=document.getElementById("checkout-items");
  if(!el)return;
  el.innerHTML="";
  cart.forEach(r=>{
    const p=productById(r.id); if(!p)return;
    const row=document.createElement("div"); row.className="checkout-item";
    const info=document.createElement("div");
    const name=document.createElement("b"); name.textContent=p.name;
    const meta=document.createElement("small"); meta.textContent=r.qty+" × "+(promoInfo(p).price==null?"Prix sur demande":money(promoInfo(p).price));
    info.append(name,meta);
    const subtotal=document.createElement("strong"); subtotal.textContent=promoInfo(p).price==null?"À confirmer":money(Number(promoInfo(p).price)*r.qty);
    row.append(info,subtotal); el.appendChild(row);
  });
  const count=document.getElementById("checkout-item-count");
  if(count)count.textContent=cart.reduce((s,r)=>s+r.qty,0)+" article(s)";
}
let lastOrderWhatsAppText="";
function reopenLastOrderWhatsApp(){if(lastOrderWhatsAppText)wa(lastOrderWhatsAppText)}
function showOrderSuccess(orderCode,totalText){
  const modal=document.getElementById("order-success-modal");
  if(!modal)return;
  const code=document.getElementById("success-order-code");
  const total=document.getElementById("success-order-total");
  if(code)code.textContent=orderCode;
  if(total)total.textContent=totalText;
  modal.classList.add("open");
}
function closeOrderSuccess(){document.getElementById("order-success-modal")?.classList.remove("open")}
function closeCheckout(){document.getElementById("checkout-modal")?.classList.remove("open")}

function normalizeWhatsApp(value){
  let digits=String(value||"").replace(/\D/g,"");
  if(digits.startsWith("00"))digits=digits.slice(2);
  if(digits.startsWith("0"))digits="221"+digits.slice(1);
  return digits;
}

function createOrderCode(){
  const stamp=Date.now().toString(36).toUpperCase();
  const random=Math.random().toString(36).slice(2,7).toUpperCase();
  return `MD-${stamp}-${random}`;
}

async function submitOrder(event){
  event.preventDefault();
  if(!cart.length)return;
  const name=document.getElementById("customer-name")?.value.trim()||"";
  const whatsapp=document.getElementById("customer-whatsapp")?.value.trim()||"";
  const notes=document.getElementById("customer-notes")?.value.trim()||"";
  const errorEl=document.getElementById("checkout-error");
  const submitBtn=event.submitter;
  if(!name){if(errorEl){errorEl.hidden=false;errorEl.textContent="Veuillez renseigner votre nom complet."}return;}
  const normalizedWhatsApp=normalizeWhatsApp(whatsapp);
  if(normalizedWhatsApp.length<9){if(errorEl){errorEl.hidden=false;errorEl.textContent="Veuillez renseigner un numéro WhatsApp valide."}return;}
  const items=cart.map(r=>{const p=productById(r.id);if(!p)return null;return {product_id:p.dbId??p.id,name:p.name,quantity:r.qty,unit_price:promoInfo(p).price==null?null:Number(promoInfo(p).price),subtotal:promoInfo(p).price==null?null:Number(promoInfo(p).price)*r.qty}}).filter(Boolean);
  const totalKnown=cart.reduce((sum,r)=>{const p=productById(r.id),pi=p&&promoInfo(p);return pi&&pi.price!=null?sum+Number(pi.price)*r.qty:sum},0);
  const hasUnknownPrice=cart.some(r=>{const p=productById(r.id);return p&&p.price==null});
  if(!window.supabaseClient){if(errorEl){errorEl.hidden=false;errorEl.textContent="Connexion Supabase indisponible. Réessayez dans un instant."}return}
  if(submitBtn){submitBtn.disabled=true;submitBtn.textContent="Enregistrement..."}
  const orderCode=createOrderCode();
  try{
    const {error}=await window.supabaseClient.from("orders").insert({order_code:orderCode,customer_name:name,customer_whatsapp:normalizedWhatsApp,items,total:hasUnknownPrice?0:totalKnown,status:"pending",notes:notes||null});
    if(error)throw error;
    const orderId=orderCode;
    const lines=items.map(item=>`- ${item.name} × ${item.quantity} — ${item.unit_price==null?"Prix sur demande":money(item.subtotal)}`).join("\n");
    const totalText=hasUnknownPrice?"À confirmer":money(totalKnown);
    const whatsappMessage=`Bonjour MA DIGITAL SHOP 👋\n\nJe souhaite passer cette commande :\nCommande #${orderId}\nClient : ${name}\nWhatsApp : ${whatsapp}\n\n${lines}\n\nTotal : ${totalText}${notes?`\nNote : ${notes}`:""}\n\nMerci de m'indiquer la procédure de paiement.`);
    lastOrderWhatsAppText=whatsappMessage;
    closeCheckout();
    wa(whatsappMessage);
    clearCart();
    closeCart();
    showOrderSuccess(orderCode,totalText);
  }catch(err){
    console.error("Création commande impossible :",err);
    if(errorEl){errorEl.hidden=false;errorEl.textContent="Impossible d'enregistrer la commande. Vérifiez votre connexion puis réessayez."}
  }finally{if(submitBtn){submitBtn.disabled=false;submitBtn.textContent="Confirmer la commande"}}
}
function goSearch(){document.getElementById("global-search")?.focus()}
function filterFavorites(){
  const arr=favorites.map(id=>productById(id)).filter(Boolean).filter(p=>p.stock!==false);
  return arr;
}
function getSearchMatches(query){
  const q=String(query||"").toLowerCase().trim();
  if(!q)return [];
  return products.filter(p=>(p.name+" "+p.description+" "+p.subtitle+" "+p.badge+" "+label(p.category)).toLowerCase().includes(q)).slice(0,8);
}
function updateSearchSuggestions(value){
  const box=document.getElementById("search-suggestions");
  const input=document.getElementById("global-search");
  if(!box||!input)return;
  const matches=getSearchMatches(value);
  box.innerHTML="";
  if(!String(value||"").trim()||!matches.length){
    box.hidden=true;
    input.setAttribute("aria-expanded","false");
    return;
  }
  matches.forEach(function(p,index){
    const item=document.createElement("button");
    item.type="button";
    item.className="search-suggestion";
    item.setAttribute("role","option");
    item.dataset.index=index;
    item.innerHTML=(p.image?'<img src="'+attr(p.image)+'" alt="" loading="lazy">':'<span class="search-suggestion-icon">✦</span>')+
      '<span class="search-suggestion-copy"><b>'+esc(p.name)+'</b><small>'+esc(label(p.category))+' · '+esc(p.price==null?"Prix sur demande":money(p.price))+'</small></span>'+
      '<span class="search-suggestion-arrow">→</span>';
    item.addEventListener("click",function(){selectSearchProduct(p.id)});
    box.appendChild(item);
  });
  box.hidden=false;
  input.setAttribute("aria-expanded","true");
}
function closeSearchSuggestions(){
  const box=document.getElementById("search-suggestions");
  const input=document.getElementById("global-search");
  if(box)box.hidden=true;
  if(input)input.setAttribute("aria-expanded","false");
}
function selectSearchProduct(id){
  const p=productById(id);
  if(!p)return;
  const input=document.getElementById("global-search");
  if(input)input.value=p.name;
  closeSearchSuggestions();
  const msg=document.getElementById("search-message");
  if(msg){msg.textContent="Produit sélectionné : "+p.name;msg.classList.add("show");setTimeout(()=>msg.classList.remove("show"),2500)}
  openProductDetail(p.id);
}
function globalSearch(v){
  const q=String(v||"").toLowerCase().trim();
  const msg=document.getElementById("search-message");
  if(!q){if(msg)msg.textContent="";closeSearchSuggestions();return;}
  const found=getSearchMatches(v);
  closeSearchSuggestions();
  if(!found.length){
    if(msg){msg.textContent="Aucun produit ne correspond à « "+v+" ».";msg.classList.add("show");}
    return;
  }
  const first=found[0];
  const section=document.getElementById(first.category);
  if(section)section.scrollIntoView({behavior:"smooth",block:"start"});
  renderSection(first.category,(first.category==="accessory"?"accessory":first.category)+"-grid",v,"");
  if(msg){
    msg.textContent=found.length+" produit"+(found.length>1?"s":"")+" trouvé"+(found.length>1?"s":"")+" pour « "+v+" ».";
    msg.classList.add("show");
    setTimeout(()=>msg.classList.remove("show"),3500);
  }
}

function openMobileNav(){document.getElementById("mobile-nav")?.classList.toggle("open")}

async function loadProducts(){
  try{
    if(!window.supabaseClient) throw new Error("Supabase non initialisé");
    const {data,error}=await window.supabaseClient.from("products").select("id,slug,name,subtitle,category,badge,price,promo_price,promo_active,promo_start,promo_end,image_url,description,product_details,available,featured,sort_order,icon").eq("available",true).order("sort_order",{ascending:true});
    if(error)throw error;
    products=(data||[]).map(p=>({id:p.slug||String(p.id),dbId:p.id,category:p.category,name:p.name,subtitle:p.subtitle||"",price:p.price==null?null:Number(p.price),promo_price:p.promo_price==null?null:Number(p.promo_price),promo_active:!!p.promo_active,promo_start:p.promo_start||null,promo_end:p.promo_end||null,badge:p.badge||"",image:p.image_url||"",description:p.description||"",product_details:p.product_details||{},stock:p.available,featured:!!p.featured,sort_order:p.sort_order,icon:p.icon||"✦"}));
  }catch(err){
    console.warn("Catalogue Supabase indisponible, utilisation du catalogue local.",err);
    try{const r=await fetch("products.json",{cache:"no-store"});products=await r.json()}catch{products=FALLBACK}
  }
  renderHome();renderCart();
}



/* ================================
   THEME CLAIR / SOMBRE
   ================================ */
function applyTheme(theme){
  const selected=theme==="dark"?"dark":"light";
  document.body?.setAttribute("data-theme",selected);
  const buttons=document.querySelectorAll("#theme-toggle,#theme-toggle-mobile");
  buttons.forEach(function(btn){
    const dark=selected==="dark";
    btn.innerHTML=dark?"☀":"☾";
    btn.setAttribute("aria-label",dark?"Activer le mode clair":"Activer le mode sombre");
    btn.setAttribute("title",dark?"Mode clair":"Mode sombre");
    if(btn.id==="theme-toggle-mobile"){
      btn.innerHTML=(dark?"☀":"☾")+" <span>"+(dark?"Mode clair":"Mode sombre")+"</span>";
    }
  });
}
function toggleTheme(){
  const next=document.body?.getAttribute("data-theme")==="dark"?"light":"dark";
  localStorage.setItem("ma_theme",next);
  applyTheme(next);
}
function initTheme(){
  const saved=localStorage.getItem("ma_theme");
  const preferred=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
  applyTheme(saved||preferred);
}

// ================================
// HERO DYNAMIQUE
// ================================
let heroSlides=[];
const HERO_FALLBACK=[
{id:"hero-main",badge:"VOTRE BOUTIQUE DIGITALE",title:"Tout le digital,<br><span class=\"grad\">au même endroit.</span>",description:"Streaming, jeux PC, logiciels et accessoires. Choisissez vos produits, ajoutez-les au panier et envoyez votre commande sur WhatsApp.",button_text:"Découvrir la boutique →",button_link:"#catalogue",secondary_text:"Nous contacter",secondary_action:"whatsapp",trust:"✓ Panier simple|✓ Commande WhatsApp|✓ Mobile & PC",image_url:"assets/hero-services.jpg",mini_one:"🎮 Gaming & logiciels",mini_two:"🛒 Panier prêt à commander"},
{id:"hero-streaming",badge:"STREAMING PREMIUM",title:"Vos services préférés,<br><span class=\"grad\">au même endroit.</span>",description:"Découvrez notre sélection streaming et trouvez rapidement l'offre qui vous intéresse.",button_text:"Voir le streaming →",button_link:"#streaming",secondary_text:"Voir mon panier",secondary_action:"cart",trust:"✓ Netflix|✓ Prime Video|✓ Crunchyroll",image_url:"assets/category-streaming.jpg",mini_one:"📺 Streaming premium",mini_two:"⚡ Commande rapide"},
{id:"hero-gaming",badge:"GAMING & ACCESSOIRES",title:"Équipez votre setup,<br><span class=\"grad\">jouez à votre façon.</span>",description:"Jeux PC, manettes, souris, claviers, casques et accessoires : parcourez le catalogue et ajoutez vos choix au panier.",button_text:"Explorer le gaming →",button_link:"#gaming",secondary_text:"Voir les accessoires",secondary_action:"link",secondary_link:"#accessoires",trust:"✓ Jeux PC|✓ Accessoires|✓ Catalogue évolutif",image_url:"assets/category-gaming.jpg",mini_one:"🎮 Jeux PC",mini_two:"🖱️ Accessoires gaming"}];
function heroSlideMarkup(s){
  const trust = (s.trust || "")
    .split("|")
    .filter(Boolean)
    .map(x => "<span>" + esc(x) + "</span>")
    .join("");

  let secondary = "";

  if(s.secondary_action === "whatsapp"){
    secondary =
      '<button class="outline" onclick="wa(\'Bonjour MA DIGITAL SHOP 👋 Je souhaite avoir des informations.\')">'
      + esc(s.secondary_text || "Nous contacter")
      + "</button>";
  }else if(s.secondary_action === "cart"){
    secondary =
      '<button class="outline" onclick="openCart()">'
      + esc(s.secondary_text || "Voir mon panier")
      + "</button>";
  }else{
    secondary =
      '<a class="outline" href="' + attr(s.secondary_link || "#catalogue") + '">'
      + esc(s.secondary_text || "En savoir plus")
      + "</a>";
  }

  return (
    '<article class="hero-slide">'
    + '<div class="container hero-grid">'
    + '<div class="hero-copy">'
    + '<span class="pill">' + esc(s.badge || "MA DIGITAL SHOP") + "</span>"
    + "<h1>" + (s.title || "") + "</h1>"
    + "<p>" + esc(s.description || "") + "</p>"
    + '<div class="actions">'
    + '<a class="primary" href="' + attr(s.button_link || "#catalogue") + '">'
    + esc(s.button_text || "Découvrir →")
    + "</a>"
    + secondary
    + "</div>"
    + '<div class="trust">' + trust + "</div>"
    + "</div>"
    + '<div class="hero-card hero-showcase">'
    + '<img class="hero-services" src="' + attr(s.image_url || "assets/logo.png")
    + '" alt="' + attr(s.badge || "MA DIGITAL SHOP") + '">'
    + '<div class="mini one">' + esc(s.mini_one || "MA DIGITAL SHOP") + "</div>"
    + '<div class="mini two">' + esc(s.mini_two || "Commande rapide") + "</div>"
    + "</div>"
    + "</div>"
    + "</article>"
  );
}

async function loadHero(){
 const slider=document.getElementById("hero-slider"); if(!slider)return;
 try{const {data,error}=await window.supabaseClient.from("hero_slides").select("*").eq("active",true).order("sort_order",{ascending:true}).order("created_at",{ascending:true});if(error)throw error;heroSlides=data||[]}catch(err){console.warn("Hero Supabase indisponible.",err);heroSlides=HERO_FALLBACK}
 if(!heroSlides.length)heroSlides=HERO_FALLBACK;
 slider.innerHTML=heroSlides.map(heroSlideMarkup).join("");
 initHero();
}

/* V5 UI — logique des carrousels uniquement */
let heroIndex=0, heroTimer=null;
function initHero(){const slider=document.getElementById("hero-slider"),dots=document.getElementById("hero-dots");if(!slider||!dots)return;const slides=[...slider.querySelectorAll(".hero-slide")];if(!slides.length)return;dots.innerHTML=slides.map((_,i)=>`<button class="hero-dot ${i===0?"active":""}" type="button" aria-label="Aller à la slide ${i+1}" onclick="goHero(${i})"></button>`).join("");heroIndex=0;slides.forEach((s,i)=>s.classList.toggle("active",i===0));clearInterval(heroTimer);heroTimer=setInterval(()=>changeHero(1),6500);slider.onmouseenter=()=>clearInterval(heroTimer);slider.onmouseleave=()=>{clearInterval(heroTimer);heroTimer=setInterval(()=>changeHero(1),6500)}}
function goHero(index){const slides=[...document.querySelectorAll("#hero-slider .hero-slide")],dots=[...document.querySelectorAll("#hero-dots .hero-dot")];if(!slides.length)return;heroIndex=(index+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle("active",i===heroIndex));dots.forEach((d,i)=>d.classList.toggle("active",i===heroIndex))}
function changeHero(step){goHero(heroIndex+step)}
function scrollTrack(id,direction){const el=document.getElementById(id);if(!el)return;el.scrollBy({left:Math.max(el.clientWidth*.82,260)*direction,behavior:"smooth"})}
function initAutoTracks(){document.querySelectorAll(".product-track").forEach(track=>{let timer=setInterval(()=>track.scrollBy({left:Math.max(track.clientWidth*.78,260),behavior:"smooth"}),7000);const reset=()=>{clearInterval(timer);timer=setInterval(()=>track.scrollBy({left:Math.max(track.clientWidth*.78,260),behavior:"smooth"}),7000)};track.addEventListener("mouseenter",()=>clearInterval(timer));track.addEventListener("mouseleave",reset);track.addEventListener("touchstart",()=>clearInterval(timer),{passive:true});track.addEventListener("touchend",reset,{passive:true})})}

function showAllCategory(category){
  const section=document.getElementById(category==="software"?"logiciels":category==="accessory"?"accessoires":category);
  if(!section)return;
  const gridId=category==="accessory"?"accessory-grid":category+"-grid";
  const track=document.getElementById(gridId);
  const carousel=track?.closest(".products-carousel");
  if(!track||!carousel)return;
  document.querySelectorAll(".products-carousel.is-expanded").forEach(c=>{
    c.classList.remove("is-expanded");
    c.querySelector(".category-back")?.remove();
  });
  carousel.classList.add("is-expanded");
  const back=document.createElement("button");
  back.type="button";
  back.className="category-back";
  back.textContent="← Revenir au défilement";
  back.onclick=()=>{carousel.classList.remove("is-expanded");back.remove()};
  carousel.parentNode.insertBefore(back,carousel);
  section.scrollIntoView({behavior:"smooth",block:"start"});
}

document.addEventListener("DOMContentLoaded",async()=>{
  initTheme();
  await loadHero();
  initAutoTracks();
  loadCategories();
  loadProducts();
  const s=document.getElementById("global-search");if(s){s.addEventListener("input",()=>updateSearchSuggestions(s.value));s.addEventListener("keydown",e=>{if(e.key==="Enter"){globalSearch(s.value)}else if(e.key==="Escape"){closeSearchSuggestions()}});s.addEventListener("focus",()=>updateSearchSuggestions(s.value));}document.addEventListener("click",e=>{if(!e.target.closest("#global-searchbox"))closeSearchSuggestions();});
  document.querySelectorAll(".mobile-link").forEach(a=>a.addEventListener("click",()=>document.getElementById("mobile-nav")?.classList.remove("open")));
});
