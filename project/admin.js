// admin.js
(function initAdmin() {
  // protect route
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const role = localStorage.getItem('role');
  if (!loggedIn) { location.href = 'login.html'; return; }
  if (role !== 'admin') { location.href = 'home.html'; return; }

  // elements
  const userForm = document.getElementById('userForm');
  const productForm = document.getElementById('productForm');
  const userTableBody = document.querySelector('#userTable tbody');
  const productTableBody = document.querySelector('#productTable tbody');
  const userReset = document.getElementById('userReset');
  const productReset = document.getElementById('productReset');
  const goHome = document.getElementById('goHome');
  const logoutBtn = document.getElementById('logoutBtn');

  let users = JSON.parse(localStorage.getItem('users') || '[]');
  let products = JSON.parse(localStorage.getItem('products') || '[]');

  let editingUserId = null;
  let editingProductId = null;

  renderUsers();
  renderProducts();

  userForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('u_name').value.trim();
    const email = document.getElementById('u_email').value.trim();
    const roleVal = document.getElementById('u_role').value;
    if (!name || !email) return alert('Nhập đầy đủ thông tin người dùng');

    if (editingUserId) {
      users = users.map(u => u.id === editingUserId ? {...u, name, email, role: roleVal} : u);
      editingUserId = null;
    } else {
      if (users.some(u => u.email === email)) return alert('Email đã tồn tại');
      users.push({id: genId(), name, email, role: roleVal});
    }
    localStorage.setItem('users', JSON.stringify(users));
    userForm.reset(); renderUsers();
  });

  productForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('p_name').value.trim();
    const price = Number(document.getElementById('p_price').value);
    const image = document.getElementById('p_image').value.trim();
    const desc = document.getElementById('p_desc').value.trim();
    if (!name || !price || !image || !desc) return alert('Nhập đầy đủ thông tin sản phẩm');

    if (editingProductId) {
      products = products.map(p => p.id === editingProductId ? {...p, name, price, image, desc} : p);
      editingProductId = null;
    } else {
      products.push({id: genId(), name, price, image, desc});
    }
    localStorage.setItem('products', JSON.stringify(products));
    productForm.reset(); renderProducts();
  });

  userReset.addEventListener('click', ()=> { editingUserId = null; userForm.reset(); });
  productReset.addEventListener('click', ()=> { editingProductId = null; productForm.reset(); });

  window.editUser = function(id) {
    users = JSON.parse(localStorage.getItem('users') || '[]');
    const u = users.find(x => x.id === id); if (!u) return;
    editingUserId = id;
    document.getElementById('u_name').value = u.name;
    document.getElementById('u_email').value = u.email;
    document.getElementById('u_role').value = u.role;
  };

  window.deleteUser = function(id) {
    if (!confirm('Xóa người dùng này?')) return;
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
  };

  window.editProduct = function(id) {
    products = JSON.parse(localStorage.getItem('products') || '[]');
    const p = products.find(x => x.id === id); if (!p) return;
    editingProductId = id;
    document.getElementById('p_name').value = p.name;
    document.getElementById('p_price').value = p.price;
    document.getElementById('p_image').value = p.image;
    document.getElementById('p_desc').value = p.desc;
  };

  window.deleteProduct = function(id) {
    if (!confirm('Xóa sản phẩm này?')) return;
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
  };

  function renderUsers() {
    users = JSON.parse(localStorage.getItem('users') || '[]');
    userTableBody.innerHTML = '';
    users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escape(u.name)}</td><td>${escape(u.email)}</td><td>${escape(u.role)}</td>
        <td>
          <button class="btn ghost" onclick='editUser("${u.id}")'>Sửa</button>
          <button class="btn primary" onclick='deleteUser("${u.id}")'>Xóa</button>
        </td>`;
      userTableBody.appendChild(tr);
    });
  }

  function renderProducts() {
    products = JSON.parse(localStorage.getItem('products') || '[]');
    productTableBody.innerHTML = '';
    products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escape(p.name)}</td><td>${fmtVND(p.price)}</td><td>${escape(p.desc)}</td>
        <td><img src="${escape(p.image)}" style="height:60px;border-radius:6px" /></td>
        <td>
          <button class="btn ghost" onclick='editProduct("${p.id}")'>Sửa</button>
          <button class="btn primary" onclick='deleteProduct("${p.id}")'>Xóa</button>
        </td>`;
      productTableBody.appendChild(tr);
    });
  }

  if (goHome) goHome.addEventListener('click', ()=> location.href = 'home.html');
  if (logoutBtn) logoutBtn.addEventListener('click', ()=> { localStorage.removeItem('loggedIn'); localStorage.removeItem('role'); localStorage.removeItem('currentUser'); location.href = 'login.html'; });

  // helpers
  function genId(){ return '_' + Math.random().toString(36).slice(2,9); }
  function fmtVND(n){ return (Number(n)||0).toLocaleString('vi-VN') + '₫'; }
  function escape(s=''){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();
