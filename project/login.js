// login.js
(function seed() {
  if (!localStorage.getItem('users')) {
    // default users (for admin CRUD we also store separate users array)
    const defaults = [
      { id: Date.now() + 1, name: "Admin", email: "admin@example.com", role: "admin" },
      { id: Date.now() + 2, name: "User", email: "user@example.com", role: "user" }
    ];
    localStorage.setItem('users', JSON.stringify(defaults));
  }
  if (!localStorage.getItem('products')) {
    const products = [
      { id: 'p1', name: "Túi xách", price: 500000, desc: "Túi xách đẹp", image: "https://images.unsplash.com/photo-1520975916376-0b1f9b1a1cbd?q=80&w=800&auto=format&fit=crop" },
      { id: 'p2', name: "Laptop", price: 30000000, desc: "Laptop mỏng nhẹ", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop" },
      { id: 'p3', name: "Đồng hồ", price: 1200000, desc: "Đồng hồ thời trang", image: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=800&auto=format&fit=crop" }
    ];
    localStorage.setItem('products', JSON.stringify(products));
  }
})();

// simple login with two sample accounts and no registration
document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const pw = document.getElementById('password').value.trim();
  const errorEl = document.getElementById('error');

  if (email === 'admin@example.com' && pw === '123456') {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('currentUser', email);
    location.href = 'admin.html';
    return;
  }
  if (email === 'user@example.com' && pw === '123456') {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('role', 'user');
    localStorage.setItem('currentUser', email);
    location.href = 'home.html';
    return;
  }

  errorEl.textContent = 'Sai email hoặc mật khẩu!';
  setTimeout(()=> errorEl.textContent = '', 3000);
});

