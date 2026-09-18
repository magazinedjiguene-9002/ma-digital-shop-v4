const WA="221773781096";
const STORAGE_PRODUCTS="ma_products_v7_local_catalog";
const STORAGE_CART="ma_cart_v3";
const FALLBACK=[];
let products=[];
let cart=JSON.parse(localStorage.getItem(STORAGE_CART)||"[]");

const money=p=>p==null?"Prix sur demande":new Intl.NumberFormat("fr-FR").format(p)+" FCFA";
const label=c=>({streaming:"Streaming",gaming:"Gaming",software:"Logiciel",accessory:"Accessoire"}[c]||c);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
const attr=esc;

function wa(text){window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(text),"_blank","noopener,noreferrer")}
function productById(id){return products.find(p=>p.id===id)}
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
function renderHome(){
  renderSection("streaming","streaming-grid");
  renderSection("gaming","gaming-grid");
  renderSection("software","software-grid");
  renderSection("accessory","accessory-grid");
  updateCartCount();
}
function renderFiltered(cat,id,searchId,filterId){renderSection(cat,id,document.getElementById(searchId)?.value||"",document.getElementById(filterId)?.value||"")}

function add(id){
  const p=productById(id); if(!p)return;
  const r=cart.find(x=>x.id===id); r?r.qty++:cart.push({id,qty:1});
  saveCart(); openCart();
}
function changeQty(id,delta){
  const r=cart.find(x=>x.id===id); if(!r)return;
  r.qty+=delta; if(r.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function clearCart(){cart=[];saveCart()}
function saveCart(){localStorage.setItem(STORAGE_CART,JSON.stringify(cart));renderCart();updateCartCount()}
function updateCartCount(){
  const count=cart.reduce((s,r)=>s+r.qty,0);
  document.querySelectorAll("[data-cart-count]").forEach(el=>{el.textContent=count;el.classList.toggle("show",count>0)})
}
function renderCart(){
  const el=document.getElementById("cart-lines"),totalEl=document.getElementById("cart-total"),clear=document.getElementById("clear-cart"); if(!el)return;
  if(!cart.length){el.innerHTML="<div class='cart-empty'>🛒<strong>Votre panier est vide</strong><span>Ajoutez un produit pour commencer votre commande.</span></div>";totalEl.textContent="0 FCFA";if(clear)clear.hidden=true;return}
  if(clear)clear.hidden=false;
  let total=0;
  el.innerHTML=cart.map(r=>{const p=productById(r.id);if(!p)return"";if(p.price!=null)total+=p.price*r.qty;return `<div class="cartline"><div><b>${esc(p.name)}</b><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty('${attr(p.id)}',-1)">−</button><span>${r.qty}</span><button onclick="changeQty('${attr(p.id)}',1)">+</button></div></div><div class="cart-right"><strong>${p.price==null?'À confirmer':money(p.price*r.qty)}</strong><button class="remove" onclick="removeItem('${attr(p.id)}')">Supprimer</button></div></div>`}).join("");
  totalEl.textContent=total?money(total):"À confirmer";
}
function openCart(){document.getElementById("cart").classList.add("open");renderCart()}
function closeCart(){document.getElementById("cart").classList.remove("open")}
function order(id){const p=productById(id);if(!p)return;wa(`Bonjour MA DIGITAL SHOP 👋\n\nJe souhaite commander :\nProduit : ${p.name}\nCatégorie : ${label(p.category)}\nPrix affiché : ${money(p.price)}\n\nMerci de m'indiquer la procédure de paiement.`)}
function checkout(){
  if(!cart.length)return;
  const lines=cart.map(r=>{const p=productById(r.id);return `- ${p.name} × ${r.qty} — ${money(p.price)}`}).join("\n");
  wa(`Bonjour MA DIGITAL SHOP 👋\n\nJe souhaite passer cette commande :\n${lines}\n\nMerci de m'indiquer la procédure de paiement.`)
}
function goSearch(){document.getElementById("global-search")?.focus()}
function globalSearch(v){
  const q=v.toLowerCase().trim(); if(!q)return;
  const found=products.find(p=>(p.name+" "+p.description+" "+p.subtitle).toLowerCase().includes(q));
  if(!found){document.getElementById("search-message").textContent="Aucun produit ne correspond à votre recherche.";return}
  const section=document.getElementById(found.category); section?.scrollIntoView({behavior:"smooth",block:"start"});
  const gridId=found.category+"-grid";
  const searchId={gaming:"game-search",software:"software-search"}[found.category];
  if(searchId){document.getElementById(searchId).value=v;renderFiltered(found.category,gridId,searchId,found.category==="gaming"?"game-filter":"software-filter")}
}
function openMobileNav(){document.getElementById("mobile-nav")?.classList.toggle("open")}

async function loadProducts(){
  const saved=localStorage.getItem(STORAGE_PRODUCTS);
  if(saved){try{products=JSON.parse(saved)}catch{products=[]}}
  if(!products.length){
    try{const r=await fetch("products.json",{cache:"no-store"});products=await r.json();localStorage.setItem(STORAGE_PRODUCTS,JSON.stringify(products))}
    catch{products=FALLBACK}
  }
  renderHome();renderCart();
}

document.addEventListener("DOMContentLoaded",()=>{
  loadProducts();
  const s=document.getElementById("global-search");
  if(s)s.addEventListener("keydown",e=>{if(e.key==="Enter")globalSearch(s.value)});
  document.querySelectorAll(".mobile-link").forEach(a=>a.addEventListener("click",()=>document.getElementById("mobile-nav")?.classList.remove("open")));
});
