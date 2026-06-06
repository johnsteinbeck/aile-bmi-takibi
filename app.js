const STORAGE_KEY = "aile-bmi-takibi-v2";
const DARK_MODE_START_HOUR = 18;
const DARK_MODE_END_HOUR = 8;
const THEME_STORAGE_KEY = "aile-bmi-theme-choice";
const THEME_CHOICES = ["auto", "light", "dark"];
const NOTIFICATION_SETTINGS_KEY = "aile-bmi-notification-settings";
const WEB_REMINDER_LAST_KEY = "aile-bmi-last-reminder-date";
const REMINDER_NOTIFICATION_IDS = [2026060301, 2026060302, 2026060303];
const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  reminderTimes: ["09:00", "12:00", "21:00"],
};

const DEFAULT_PEOPLE = [
  "Mehmet",
  "Binalı",
  "Rıdvan",
  "Hatice",
  "Ayşe",
  "Muhammed",
  "Zeynep",
  "Meryem",
  "Abdullah",
  "Zehra",
  "Abdulkerim",
  "Ömer",
  "Oğuzcan",
  "Tarık Yasin",
  "Betül",
  "Kerem",
];

const ADULT_BMI = {
  severeThin: 16,
  moderateThin: 17,
  normalLow: 18.5,
  normalHigh: 25,
  overweightHigh: 30,
  obeseClass2: 35,
  obeseClass3: 40,
};

const MONTHLY_LOSS_PRIZE = 1000;

const QUOTE_SOURCE =
  "Tartı yalan söylemez. Buzdolabını açmak bir aktivite değildir. Aç değilsin. Sadece mutfağın önünden geçiyorsun. Tartıdan kaçmak, sonucu değiştirmez. Her gün 500 kalori fazla, 15 günde 1 kilo aldırır. 1 kutu kola ≈ 7-8 küp şeker demek. Bir tabak patates kızartması ≈ 1 saat yürüyüş demek. 100 g sütlü çikolata ≈ 500 kalori. 1 kilo 7700 kaloriye denk gelir. Aç değilsin sadece canın sıkılıyor. Elindeki ekmeği sessizce yerine bırak. Kimse fark etmedi. Ekmeği tamamen bırak. Ekmeği dün bırakmadın bugün bırak. Son öğünde bir dilim ekmek yedin yemesen aç kalmazdın. Neden ekmek yiyiyorum diye sor kendine. Tebrikler ekmeği bıraktın. Küçük alışkanlıklar büyük değişimler üretir. 10 dakikalık yürüyüş bile iştahı azaltır. Susuzluk bazen açlık gibi hissedilebilir BOL SU İÇ. Acıktın mı o zaman su iç. Hedefine az kaldı bugün başlarsan. Sadece tadına bakacağım yasaklı bir söz unutma. Hedef kilon seni bekliyor. Bugün başlamak için mükemmel gün. Her öğün yeni bir başlangıçtır. 500 kaloriyi yemek 5 dakika, yakmak saatler sürebilir. Ekmek olmadan da yemek yenebilir. Bir tabak salata, bir avuç cipsle aynı kalori. Her öğünde 4 dilim ekmeği çıkarırsan günde yaklaşık 840 kalori demek yani 1 haftada bir kilo verirsin. Her öğün iki dilim ekmek yememek 6 ayda 10 kiloya denk gelir. Kalori açığı oluştur.";

const DAILY_QUOTES = QUOTE_SOURCE.split(".")
  .map((quote) => quote.trim())
  .filter(Boolean);

const MEAL_PLAN_RANGES = [
  {
    id: "low",
    title: "1000-1500 kalori",
    subtitle: "Hafif günlük plan",
    plans: [
      {
        calories: "Yaklaşık 1250 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "520 kcal", items: ["2 haşlanmış yumurta", "Beyaz peynir", "Domates, salatalık, yeşillik"] },
          { title: "Ana öğün 2", calories: "560 kcal", items: ["Tavuklu sebze sote", "4 kaşık bulgur", "1 kase yoğurt"] },
        ],
        snacks: ["1 elma", "10 badem", "Şekersiz çay veya kahve"],
      },
      {
        calories: "Yaklaşık 1350 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "560 kcal", items: ["Menemen", "1 dilim ekmek", "Salatalık ve maydanoz"] },
          { title: "Ana öğün 2", calories: "620 kcal", items: ["Mercimek çorbası", "Yoğurtlu salata", "4 kaşık bulgur"] },
        ],
        snacks: ["1 mandalina", "1 avuç leblebi"],
      },
      {
        calories: "Yaklaşık 1180 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "500 kcal", items: ["1 kase yoğurt", "Yarım muz", "2 ceviz içi", "Tarçın"] },
          { title: "Ana öğün 2", calories: "540 kcal", items: ["Izgara köfte", "Çoban salata", "1 kase cacık"] },
        ],
        snacks: ["Salatalık ve havuç", "1 küçük armut", "5 ceviz içi"],
      },
      {
        calories: "Yaklaşık 1450 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "640 kcal", items: ["Menemen", "1 dilim ekmek", "Beyaz peynir"] },
          { title: "Ana öğün 2", calories: "630 kcal", items: ["Kabak veya taze fasulye yemeği", "Yoğurt", "Bol salata"] },
        ],
        snacks: ["1 bardak süt", "1 portakal"],
      },
      {
        calories: "Yaklaşık 1300 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "540 kcal", items: ["Peynirli omlet", "Domates salatalık", "1 dilim ekmek"] },
          { title: "Ana öğün 2", calories: "600 kcal", items: ["Haşlanmış tavuk", "Yoğurt", "Marul salatası"] },
        ],
        snacks: ["1 elma veya armut", "8 fındık"],
      },
    ],
  },
  {
    id: "balanced",
    title: "1500-2000 kalori",
    subtitle: "Daha tok tutan günlük plan",
    plans: [
      {
        calories: "Yaklaşık 1750 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "760 kcal", items: ["2 yumurta", "Peynir", "Zeytin", "Bol yeşillik", "2 dilim ekmek"] },
          { title: "Ana öğün 2", calories: "780 kcal", items: ["Izgara köfte", "Bulgur pilavı", "Cacık", "Mevsim salata"] },
        ],
        snacks: ["1 kase yoğurt", "1 elma", "10 badem"],
      },
      {
        calories: "Yaklaşık 1850 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "780 kcal", items: ["Tavuklu sandviç", "Ayran", "Bol yeşillik"] },
          { title: "Ana öğün 2", calories: "850 kcal", items: ["Kuru fasulye", "4 kaşık pilav", "Yoğurt", "Salata"] },
        ],
        snacks: ["1 muz", "1 bardak süt"],
      },
      {
        calories: "Yaklaşık 1650 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "700 kcal", items: ["1 kase yoğurt", "Muz", "Ceviz", "1 dilim ekmek"] },
          { title: "Ana öğün 2", calories: "760 kcal", items: ["Tavuk şiş veya tavuk sote", "6 kaşık bulgur", "Bol salata", "Ayran"] },
        ],
        snacks: ["1 portakal", "1 haşlanmış yumurta"],
      },
      {
        calories: "Yaklaşık 1950 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "820 kcal", items: ["Peynirli omlet", "Domates salatalık", "2 dilim ekmek", "Ayran"] },
          { title: "Ana öğün 2", calories: "920 kcal", items: ["Kuru fasulye", "4 kaşık pilav", "Yoğurt", "Salata"] },
        ],
        snacks: ["1 avuç leblebi", "1 armut"],
      },
      {
        calories: "Yaklaşık 1700 kcal",
        mains: [
          { title: "Ana öğün 1", calories: "720 kcal", items: ["Peynirli tost", "Domates salatalık", "Ayran"] },
          { title: "Ana öğün 2", calories: "780 kcal", items: ["Sebzeli kıyma yemeği", "Yoğurt", "Karışık salata", "3 kaşık bulgur"] },
        ],
        snacks: ["1 bardak süt", "12 badem"],
      },
    ],
  },
];

const state = {
  people: [],
  selectedId: null,
  query: "",
  sortBy: "age",
  themeChoice: getStoredThemeChoice(),
  notificationSettings: getStoredNotificationSettings(),
  activeView: "tracking",
};

let dataStore;
let realtimeChannel = null;
let webReminderTimer = null;
let birthDateColumnAvailable = true;

const els = {
  grid: document.querySelector("#peopleGrid"),
  template: document.querySelector("#personCardTemplate"),
  totalPeople: document.querySelector("#totalPeople"),
  trackedPeople: document.querySelector("#trackedPeople"),
  healthyPeople: document.querySelector("#healthyPeople"),
  familyLossTarget: document.querySelector("#familyLossTarget"),
  monthLoserName: document.querySelector("#monthLoserName"),
  monthLoserAmount: document.querySelector("#monthLoserAmount"),
  monthGainerName: document.querySelector("#monthGainerName"),
  monthGainerAmount: document.querySelector("#monthGainerAmount"),
  addPersonForm: document.querySelector("#addPersonForm"),
  personName: document.querySelector("#personName"),
  searchPeople: document.querySelector("#searchPeople"),
  sortButtons: document.querySelectorAll("button[data-sort-choice]"),
  dialog: document.querySelector("#personDialog"),
  dialogClose: document.querySelector("#dialogClose"),
  dialogBottomClose: document.querySelector("#dialogBottomClose"),
  dialogLayout: document.querySelector(".dialog-layout"),
  dialogName: document.querySelector("#dialogName"),
  dialogBmi: document.querySelector("#dialogBmi"),
  dialogPointer: document.querySelector("#dialogPointer"),
  dialogRecommendation: document.querySelector("#dialogRecommendation"),
  calorieTitle: document.querySelector("#calorieTitle"),
  calorieTarget: document.querySelector("#calorieTarget"),
  calorieNote: document.querySelector("#calorieNote"),
  rewardTotal: document.querySelector("#rewardTotal"),
  rewardBreakdown: document.querySelector("#rewardBreakdown"),
  profileSummary: document.querySelector("#profileSummary"),
  profileSummaryText: document.querySelector("#profileSummaryText"),
  editProfile: document.querySelector("#editProfile"),
  profileForm: document.querySelector("#profileForm"),
  birthDateInput: document.querySelector("#birthDateInput"),
  heightInput: document.querySelector("#heightInput"),
  genderInput: document.querySelector("#genderInput"),
  weightForm: document.querySelector("#weightForm"),
  dateInput: document.querySelector("#dateInput"),
  weightInput: document.querySelector("#weightInput"),
  chart: document.querySelector("#weightChart"),
  emptyChart: document.querySelector("#emptyChart"),
  historyList: document.querySelector("#historyList"),
  deletePerson: document.querySelector("#deletePerson"),
  exportData: document.querySelector("#exportData"),
  importData: document.querySelector("#importData"),
  importFile: document.querySelector("#importFile"),
  storageStatus: document.querySelector("#storageStatus"),
  dailyQuote: document.querySelector("#dailyQuote"),
  themeButtons: document.querySelectorAll("button[data-theme-choice]"),
  viewButtons: document.querySelectorAll("button[data-view-tab]"),
  trackingView: document.querySelector("#trackingView"),
  mealMenuView: document.querySelector("#mealMenuView"),
  mealMenuDate: document.querySelector("#mealMenuDate"),
  mealPlanGrid: document.querySelector("#mealPlanGrid"),
};

els.addPersonForm.addEventListener("submit", addPerson);
els.searchPeople.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLocaleLowerCase("tr-TR");
  render();
});
els.sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.sortBy = button.dataset.sortChoice;
    renderPeople();
    updateSortButtons();
  });
});
els.profileForm.addEventListener("submit", saveProfile);
els.weightForm.addEventListener("submit", addWeight);
els.deletePerson.addEventListener("click", deleteSelectedPerson);
els.dialogClose.addEventListener("click", closePersonDialog);
els.dialogBottomClose.addEventListener("click", closePersonDialog);
els.dialog.addEventListener("cancel", closePersonDialog);
els.dialog.addEventListener("close", () => {
  state.selectedId = null;
});
els.exportData.addEventListener("click", exportData);
els.importData.addEventListener("click", () => els.importFile.click());
els.importFile.addEventListener("change", importData);
els.editProfile.addEventListener("click", showProfileForm);
els.genderInput.addEventListener("change", updateProfileFieldsForSpecies);
els.themeButtons.forEach((button) => {
  button.addEventListener("click", () => setThemeChoice(button.dataset.themeChoice));
});
els.viewButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.viewTab));
});
window.addEventListener("resize", () => renderChart(getSelectedPerson()));
window.addEventListener("focus", () => {
  syncDateInput();
  syncScheduledTheme();
  checkWebReminder();
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    syncDateInput();
    syncScheduledTheme();
    checkWebReminder();
  }
});

syncDateInput();
syncScheduledTheme();
setWelcomeQuote();
startWebReminderTicker();
setInterval(() => {
  syncDateInput();
  syncScheduledTheme();
  renderMealMenu();
  checkWebReminder();
}, 60000);
init();

function createPerson(name) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name,
    age: "",
    birthDate: "",
    heightCm: "",
    gender: "",
    weights: [],
  };
}

function setWelcomeQuote() {
  if (!els.dailyQuote || DAILY_QUOTES.length === 0) return;
  const quote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
  els.dailyQuote.textContent = `${quote}.`;
}

function syncScheduledTheme() {
  const theme = getEffectiveTheme();
  const previousTheme = document.documentElement.dataset.theme;

  document.documentElement.dataset.themeChoice = state.themeChoice;
  updateThemeButtons();
  if (previousTheme === theme) return;
  document.documentElement.dataset.theme = theme;
  renderChart(getSelectedPerson());
}

function getEffectiveTheme() {
  return state.themeChoice === "auto" ? getScheduledTheme() : state.themeChoice;
}

function getScheduledTheme(date = new Date()) {
  const hour = date.getHours();
  return hour >= DARK_MODE_START_HOUR || hour < DARK_MODE_END_HOUR ? "dark" : "light";
}

function setThemeChoice(choice) {
  if (!THEME_CHOICES.includes(choice)) return;
  state.themeChoice = choice;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch (error) {}
  syncScheduledTheme();
}

function getStoredThemeChoice() {
  try {
    const choice = localStorage.getItem(THEME_STORAGE_KEY);
    if (THEME_CHOICES.includes(choice)) return choice;
  } catch (error) {}
  return "auto";
}

function getStoredNotificationSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(NOTIFICATION_SETTINGS_KEY));
    if (!saved || typeof saved !== "object") return { ...DEFAULT_NOTIFICATION_SETTINGS };
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      enabled: saved.enabled !== false,
      reminderTimes: getReminderTimes(saved),
    };
  } catch {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }
}

function saveNotificationSettings() {
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(state.notificationSettings));
}

function updateThemeButtons() {
  els.themeButtons.forEach((button) => {
    const isActive = button.dataset.themeChoice === state.themeChoice;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateSortButtons() {
  els.sortButtons.forEach((button) => {
    const isActive = button.dataset.sortChoice === state.sortBy;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

async function init() {
  dataStore = await createDataStore();
  setStorageStatus(dataStore.label, dataStore.mode);

  try {
    state.people = await dataStore.loadPeople();
  } catch (error) {
    console.error(error);
    alert("Veriler yüklenemedi. Bağlantı ayarlarını kontrol edin.");
    state.people = [];
  }

  render();
  setupRealtimeSync();
  await syncNotificationRuntime();
}

async function createDataStore() {
  const config = window.BMI_APP_CONFIG || {};
  const hasSupabaseConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey);

  if (!hasSupabaseConfig) {
    return createLocalStore();
  }

  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    const client = createClient(config.supabaseUrl, config.supabaseAnonKey);
    return createSupabaseStore(client);
  } catch (error) {
    console.error(error);
    alert("Supabase bağlantısı kurulamadı. Site cihaz içi kayıt modunda açıldı.");
    return createLocalStore();
  }
}

function createLocalStore() {
  return {
    mode: "local",
    label: "Cihaz içi kayıt",
    async loadPeople() {
      const fallback = DEFAULT_PEOPLE.map((name) => createPerson(name));

      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(saved) || saved.length === 0) return fallback;

        return saved.map((person) => ({
          ...createPerson(person.name || "İsimsiz"),
          ...person,
          weights: Array.isArray(person.weights) ? person.weights : [],
        }));
      } catch {
        return fallback;
      }
    },
    async createPerson(person) {
      saveLocalPeople([...state.people, person]);
      return person;
    },
    async savePerson(person) {
      const people = state.people.map((item) => (item.id === person.id ? person : item));
      saveLocalPeople(people);
      return person;
    },
    async deletePerson(id) {
      saveLocalPeople(state.people.filter((person) => person.id !== id));
    },
    async upsertWeight(personId, entry) {
      const person = state.people.find((item) => item.id === personId);
      if (!person) return entry;
      const existing = person.weights.find((item) => item.date === entry.date);
      if (existing) existing.kg = entry.kg;
      else person.weights.push(entry);
      saveLocalPeople(state.people);
      return entry;
    },
    async deleteWeight(personId, entry) {
      const person = state.people.find((item) => item.id === personId);
      if (!person) return;
      person.weights = person.weights.filter((item) => item.date !== entry.date);
      saveLocalPeople(state.people);
    },
    async replaceAll(people) {
      saveLocalPeople(people);
      return people;
    },
  };
}

function saveLocalPeople(people) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

function createSupabaseStore(client) {
  return {
    mode: "online",
    label: "Ortak veritabanı",
    async loadPeople() {
      await ensureDefaultPeople(client);
      return fetchSupabasePeople(client);
    },
    async createPerson(person) {
      const { data, error } = await client.from("people").insert({ name: person.name }).select(getPeopleSelectColumns()).single();
      if (error) throw error;
      return mapSupabasePerson(data);
    },
    async savePerson(person) {
      if (person.birthDate && !birthDateColumnAvailable) {
        alert("Doğum tarihi kaydı için Supabase SQL güncellemesini çalıştırmanız gerekiyor.");
      }

      const { error } = await client
        .from("people")
        .update(getPeoplePayload(person))
        .eq("id", person.id);
      if (error) throw error;
      return person;
    },
    async deletePerson(id) {
      const { error } = await client.from("people").delete().eq("id", id);
      if (error) throw error;
    },
    async upsertWeight(personId, entry) {
      const { data, error } = await client
        .from("weight_entries")
        .upsert(
          {
            person_id: personId,
            entry_date: entry.date,
            kg: entry.kg,
          },
          { onConflict: "person_id,entry_date" },
        )
        .select("id,entry_date,kg")
        .single();
      if (error) throw error;
      return mapSupabaseWeight(data);
    },
    async deleteWeight(personId, entry) {
      const query = client.from("weight_entries").delete();
      const { error } = entry.id
        ? await query.eq("id", entry.id)
        : await query.eq("person_id", personId).eq("entry_date", entry.date);
      if (error) throw error;
    },
    async replaceAll(people) {
      for (const person of people) {
        const savedPerson = await this.createPersonIfMissing(person);
        for (const entry of person.weights || []) {
          await this.upsertWeight(savedPerson.id, entry);
        }
      }
      return fetchSupabasePeople(client);
    },
    async createPersonIfMissing(person) {
      const { data, error } = await client
        .from("people")
        .upsert(
          {
            name: person.name,
            ...getPeoplePayload(person),
          },
          { onConflict: "name" },
        )
        .select(getPeopleSelectColumns())
        .single();
      if (error) throw error;
      return mapSupabasePerson(data);
    },
    subscribeToWeightChanges(callback) {
      return client
        .channel("family-weight-entries")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "weight_entries",
          },
          callback,
        )
        .subscribe();
    },
  };
}

async function ensureDefaultPeople(client) {
  const { error } = await client.from("people").upsert(DEFAULT_PEOPLE.map((name) => ({ name })), {
    onConflict: "name",
    ignoreDuplicates: true,
  });
  if (error) throw error;
}

async function fetchSupabasePeople(client) {
  let response = await client.from("people").select(getPeopleSelectColumns()).order("name", { ascending: true });

  if (response.error && isMissingBirthDateError(response.error)) {
    birthDateColumnAvailable = false;
    setStorageStatus("Ortak DB: SQL güncellemesi gerekli", "online");
    response = await client.from("people").select(getPeopleSelectColumns()).order("name", { ascending: true });
  }

  const { data, error } = response;
  if (error) throw error;
  return data.map(mapSupabasePerson);
}

function getPeopleSelectColumns() {
  const birthDateColumn = birthDateColumnAvailable ? "birth_date," : "";
  return `id,name,age,${birthDateColumn}height_cm,gender,weight_entries(id,entry_date,kg)`;
}

function getPeoplePayload(person) {
  const payload = {
    height_cm: isCat(person) ? null : person.heightCm || null,
    gender: person.gender || null,
  };

  if (birthDateColumnAvailable) {
    payload.birth_date = isCat(person) ? null : person.birthDate || null;
    payload.age = person.birthDate || isCat(person) ? null : person.age || null;
  } else {
    payload.age = isCat(person) ? null : person.age || null;
  }

  return payload;
}

function isMissingBirthDateError(error) {
  const message = `${error.message || ""} ${error.details || ""} ${error.hint || ""}`;
  return message.includes("birth_date") && (message.includes("column") || message.includes("schema cache"));
}

function mapSupabasePerson(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age ?? "",
    birthDate: row.birth_date ?? "",
    heightCm: row.height_cm ?? "",
    gender: row.gender ?? "",
    weights: (row.weight_entries || []).map(mapSupabaseWeight).sort((a, b) => a.date.localeCompare(b.date)),
  };
}

function mapSupabaseWeight(row) {
  return {
    id: row.id,
    date: row.entry_date,
    kg: Number(row.kg),
  };
}

function setStorageStatus(label, mode) {
  els.storageStatus.textContent = label;
  els.storageStatus.classList.toggle("online", mode === "online");
  els.storageStatus.classList.toggle("local", mode === "local");
}

async function syncNotificationRuntime() {
  startWebReminderTicker();
  if (!isNotificationSupported()) return;

  const granted = await requestNotificationPermission();
  state.notificationSettings.enabled = granted;
  saveNotificationSettings();
  if (granted) await scheduleDailyReminder();
}

function isNotificationSupported() {
  return Boolean(getLocalNotificationsPlugin() || "Notification" in window);
}

function getLocalNotificationsPlugin() {
  return window.Capacitor?.Plugins?.LocalNotifications || null;
}

async function requestNotificationPermission() {
  const localNotifications = getLocalNotificationsPlugin();
  if (localNotifications?.requestPermissions) {
    try {
      const permission = await localNotifications.requestPermissions();
      return permission.display === "granted";
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

async function hasNotificationPermission() {
  const localNotifications = getLocalNotificationsPlugin();
  if (localNotifications?.checkPermissions) {
    try {
      const permission = await localNotifications.checkPermissions();
      return permission.display === "granted";
    } catch {
      return false;
    }
  }

  return "Notification" in window && Notification.permission === "granted";
}

async function scheduleDailyReminder() {
  if (!state.notificationSettings.enabled) return;

  const localNotifications = getLocalNotificationsPlugin();
  if (!localNotifications?.schedule) return;

  try {
    await localNotifications.cancel({
      notifications: REMINDER_NOTIFICATION_IDS.map((id) => ({ id })),
    });
  } catch {}

  await localNotifications.schedule({
    notifications: getReminderTimes(state.notificationSettings).map((timeValue, index) => ({
        id: REMINDER_NOTIFICATION_IDS[index],
        title: "Kilo hatırlatması",
        body: "Bugünkü kilonu girmelisin.",
        schedule: {
          at: getNextReminderDate(timeValue),
          repeats: true,
          every: "day",
        },
      })),
  });
}

async function showAppNotification(title, body, options = {}) {
  if (!options.force && !state.notificationSettings.enabled) return;
  if (!options.force && !(await hasNotificationPermission())) return;

  const localNotifications = getLocalNotificationsPlugin();
  if (localNotifications?.schedule) {
    await localNotifications.schedule({
      notifications: [
        {
          id: getNotificationId(),
          title,
          body,
          schedule: { at: new Date(Date.now() + 250) },
        },
      ],
    });
    return;
  }

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

function startWebReminderTicker() {
  if (webReminderTimer) clearInterval(webReminderTimer);
  webReminderTimer = setInterval(checkWebReminder, 60000);
  checkWebReminder();
}

async function checkWebReminder() {
  if (!state.notificationSettings.enabled || getLocalNotificationsPlugin()) return;
  if (!(await hasNotificationPermission())) return;

  const now = new Date();
  const today = getTodayInputValue();
  const current = now.getHours() * 60 + now.getMinutes();
  const sentSlots = getSentWebReminderSlots();

  for (const timeValue of getReminderTimes(state.notificationSettings)) {
    const target = timeToMinutes(timeValue);
    if (sentSlots[timeValue] === today || current < target || current > target + 5) continue;
    sentSlots[timeValue] = today;
    localStorage.setItem(WEB_REMINDER_LAST_KEY, JSON.stringify(sentSlots));
    await showAppNotification("Kilo hatırlatması", "Bugünkü kilonu girmelisin.");
  }
}

function setupRealtimeSync() {
  if (realtimeChannel || !dataStore?.subscribeToWeightChanges) return;
  realtimeChannel = dataStore.subscribeToWeightChanges(handleRemoteWeightChange);
}

async function handleRemoteWeightChange(payload) {
  const row = payload.new || payload.old;
  if (!row?.person_id) return;

  const selectedId = state.selectedId;

  try {
    state.people = await dataStore.loadPeople();
    render();
    if (els.dialog.open && selectedId) {
      const selectedPerson = getSelectedPerson();
      if (selectedPerson) renderDialog(selectedPerson);
      else els.dialog.close();
    }
  } catch (error) {
    console.error(error);
  }
}

function getNextReminderDate(timeValue) {
  const [hour, minute] = timeValue.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  if (date <= new Date()) date.setDate(date.getDate() + 1);
  return date;
}

function getNotificationId() {
  return Math.floor(Date.now() % 1000000000);
}

function isValidTimeValue(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function getReminderTimes(settings = {}) {
  if (Array.isArray(settings.reminderTimes)) {
    const times = settings.reminderTimes.filter(isValidTimeValue);
    if (times.length) return times;
  }

  return DEFAULT_NOTIFICATION_SETTINGS.reminderTimes;
}

function getSentWebReminderSlots() {
  try {
    const saved = JSON.parse(localStorage.getItem(WEB_REMINDER_LAST_KEY));
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function timeToMinutes(value) {
  if (!isValidTimeValue(value)) return timeToMinutes(DEFAULT_NOTIFICATION_SETTINGS.reminderTimes[0]);
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

async function addPerson(event) {
  event.preventDefault();
  const name = els.personName.value.trim();
  if (!name) return;

  const exists = state.people.some((person) => person.name.toLocaleLowerCase("tr-TR") === name.toLocaleLowerCase("tr-TR"));
  if (exists) {
    els.personName.select();
    return;
  }

  try {
    const person = await dataStore.createPerson(createPerson(name));
    state.people.push(person);
    state.selectedId = person.id;
    els.personName.value = "";
    render();
    openPerson(person.id);
  } catch (error) {
    console.error(error);
    alert("Kişi eklenemedi. Bağlantıyı ve veritabanı izinlerini kontrol edin.");
  }
}

async function saveProfile(event) {
  event.preventDefault();
  const person = getSelectedPerson();
  if (!person) return;

  person.gender = els.genderInput.value;
  person.birthDate = person.gender === "kedi" ? "" : els.birthDateInput.value;
  person.age = person.birthDate || person.gender === "kedi" ? "" : person.age;
  person.heightCm = person.gender === "kedi" ? "" : numberOrEmpty(els.heightInput.value);

  try {
    await dataStore.savePerson(person);
    render();
    renderDialog(person);
  } catch (error) {
    console.error(error);
    alert("Profil kaydedilemedi. Bağlantıyı ve veritabanı izinlerini kontrol edin.");
  }
}

async function addWeight(event) {
  event.preventDefault();
  const person = getSelectedPerson();
  if (!person) return;

  syncDateInput();
  const date = getTodayInputValue();
  const kg = Number.parseFloat(els.weightInput.value.replace(",", "."));
  if (!Number.isFinite(kg) || kg <= 0) return;

  try {
    const savedEntry = await dataStore.upsertWeight(person.id, { date, kg });
    const existing = person.weights.find((entry) => entry.date === date);
    if (existing) {
      existing.id = savedEntry.id || existing.id;
      existing.kg = savedEntry.kg;
    } else {
      person.weights.push(savedEntry);
    }

    person.weights.sort((a, b) => a.date.localeCompare(b.date));
    els.weightInput.value = "";
    render();
    renderDialog(person);
  } catch (error) {
    console.error(error);
    alert("Kilo kaydı eklenemedi. Bağlantıyı ve veritabanı izinlerini kontrol edin.");
  }
}

async function deleteSelectedPerson() {
  const person = getSelectedPerson();
  if (!person) return;

  const ok = confirm(`${person.name} kaydı silinsin mi?`);
  if (!ok) return;

  try {
    await dataStore.deletePerson(person.id);
    state.people = state.people.filter((item) => item.id !== person.id);
    state.selectedId = null;
    els.dialog.close();
    render();
  } catch (error) {
    console.error(error);
    alert("Kişi silinemedi. Bağlantıyı ve veritabanı izinlerini kontrol edin.");
  }
}

function render() {
  renderSummary();
  renderMonthlyLeaders();
  renderPeople();
  renderMealMenu();
  syncActiveView();
  updateSortButtons();
}

function setActiveView(view) {
  if (!["tracking", "meals"].includes(view)) return;
  state.activeView = view;
  syncActiveView();
  if (view === "meals") renderMealMenu();
}

function syncActiveView() {
  els.trackingView.hidden = state.activeView !== "tracking";
  els.mealMenuView.hidden = state.activeView !== "meals";
  els.viewButtons.forEach((button) => {
    const isActive = button.dataset.viewTab === state.activeView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderMealMenu() {
  if (!els.mealPlanGrid) return;

  const today = getTodayInputValue();
  const dayNumber = dateToDayNumber(today);
  els.mealMenuDate.textContent = formatLongDate(today);
  els.mealPlanGrid.innerHTML = "";

  MEAL_PLAN_RANGES.forEach((range, rangeIndex) => {
    const plan = range.plans[(dayNumber + rangeIndex * 2) % range.plans.length];
    els.mealPlanGrid.appendChild(createMealPlanCard(range, plan));
  });
}

function createMealPlanCard(range, plan) {
  const card = document.createElement("article");
  card.className = "meal-plan-card";

  const header = document.createElement("div");
  header.className = "meal-plan-card-head";

  const titleWrap = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = range.title;
  const subtitle = document.createElement("p");
  subtitle.textContent = range.subtitle;
  titleWrap.append(title, subtitle);

  const calories = document.createElement("span");
  calories.textContent = plan.calories;
  header.append(titleWrap, calories);
  card.appendChild(header);

  const meals = document.createElement("div");
  meals.className = "meal-blocks";
  plan.mains.forEach((meal) => meals.appendChild(createMealBlock(meal.title, meal.calories, meal.items)));
  meals.appendChild(createMealBlock("Ara öğünler", "", plan.snacks));
  card.appendChild(meals);

  return card;
}

function createMealBlock(titleText, caloriesText, items) {
  const block = document.createElement("section");
  block.className = "meal-block";

  const heading = document.createElement("div");
  heading.className = "meal-block-head";
  const title = document.createElement("h4");
  title.textContent = titleText;
  heading.appendChild(title);
  if (caloriesText) {
    const calories = document.createElement("span");
    calories.textContent = caloriesText;
    heading.appendChild(calories);
  }
  block.appendChild(heading);

  const list = document.createElement("ul");
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });
  block.appendChild(list);

  return block;
}

function renderSummary() {
  const tracked = state.people.filter((person) => getLatestWeight(person) && (person.heightCm || isCat(person)));
  const healthy = tracked.filter((person) => {
    const status = getHealthStatus(person);
    return status.label === "İdeal";
  });
  const familyLossTarget = state.people.reduce((total, person) => total + getWeightToLose(person), 0);

  els.totalPeople.textContent = state.people.length;
  els.trackedPeople.textContent = tracked.length;
  els.healthyPeople.textContent = healthy.length;
  els.familyLossTarget.textContent = formatKg(familyLossTarget);
}

function renderMonthlyLeaders() {
  const leaders = getMonthlyWeightLeaders();
  const loser = leaders.loser;
  const gainer = leaders.gainer;

  els.monthLoserName.textContent = loser ? loser.name : "Kimse yok";
  els.monthLoserAmount.textContent = loser ? formatKg(loser.amount) : "0 kg";
  els.monthGainerName.textContent = gainer ? gainer.name : "Kimse yok";
  els.monthGainerAmount.textContent = gainer ? formatKg(gainer.amount) : "0 kg";
}

function getMonthlyWeightLeaders() {
  const today = new Date(`${getTodayInputValue()}T12:00:00`);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1, 12);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1, 12);
  const monthStartValue = dateToInputValue(monthStart);
  const nextMonthStartValue = dateToInputValue(nextMonthStart);

  const changes = state.people
    .map((person) => getMonthlyWeightChange(person, monthStartValue, nextMonthStartValue))
    .filter(Boolean);

  const loser = changes
    .filter((change) => change.delta < 0)
    .sort((a, b) => a.delta - b.delta || a.name.localeCompare(b.name, "tr"))[0];
  const gainer = changes
    .filter((change) => change.delta > 0)
    .sort((a, b) => b.delta - a.delta || a.name.localeCompare(b.name, "tr"))[0];

  return {
    loser: loser ? { name: loser.name, amount: Math.abs(loser.delta) } : null,
    gainer: gainer ? { name: gainer.name, amount: gainer.delta } : null,
  };
}

function getMonthlyWeightChange(person, monthStartValue, nextMonthStartValue) {
  const entries = [...person.weights].sort((a, b) => a.date.localeCompare(b.date));
  const monthEntries = entries.filter((entry) => entry.date >= monthStartValue && entry.date < nextMonthStartValue);
  if (!monthEntries.length) return null;

  const baseline = [...entries].reverse().find((entry) => entry.date < monthStartValue) || monthEntries[0];
  const latest = monthEntries[monthEntries.length - 1];

  return {
    personId: person.id,
    name: person.name,
    delta: latest.kg - baseline.kg,
  };
}

function renderPeople() {
  els.grid.innerHTML = "";

  const people = state.people
    .filter((person) => person.name.toLocaleLowerCase("tr-TR").includes(state.query))
    .sort(comparePeople);

  people.forEach((person) => {
    const fragment = els.template.content.cloneNode(true);
    const card = fragment.querySelector(".person-card");
    const status = getHealthStatus(person);
    const latestWeight = getLatestWeight(person);
    const rewards = getRewardSummary(person);
    const pointer = fragment.querySelector(".meter-pointer");

    card.dataset.id = person.id;
    card.querySelector("h2").textContent = person.name;
    card.querySelector(".person-meta").textContent = getPersonMeta(person);
    const statusChip = card.querySelector(".status-chip");
    const statusValue = card.querySelector(".bmi-value");
    statusChip.textContent = status.badge;
    statusChip.hidden = !status.badge;
    if (status.color) statusChip.classList.add(status.color);
    statusValue.textContent = status.label;
    if (status.color) statusValue.classList.add(status.color);
    card.querySelector(".latest-weight").textContent = latestWeight ? `${formatNumber(latestWeight.kg)} kg` : "Kilo yok";
    card.querySelector(".recommendation").textContent = getRecommendation(person);
    card.querySelector(".reward-total").textContent = `${formatCurrency(rewards.total)} kazandı`;
    card.querySelector(".reward-detail").textContent = getRewardCardText(rewards);
    setMeter(pointer, status, person);

    card.addEventListener("click", () => openPerson(person.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPerson(person.id);
      }
    });
    els.grid.appendChild(fragment);
  });
}

function comparePeople(a, b) {
  if (state.sortBy === "ideal") {
    return compareNullableAsc(getIdealDistanceScore(a), getIdealDistanceScore(b)) || a.name.localeCompare(b.name, "tr");
  }

  if (state.sortBy === "weight") {
    return (
      compareNullableDesc(getLatestWeight(a)?.kg ?? null, getLatestWeight(b)?.kg ?? null) ||
      a.name.localeCompare(b.name, "tr")
    );
  }

  const ageA = calculateAge(a);
  const ageB = calculateAge(b);

  if (ageA !== null && ageB !== null && ageA !== ageB) return ageB - ageA;
  if (ageA !== null && ageB === null) return -1;
  if (ageA === null && ageB !== null) return 1;
  return a.name.localeCompare(b.name, "tr");
}

function compareNullableAsc(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}

function compareNullableDesc(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b - a;
}

function getIdealDistanceScore(person) {
  const latestWeight = getLatestWeight(person);
  if (!latestWeight) return null;
  if (isCat(person)) return latestWeight.kg < 10 ? 0 : latestWeight.kg - 10;

  const bmi = calculateBmi(person);
  if (!bmi) return null;
  const range = getIdealBmiRange(person, latestWeight.date);
  if (bmi >= range.low && bmi < range.high) return 0;
  if (bmi < range.low) return range.low - bmi;
  return bmi - range.high;
}

function getWorstHealthScore(person) {
  const latestWeight = getLatestWeight(person);
  if (!latestWeight) return null;
  if (isCat(person)) return latestWeight.kg < 10 ? 0 : 100 + latestWeight.kg - 10;

  const bmi = calculateBmi(person);
  if (!bmi) return null;
  const range = getIdealBmiRange(person, latestWeight.date);
  if (bmi >= range.high) return 100 + bmi - range.high;
  if (bmi < range.low) return range.low - bmi;
  return 0;
}

function openPerson(id) {
  state.selectedId = id;
  const person = getSelectedPerson();
  if (!person) return;

  renderDialog(person);
  if (!els.dialog.open) els.dialog.showModal();
}

function closePersonDialog(event) {
  event?.preventDefault();
  if (els.dialog.open) els.dialog.close();
  state.selectedId = null;
}

function renderDialog(person) {
  const status = getHealthStatus(person);
  const profileComplete = isProfileComplete(person);
  els.dialogName.textContent = person.name;
  els.dialogBmi.textContent = status.label ? `Durum: ${status.label}` : "Durum: Kilo girilince gösterilecek";
  els.dialogRecommendation.textContent = getRecommendation(person);
  renderCalories(person);
  renderRewards(person);
  els.dialogLayout.classList.toggle("profile-complete-mode", profileComplete);
  els.profileForm.hidden = profileComplete;
  els.profileSummary.hidden = !profileComplete;
  els.profileSummaryText.textContent = getProfileSummary(person);
  els.birthDateInput.value = person.birthDate ?? "";
  els.heightInput.value = person.heightCm ?? "";
  els.genderInput.value = person.gender ?? "";
  updateProfileFieldsForSpecies();
  syncDateInput();
  setMeter(els.dialogPointer, status, person);
  renderHistory(person);
  renderChart(person);
}

function showProfileForm() {
  els.profileForm.hidden = false;
  els.profileSummary.hidden = true;
  els.dialogLayout.classList.remove("profile-complete-mode");
  updateProfileFieldsForSpecies();
  if (els.genderInput.value === "kedi") els.genderInput.focus();
  else els.birthDateInput.focus();
}

function updateProfileFieldsForSpecies() {
  const catMode = els.genderInput.value === "kedi";
  document.querySelectorAll(".human-field").forEach((field) => {
    field.hidden = catMode;
  });
  els.birthDateInput.disabled = catMode;
  els.heightInput.disabled = catMode;
}

function renderHistory(person) {
  els.historyList.innerHTML = "";
  const entries = [...person.weights].sort((a, b) => b.date.localeCompare(a.date));

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Henüz kilo kaydı yok.";
    els.historyList.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement("li");
    const date = document.createElement("span");
    const weight = document.createElement("strong");
    const remove = document.createElement("button");

    date.textContent = formatLongDate(entry.date);
    weight.textContent = `${formatNumber(entry.kg)} kg`;
    remove.className = "delete-record";
    remove.type = "button";
    remove.title = "Kaydı sil";
    remove.setAttribute("aria-label", `${formatLongDate(entry.date)} kaydını sil`);
    remove.textContent = "×";
    remove.addEventListener("click", async () => {
      try {
        await dataStore.deleteWeight(person.id, entry);
        person.weights = person.weights.filter((itemEntry) => itemEntry.date !== entry.date);
        render();
        renderDialog(person);
      } catch (error) {
        console.error(error);
        alert("Kilo kaydı silinemedi. Bağlantıyı ve veritabanı izinlerini kontrol edin.");
      }
    });

    item.append(date, weight, remove);
    els.historyList.appendChild(item);
  });
}

function renderChart(person) {
  if (!person) return;
  const entries = [...person.weights].sort((a, b) => a.date.localeCompare(b.date));
  const canvas = els.chart;
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = Math.max(320, rect.width || 720);
  const cssHeight = Math.max(260, rect.height || 320);

  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, cssWidth, cssHeight);

  if (entries.length === 0) {
    els.emptyChart.classList.remove("is-hidden");
    return;
  }

  els.emptyChart.classList.add("is-hidden");

  const padding = { top: 26, right: 24, bottom: 42, left: 52 };
  const chartWidth = cssWidth - padding.left - padding.right;
  const chartHeight = cssHeight - padding.top - padding.bottom;
  const weights = entries.map((entry) => entry.kg);
  const min = Math.floor(Math.min(...weights) - 2);
  const max = Math.ceil(Math.max(...weights) + 2);
  const range = Math.max(1, max - min);
  const xFor = (index) => padding.left + (entries.length === 1 ? chartWidth / 2 : (index / (entries.length - 1)) * chartWidth);
  const yFor = (kg) => padding.top + chartHeight - ((kg - min) / range) * chartHeight;
  const chartColors = getChartColors();

  context.lineWidth = 1;
  context.strokeStyle = chartColors.line;
  context.fillStyle = chartColors.muted;
  context.font = "12px Inter, system-ui, sans-serif";

  for (let step = 0; step <= 4; step += 1) {
    const value = min + (range / 4) * step;
    const y = yFor(value);
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(cssWidth - padding.right, y);
    context.stroke();
    context.fillText(`${formatNumber(value)} kg`, 8, y + 4);
  }

  if (isCat(person)) {
    const idealY = Math.min(padding.top + chartHeight, Math.max(padding.top, yFor(10)));
    context.fillStyle = chartColors.idealFill;
    context.fillRect(padding.left, idealY, chartWidth, padding.top + chartHeight - idealY);
  } else if (person.heightCm) {
    const h = Number(person.heightCm) / 100;
    const idealRange = getIdealBmiRange(person, entries[entries.length - 1]?.date);
    const lowTarget = idealRange.low * h * h;
    const highTarget = idealRange.high * h * h;
    const lowY = yFor(lowTarget);
    const highY = yFor(highTarget);
    context.fillStyle = chartColors.idealFill;
    context.fillRect(padding.left, highY, chartWidth, Math.max(0, lowY - highY));
  }

  context.beginPath();
  entries.forEach((entry, index) => {
    const x = xFor(index);
    const y = yFor(entry.kg);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.strokeStyle = chartColors.brand;
  context.lineWidth = 3;
  context.stroke();

  entries.forEach((entry, index) => {
    const x = xFor(index);
    const y = yFor(entry.kg);
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fillStyle = chartColors.panel;
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = chartColors.brand;
    context.stroke();
  });

  context.fillStyle = chartColors.muted;
  const first = entries[0];
  const last = entries[entries.length - 1];
  context.fillText(formatShortDate(first.date), padding.left, cssHeight - 14);
  context.textAlign = "right";
  context.fillText(formatShortDate(last.date), cssWidth - padding.right, cssHeight - 14);
  context.textAlign = "left";
}

function getChartColors() {
  const styles = getComputedStyle(document.documentElement);
  const isDark = document.documentElement.dataset.theme === "dark";

  return {
    line: styles.getPropertyValue("--line").trim() || "#dce8e4",
    muted: styles.getPropertyValue("--muted").trim() || "#687874",
    brand: styles.getPropertyValue("--brand").trim() || "#0f8f7c",
    panel: styles.getPropertyValue("--panel").trim() || "#ffffff",
    idealFill: isDark ? "rgba(255, 122, 92, 0.14)" : "rgba(53, 173, 114, 0.08)",
  };
}

function getHealthStatus(person) {
  if (isCat(person)) return getCatStatus(person);
  const bmi = calculateBmi(person);
  if (!bmi) return getEmptyStatus();

  const pediatricThresholds = getPediatricBmiThresholds(person, getLatestWeight(person)?.date);
  if (pediatricThresholds) return getPediatricBmiStatus(bmi, pediatricThresholds);

  return getAdultBmiStatus(bmi);
}

function getCatStatus(person) {
  const latestWeight = getLatestWeight(person);
  if (!latestWeight) {
    return {
      label: "",
      badge: "Kedi",
      color: "",
      pointer: 0,
      pointerColor: "#687874",
    };
  }

  if (latestWeight.kg < 10) {
    return {
      label: "İdeal",
      badge: "Kedi",
      color: "green",
      pointer: Math.min(42.3, Math.max(17.3, 17.3 + (latestWeight.kg / 10) * 25)),
      pointerColor: "#35ad72",
    };
  }

  return {
    label: latestWeight.kg >= 12 ? "Obezite" : "Fazla kilo",
    badge: "Kedi",
    color: latestWeight.kg >= 12 ? "red" : "yellow",
    pointer:
      latestWeight.kg >= 12
        ? Math.min(100, 61.5 + (latestWeight.kg - 12) * 8)
        : Math.min(61.5, 42.3 + ((latestWeight.kg - 10) / 2) * 19.2),
    pointerColor: latestWeight.kg >= 12 ? "#d95252" : "#e0a72e",
  };
}

function calculateBmi(person) {
  const latestWeight = getLatestWeight(person);
  const height = Number(person.heightCm);
  if (!latestWeight || !height) return null;
  const meters = height / 100;
  return latestWeight.kg / (meters * meters);
}

function getEmptyStatus() {
  return {
    label: "",
    badge: "",
    color: "",
    pointer: 0,
    pointerColor: "#687874",
  };
}

function getAdultBmiStatus(bmi) {
  let label = "İdeal";
  let color = "green";
  let pointerColor = "#35ad72";

  if (bmi < ADULT_BMI.severeThin) {
    label = "Çok zayıf";
    color = "yellow";
    pointerColor = "#e0a72e";
  } else if (bmi < ADULT_BMI.moderateThin) {
    label = "Orta zayıf";
    color = "yellow";
    pointerColor = "#e0a72e";
  } else if (bmi < ADULT_BMI.normalLow) {
    label = "Hafif zayıf";
    color = "yellow";
    pointerColor = "#e0a72e";
  } else if (bmi < ADULT_BMI.normalHigh) {
    label = "İdeal";
    color = "green";
    pointerColor = "#35ad72";
  } else if (bmi < ADULT_BMI.overweightHigh) {
    label = "Fazla kilo";
    color = "yellow";
    pointerColor = "#e0a72e";
  } else if (bmi < ADULT_BMI.obeseClass2) {
    label = "Obezite I";
    color = "red";
    pointerColor = "#d95252";
  } else if (bmi <= ADULT_BMI.obeseClass3) {
    label = "Obezite II";
    color = "red";
    pointerColor = "#d95252";
  } else {
    label = "Obezite III";
    color = "red";
    pointerColor = "#d95252";
  }

  return {
    label,
    badge: "",
    color,
    pointer: bmiToPointer(bmi),
    pointerColor,
  };
}

function getPediatricBmiStatus(bmi, thresholds) {
  let label = "İdeal";
  let color = "green";
  let pointerColor = "#35ad72";

  if (bmi < thresholds.p5) {
    label = "Zayıf";
    color = "yellow";
    pointerColor = "#e0a72e";
  } else if (bmi < thresholds.p85) {
    label = "İdeal";
    color = "green";
    pointerColor = "#35ad72";
  } else if (bmi < thresholds.p95) {
    label = "Fazla kilo";
    color = "yellow";
    pointerColor = "#e0a72e";
  } else {
    label = "Obezite";
    color = "red";
    pointerColor = "#d95252";
  }

  return {
    label,
    badge: "",
    color,
    pointer: pediatricBmiToPointer(bmi, thresholds),
    pointerColor,
  };
}

function bmiToPointer(bmi) {
  const min = 14;
  const max = 40;
  const value = Math.min(max, Math.max(min, bmi));
  return ((value - min) / (max - min)) * 100;
}

function pediatricBmiToPointer(bmi, thresholds) {
  if (bmi < thresholds.p5) return scaleBetween(bmi, thresholds.p5 - 4, thresholds.p5, 0, 17.3);
  if (bmi < thresholds.p85) return scaleBetween(bmi, thresholds.p5, thresholds.p85, 17.3, 42.3);
  if (bmi < thresholds.p95) return scaleBetween(bmi, thresholds.p85, thresholds.p95, 42.3, 61.5);
  return scaleBetween(bmi, thresholds.p95, thresholds.p95 + 8, 61.5, 100);
}

function scaleBetween(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const ratio = Math.min(1, Math.max(0, (value - inMin) / (inMax - inMin)));
  return outMin + ratio * (outMax - outMin);
}

function setPointer(pointer, status) {
  pointer.style.setProperty("--pointer", `${status.pointer}%`);
  pointer.style.setProperty("--pointer-color", status.pointerColor);
}

function setMeter(pointer, status, person) {
  setPointer(pointer, status);
  setPointerWeightLabel(pointer, person);
  setMeterWeightMarkers(pointer.closest(".meter"), person);
}

function setPointerWeightLabel(pointer, person) {
  const latestWeight = getLatestWeight(person);
  pointer.dataset.weight = latestWeight ? formatWholeKg(latestWeight.kg) : "";
}

function setMeterWeightMarkers(meter, person) {
  const track = meter?.querySelector(".meter-track");
  if (!track) return;

  const markerSlots = ["first", "second", "third"];
  const markers = getMeterWeightMarkerValues(person);

  markerSlots.forEach((slot, index) => {
    const marker = getOrCreateMeterMarker(track, slot);
    const markerValue = markers[index];
    marker.hidden = !markerValue;
    if (!markerValue) return;
    marker.textContent = markerValue.text;
    marker.style.setProperty("--ideal-position", markerValue.position);
  });
}

function getOrCreateMeterMarker(track, type) {
  const className = `meter-ideal-${type}`;
  const existing = track.querySelector(`.${className}`);
  if (existing) return existing;

  const marker = document.createElement("span");
  marker.className = `meter-ideal-bound ${className}`;
  track.appendChild(marker);
  return marker;
}

function getMeterWeightMarkerValues(person) {
  if (isCat(person)) {
    return [
      { text: "10 kg", position: "42.3%" },
      { text: "12 kg", position: "61.5%" },
    ];
  }

  const height = Number(person.heightCm);
  if (!height) return [];

  const latestWeight = getLatestWeight(person);
  const asOfDate = latestWeight?.date || getTodayInputValue();
  const pediatricThresholds = getPediatricBmiThresholds(person, asOfDate);
  const meters = height / 100;
  const thresholds = pediatricThresholds
    ? [pediatricThresholds.p5, pediatricThresholds.p85, pediatricThresholds.p95]
    : [ADULT_BMI.normalLow, ADULT_BMI.normalHigh, ADULT_BMI.overweightHigh];

  return [
    { text: formatWholeKg(thresholds[0] * meters * meters), position: "17.3%" },
    { text: formatWholeKg(thresholds[1] * meters * meters), position: "42.3%" },
    { text: formatWholeKg(thresholds[2] * meters * meters), position: "61.5%" },
  ];
}

function getRecommendation(person) {
  const latestWeight = getLatestWeight(person);
  if (isCat(person)) {
    if (!latestWeight) return "Kedi için kilo kaydı girilmeli.";
    if (latestWeight.kg < 10) return "Kedi 10 kg altında, ideal aralıkta kabul edildi.";
    return `${formatNumber(latestWeight.kg - 10)} kg vermesi hedeflenir.`;
  }

  const height = Number(person.heightCm);
  if (!latestWeight && !height) return "Boy ve kilo bilgisi girilmeli.";
  if (!height) return "Boy bilgisi girilmeli.";
  if (!latestWeight) return "Kilo kaydı girilmeli.";

  const meters = height / 100;
  const bmi = calculateBmi(person);
  const idealRange = getIdealBmiRange(person, latestWeight.date);
  const low = idealRange.low * meters * meters;
  const high = idealRange.high * meters * meters;

  if (bmi < idealRange.low) return `${formatNumber(low - latestWeight.kg)} kg alması önerilir.`;
  if (bmi >= idealRange.high) return `${formatNumber(latestWeight.kg - high)} kg vermesi önerilir.`;
  return "İdeal aralıkta.";
}

function renderRewards(person) {
  const rewards = getRewardSummary(person);
  els.rewardTotal.textContent = formatCurrency(rewards.total);
  els.rewardBreakdown.textContent = getRewardDetailText(rewards);
}

function getRewardSummary(person) {
  const weeklyCount = getEntryWeekCount(person);
  const weeklyReward = weeklyCount * 50;
  const normalDays = getNormalBmiDays(person);
  const normalReward = normalDays * 7;
  const loss = getWeightLossReward(person);
  const gainPenalty = getWeightGainPenalty(person);
  const monthlyPrize = getMonthlyLossPrize(person);
  const rawTotal =
    weeklyReward + normalReward + loss.baseReward + loss.proximityBonus + monthlyPrize.amount - gainPenalty.amount;

  return {
    weeklyCount,
    weeklyReward,
    normalDays,
    normalReward,
    lossKg: loss.kg,
    lossReward: loss.baseReward,
    proximityPercent: loss.proximityPercent,
    proximityBonus: loss.proximityBonus,
    gainedKg: gainPenalty.kg,
    gainPenalty: gainPenalty.amount,
    monthlyPrizeCount: monthlyPrize.count,
    monthlyPrize: monthlyPrize.amount,
    total: Math.max(0, rawTotal),
  };
}

function getEntryWeekCount(person) {
  return getWeeklyRewardCheckpoints(person).length;
}

function getWeeklyRewardCheckpoints(person) {
  const entries = [...person.weights].sort((a, b) => a.date.localeCompare(b.date));
  const weeklyEntries = new Map();

  entries.forEach((entry) => {
    weeklyEntries.set(getWeekKey(entry.date), entry);
  });

  return [...weeklyEntries.values()];
}

function getWeeklyProgressGroups(person) {
  const entries = [...person.weights].sort((a, b) => a.date.localeCompare(b.date));
  const groups = new Map();

  entries.forEach((entry) => {
    const weekKey = getWeekKey(entry.date);
    const group = groups.get(weekKey) || {
      weekKey,
      first: entry,
      latest: entry,
    };

    group.latest = entry;
    groups.set(weekKey, group);
  });

  return [...groups.values()];
}

function getMonthlyLossPrize(person) {
  const wins = getCompletedMonthlyLossWinners().filter((winner) => winner.personId === person.id).length;
  return {
    count: wins,
    amount: wins * MONTHLY_LOSS_PRIZE,
  };
}

function getCompletedMonthlyLossWinners() {
  const currentMonthKey = getTodayInputValue().slice(0, 7);
  const monthKeys = new Set();

  state.people.forEach((person) => {
    person.weights.forEach((entry) => {
      const monthKey = entry.date.slice(0, 7);
      if (monthKey < currentMonthKey) monthKeys.add(monthKey);
    });
  });

  return [...monthKeys].sort().map(getMonthlyLossWinner).filter(Boolean);
}

function getMonthlyLossWinner(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const monthStartValue = `${monthKey}-01`;
  const nextMonthStartValue = dateToInputValue(new Date(year, month, 1, 12));
  const winner = state.people
    .map((person) => getMonthlyWeightChange(person, monthStartValue, nextMonthStartValue))
    .filter(Boolean)
    .filter((change) => change.delta < 0)
    .sort((a, b) => a.delta - b.delta || a.name.localeCompare(b.name, "tr"))[0];

  return winner
    ? {
        personId: winner.personId,
        name: winner.name,
        monthKey,
        amount: Math.abs(winner.delta),
      }
    : null;
}

function getWeightLossReward(person) {
  const entries = [...person.weights].sort((a, b) => a.date.localeCompare(b.date));
  if (entries.length < 2) {
    return { kg: 0, baseReward: 0, proximityPercent: 0, proximityBonus: 0 };
  }

  const first = entries[0];
  const startTargetWeight = getIdealUpperWeight(person, first.date);
  if (!startTargetWeight || first.kg <= startTargetWeight) {
    return { kg: 0, baseReward: 0, proximityPercent: 0, proximityBonus: 0 };
  }

  const groups = getWeeklyProgressGroups(person);
  let paidLossKg = 0;
  let rewardEntry = first;

  groups.forEach((group) => {
    if (group.latest.date === first.date) return;

    const totalLossAtCheckpoint = Math.max(0, first.kg - group.latest.kg);
    const newLossKg = Math.max(0, totalLossAtCheckpoint - paidLossKg);
    if (!newLossKg) return;

    paidLossKg += newLossKg;
    rewardEntry = group.latest;
  });

  if (!paidLossKg) {
    return { kg: 0, baseReward: 0, proximityPercent: 0, proximityBonus: 0 };
  }

  const latestTargetWeight = getIdealUpperWeight(person, rewardEntry.date);
  if (!latestTargetWeight) {
    return { kg: 0, baseReward: 0, proximityPercent: 0, proximityBonus: 0 };
  }

  const distanceAtStart = Math.max(0, first.kg - startTargetWeight);
  const distanceNow = Math.max(0, rewardEntry.kg - latestTargetWeight);
  const progress = distanceAtStart ? Math.min(1, Math.max(0, (distanceAtStart - distanceNow) / distanceAtStart)) : 0;
  const proximityPercent = progress * 10;
  const baseReward = paidLossKg * 250;
  const proximityBonus = baseReward * (proximityPercent / 100);

  return {
    kg: paidLossKg,
    baseReward,
    proximityPercent,
    proximityBonus,
  };
}

function getWeightGainPenalty(person) {
  const checkpoints = getWeeklyRewardCheckpoints(person);
  if (checkpoints.length < 2) return { kg: 0, amount: 0 };

  const gainedKg = checkpoints.reduce((total, entry, index) => {
    if (index === 0) return total;
    if (!isAboveIdealWeightForPerson(person, entry.kg, entry.date)) return total;
    const previous = checkpoints[index - 1];
    return total + Math.max(0, entry.kg - previous.kg);
  }, 0);

  return {
    kg: gainedKg,
    amount: gainedKg * 50,
  };
}

function getNormalBmiDays(person) {
  const entries = [...person.weights].sort((a, b) => a.date.localeCompare(b.date));
  if (entries.length === 0) return 0;

  const today = getTodayDayNumber();
  const tomorrow = today + 1;

  return entries.reduce((total, entry, index) => {
    if (!isIdealWeightForPerson(person, entry.kg, entry.date)) return total;

    const start = dateToDayNumber(entry.date);
    const next = entries[index + 1] ? dateToDayNumber(entries[index + 1].date) : tomorrow;
    const end = Math.min(next, tomorrow);
    return total + Math.max(0, end - Math.max(start, 0));
  }, 0);
}

function calculateBmiForWeight(weight, heightCm) {
  const meters = Number(heightCm) / 100;
  return Number(weight) / (meters * meters);
}

function isIdealWeightForPerson(person, kg, asOfDate) {
  if (isCat(person)) return kg < 10;
  const height = Number(person.heightCm);
  if (!height) return false;
  const range = getIdealBmiRange(person, asOfDate);
  const bmi = calculateBmiForWeight(kg, height);
  return bmi >= range.low && bmi < range.high;
}

function isAboveIdealWeightForPerson(person, kg, asOfDate) {
  if (isCat(person)) return kg >= 10;
  const height = Number(person.heightCm);
  if (!height) return false;
  const range = getIdealBmiRange(person, asOfDate);
  return calculateBmiForWeight(kg, height) >= range.high;
}

function getWeightToLose(person) {
  const latestWeight = getLatestWeight(person);
  if (!latestWeight) return 0;

  const targetWeight = getIdealUpperWeight(person, latestWeight.date);
  if (!targetWeight) return 0;

  return Math.max(0, latestWeight.kg - targetWeight);
}

function getIdealUpperWeight(person, asOfDate) {
  if (isCat(person)) return 10;
  const height = Number(person.heightCm);
  if (!height) return null;
  const meters = height / 100;
  return getIdealBmiRange(person, asOfDate).high * meters * meters;
}

function getIdealBmiRange(person, asOfDate) {
  const pediatricThresholds = getPediatricBmiThresholds(person, asOfDate);
  if (pediatricThresholds) {
    return {
      low: pediatricThresholds.p5,
      high: pediatricThresholds.p85,
    };
  }

  return {
    low: ADULT_BMI.normalLow,
    high: ADULT_BMI.normalHigh,
  };
}

function getPediatricBmiThresholds(person, asOfDate) {
  if (isCat(person) || !person.birthDate || !["erkek", "kadın"].includes(person.gender)) return null;
  const ageMonths = getAgeMonthsAtDate(person.birthDate, asOfDate || getTodayInputValue());
  if (ageMonths < 24 || ageMonths > 240) return null;

  const sex = person.gender === "erkek" ? 1 : 2;
  const rows = (window.CDC_BMI_FOR_AGE || []).filter((row) => row[0] === sex);
  if (!rows.length) return null;

  let lower = rows[0];
  let upper = rows[rows.length - 1];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row[1] <= ageMonths) lower = row;
    if (row[1] >= ageMonths) {
      upper = row;
      break;
    }
  }

  const interpolate = (fieldIndex) => {
    if (upper[1] === lower[1]) return lower[fieldIndex];
    const ratio = (ageMonths - lower[1]) / (upper[1] - lower[1]);
    return lower[fieldIndex] + (upper[fieldIndex] - lower[fieldIndex]) * ratio;
  };

  return {
    p5: interpolate(2),
    p85: interpolate(3),
    p95: interpolate(4),
  };
}

function getAgeMonthsAtDate(birthDateValue, dateValue) {
  const birth = new Date(`${birthDateValue}T12:00:00`);
  const date = new Date(`${dateValue}T12:00:00`);
  let months = (date.getFullYear() - birth.getFullYear()) * 12 + (date.getMonth() - birth.getMonth());
  if (date.getDate() < birth.getDate()) months -= 1;
  return months;
}

function getRewardCardText(rewards) {
  const parts = [];
  if (rewards.weeklyReward) parts.push(`${rewards.weeklyCount} hafta`);
  if (rewards.normalReward) parts.push(`${rewards.normalDays} normal gün`);
  if (rewards.lossReward) parts.push(`${formatKg(rewards.lossKg)} düşüş`);
  if (rewards.monthlyPrize) parts.push(`${rewards.monthlyPrizeCount} aylık ödül`);
  if (rewards.gainPenalty) parts.push(`${formatKg(rewards.gainedKg)} kilo alma cezası`);
  return parts.length ? parts.join(" · ") : "Her hafta 1 kilo girişi ödüllenir";
}

function getRewardDetailText(rewards) {
  const penaltyText = rewards.gainPenalty ? `-${formatCurrency(rewards.gainPenalty)}` : formatCurrency(0);
  return `Haftalık Kilo Girişi (${rewards.weeklyCount} hafta): ${formatCurrency(rewards.weeklyReward)} · İdeal kiloda kalınan gün (${rewards.normalDays} gün): ${formatCurrency(rewards.normalReward)} · Kilo verme ödülü (${formatKg(rewards.lossKg)}): ${formatCurrency(rewards.lossReward)} · İdeal kiloya yaklaşma bonusu (+%${formatNumber(rewards.proximityPercent)}): ${formatCurrency(rewards.proximityBonus)} · Aylık ödül (${rewards.monthlyPrizeCount} ay): ${formatCurrency(rewards.monthlyPrize)} · Kilo alma cezası (${formatKg(rewards.gainedKg)}): ${penaltyText}`;
}

function renderCalories(person) {
  const plan = getCaloriePlan(person);
  els.calorieTitle.textContent = plan.title;
  els.calorieTarget.textContent = plan.target;
  els.calorieNote.textContent = plan.note;
}

function getCaloriePlan(person) {
  const latestWeight = getLatestWeight(person);
  if (isCat(person)) {
    return {
      title: "Kedi kilo hedefi",
      target: "10 kg altı",
      note: latestWeight && latestWeight.kg < 10 ? "Kedi modu: ideal kabul edildi." : "Kedi modu: 10 kg altı hedeflenir.",
    };
  }

  const age = calculateAge(person);
  const height = Number(person.heightCm);
  const gender = person.gender;

  if (!latestWeight || !age || !height || !gender) {
    return {
      title: "Günlük kalori hedefi",
      target: "--",
      note: "Hedef için doğum tarihi, boy, cinsiyet ve güncel kilo girilmeli.",
    };
  }

  const bmr =
    gender === "erkek"
      ? 10 * latestWeight.kg + 6.25 * height - 5 * age + 5
      : 10 * latestWeight.kg + 6.25 * height - 5 * age - 161;
  const maintenance = roundCalories(bmr * 1.375);
  const bmi = calculateBmi(person);
  const idealRange = getIdealBmiRange(person, latestWeight.date);

  if (bmi && bmi < idealRange.low) {
    return {
      title: "Kilo almak için günlük kalori hedefi",
      target: `${formatCalories(maintenance + 300)} kcal`,
      note: `Aynı kiloda kalmak için alman gereken kalori yaklaşık ${formatCalories(maintenance)} kcal.`,
    };
  }

  if (bmi && bmi >= idealRange.high) {
    const target = Math.max(roundCalories(bmr * 1.1), maintenance - 500);
    return {
      title: "Kilo vermek için günlük kalori hedefi",
      target: `${formatCalories(target)} kcal`,
      note: `Aynı kiloda kalmak için alman gereken kalori yaklaşık ${formatCalories(maintenance)} kcal.`,
    };
  }

  return {
    title: "Aynı kiloda kalmak için günlük kalori hedefi",
    target: `${formatCalories(maintenance)} kcal`,
    note: "Aynı kiloda kalmak için alman gereken tahmini günlük kalori.",
  };
}

function getLatestWeight(person) {
  if (!person.weights.length) return null;
  return [...person.weights].sort((a, b) => b.date.localeCompare(a.date))[0];
}

function getPersonMeta(person) {
  if (isCat(person)) return "Kedi · 10 kg altı ideal";

  const parts = [];
  const age = calculateAge(person);
  if (age !== null) parts.push(`${age} yaş`);
  if (person.heightCm) parts.push(`${formatNumber(person.heightCm)} cm`);
  if (person.gender) parts.push(capitalize(person.gender));
  return parts.length ? parts.join(" · ") : "Profil eksik";
}

function isProfileComplete(person) {
  if (isCat(person)) return true;
  return Boolean(person.birthDate && person.heightCm && person.gender);
}

function getProfileSummary(person) {
  if (isCat(person)) return "Kedi · 10 kg altı ideal kabul ediliyor";

  const age = calculateAge(person);
  const parts = [];
  if (person.birthDate) parts.push(`${formatLongDate(person.birthDate)} doğumlu`);
  if (age !== null) parts.push(`${age} yaş`);
  if (person.heightCm) parts.push(`${formatNumber(person.heightCm)} cm`);
  if (person.gender) parts.push(capitalize(person.gender));
  return parts.join(" · ");
}

function calculateAge(person) {
  if (person.birthDate) {
    const birthDate = new Date(`${person.birthDate}T12:00:00`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate(), 12);
    if (today < birthdayThisYear) age -= 1;
    return Number.isFinite(age) && age >= 0 ? age : null;
  }

  const legacyAge = Number(person.age);
  return Number.isFinite(legacyAge) && legacyAge > 0 ? legacyAge : null;
}

function isCat(person) {
  return person.gender === "kedi";
}

function numberOrEmpty(value) {
  const number = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(number) ? number : "";
}

function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatWholeNumber(value) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatKg(value) {
  return `${formatNumber(value)} kg`;
}

function formatWholeKg(value) {
  return `${formatWholeNumber(value)} kg`;
}

function formatCalories(value) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)} TL`;
}

function roundCalories(value) {
  return Math.round(value / 10) * 10;
}

function syncDateInput() {
  els.dateInput.value = getTodayInputValue();
}

function getTodayInputValue() {
  const now = new Date();
  return dateToInputValue(now);
}

function dateToInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function getWeekKey(value) {
  const date = new Date(`${value}T12:00:00`);
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((temp - yearStart) / 86400000 + 1) / 7);
  return `${temp.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}

function dateToDayNumber(value) {
  const date = new Date(`${value}T12:00:00`);
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

function getTodayDayNumber() {
  const today = new Date();
  return Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
}

function capitalize(value) {
  return value.charAt(0).toLocaleUpperCase("tr-TR") + value.slice(1);
}

function getSelectedPerson() {
  return state.people.find((person) => person.id === state.selectedId);
}

function exportData() {
  const blob = new Blob([JSON.stringify(state.people, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `aile-bmi-yedek-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error("Invalid file");

    const normalizedPeople = data.map((person) => ({
      ...createPerson(person.name || "İsimsiz"),
      ...person,
      weights: Array.isArray(person.weights) ? person.weights : [],
    }));
    state.people = await dataStore.replaceAll(normalizedPeople);
    render();
  } catch {
    alert("Yedek dosyası okunamadı.");
  } finally {
    event.target.value = "";
  }
}
