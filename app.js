const WA="221773781096";
const STORAGE_CART="ma_cart_v3";
const FALLBACK=[];
let products=[];
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
function productCard(p){
  const price=p.price==null?"Sur demande":money(p.price);
  const disabled=p.stock===false;
  return `<article class="card">
    <div class="visual ${p.image?'has-image':''}">${productImage(p)}<div class="cover"><span>${esc(p.icon||"✦")}</span><b>${esc(p.name)}</b></div>${p.featured?'<span class="featured">Populaire</span>':''}</div>
    <div class="body"><span class="badge">${esc(p.badge||label(p.category))}</span><h3>${esc(p.name)}</h3><p>${esc(p.description||p.subtitle||"")}</p>
      <div class="price">${price}</div>
      <div class="row"><button ${disabled?'disabled':''} onclick="add('${attr(p.id)}')">${disabled?'Indisponible':'Ajouter'}</button><button class="buy" onclick="order('${attr(p.id)}')">WhatsApp</button></div>
    </div>
  </article>`;
}
function renderSection(cat,id,q="",filter=""){
  const el=document.getElementById(id); if(!el)return;
  let arr=products.filter(p=>p.category===cat && p.stock!==false);
  if(q)arr=arr.filter(p=>(p.name+" "+p.description+" "+p.subtitle).toLowerCase().includes(q.toLowerCase()));
  if(filter)arr=arr.filter(p=>(p.badge||"")===filter);
  el.innerHTML=arr.map(productCard).join("")||"<div class='empty'>Aucun produit trouvé.</div>";
}
function renderFeatured(){const el=document.getElementById("featured-grid");if(!el)return;const arr=products.filter(p=>p.featured&&p.stock!==false).slice(0,6);el.innerHTML=arr.map(productCard).join("")||"<div class='empty'>Aucun produit phare pour le moment.</div>"}
function showAllFeatured(){const el=document.getElementById("featured-grid");const section=document.getElementById("produits-phares");if(!el||!section)return;const all=products.filter(p=>p.featured&&p.stock!==false);el.classList.toggle("featured-expanded");el.innerHTML=(el.classList.contains("featured-expanded")?all:all.slice(0,6)).map(productCard).join("");const btn=section.querySelector(".text-btn");if(btn)btn.textContent=el.classList.contains("featured-expanded")?"← Réduire la sélection":"Voir toute la sélection →"}
function renderHome(){
  renderFeatured();
  renderSection("streaming","streaming-grid");
  renderSection("gaming","gaming-grid");
  renderSection("software","software-grid");
  renderSection("accessory","accessory-grid");
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
  el.innerHTML=cart.map(r=>{const p=productById(r.id);if(!p)return"";if(p.price!=null)total+=p.price*r.qty;return `<div class="cartline"><div><b>${esc(p.name)}</b><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty('${attr(p.id)}',-1)">−</button><span>${r.qty}</span><button onclick="changeQty('${attr(p.id)}',1)">+</button></div></div><div class="cart-right"><strong>${p.price==null?'À confirmer':money(p.price*r.qty)}</strong><button class="remove" onclick="removeItem('${attr(p.id)}')">Supprimer</button></div></div>`}).join("");
  totalEl.textContent=total?money(total):"À confirmer";
}
function openCart(){document.getElementById("cart").classList.add("open");renderCart()}
function closeCart(){document.getElementById("cart").classList.remove("open")}
function order(id){const p=productById(id);if(!p)return;wa(`Bonjour MA DIGITAL SHOP 👋\n\nJe souhaite commander :\nProduit : ${p.name}\nCatégorie : ${label(p.category)}\nPrix affiché : ${money(p.price)}\n\nMerci de m'indiquer la procédure de paiement.`)}
function checkout(){
  if(!cart.length)return;
  const modal=document.getElementById("checkout-modal");
  if(!modal)return;
  const total=cart.reduce((sum,r)=>{const p=productById(r.id);return p&&p.price!=null?sum+Number(p.price)*r.qty:sum},0);
  const hasUnknownPrice=cart.some(r=>{const p=productById(r.id);return p&&p.price==null});
  const totalEl=document.getElementById("checkout-total");
  if(totalEl)totalEl.textContent=hasUnknownPrice?"À confirmer":money(total);
  const error=document.getElementById("checkout-error");
  if(error){error.hidden=true;error.textContent=""}
  modal.classList.add("open");
  document.getElementById("customer-name")?.focus();
}

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
  if(!name||!whatsapp)return;
  const items=cart.map(r=>{const p=productById(r.id);if(!p)return null;return {product_id:p.dbId??p.id,name:p.name,quantity:r.qty,unit_price:p.price==null?null:Number(p.price),subtotal:p.price==null?null:Number(p.price)*r.qty}}).filter(Boolean);
  const totalKnown=cart.reduce((sum,r)=>{const p=productById(r.id);return p&&p.price!=null?sum+Number(p.price)*r.qty:sum},0);
  const hasUnknownPrice=cart.some(r=>{const p=productById(r.id);return p&&p.price==null});
  if(!window.supabaseClient){if(errorEl){errorEl.hidden=false;errorEl.textContent="Connexion Supabase indisponible. Réessayez dans un instant."}return}
  if(submitBtn){submitBtn.disabled=true;submitBtn.textContent="Enregistrement..."}
  const normalizedWhatsApp=normalizeWhatsApp(whatsapp);
  const orderCode=createOrderCode();
  try{
    const {error}=await window.supabaseClient.from("orders").insert({order_code:orderCode,customer_name:name,customer_whatsapp:normalizedWhatsApp,items,total:hasUnknownPrice?0:totalKnown,status:"pending",notes:notes||null});
    if(error)throw error;
    const orderId=orderCode;
    const lines=items.map(item=>`- ${item.name} × ${item.quantity} — ${item.unit_price==null?"Prix sur demande":money(item.subtotal)}`).join("\n");
    const totalText=hasUnknownPrice?"À confirmer":money(totalKnown);
    closeCheckout();
    wa(`Bonjour MA DIGITAL SHOP 👋\n\nJe souhaite passer cette commande :\nCommande #${orderId}\nClient : ${name}\nWhatsApp : ${whatsapp}\n\n${lines}\n\nTotal : ${totalText}${notes?`\nNote : ${notes}`:""}\n\nMerci de m'indiquer la procédure de paiement.`);
    clearCart();
    closeCart();
  }catch(err){
    console.error("Création commande impossible :",err);
    if(errorEl){errorEl.hidden=false;errorEl.textContent="Impossible d'enregistrer la commande. Vérifiez votre connexion puis réessayez."}
  }finally{if(submitBtn){submitBtn.disabled=false;submitBtn.textContent="Confirmer la commande"}}
}
function goSearch(){document.getElementById("global-search")?.focus()}
function globalSearch(v){const q=v.toLowerCase().trim();if(!q)return;const found=products.find(p=>(p.name+" "+p.description+" "+p.subtitle).toLowerCase().includes(q));if(!found){document.getElementById("search-message").textContent="Aucun produit ne correspond à votre recherche.";return}const section=document.getElementById(found.category);section?.scrollIntoView({behavior:"smooth",block:"start"});const gridId=found.category+"-grid";const searchId={gaming:"game-search",software:"software-search"}[found.category];if(searchId){document.getElementById(searchId).value=v;renderFiltered(found.category,gridId,searchId,found.category==="gaming"?"game-filter":"software-filter")}}
function openMobileNav(){document.getElementById("mobile-nav")?.classList.toggle("open")}

async function loadProducts(){
  try{
    if(!window.supabaseClient) throw new Error("Supabase non initialisé");
    const {data,error}=await window.supabaseClient.from("products").select("id,slug,name,subtitle,category,badge,price,image_url,description,available,featured,sort_order,icon").eq("available",true).order("sort_order",{ascending:true});
    if(error)throw error;
    products=(data||[]).map(p=>({id:p.slug||String(p.id),dbId:p.id,category:p.category,name:p.name,subtitle:p.subtitle||"",price:p.price==null?null:Number(p.price),badge:p.badge||"",image:p.image_url||"",description:p.description||"",stock:p.available,featured:!!p.featured,icon:p.icon||"✦"}));
  }catch(err){
    console.warn("Catalogue Supabase indisponible, utilisation du catalogue local.",err);
    try{const r=await fetch("products.json",{cache:"no-store"});products=await r.json()}catch{products=FALLBACK}
  }
  renderHome();renderCart();
}

/* V5 UI — logique des carrousels uniquement */
let heroIndex=0, heroTimer=null;
function initHero(){const slider=document.getElementById("hero-slider"),dots=document.getElementById("hero-dots");if(!slider||!dots)return;const slides=[...slider.querySelectorAll(".hero-slide")];dots.innerHTML=slides.map((_,i)=>`<button class="hero-dot ${i===0?"active":""}" type="button" aria-label="Aller à la slide ${i+1}" onclick="goHero(${i})"></button>`).join("");heroIndex=0;slides.forEach((s,i)=>s.classList.toggle("active",i===0));clearInterval(heroTimer);heroTimer=setInterval(()=>changeHero(1),6500);slider.addEventListener("mouseenter",()=>clearInterval(heroTimer));slider.addEventListener("mouseleave",()=>{clearInterval(heroTimer);heroTimer=setInterval(()=>changeHero(1),6500)})}
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

document.addEventListener("DOMContentLoaded",()=>{
  initHero();
  initAutoTracks();
  loadProducts();
  const s=document.getElementById("global-search");if(s)s.addEventListener("keydown",e=>{if(e.key==="Enter")globalSearch(s.value)});
  document.querySelectorAll(".mobile-link").forEach(a=>a.addEventListener("click",()=>document.getElementById("mobile-nav")?.classList.remove("open")));
});
