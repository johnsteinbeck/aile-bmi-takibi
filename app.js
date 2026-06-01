const STORAGE_KEY = "aile-bmi-takibi-v2";

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

const state = {
  people: [],
  selectedId: null,
  query: "",
};

let dataStore;

const els = {
  grid: document.querySelector("#peopleGrid"),
  template: document.querySelector("#personCardTemplate"),
  totalPeople: document.querySelector("#totalPeople"),
  trackedPeople: document.querySelector("#trackedPeople"),
  healthyPeople: document.querySelector("#healthyPeople"),
  latestEntry: document.querySelector("#latestEntry"),
  addPersonForm: document.querySelector("#addPersonForm"),
  personName: document.querySelector("#personName"),
  searchPeople: document.querySelector("#searchPeople"),
  dialog: document.querySelector("#personDialog"),
  dialogName: document.querySelector("#dialogName"),
  dialogBmi: document.querySelector("#dialogBmi"),
  dialogPointer: document.querySelector("#dialogPointer"),
  dialogRecommendation: document.querySelector("#dialogRecommendation"),
  calorieTarget: document.querySelector("#calorieTarget"),
  calorieNote: document.querySelector("#calorieNote"),
  profileForm: document.querySelector("#profileForm"),
  ageInput: document.querySelector("#ageInput"),
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
};

els.addPersonForm.addEventListener("submit", addPerson);
els.searchPeople.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLocaleLowerCase("tr-TR");
  render();
});
els.profileForm.addEventListener("submit", saveProfile);
els.weightForm.addEventListener("submit", addWeight);
els.deletePerson.addEventListener("click", deleteSelectedPerson);
els.exportData.addEventListener("click", exportData);
els.importData.addEventListener("click", () => els.importFile.click());
els.importFile.addEventListener("change", importData);
window.addEventListener("resize", () => renderChart(getSelectedPerson()));

els.dateInput.value = new Date().toISOString().slice(0, 10);
init();

function createPerson(name) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name,
    age: "",
    heightCm: "",
    gender: "",
    weights: [],
  };
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
      const { data, error } = await client.from("people").insert({ name: person.name }).select("id,name,age,height_cm,gender").single();
      if (error) throw error;
      return mapSupabasePerson(data);
    },
    async savePerson(person) {
      const { error } = await client
        .from("people")
        .update({
          age: person.age || null,
          height_cm: person.heightCm || null,
          gender: person.gender || null,
        })
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
            age: person.age || null,
            height_cm: person.heightCm || null,
            gender: person.gender || null,
          },
          { onConflict: "name" },
        )
        .select("id,name,age,height_cm,gender")
        .single();
      if (error) throw error;
      return mapSupabasePerson(data);
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
  const { data, error } = await client
    .from("people")
    .select("id,name,age,height_cm,gender,weight_entries(id,entry_date,kg)")
    .order("name", { ascending: true });
  if (error) throw error;
  return data.map(mapSupabasePerson);
}

function mapSupabasePerson(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age ?? "",
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

  person.age = numberOrEmpty(els.ageInput.value);
  person.heightCm = numberOrEmpty(els.heightInput.value);
  person.gender = els.genderInput.value;

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

  const date = els.dateInput.value || new Date().toISOString().slice(0, 10);
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
  renderPeople();
}

function renderSummary() {
  const tracked = state.people.filter((person) => getLatestWeight(person) && person.heightCm);
  const healthy = tracked.filter((person) => {
    const bmi = calculateBmi(person);
    return bmi && bmi >= 18.5 && bmi <= 24.9;
  });
  const latest = state.people
    .flatMap((person) => person.weights.map((entry) => ({ ...entry, name: person.name })))
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  els.totalPeople.textContent = state.people.length;
  els.trackedPeople.textContent = tracked.length;
  els.healthyPeople.textContent = healthy.length;
  els.latestEntry.textContent = latest ? formatShortDate(latest.date) : "-";
}

function renderPeople() {
  els.grid.innerHTML = "";

  const people = state.people
    .filter((person) => person.name.toLocaleLowerCase("tr-TR").includes(state.query))
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));

  people.forEach((person) => {
    const fragment = els.template.content.cloneNode(true);
    const card = fragment.querySelector(".person-card");
    const status = getBmiStatus(calculateBmi(person));
    const latestWeight = getLatestWeight(person);
    const pointer = fragment.querySelector(".meter-pointer");

    card.dataset.id = person.id;
    card.querySelector("h2").textContent = person.name;
    card.querySelector(".person-meta").textContent = getPersonMeta(person);
    card.querySelector(".status-chip").textContent = status.label;
    if (status.color) card.querySelector(".status-chip").classList.add(status.color);
    card.querySelector(".bmi-value").textContent = status.bmiText;
    card.querySelector(".latest-weight").textContent = latestWeight ? `${formatNumber(latestWeight.kg)} kg` : "Kilo yok";
    card.querySelector(".recommendation").textContent = getRecommendation(person);
    setPointer(pointer, status);

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

function openPerson(id) {
  state.selectedId = id;
  const person = getSelectedPerson();
  if (!person) return;

  renderDialog(person);
  if (!els.dialog.open) els.dialog.showModal();
}

function renderDialog(person) {
  const status = getBmiStatus(calculateBmi(person));
  els.dialogName.textContent = person.name;
  els.dialogBmi.textContent = `BMI ${status.bmiText} · ${status.label}`;
  els.dialogRecommendation.textContent = getRecommendation(person);
  renderCalories(person);
  els.ageInput.value = person.age ?? "";
  els.heightInput.value = person.heightCm ?? "";
  els.genderInput.value = person.gender ?? "";
  els.dateInput.value = els.dateInput.value || new Date().toISOString().slice(0, 10);
  setPointer(els.dialogPointer, status);
  renderHistory(person);
  renderChart(person);
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

  context.lineWidth = 1;
  context.strokeStyle = "#dce8e4";
  context.fillStyle = "#687874";
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

  if (person.heightCm) {
    const h = Number(person.heightCm) / 100;
    const lowTarget = 18.5 * h * h;
    const highTarget = 24.9 * h * h;
    const lowY = yFor(lowTarget);
    const highY = yFor(highTarget);
    context.fillStyle = "rgba(53, 173, 114, 0.08)";
    context.fillRect(padding.left, highY, chartWidth, Math.max(0, lowY - highY));
  }

  context.beginPath();
  entries.forEach((entry, index) => {
    const x = xFor(index);
    const y = yFor(entry.kg);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.strokeStyle = "#0f8f7c";
  context.lineWidth = 3;
  context.stroke();

  entries.forEach((entry, index) => {
    const x = xFor(index);
    const y = yFor(entry.kg);
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fillStyle = "#ffffff";
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "#0f8f7c";
    context.stroke();
  });

  context.fillStyle = "#687874";
  const first = entries[0];
  const last = entries[entries.length - 1];
  context.fillText(formatShortDate(first.date), padding.left, cssHeight - 14);
  context.textAlign = "right";
  context.fillText(formatShortDate(last.date), cssWidth - padding.right, cssHeight - 14);
  context.textAlign = "left";
}

function calculateBmi(person) {
  const latestWeight = getLatestWeight(person);
  const height = Number(person.heightCm);
  if (!latestWeight || !height) return null;
  const meters = height / 100;
  return latestWeight.kg / (meters * meters);
}

function getBmiStatus(bmi) {
  if (!bmi) {
    return {
      label: "Eksik veri",
      color: "",
      bmiText: "--",
      pointer: 0,
      pointerColor: "#687874",
    };
  }

  let label = "İdeal";
  let color = "green";
  let pointerColor = "#35ad72";

  if (bmi < 18.5) {
    label = "Zayıf";
    color = "yellow";
    pointerColor = "#e0a72e";
  } else if (bmi > 29.9) {
    label = "Obezite";
    color = "red";
    pointerColor = "#d95252";
  } else if (bmi > 24.9) {
    label = "Fazla kilo";
    color = "yellow";
    pointerColor = "#e0a72e";
  }

  return {
    label,
    color,
    bmiText: formatNumber(bmi),
    pointer: bmiToPointer(bmi),
    pointerColor,
  };
}

function bmiToPointer(bmi) {
  const min = 14;
  const max = 40;
  const value = Math.min(max, Math.max(min, bmi));
  return ((value - min) / (max - min)) * 100;
}

function setPointer(pointer, status) {
  pointer.style.setProperty("--pointer", `${status.pointer}%`);
  pointer.style.setProperty("--pointer-color", status.pointerColor);
}

function getRecommendation(person) {
  const latestWeight = getLatestWeight(person);
  const height = Number(person.heightCm);
  if (!latestWeight && !height) return "Boy ve kilo bilgisi girilmeli.";
  if (!height) return "Boy bilgisi girilmeli.";
  if (!latestWeight) return "Kilo kaydı girilmeli.";

  const meters = height / 100;
  const bmi = calculateBmi(person);
  const low = 18.5 * meters * meters;
  const high = 24.9 * meters * meters;

  if (bmi < 18.5) return `${formatNumber(low - latestWeight.kg)} kg alması önerilir.`;
  if (bmi > 24.9) return `${formatNumber(latestWeight.kg - high)} kg vermesi önerilir.`;
  return "İdeal BMI aralığında.";
}

function renderCalories(person) {
  const plan = getCaloriePlan(person);
  els.calorieTarget.textContent = plan.target;
  els.calorieNote.textContent = plan.note;
}

function getCaloriePlan(person) {
  const latestWeight = getLatestWeight(person);
  const age = Number(person.age);
  const height = Number(person.heightCm);
  const gender = person.gender;

  if (!latestWeight || !age || !height || !gender) {
    return {
      target: "--",
      note: "Kalori hedefi için yaş, boy, cinsiyet ve güncel kilo gerekli.",
    };
  }

  const bmr =
    gender === "erkek"
      ? 10 * latestWeight.kg + 6.25 * height - 5 * age + 5
      : 10 * latestWeight.kg + 6.25 * height - 5 * age - 161;
  const maintenance = roundCalories(bmr * 1.375);
  const bmi = calculateBmi(person);

  if (bmi && bmi < 18.5) {
    return {
      target: `${formatCalories(maintenance + 300)} kcal`,
      note: `Kilo almak için tahmini hedef. Koruma kalorisi yaklaşık ${formatCalories(maintenance)} kcal.`,
    };
  }

  if (bmi && bmi > 24.9) {
    const target = Math.max(roundCalories(bmr * 1.1), maintenance - 500);
    return {
      target: `${formatCalories(target)} kcal`,
      note: `Kilo vermek için tahmini hedef. Koruma kalorisi yaklaşık ${formatCalories(maintenance)} kcal.`,
    };
  }

  return {
    target: `${formatCalories(maintenance)} kcal`,
    note: "İdeal aralık için tahmini koruma kalorisi.",
  };
}

function getLatestWeight(person) {
  if (!person.weights.length) return null;
  return [...person.weights].sort((a, b) => b.date.localeCompare(a.date))[0];
}

function getPersonMeta(person) {
  const parts = [];
  if (person.age) parts.push(`${person.age} yaş`);
  if (person.heightCm) parts.push(`${formatNumber(person.heightCm)} cm`);
  if (person.gender) parts.push(capitalize(person.gender));
  return parts.length ? parts.join(" · ") : "Profil eksik";
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

function formatCalories(value) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function roundCalories(value) {
  return Math.round(value / 10) * 10;
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
