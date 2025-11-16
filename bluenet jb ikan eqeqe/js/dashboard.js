// Sample product data
const products = [
  {
    id: 1,
    name: "Ikan Dori Segar",
    category: "segar fillet",
    price: 45000,
    originalPrice: 56000,
    discount: 20,
    rating: 4.5,
    reviews: 245,
    sold: 120,
    location: "Jakarta",
    badge: "DISKON 20%",
    image: "hero-fish.jpg"
  },
  {
    id: 2,
    name: "Ikan Tongkol Beku",
    category: "beku",
    price: 38000,
    rating: 4.0,
    reviews: 189,
    sold: 85,
    location: "Jakarta",
    image: "hero-fish.jpg"
  },
  {
    id: 3,
    name: "Udang Beku Premium",
    category: "beku udang",
    price: 95000,
    originalPrice: 120000,
    discount: 21,
    rating: 4.8,
    reviews: 456,
    sold: 200,
    location: "Jakarta",
    badge: "PROMO",
    image: "hero-fish.jpg"
  },
  {
    id: 4,
    name: "Ikan Kembung Fresh",
    category: "segar",
    price: 42000,
    rating: 4.7,
    reviews: 312,
    sold: 150,
    location: "Jakarta",
    badge: "TERBARU",
    image: "hero-fish.jpg"
  },
  {
    id: 5,
    name: "Fillet Ikan Lele",
    category: "fillet",
    price: 28000,
    rating: 4.2,
    reviews: 178,
    sold: 95,
    location: "Jakarta",
    image: "hero-fish.jpg"
  },
  {
    id: 6,
    name: "Ikan Pari Beku",
    category: "beku",
    price: 52000,
    rating: 4.6,
    reviews: 267,
    sold: 110,
    location: "Jakarta",
    image: "hero-fish.jpg"
  }
];

// Cart functionality
let cart = [];
let cartTotal = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  setupEventListeners();
});

// Render products to the grid
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    grid.appendChild(productCard);
  });
}

// Create product card HTML
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-category', product.category);
  card.setAttribute('data-name', product.name.toLowerCase());
  
  const stars = generateStars(product.rating);
  
  card.innerHTML = `
    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
    <div class="product-image" style="background-image:url('${product.image}')"></div>
    <div class="product-actions">
      <button class="action-icon wishlist-btn" title="Tambah ke wishlist">
        <i class="far fa-heart"></i>
      </button>
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-desc">${getCategoryDescription(product.category)}</p>
      <div class="product-rating">
        <div class="stars">${stars}</div>
        <span class="rating-count">(${product.reviews})</span>
      </div>
      <div class="product-price">
        <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}/kg</span>
        ${product.originalPrice ? `<span class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
      </div>
      <div class="product-meta">
        <span class="sold">Terjual ${product.sold}</span>
        <span class="location">${product.location}</span>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
        <i class="fas fa-cart-plus"></i> Keranjang
      </button>
    </div>
  `;
  
  return card;
}

// Generate star ratings
function generateStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
}

// Get category description
function getCategoryDescription(category) {
  const descriptions = {
    'segar': 'Segar langsung melaut',
    'beku': 'Kualitas pabrik',
    'udang': 'Size restoran',
    'fillet': 'Fillet premium segar',
    'segar fillet': 'Fillet premium segar',
    'beku udang': 'Size restoran'
  };
  
  return descriptions[category] || 'Produk berkualitas';
}

// Setup event listeners
function setupEventListeners() {
  // Cart toggle
  document.getElementById('cartBtn').addEventListener('click', function() {
    document.getElementById('cartSidebar').classList.add('active');
  });
  
  document.getElementById('closeCart').addEventListener('click', function() {
    document.getElementById('cartSidebar').classList.remove('active');
  });
  
  // Search functionality
  document.getElementById('searchInput').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
      const name = card.getAttribute('data-name');
      if (name.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
  
  // Wishlist functionality
  document.addEventListener('click', function(e) {
    if (e.target.closest('.wishlist-btn')) {
      const btn = e.target.closest('.wishlist-btn');
      const icon = btn.querySelector('i');
      
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.classList.add('active');
        showToast('Produk ditambahkan ke wishlist!');
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.classList.remove('active');
        showToast('Produk dihapus dari wishlist');
      }
    }
  });
}

// Add to cart function
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  cart.push(product);
  updateCart();
  showToast(`✓ ${product.name} ditambahkan ke keranjang!`);
}

// Update cart UI
function updateCart() {
  const cartCount = document.querySelector('.cart-count');
  const cartItems = document.getElementById('cartItems');
  const totalAmount = document.querySelector('.total-amount');
  
  // Update cart count
  cartCount.textContent = cart.length;
  
  // Update cart items
  cartItems.innerHTML = '';
  cartTotal = 0;
  
  cart.forEach((item, index) => {
    cartTotal += item.price;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>Rp ${item.price.toLocaleString('id-ID')}</p>
      </div>
      <button class="action-icon" onclick="removeFromCart(${index})">
        <i class="fas fa-trash"></i>
      </button>
    `;
    
    cartItems.appendChild(cartItem);
  });
  
  // Update total
  totalAmount.textContent = `Rp ${cartTotal.toLocaleString('id-ID')}`;
}

// Remove from cart
function removeFromCart(index) {
  const removedItem = cart[index];
  cart.splice(index, 1);
  updateCart();
  showToast(`✗ ${removedItem.name} dihapus dari keranjang`);
}

// Toast notification
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}