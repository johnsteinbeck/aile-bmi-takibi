"use strict";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const publicMenuUrl = "https://pizzeria-tov.vercel.app";

// Restaurant contact details: change WhatsApp, phone, map, Instagram, and hours here.
const businessConfig = {
  whatsappNumber: "90546860042",
  phoneDisplay: "0546 860 04 2",
  phoneHref: "tel:0546860042",
  whatsappMessage: {
    tr: "Merhaba, Pizzeria Tov için sipariş vermek istiyorum.",
    en: "Hello, I would like to order from Pizzeria Tov.",
  },
  mapUrl:
    "https://www.google.com/maps/place/Pizzeria+TOV/@37.9383882,40.1316048,686m/data=!3m2!1e3!4b1!4m6!3m5!1s0x40751f007b429305:0xc22fae67584a3097!8m2!3d37.9383882!4d40.1316048!16s%2Fg%2F11y6p2z61x!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D",
  instagramUrl: "https://www.instagram.com/pizzeria_tov/",
  hours: {
    tr: [
      "Neapolitan Style Pizza",
      "Pazartesi: Kapalı",
      "Salı - Cuma: 12.00 - 20.00",
      "Cumartesi - Pazar: 14.00 - 20.00",
    ],
    en: [
      "Neapolitan Style Pizza",
      "Monday: Closed",
      "Tuesday - Friday: 12.00 - 20.00",
      "Saturday - Sunday: 14.00 - 20.00",
    ],
  },
};

const supabaseConfig = window.PIZZERIA_TOV_CONFIG || {};
const storageBucket = supabaseConfig.storageBucket || "product-images";
const hasSupabaseCredentials =
  Boolean(supabaseConfig.supabaseUrl) &&
  Boolean(supabaseConfig.supabaseAnonKey) &&
  !String(supabaseConfig.supabaseUrl).includes("YOUR_PROJECT_REF") &&
  !String(supabaseConfig.supabaseAnonKey).includes("YOUR_SUPABASE_ANON_KEY");
const supabaseClient =
  hasSupabaseCredentials && window.supabase
    ? window.supabase.createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey)
    : null;

const categories = [
  { id: "napoli", label: { tr: "Napoli Pizzaları", en: "Napoli Pizzas" } },
  { id: "drinks", label: { tr: "İçecekler", en: "Drinks" } },
];

const menuGroups = {
  chef: {
    eyebrow: { tr: "Napoli Pizzaları", en: "Napoli Pizzas" },
    title: { tr: "Şefin önerisi", en: "Chef's Selection" },
  },
  signature: {
    eyebrow: { tr: "En çok tercih edilen", en: "Most Ordered" },
    title: { tr: "İmza Pizzalar", en: "Signature Pizzas" },
  },
  drinks: {
    eyebrow: { tr: "Bibite", en: "Bibite" },
    title: { tr: "İçecekler", en: "Drinks" },
  },
};

const groupOrderByCategory = { napoli: ["chef", "signature"], drinks: ["drinks"] };

// Preview-only fallback. Production products, prices, visibility, and image paths live in Supabase.
const baseMenuItems = [
  previewItem("margherita", "napoli", "chef", "415 ₺", "tomato", "Margherita", [
    "Eritilmiş peynir",
    "San Marzano domates",
    "Fesleğen",
    "Parmesan",
    "Zeytinyağı",
  ], [
    "Melted cheese",
    "San Marzano tomatoes",
    "Basil",
    "Parmesan",
    "Olive oil",
  ], "assets/menu/Margherita.png", 10),
  previewItem("marinara", "napoli", "chef", "240 ₺", "tomato", "Marinara", [
    "San Marzano domates sos",
    "Fesleğen",
    "Siyah zeytin",
    "Acı zeytin",
    "Zeytinyağı",
  ], [
    "San Marzano tomato sauce",
    "Basil",
    "Black olives",
    "Spicy olives",
    "Olive oil",
  ], "", 20),
  previewItem("no-1", "napoli", "signature", "460 ₺", "mushroom", "No:1", [
    "San Marzano domates sos",
    "Fesleğen",
    "Dilber eritilmiş peyniri",
    "Parmesan",
    "Mantar mix",
    "Zeytinyağı",
  ], [
    "San Marzano tomato sauce",
    "Basil",
    "Dilber melted cheese",
    "Parmesan",
    "Mixed mushrooms",
    "Olive oil",
  ], "assets/menu/mantar-pizza-dilim.jpg", 30),
  previewItem("no-2", "napoli", "signature", "485 ₺", "cheese", "No:2", [
    "Gorgonzola",
    "Kars gravyeri",
    "Dilber eritilmiş peyniri",
    "Fesleğen",
    "Parmesan",
    "Mantar mix",
    "Zeytinyağı",
    "Soslu etler",
  ], [
    "Gorgonzola",
    "Kars gruyere",
    "Dilber melted cheese",
    "Basil",
    "Parmesan",
    "Mixed mushrooms",
    "Olive oil",
    "Sauced meats",
  ], "assets/menu/mantar-pizza.jpg", 40),
  previewItem("no-3", "napoli", "signature", "Fiyat sorunuz", "mushroom", "No:3", [
    "Gorgonzola peyniri",
    "Fesleğen",
    "Parmesan peyniri",
    "Dilber peyniri",
    "Mantar",
    "Füme et",
    "Ricotta kreması",
    "Balzamik",
    "Karabiber",
  ], [
    "Gorgonzola cheese",
    "Basil",
    "Parmesan cheese",
    "Dilber cheese",
    "Mushroom",
    "Smoked meat",
    "Ricotta cream",
    "Balsamic",
    "Black pepper",
  ], "assets/menu/no 3.png", 50),
  previewItem("pepperoni", "napoli", "signature", "525 ₺", "tomato", "Pepperoni", [
    "San Marzano domates sos",
    "Fesleğen",
    "Parmesan",
    "Dilber eritilmiş peyniri",
    "Kayap sucuk",
    "Deniz zeytinyağı",
  ], [
    "San Marzano tomato sauce",
    "Basil",
    "Parmesan",
    "Dilber melted cheese",
    "Kayap sucuk",
    "Deniz olive oil",
  ], "assets/menu/pepperoni.png", 60),
  previewItem("dort-peynir", "napoli", "signature", "570 ₺", "cheese", {
    tr: "4 Peynirli Pizza",
    en: "Four Cheese Pizza",
  }, [
    "Dilberice",
    "Kars gravyeri",
    "Gorgonzola",
    "Parmesan",
    "Dilber peyniri",
    "Kaymak",
    "Bal",
  ], [
    "Dilberice",
    "Kars gruyere",
    "Gorgonzola",
    "Parmesan",
    "Dilber cheese",
    "Cream",
    "Honey",
  ], "assets/menu/dort-peynir.jpg", 70),
  previewItem("burrata-special", "napoli", "signature", "460 ₺", "cheese", "Burrata Special", [
    "Burrata",
    "Roka",
    "Cherry domates",
    "Pesto",
  ], [
    "Burrata",
    "Arugula",
    "Cherry tomatoes",
    "Pesto",
  ], "assets/menu/burrata-special.jpg", 80),
  previewItem("san-pellegrino", "drinks", "drinks", "120 ₺", "drink", "San Pellegrino", [
    "Maden suyu",
  ], [
    "Sparkling mineral water",
  ], "", 90),
  previewItem("espresso", "drinks", "drinks", "95 ₺", "drink", "Espresso", [
    "Yoğun İtalyan espresso",
  ], [
    "Intense Italian espresso",
  ], "", 100),
];

const uiText = {
  tr: {
    nav: { skip: "Menüye geç", menu: "Menü", admin: "Yönetim", visit: "İletişim" },
    menu: {
      eyebrow: "Menu della casa",
      title: "Pizzeria Tov Menüsü",
      empty: "Bu kategoride ürün yok.",
      error: "Menü şu anda yüklenemedi. Lütfen birkaç dakika sonra tekrar deneyin.",
    },
    admin: {
      skip: "Yönetim paneline geç",
      eyebrow: "Area riservata",
      title: "Yönetici paneli",
      copy: "Pizzeria Tov menüsü Supabase veritabanından yönetilir. Ürün ekleyin, fiyatları güncelleyin, görsel yükleyin, gizleyin ya da silin.",
      authTitle: "Yönetici girişi",
      authCopy: "Yetkili e-postanızı yazın. Supabase size güvenli giriş bağlantısı gönderir.",
      emailLabel: "Yönetici e-postası",
      emailPlaceholder: "owner@example.com",
      sendLinkButton: "Giriş Linki Gönder",
      signOutButton: "Çıkış Yap",
      addKicker: "Nuova pizza",
      addTitle: "Yeni ürün ekle",
      nameLabel: "Ürün adı",
      priceLabel: "Fiyat",
      categoryLabel: "Kategori",
      categoryNapoli: "Napoli Pizzaları",
      categoryDrinks: "İçecekler",
      groupLabel: "Menü başlığı",
      groupChef: "Şefin önerisi",
      groupSignature: "İmza Pizzalar",
      ingredientsLabel: "İçerikler",
      photoFileLabel: "Fotoğraf dosyası",
      addButton: "Ürünü Ekle",
      organizeKicker: "Ordine",
      organizeTitle: "Menüyü düzenle",
      productLabel: "Ürün seç",
      sortLabel: "Sıra numarası",
      organizeButton: "Düzeni Kaydet",
      priceKicker: "Prezzo",
      priceTitle: "Fiyat güncelle",
      newPriceLabel: "Yeni fiyat",
      priceButton: "Fiyatı Güncelle",
      photoKicker: "Fotografia",
      photoTitle: "Fotoğraf ekle",
      photoButton: "Fotoğrafı Güncelle",
      visibilityKicker: "Visibile",
      visibilityTitle: "Gizle / göster",
      visibleLabel: "Menüde görünür",
      visibilityButton: "Görünürlüğü Kaydet",
      deleteKicker: "Rimuovi",
      deleteTitle: "Pizza sil",
      deleteCopy: "Silinen ürün veritabanından kaldırılır. Görsel Supabase Storage içinde ise dosya da temizlenir.",
      deleteButton: "Seçili Ürünü Sil",
      qrKicker: "QR",
      qrTitle: "Baskı için QR",
      qrCopy: "Bu QR kod doğrudan Vercel menü adresine gider.",
      publicUrlLabel: "Menü URL",
      backToMenu: "Menüye Dön",
      loginNeeded: "Yönetim için yetkili e-posta ile giriş yapın.",
      linkSent: "Giriş bağlantısı gönderildi. E-postanızı kontrol edin.",
      checking: "Yetki kontrol ediliyor...",
      notConfigured: "Supabase bilgileri config.js içine eklenmeden yönetim paneli aktif olmaz.",
      notAuthorized: "Bu e-posta yönetici listesinde yok.",
      ready: "Yönetim paneli hazır.",
      added: "Yeni ürün Supabase menüsüne eklendi.",
      priceUpdated: "Fiyat güncellendi.",
      photoUpdated: "Fotoğraf güncellendi.",
      organized: "Menü sırası ve başlığı güncellendi.",
      visibilityUpdated: "Ürün görünürlüğü güncellendi.",
      deleted: "Ürün silindi.",
      missingPhoto: "Fotoğraf dosyası seçin.",
      confirmDelete: "Bu ürünü kalıcı olarak silmek istiyor musunuz?",
      saveError: "İşlem tamamlanamadı. Supabase ayarlarını ve yetkinizi kontrol edin.",
      loadError: "Ürünler Supabase'den yüklenemedi.",
      noProducts: "Henüz ürün yok.",
      hiddenSuffix: "Gizli",
    },
    visit: {
      title: "İletişim & Konum",
      phoneLabel: "Telefon",
      hoursLabel: "Çalışma saatleri",
      whatsapp: "WhatsApp",
      maps: "Konum",
    },
    mobileNav: { menu: "Menü", visit: "İletişim" },
    footer: { copy: "Gerçek Napoli Pizzası." },
  },
  en: {
    nav: { skip: "Skip to menu", menu: "Menu", admin: "Admin", visit: "Contact" },
    menu: {
      eyebrow: "Menu della casa",
      title: "Pizzeria Tov Menu",
      empty: "No items in this category.",
      error: "The menu could not be loaded right now. Please try again in a few minutes.",
    },
    admin: {
      skip: "Skip to admin panel",
      eyebrow: "Area riservata",
      title: "Admin panel",
      copy: "Pizzeria Tov's menu is managed from the Supabase database. Add products, update prices, upload images, hide, show, or delete items.",
      authTitle: "Admin sign in",
      authCopy: "Enter the authorized email. Supabase will send a secure login link.",
      emailLabel: "Admin email",
      emailPlaceholder: "owner@example.com",
      sendLinkButton: "Send Login Link",
      signOutButton: "Sign Out",
      addKicker: "Nuova pizza",
      addTitle: "Add new product",
      nameLabel: "Product name",
      priceLabel: "Price",
      categoryLabel: "Category",
      categoryNapoli: "Napoli Pizzas",
      categoryDrinks: "Drinks",
      groupLabel: "Menu heading",
      groupChef: "Chef's Selection",
      groupSignature: "Signature Pizzas",
      ingredientsLabel: "Ingredients",
      photoFileLabel: "Photo file",
      addButton: "Add Product",
      organizeKicker: "Ordine",
      organizeTitle: "Organize menu",
      productLabel: "Choose product",
      sortLabel: "Sort order",
      organizeButton: "Save Order",
      priceKicker: "Prezzo",
      priceTitle: "Update price",
      newPriceLabel: "New price",
      priceButton: "Update Price",
      photoKicker: "Fotografia",
      photoTitle: "Add Photo",
      photoButton: "Update Photo",
      visibilityKicker: "Visibile",
      visibilityTitle: "Hide / show",
      visibleLabel: "Visible on menu",
      visibilityButton: "Save Visibility",
      deleteKicker: "Rimuovi",
      deleteTitle: "Delete pizza",
      deleteCopy: "Deleted products are removed from the database. Storage images are removed too.",
      deleteButton: "Delete Selected Product",
      qrKicker: "QR",
      qrTitle: "QR for print",
      qrCopy: "This QR code opens the Vercel public menu URL.",
      publicUrlLabel: "Menu URL",
      backToMenu: "Back to Menu",
      loginNeeded: "Sign in with the authorized email to manage the menu.",
      linkSent: "Login link sent. Check your email.",
      checking: "Checking admin permission...",
      notConfigured: "Add Supabase credentials to config.js before using the admin panel.",
      notAuthorized: "This email is not in the admin list.",
      ready: "Admin panel is ready.",
      added: "New product added to the Supabase menu.",
      priceUpdated: "Price updated.",
      photoUpdated: "Photo updated.",
      organized: "Menu order and heading updated.",
      visibilityUpdated: "Product visibility updated.",
      deleted: "Product deleted.",
      missingPhoto: "Choose a photo file.",
      confirmDelete: "Do you want to permanently delete this product?",
      saveError: "The action could not be completed. Check Supabase settings and permissions.",
      loadError: "Products could not be loaded from Supabase.",
      noProducts: "No products yet.",
      hiddenSuffix: "Hidden",
    },
    visit: {
      title: "Contact & Location",
      phoneLabel: "Phone",
      hoursLabel: "Opening hours",
      whatsapp: "WhatsApp",
      maps: "Location",
    },
    mobileNav: { menu: "Menu", visit: "Contact" },
    footer: { copy: "The soul of Naples, fired by wood." },
  },
};

const state = {
  language: "tr",
  category: "napoli",
  isAdminPage: false,
  isAdminReady: false,
};

let menuItems = [];

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  state.isAdminPage = document.body.classList.contains("admin-page");
  bindLanguageSwitch();
  bindSmoothScroll();
  renderStaticText();
  updateBusinessLinks();

  if (state.isAdminPage) {
    bindAdminPanel();
    await initAdminAuth();
  } else {
    menuItems = await loadMenuItems({ includeHidden: false });
    renderFilters();
    renderMenu();
    if (!window.location.hash) window.scrollTo(0, 0);
  }
}

function bindLanguageSwitch() {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = button.dataset.language || "tr";
      renderStaticText();
      renderFilters();
      renderMenu();
      renderAdminSelectors();
      updateBusinessLinks();
    });
  });
}

function bindSmoothScroll() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

async function initAdminAuth() {
  const authForm = document.getElementById("adminAuthForm");
  const signOutButton = document.getElementById("adminSignOutButton");

  if (!supabaseClient) {
    showAdminStatus("notConfigured");
    setAdminWorkspace(false);
    return;
  }

  authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("adminEmail")?.value.trim();
    if (!email) return;
    try {
      setAdminBusy(true);
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: getAdminRedirectUrl(),
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      showAdminStatus("linkSent");
    } catch (error) {
      console.error(error);
      showAdminStatus("saveError");
    } finally {
      setAdminBusy(false);
    }
  });

  signOutButton?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    state.isAdminReady = false;
    menuItems = [];
    setAdminWorkspace(false);
    showAdminStatus("loginNeeded");
  });

  const { data } = await supabaseClient.auth.getSession();
  await handleAdminSession(data.session);
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    handleAdminSession(session);
  });
}

async function handleAdminSession(session) {
  const authForm = document.getElementById("adminAuthForm");
  const signOutButton = document.getElementById("adminSignOutButton");

  if (!session?.user) {
    state.isAdminReady = false;
    if (authForm) authForm.hidden = false;
    if (signOutButton) signOutButton.hidden = true;
    setAdminWorkspace(false);
    showAdminStatus("loginNeeded");
    return;
  }

  if (signOutButton) signOutButton.hidden = false;
  if (authForm) authForm.hidden = true;
  showAdminStatus("checking");

  try {
    const isAdmin = await verifyAdminGrant(session.user);
    if (!isAdmin) {
      state.isAdminReady = false;
      setAdminWorkspace(false);
      showAdminStatus("notAuthorized");
      return;
    }
    state.isAdminReady = true;
    setAdminWorkspace(true);
    menuItems = await loadMenuItems({ includeHidden: true });
    renderAdminSelectors();
    syncNewProductControls();
    showAdminStatus("ready");
  } catch (error) {
    console.error(error);
    state.isAdminReady = false;
    setAdminWorkspace(false);
    showAdminStatus("saveError");
  }
}

async function verifyAdminGrant(user) {
  const { data, error } = await supabaseClient.from("app_admins").select("id,user_id,email").limit(1);
  if (error) throw error;
  const grant = data?.[0];
  if (!grant) return false;
  if (!grant.user_id) {
    await supabaseClient.from("app_admins").update({ user_id: user.id }).eq("id", grant.id);
  }
  return true;
}

function bindAdminPanel() {
  const addForm = document.getElementById("addPizzaForm");
  const organizeForm = document.getElementById("organizeForm");
  const priceForm = document.getElementById("priceUpdateForm");
  const photoForm = document.getElementById("photoUpdateForm");
  const visibilityForm = document.getElementById("visibilityForm");
  const deleteForm = document.getElementById("deletePizzaForm");

  document.getElementById("newPizzaCategory")?.addEventListener("change", syncNewProductControls);
  document.getElementById("priceItemSelect")?.addEventListener("change", syncSelectedPrice);
  document.getElementById("organizeItemSelect")?.addEventListener("change", syncOrganizeControls);
  document.getElementById("organizeCategorySelect")?.addEventListener("change", syncOrganizeGroupState);
  document.getElementById("visibilityItemSelect")?.addEventListener("change", syncVisibilityToggle);

  addForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAdminReady()) return;

    const name = document.getElementById("newPizzaName")?.value.trim() || "";
    const price = document.getElementById("newPizzaPrice")?.value.trim() || "";
    const category = document.getElementById("newPizzaCategory")?.value || "napoli";
    const group = category === "drinks" ? "drinks" : document.getElementById("newPizzaGroup")?.value || "signature";
    const ingredients = splitIngredients(document.getElementById("newPizzaIngredients")?.value || "");
    const file = document.getElementById("newPizzaFile")?.files?.[0] || null;
    if (!name || !price || !ingredients.length) return;

    try {
      setAdminBusy(true);
      const slug = await createUniqueSlug(name);
      const imagePath = file ? await uploadProductImage(file, slug) : "";
      const nextSort = getNextSortOrder(category);
      const { error } = await supabaseClient.from("menu_products").insert({
        slug,
        category,
        menu_group: group,
        name_tr: name,
        name_en: name,
        ingredients_tr: ingredients,
        ingredients_en: ingredients,
        price_text_tr: price,
        price_text_en: price,
        visual: category === "drinks" ? "drink" : "tomato",
        image_path: imagePath,
        sort_order: nextSort,
        is_visible: true,
      });
      if (error) throw error;
      addForm.reset();
      syncNewProductControls();
      await reloadAdminMenu();
      showAdminStatus("added");
    } catch (error) {
      console.error(error);
      showAdminStatus("saveError");
    } finally {
      setAdminBusy(false);
    }
  });

  organizeForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAdminReady()) return;

    const selected = findMenuItem(document.getElementById("organizeItemSelect")?.value);
    if (!selected) return;
    const category = document.getElementById("organizeCategorySelect")?.value || selected.category;
    const group = category === "drinks" ? "drinks" : document.getElementById("organizeGroupSelect")?.value || selected.group;
    const sortOrder = Number(document.getElementById("sortOrderInput")?.value || selected.sortOrder || 0);

    try {
      setAdminBusy(true);
      const { error } = await supabaseClient
        .from("menu_products")
        .update({ category, menu_group: group, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 })
        .eq("id", selected.id);
      if (error) throw error;
      await reloadAdminMenu();
      showAdminStatus("organized");
    } catch (error) {
      console.error(error);
      showAdminStatus("saveError");
    } finally {
      setAdminBusy(false);
    }
  });

  priceForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAdminReady()) return;

    const selected = findMenuItem(document.getElementById("priceItemSelect")?.value);
    const updatedPrice = document.getElementById("updatedPrice")?.value.trim() || "";
    if (!selected || !updatedPrice) return;

    try {
      setAdminBusy(true);
      const { error } = await supabaseClient
        .from("menu_products")
        .update({ price_text_tr: updatedPrice, price_text_en: updatedPrice })
        .eq("id", selected.id);
      if (error) throw error;
      await reloadAdminMenu();
      showAdminStatus("priceUpdated");
    } catch (error) {
      console.error(error);
      showAdminStatus("saveError");
    } finally {
      setAdminBusy(false);
    }
  });

  photoForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAdminReady()) return;

    const selected = findMenuItem(document.getElementById("photoItemSelect")?.value);
    const file = document.getElementById("updatedPhotoFile")?.files?.[0] || null;
    if (!selected || !file) {
      showAdminStatus("missingPhoto");
      return;
    }

    try {
      setAdminBusy(true);
      const imagePath = await uploadProductImage(file, selected.slug || selected.id);
      const { error } = await supabaseClient
        .from("menu_products")
        .update({ image_path: imagePath })
        .eq("id", selected.id);
      if (error) throw error;
      await removeStorageImage(selected.imagePath);
      photoForm.reset();
      await reloadAdminMenu();
      showAdminStatus("photoUpdated");
    } catch (error) {
      console.error(error);
      showAdminStatus("saveError");
    } finally {
      setAdminBusy(false);
    }
  });

  visibilityForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAdminReady()) return;

    const selected = findMenuItem(document.getElementById("visibilityItemSelect")?.value);
    const isVisible = Boolean(document.getElementById("visibilityToggle")?.checked);
    if (!selected) return;

    try {
      setAdminBusy(true);
      const { error } = await supabaseClient
        .from("menu_products")
        .update({ is_visible: isVisible })
        .eq("id", selected.id);
      if (error) throw error;
      await reloadAdminMenu();
      showAdminStatus("visibilityUpdated");
    } catch (error) {
      console.error(error);
      showAdminStatus("saveError");
    } finally {
      setAdminBusy(false);
    }
  });

  deleteForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAdminReady()) return;

    const selected = findMenuItem(document.getElementById("deleteItemSelect")?.value);
    if (!selected || !window.confirm(translate("admin.confirmDelete"))) return;

    try {
      setAdminBusy(true);
      const { error } = await supabaseClient.from("menu_products").delete().eq("id", selected.id);
      if (error) throw error;
      await removeStorageImage(selected.imagePath);
      await reloadAdminMenu();
      showAdminStatus("deleted");
    } catch (error) {
      console.error(error);
      showAdminStatus("saveError");
    } finally {
      setAdminBusy(false);
    }
  });

  syncNewProductControls();
}

async function reloadAdminMenu() {
  menuItems = await loadMenuItems({ includeHidden: true });
  renderAdminSelectors();
}

function requireAdminReady() {
  if (!state.isAdminReady) {
    showAdminStatus(supabaseClient ? "loginNeeded" : "notConfigured");
    return false;
  }
  return true;
}

function setAdminWorkspace(isVisible) {
  const workspace = document.getElementById("adminWorkspace");
  if (workspace) workspace.hidden = !isVisible;
}

function setAdminBusy(isBusy) {
  document.querySelectorAll(".admin-page button, .admin-page input, .admin-page select, .admin-page textarea").forEach((element) => {
    if (element.id === "adminSignOutButton") return;
    element.disabled = isBusy;
  });
}

function renderAdminSelectors() {
  const selectors = [
    "priceItemSelect",
    "photoItemSelect",
    "deleteItemSelect",
    "organizeItemSelect",
    "visibilityItemSelect",
  ].map((id) => document.getElementById(id));
  const options = menuItems
    .map((entry) => `<option value="${escapeHtml(entry.id)}">${escapeHtml(formatSelectorLabel(entry))}</option>`)
    .join("");

  selectors.forEach((select) => {
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = options || `<option value="">${escapeHtml(translate("admin.noProducts"))}</option>`;
    if (currentValue && findMenuItem(currentValue)) select.value = currentValue;
  });
  syncSelectedPrice();
  syncOrganizeControls();
  syncVisibilityToggle();
}

function syncNewProductControls() {
  const categorySelect = document.getElementById("newPizzaCategory");
  const groupSelect = document.getElementById("newPizzaGroup");
  if (groupSelect) groupSelect.disabled = categorySelect?.value === "drinks";
}

function syncSelectedPrice() {
  const selected = findMenuItem(document.getElementById("priceItemSelect")?.value);
  const input = document.getElementById("updatedPrice");
  if (input) input.value = selected ? localize(selected.price) : "";
}

function syncOrganizeControls() {
  const selected = findMenuItem(document.getElementById("organizeItemSelect")?.value);
  const categorySelect = document.getElementById("organizeCategorySelect");
  const groupSelect = document.getElementById("organizeGroupSelect");
  const sortInput = document.getElementById("sortOrderInput");

  if (!selected) return;
  if (categorySelect) categorySelect.value = selected.category;
  if (groupSelect) groupSelect.value = selected.group === "drinks" ? "chef" : selected.group;
  if (sortInput) sortInput.value = selected.sortOrder || 0;
  syncOrganizeGroupState();
}

function syncOrganizeGroupState() {
  const categorySelect = document.getElementById("organizeCategorySelect");
  const groupSelect = document.getElementById("organizeGroupSelect");
  if (groupSelect) groupSelect.disabled = categorySelect?.value === "drinks";
}

function syncVisibilityToggle() {
  const selected = findMenuItem(document.getElementById("visibilityItemSelect")?.value);
  const toggle = document.getElementById("visibilityToggle");
  if (toggle) toggle.checked = selected ? selected.isVisible : false;
}

async function loadMenuItems({ includeHidden }) {
  if (!supabaseClient) return cloneMenuItems(baseMenuItems);

  try {
    let query = supabaseClient.from("menu_products").select("*");
    if (!includeHidden) query = query.eq("is_visible", true);
    const { data, error } = await query.order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data.map(normalizeProductRow) : [];
  } catch (error) {
    console.error(error);
    if (state.isAdminPage) showAdminStatus("loadError");
    return supabaseClient ? [] : cloneMenuItems(baseMenuItems);
  }
}

function normalizeProductRow(row) {
  const trIngredients = Array.isArray(row.ingredients_tr) ? row.ingredients_tr : splitIngredients(row.ingredients_tr || "");
  const enIngredients = Array.isArray(row.ingredients_en) && row.ingredients_en.length ? row.ingredients_en : trIngredients;
  return {
    id: row.id,
    slug: row.slug,
    category: row.category || "napoli",
    group: row.menu_group || (row.category === "drinks" ? "drinks" : "signature"),
    price: { tr: row.price_text_tr || "", en: row.price_text_en || row.price_text_tr || "" },
    visual: row.visual || (row.category === "drinks" ? "drink" : "tomato"),
    name: { tr: row.name_tr || "", en: row.name_en || row.name_tr || "" },
    ingredients: { tr: trIngredients, en: enIngredients },
    image: resolveProductImage(row.image_path || ""),
    imagePath: row.image_path || "",
    sortOrder: row.sort_order || 0,
    isVisible: row.is_visible !== false,
  };
}

function previewItem(id, category, group, price, visual, name, trIngredients, enIngredients, image = "", sortOrder = 0) {
  return {
    id,
    slug: id,
    category,
    group,
    price: typeof price === "string" ? { tr: price, en: price } : price,
    visual,
    name: typeof name === "string" ? { tr: name, en: name } : name,
    ingredients: { tr: trIngredients, en: enIngredients },
    image,
    imagePath: image,
    sortOrder,
    isVisible: true,
  };
}

function renderStaticText() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", translate(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === state.language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  const publicUrlText = document.getElementById("publicMenuUrlText");
  if (publicUrlText) publicUrlText.textContent = publicMenuUrl;
}

function renderFilters() {
  const container = document.getElementById("categoryFilters");
  if (!container) return;
  container.innerHTML = categories
    .map((category) => {
      const isActive = state.category === category.id;
      return `<button class="filter-button${isActive ? " is-active" : ""}" type="button" role="tab" aria-selected="${isActive}" data-category="${escapeHtml(category.id)}">${escapeHtml(localize(category.label))}</button>`;
    })
    .join("");
  container.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category || "napoli";
      renderFilters();
      renderMenu();
    });
  });
}

function renderMenu() {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;
  const visibleItems = menuItems.filter((entry) => entry.category === state.category && entry.isVisible);
  if (!visibleItems.length) {
    grid.innerHTML = `<p class="menu-empty">${escapeHtml(translate("menu.empty"))}</p>`;
    return;
  }
  const groupOrder = groupOrderByCategory[state.category] || [];
  const groupedMarkup = groupOrder
    .map((groupId) => {
      const groupItems = visibleItems.filter((entry) => entry.group === groupId);
      return groupItems.length ? createMenuGroup(groupId, groupItems) : "";
    })
    .join("");
  grid.innerHTML = groupedMarkup || visibleItems.map((entry, index) => createMenuCard(entry, index)).join("");
}

function createMenuGroup(groupId, entries) {
  const group = menuGroups[groupId];
  const heading = group
    ? `<div class="menu-group-heading"><p class="eyebrow">${escapeHtml(localize(group.eyebrow))}</p><h2>${escapeHtml(localize(group.title))}</h2></div>`
    : "";
  const cards = entries.map((entry, index) => createMenuCard(entry, index)).join("");
  return `<section class="menu-group" aria-label="${escapeHtml(group ? localize(group.title) : "")}">${heading}<div class="menu-group-grid">${cards}</div></section>`;
}

function createMenuCard(entry, index) {
  const category = categories.find((candidate) => candidate.id === entry.category);
  const categoryLabel = category ? localize(category.label) : "";
  const rawIngredients = localize(entry.ingredients);
  const ingredients = (Array.isArray(rawIngredients) ? rawIngredients : [rawIngredients])
    .filter(Boolean)
    .map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`)
    .join("");
  const entryName = localize(entry.name);
  const image = entry.image
    ? `<img class="item-photo" src="${escapeHtml(entry.image)}" alt="${escapeHtml(entryName)}" loading="eager" decoding="async" />`
    : "";
  const animationDelay = Math.min(index * 35, 280);
  return `<article class="menu-card" style="animation-delay: ${animationDelay}ms"><div class="item-visual visual-${escapeHtml(entry.visual || "tomato")}${image ? " has-photo" : ""}"${image ? "" : ' aria-hidden="true"'}>${image}</div><div class="item-copy"><p class="item-category">${escapeHtml(categoryLabel)}</p><div class="item-heading"><h3>${escapeHtml(entryName)}</h3><strong class="item-price">${escapeHtml(localize(entry.price))}</strong></div><ul class="item-ingredients">${ingredients}</ul></div></article>`;
}

function updateBusinessLinks() {
  const links = {
    locationWhatsappLink: getWhatsAppUrl(),
    mapLink: businessConfig.mapUrl,
    instagramLink: businessConfig.instagramUrl,
    phoneLink: businessConfig.phoneHref,
  };
  Object.entries(links).forEach(([id, href]) => {
    const element = document.getElementById(id);
    if (element) element.href = href;
  });
  const phoneText = document.getElementById("phoneText");
  if (phoneText) phoneText.textContent = businessConfig.phoneDisplay;
  const hoursText = document.getElementById("hoursText");
  const hours = localize(businessConfig.hours);
  if (hoursText && Array.isArray(hours)) hoursText.innerHTML = hours.map(escapeHtml).join("<br>");
}

function getWhatsAppUrl() {
  return `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(localize(businessConfig.whatsappMessage))}`;
}

function getAdminRedirectUrl() {
  if (window.location.protocol === "file:") return `${publicMenuUrl}/admin.html`;
  return `${window.location.origin}/admin.html`;
}

async function uploadProductImage(file, slug) {
  const extension = getFileExtension(file.name);
  const path = `${slugify(slug)}/${Date.now()}-${randomToken()}.${extension}`;
  const { data, error } = await supabaseClient.storage.from(storageBucket).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;
  return data.path;
}

async function removeStorageImage(imagePath) {
  if (!imagePath || isExternalOrLocalImage(imagePath)) return;
  await supabaseClient.storage.from(storageBucket).remove([imagePath]);
}

function resolveProductImage(imagePath) {
  if (!imagePath) return "";
  if (isExternalOrLocalImage(imagePath)) return imagePath;
  if (!supabaseClient) return "";
  return supabaseClient.storage.from(storageBucket).getPublicUrl(imagePath).data.publicUrl;
}

function isExternalOrLocalImage(imagePath) {
  return /^(https?:|data:|assets\/|\/)/i.test(imagePath);
}

async function createUniqueSlug(name) {
  const base = slugify(name) || `urun-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  while (await slugExists(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

async function slugExists(slug) {
  const { data, error } = await supabaseClient.from("menu_products").select("id").eq("slug", slug).limit(1);
  if (error) throw error;
  return Boolean(data?.length);
}

function getNextSortOrder(category) {
  const sameCategory = menuItems.filter((entry) => entry.category === category);
  return sameCategory.reduce((max, entry) => Math.max(max, Number(entry.sortOrder) || 0), 0) + 10;
}

function splitIngredients(value) {
  if (Array.isArray(value)) return value;
  return String(value)
    .split(/\r?\n/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
}

function findMenuItem(id) {
  return menuItems.find((entry) => String(entry.id) === String(id));
}

function formatSelectorLabel(entry) {
  const hidden = entry.isVisible ? "" : ` · ${translate("admin.hiddenSuffix")}`;
  return `${localize(entry.name)} · ${localize(entry.price)}${hidden}`;
}

function slugify(value) {
  return String(value)
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(fileName) {
  const extension = String(fileName).split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return extension || "jpg";
}

function randomToken() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneMenuItems(items) {
  return JSON.parse(JSON.stringify(items));
}

function showAdminStatus(key) {
  const status = document.getElementById("adminStatus");
  if (status) status.textContent = translate(`admin.${key}`);
}

function translate(path) {
  return path.split(".").reduce((source, key) => source?.[key], uiText[state.language]) || path;
}

function localize(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value;
  return value?.[state.language] || value?.tr || "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
