// ============= بيانات المنيو الثابتة (لو Firebase فاضي) =============
const defaultMenuItems = [
    { id: "1", name: "قهوة تركية", desc: "على أصولها، بنطحنها قدامك", price: 25, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300", category: "hot" },
    { id: "2", name: "كابتشينو", desc: "رغوة حليب كثيفة وقهوة إيطالية", price: 30, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300", category: "hot" },
    { id: "3", name: "لاتيه بالكراميل", desc: "ناعم مع لمسة كراميل", price: 35, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300", category: "hot" },
    { id: "4", name: "موكا", desc: "شوكولاتة وقهوة معاً", price: 32, image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4d?w=300", category: "hot" },
    { id: "5", name: "نسكافيه مثلج", desc: "منعش ومثالي للصيف", price: 28, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300", category: "cold" },
    { id: "6", name: "فرابتشينو", desc: "مثلج بالكريمة المخفوقة", price: 40, image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4d?w=300", category: "cold" },
    { id: "7", name: "كنافة بالجبنة", desc: "حلويات مصرية أصيلة", price: 45, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300", category: "dessert" },
    { id: "8", name: "تشيز كيك", desc: "بالفراولة أو الكراميل", price: 35, image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=300", category: "dessert" },
    { id: "9", name: "بسبوسة", desc: "بالجوز والقطر", price: 25, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300", category: "dessert" }
];

// ============= عرض المنيو الكامل مع التصنيفات =============
let allMenuItems = [];

async function loadFullMenu() {
    // نحاول نجيب من Firebase
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        if (!querySnapshot.empty) {
            allMenuItems = [];
            querySnapshot.forEach((doc) => {
                allMenuItems.push({ id: doc.id, ...doc.data() });
            });
        } else {
            // لو مفيش بيانات، نضيف البيانات الافتراضية لـ Firebase
            allMenuItems = defaultMenuItems;
            for (const item of defaultMenuItems) {
                await addDoc(collection(db, "products"), item);
            }
        }
    } catch (error) {
        console.log("خطأ في التحميل، استخدم البيانات المحلية", error);
        allMenuItems = defaultMenuItems;
    }
    
    renderMenuGrid("all");
}

function renderMenuGrid(category) {
    const grid = document.getElementById("menuGrid");
    if (!grid) return;
    
    let filtered = allMenuItems;
    if (category !== "all") {
        filtered = allMenuItems.filter(item => item.category === category);
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="loading">📭 لا توجد منتجات في هذا التصنيف</div>';
        return;
    }
    
    // ترجمة التصنيف للعرض
    const categoryNames = {
        hot: "☕ مشروب ساخن",
        cold: "🧊 مشروب بارد",
        dessert: "🍰 حلويات"
    };
    
    grid.innerHTML = filtered.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <img class="menu-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300'">
            <div class="menu-item-content">
                <span class="menu-item-category">${categoryNames[item.category] || item.category}</span>
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-desc">${item.desc || "وصف لذيذ"}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">${item.price} جنيه</span>
                    <button class="menu-item-add" data-id="${item.id}">
                        <i class="fas fa-plus"></i> أضف
                    </button>
                </div>
            </div>
        </div>
    `).join("");
    
    // إضافة حدث الأزرار
    document.querySelectorAll(".menu-item-add").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            addToCart(id);
        });
    });
}

// ============= أحداث أزرار التصنيف =============
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll(".category-btn");
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const category = btn.dataset.category;
            renderMenuGrid(category);
        });
    });
}

// ============= دالة الإضافة مع إشعار =============
function showNotification(message) {
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// تعديل دالة addToCart القديمة عشان تشتغل
const originalAddToCart = addToCart;
window.addToCart = function(productId) {
    const product = allMenuItems.find(p => p.id == productId) || products.find(p => p.id == productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id == productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showNotification(`✅ تم إضافة ${product.name} للعربة`);
};

// ============= ربط أزرار المنيو =============
document.getElementById("menuLinkBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("full-menu").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("heroMenuBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("full-menu").scrollIntoView({ behavior: "smooth" });
});

// ============= تشغيل المنيو عند تحميل الصفحة =============
// استدعي loadFullMenu بعد loadProducts
const originalLoadProducts = loadProducts;
window.loadProducts = async function() {
    await originalLoadProducts();
    await loadFullMenu();
    setupCategoryFilters();
};

// بدء التطبيق
(async function init() {
    await loadProducts();
    await loadFullMenu();
    setupCategoryFilters();
    updateCartUI();
    
    // Auth state
    onAuthStateChanged(auth, (user) => {
        const adminLink = document.getElementById("adminLink");
        const loginLink = document.getElementById("loginLink");
        const logoutLink = document.getElementById("logoutLink");
        
        if (user) {
            adminLink.style.display = "block";
            loginLink.style.display = "none";
            logoutLink.style.display = "block";
            loadAdminProducts();
            loadOrders();
        } else {
            adminLink.style.display = "none";
            loginLink.style.display = "block";
            logoutLink.style.display = "none";
        }
    });
})();