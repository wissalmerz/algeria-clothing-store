const products = [
  {id:1,name:"Robe Noura",category:"Robes",price:18900,detail:"Satin mat · Rose fumé",image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",tag:"Nouveau"},
  {id:2,name:"Ensemble Sirocco",category:"Ensembles",price:24500,detail:"Crêpe de soie · Sable",image:"https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=700&q=80",tag:"Signature"},
  {id:3,name:"Manteau Dune",category:"Manteaux",price:32900,detail:"Laine mélangée · Camel",image:"https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=700&q=80",tag:"Édition limitée"},
  {id:4,name:"Robe Zina",category:"Robes",price:21900,detail:"Coton brodé · Ivoire",image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",tag:"Best-seller"},
  {id:5,name:"Chemise Selma",category:"Ensembles",price:12900,detail:"Popeline · Blanc cassé",image:"https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=80",tag:"Essentiel"},
  {id:6,name:"Foulard Atlas",category:"Accessoires",price:5900,detail:"Soie · Imprimé floral",image:"https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=700&q=80",tag:"Nouveau"},
  {id:7,name:"Veste Yasmine",category:"Manteaux",price:27800,detail:"Velours côtelé · Prune",image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",tag:"Signature"},
  {id:8,name:"Sac Zellige",category:"Accessoires",price:14900,detail:"Cuir grainé · Chocolat",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",tag:"Édition limitée"}
];

const wilayas = [
  ["Adrar",1100],["Chlef",700],["Laghouat",800],["Oum El Bouaghi",700],["Batna",700],["Béjaïa",600],["Biskra",800],["Béchar",1000],["Blida",500],["Bouira",600],["Tamanrasset",1400],["Tébessa",800],["Tlemcen",800],["Tiaret",800],["Tizi Ouzou",600],["Alger",400],["Djelfa",800],["Jijel",700],["Sétif",700],["Saïda",800],["Skikda",700],["Sidi Bel Abbès",800],["Annaba",800],["Guelma",700],["Constantine",700],["Médéa",600],["Mostaganem",700],["M'Sila",800],["Mascara",800],["Ouargla",900],["Oran",700],["El Bayadh",900],["Illizi",1400],["Bordj Bou Arréridj",700],["Boumerdès",500],["El Tarf",800],["Tindouf",1400],["Tissemsilt",800],["El Oued",900],["Khenchela",800],["Souk Ahras",800],["Tipaza",600],["Mila",700],["Aïn Defla",700],["Naâma",1000],["Aïn Témouchent",800],["Ghardaïa",900],["Relizane",700],["Timimoun",1200],["Bordj Badji Mokhtar",1600],["Ouled Djellal",900],["Béni Abbès",1200],["In Salah",1400],["In Guezzam",1600],["Touggourt",900],["Djanet",1500],["El M'Ghair",900],["El Meniaa",1000]
];

const state = {cart: [], category:"Tous"};
const money = value => `${value.toLocaleString("fr-DZ")} DA`;
const $ = selector => document.querySelector(selector);

function renderProducts() {
  const search = ($("#searchInput")?.value || "").toLowerCase().trim();
  const visible = products.filter(product => (state.category === "Tous" || product.category === state.category) && (!search || `${product.name} ${product.category}`.toLowerCase().includes(search)));
  $("#productGrid").innerHTML = visible.length ? visible.map(product => `
    <article class="product-card">
      <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-tag">${product.tag}</span><button class="add-product" data-add="${product.id}" aria-label="Ajouter ${product.name}">+</button></div>
      <div class="product-info"><div><p>${product.name}</p><p class="detail">${product.detail}</p></div><p class="product-price">${money(product.price)}</p></div>
    </article>`).join("") : '<p class="empty-results">Aucune pièce ne correspond à votre recherche.</p>';
}

function cartCount() { return state.cart.reduce((sum, item) => sum + item.quantity, 0); }
function selectedWilaya() { return wilayas.find(item => item[0] === $("#wilayaSelect").value); }
function shippingCost() {
  const selected = selectedWilaya();
  if (!selected || !state.cart.length) return 0;
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal >= 18000 ? 0 : selected[1];
}
function renderCart() {
  const count = cartCount();
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingCost();
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartItems").innerHTML = state.cart.map(item => `
    <div class="cart-line"><img src="${item.image}" alt="${item.name}"><div><p>${item.name}</p><small>${money(item.price)}</small><div class="line-controls"><button data-minus="${item.id}" aria-label="Retirer une unité">−</button><span>${item.quantity}</span><button data-plus="${item.id}" aria-label="Ajouter une unité">+</button></div></div><button class="line-remove" data-remove="${item.id}" aria-label="Supprimer ${item.name}">×</button></div>`).join("");
  $("#subtotal").textContent = money(subtotal);
  $("#subtotal").dataset.amount = subtotal;
  $("#shipping").textContent = state.cart.length && selectedWilaya() ? shipping ? money(shipping) : "Offerte" : "—";
  $("#total").textContent = money(subtotal + shipping);
  $("#cartEmpty").style.display = state.cart.length ? "none" : "flex";
  $("#cartFooter").style.display = state.cart.length ? "block" : "none";
  $("#whatsappButton").disabled = !state.cart.length || !selectedWilaya();
  if (selectedWilaya()) $("#deliveryMessage").textContent = shipping ? `Livraison ${selectedWilaya()[1].toLocaleString("fr-DZ")} DA · 2 à 4 jours ouvrés` : "Livraison offerte · 2 à 4 jours ouvrés";
}
function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = state.cart.find(item => item.id === id);
  if (existing) existing.quantity += 1; else state.cart.push({...product, quantity:1});
  renderCart(); openCart(); showToast(`${product.name} ajouté au panier`);
}
function updateQuantity(id, delta) {
  const item = state.cart.find(product => product.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) state.cart = state.cart.filter(product => product.id !== id);
  renderCart();
}
function openCart() { $("#cartDrawer").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden","false"); $("#overlay").classList.add("visible"); }
function closeCart() { $("#cartDrawer").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden","true"); $("#overlay").classList.remove("visible"); }
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2400); }

function openWhatsApp() {
  const wilaya = selectedWilaya();
  if (!wilaya || !state.cart.length) return;
  const lines = state.cart.map(item => `• ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`).join("\n");
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingCost();
  const text = `Bonjour Nouba, je souhaite commander :\n\n${lines}\n\nSous-total : ${money(subtotal)}\nLivraison : ${shipping ? money(shipping) : "Offerte"}\nTotal : ${money(subtotal + shipping)}\n\nWilaya de livraison : ${wilaya[0]}\nMerci de confirmer ma commande.`;
  window.open(`https://wa.me/213555000000?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  const select = $("#wilayaSelect");
  wilayas.forEach(([name]) => select.add(new Option(name, name)));
  renderCart();
  setTimeout(() => { $("#intro").classList.add("is-open"); $("#storefront").classList.add("visible"); }, 300);
  $("#bowStage").addEventListener("click", () => { $("#intro").classList.add("is-open"); $("#storefront").classList.add("visible"); });
  $("#bowStage").addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") $("#bowStage").click(); });
  $("#categoryTabs").addEventListener("click", event => { const button = event.target.closest("button"); if (!button) return; state.category = button.dataset.category; document.querySelectorAll("#categoryTabs button").forEach(item => item.classList.toggle("active", item === button)); renderProducts(); });
  $("#productGrid").addEventListener("click", event => { const button = event.target.closest("[data-add]"); if (button) addToCart(Number(button.dataset.add)); });
  $("#cartItems").addEventListener("click", event => { const target = event.target; if (target.dataset.plus) updateQuantity(Number(target.dataset.plus), 1); if (target.dataset.minus) updateQuantity(Number(target.dataset.minus), -1); if (target.dataset.remove) { state.cart = state.cart.filter(item => item.id !== Number(target.dataset.remove)); renderCart(); } });
  $("#cartButton").addEventListener("click", openCart); $("#closeCart").addEventListener("click", closeCart); $("#overlay").addEventListener("click", closeCart); $("#emptyLink").addEventListener("click", closeCart);
  select.addEventListener("change", renderCart); $("#whatsappButton").addEventListener("click", openWhatsApp);
  $(".search-toggle").addEventListener("click", () => { $("#searchPanel").classList.toggle("open"); if ($("#searchPanel").classList.contains("open")) $("#searchInput").focus(); });
  $(".search-close").addEventListener("click", () => $("#searchPanel").classList.remove("open")); $("#searchInput").addEventListener("input", renderProducts);
  $("#menuToggle").addEventListener("click", () => $(".main-nav").classList.toggle("mobile-open"));
});
