// home.js
(function init() {
  // protect route
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const role = localStorage.getItem('role');
  if (!loggedIn) { location.href = 'login.html'; return; }
  if (role === 'admin') { location.href = 'admin.html'; return; }

  // elements
  const cards = document.getElementById('cards');
  const openCart = document.getElementById('openCart');
  const closeCart = document.getElementById('closeCart');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cartCount');
  const totalPriceEl = document.getElementById('totalPrice');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const currentUser = localStorage.getItem('currentUser') || 'user@example.com';
  const CART_KEY = `cart_${currentUser}`;

  renderProducts();
  renderCart();

  openCart.addEventListener('click', ()=> cartDrawer.classList.add('open'));
  closeCart.addEventListener('click', ()=> cartDrawer.classList.remove('open'));
  if (cartDrawer) cartDrawer.addEventListener('click', e => { if (e.target === cartDrawer) cartDrawer.classList.remove('open'); });

  checkoutBtn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!cart.length) return alert('Giỏ hàng trống!');
    alert('✅ Thanh toán thành công!');
    localStorage.removeItem(CART_KEY);
    renderCart();
    cartDrawer.classList.remove('open');
  });
  clearCartBtn.addEventListener('click', ()=> { if (confirm('Xóa toàn bộ giỏ hàng?')) { localStorage.removeItem(CART_KEY); renderCart(); } });

  logoutBtn.addEventListener('click', ()=> {
    localStorage.removeItem('loggedIn'); localStorage.removeItem('role'); localStorage.removeItem('currentUser');
    location.href = 'login.html';
  });

  window.addToCart = function(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const p = products.find(x => x.id == id);
    if (!p) { alert('Sản phẩm không tồn tại'); return; }

    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const found = cart.find(x => x.id == id);
    if (found) found.qty += 1;
    else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  };

  window.removeFromCart = function(id) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    cart = cart.filter(x => x.id != id);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  };

  function renderProducts(){
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    cards.innerHTML = '';
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <img src="${escape(p.image)}" alt="${escape(p.name)}" />
        <div class="name ${'name'}">${escape(p.name)}</div>
        <div class="desc">${escape(p.desc)}</div>
        <div class="price">${fmtVND(p.price)}</div>
        <div class="add"><button class="btn primary" onclick='addToCart("${p.id}")'>Thêm vào giỏ</button></div>
      `;
      cards.appendChild(div);
    });
  }

  function renderCart(){
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    cartItemsEl.innerHTML = cart.length ? '' : '<p class="muted">Giỏ hàng trống</p>';
    cart.forEach(item => {
      const d = document.createElement('div'); d.className = 'cart-item';
      d.innerHTML = `
        <img src="${escape(item.image)}" alt="${escape(item.name)}" />
        <div class="meta"><div class="n">${escape(item.name)}</div><div class="q">Số lượng: ${item.qty}</div></div>
        <div style="text-align:right">
          <div style="font-weight:700">${fmtVND(item.price * item.qty)}</div>
          <div style="margin-top:6px"><button class="btn ghost" onclick='removeFromCart("${item.id}")'>Xóa</button></div>
        </div>
      `;
      cartItemsEl.appendChild(d);
    });
    const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
    const count = cart.reduce((s,i)=>s + i.qty, 0);
    cartCountEl.textContent = count;
    totalPriceEl.textContent = fmtVND(total);
  }

  function fmtVND(n){ return (Number(n)||0).toLocaleString('vi-VN') + '₫' }
  function escape(s=''){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();
