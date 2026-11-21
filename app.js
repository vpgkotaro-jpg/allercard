// AllerCard — all data stays in this browser (localStorage). MIT License.
const ALLERGENS = [
  { id: "egg",       en: "Egg",        ja: "卵",       zh: "鸡蛋",   ko: "달걀" },
  { id: "milk",      en: "Milk",       ja: "乳（牛乳）", zh: "牛奶",   ko: "우유" },
  { id: "wheat",     en: "Wheat",      ja: "小麦",     zh: "小麦",   ko: "밀" },
  { id: "peanut",    en: "Peanut",     ja: "落花生（ピーナッツ）", zh: "花生", ko: "땅콩" },
  { id: "buckwheat", en: "Buckwheat",  ja: "そば",     zh: "荞麦",   ko: "메밀" },
  { id: "shrimp",    en: "Shrimp",     ja: "えび",     zh: "虾",     ko: "새우" },
  { id: "crab",      en: "Crab",       ja: "かに",     zh: "蟹",     ko: "게" },
  { id: "walnut",    en: "Walnut",     ja: "くるみ",   zh: "核桃",   ko: "호두" },
  { id: "treenut",   en: "Tree nuts",  ja: "ナッツ類", zh: "坚果",   ko: "견과류" },
  { id: "soy",       en: "Soy",        ja: "大豆",     zh: "大豆",   ko: "대두" },
  { id: "sesame",    en: "Sesame",     ja: "ごま",     zh: "芝麻",   ko: "참깨" },
  { id: "fish",      en: "Fish",       ja: "魚",       zh: "鱼",     ko: "생선" },
  { id: "shellfish", en: "Shellfish",  ja: "貝類",     zh: "贝类",   ko: "조개류" },
];

const TEXT = {
  en: {
    tag: "FOOD ALLERGY",
    titleSevere: "I have a severe food allergy.",
    titleAvoid: "I have a food allergy.",
    lead: "I cannot eat food that contains:",
    severe: "Even a tiny amount, or food cooked with the same oil or utensils, can make me seriously ill.",
    avoid: "Please tell me if a dish contains these, so I can decide.",
    ask: "Please check the ingredients before giving me food. Thank you.",
    epi: "I carry an adrenaline auto-injector (EpiPen).",
    emerg: "If I have trouble breathing, call an ambulance immediately.",
    contact: "Emergency contact:",
  },
  ja: {
    tag: "食物アレルギー",
    titleSevere: "重い食物アレルギーがあります。",
    titleAvoid: "食物アレルギーがあります。",
    lead: "次の食品が入ったものは食べられません：",
    severe: "ごく少量や、同じ油・調理器具で作ったものでも、重い症状が出ることがあります。",
    avoid: "料理に入っているかどうかを教えてください。自分で判断します。",
    ask: "食べ物をいただく前に、原材料を確認していただけると助かります。",
    epi: "アドレナリン自己注射薬（エピペン）を持っています。",
    emerg: "息が苦しそうなときは、すぐに救急車（119）を呼んでください。",
    contact: "緊急連絡先：",
  },
  zh: {
    tag: "食物过敏",
    titleSevere: "我有严重的食物过敏。",
    titleAvoid: "我有食物过敏。",
    lead: "我不能吃含有以下成分的食物：",
    severe: "即使极少量，或用同一油锅、厨具做的食物，也可能让我出现严重反应。",
    avoid: "请告诉我菜里是否含有这些成分，我自己判断。",
    ask: "给我食物前，请帮我确认配料。谢谢。",
    epi: "我随身携带肾上腺素自动注射笔（EpiPen）。",
    emerg: "如果我呼吸困难，请立即叫救护车。",
    contact: "紧急联系人：",
  },
  ko: {
    tag: "식품 알레르기",
    titleSevere: "심한 식품 알레르기가 있습니다.",
    titleAvoid: "식품 알레르기가 있습니다.",
    lead: "다음 성분이 들어간 음식은 먹을 수 없습니다:",
    severe: "아주 적은 양이나 같은 기름·조리도구로 만든 음식도 심한 증상을 일으킬 수 있습니다.",
    avoid: "음식에 들어 있는지 알려 주세요. 제가 판단하겠습니다.",
    ask: "음식을 주시기 전에 원재료를 확인해 주시면 감사하겠습니다.",
    epi: "아드레날린 자가주사기(에피펜)를 가지고 있습니다.",
    emerg: "숨쉬기 힘들어하면 바로 구급차를 불러 주세요.",
    contact: "비상 연락처:",
  },
};

const KIT = [
  ["Allergy-safe staple food for 3+ days", "Rice packs or crackers you have already checked"],
  ["Allergy-safe baby or child food", "If someone at home needs it"],
  ["Your regular medicines, 7 days or more", "Antihistamines and anything you take daily"],
  ["Adrenaline auto-injector (if prescribed)", "Check the expiry date"],
  ["Printed AllerCard", "Phones die. Paper doesn't."],
  ["Copy of your prescription or medicine notebook", "お薬手帳 in Japan"],
  ["Allergen-free seasoning", "Soy sauce often contains wheat"],
  ["Water, 3 litres per person per day", ""],
];

const store = {
  get() { try { return JSON.parse(localStorage.getItem("allercard") || "{}"); } catch { return {}; } },
  set(v) { try { localStorage.setItem("allercard", JSON.stringify(v)); } catch {} },
};

const state = Object.assign({ picked: [], other: "", sev: "severe", lang: "ja", contact: "", epi: false, kit: [] }, store.get());
const $ = (s) => document.querySelector(s);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderChips() {
  const box = $("#allergens");
  box.innerHTML = "";
  ALLERGENS.forEach((a) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = a.en;
    b.setAttribute("aria-pressed", state.picked.includes(a.id));
    b.onclick = () => {
      state.picked = state.picked.includes(a.id) ? state.picked.filter((x) => x !== a.id) : [...state.picked, a.id];
      b.setAttribute("aria-pressed", state.picked.includes(a.id));
      update();
    };
    box.appendChild(b);
  });
}

function cardHTML() {
  const t = TEXT[state.lang];
  const items = state.picked.map((id) => {
    const a = ALLERGENS.find((x) => x.id === id);
    const local = a[state.lang];
    return state.lang === "en" ? local : `${local} <small>(${a.en})</small>`;
  });
  if (state.other.trim()) items.push(esc(state.other.trim()));
  if (!items.length) return null;
  const sev = state.sev === "severe";
  return `
    <span class="tag">${t.tag}</span>
    <h3>${sev ? t.titleSevere : t.titleAvoid}</h3>
    <p>${t.lead}</p>
    <ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>
    <p>${sev ? t.severe : t.avoid}</p>
    <p>${t.ask}</p>
    ${state.epi ? `<p><strong>${t.epi}</strong></p>` : ""}
    ${sev ? `<p><strong>${t.emerg}</strong></p>` : ""}
    ${state.contact.trim() ? `<p>${t.contact} ${esc(state.contact.trim())}</p>` : ""}
    ${state.lang !== "en" ? `<p class="sub">${TEXT.en.titleSevere.replace("severe ", sev ? "severe " : "")} ${TEXT.en.lead} ${state.picked.map((id) => ALLERGENS.find((x) => x.id === id).en).join(", ")}${state.other.trim() ? ", " + esc(state.other.trim()) : ""}.</p>` : ""}
  `;
}

function update() {
  const html = cardHTML();
  const card = $("#card");
  if (html) { card.className = "card"; card.innerHTML = html; }
  else { card.className = "card empty"; card.textContent = "Pick at least one allergen to see your card."; }
  document.documentElement.lang = state.lang === "zh" ? "zh-Hans" : state.lang;
  store.set(state);
}

function renderKit() {
  const ul = $("#kitlist");
  ul.innerHTML = "";
  KIT.forEach(([title, note], i) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="checkbox" ${state.kit.includes(i) ? "checked" : ""}><span>${title}${note ? `<small>${note}</small>` : ""}</span></label>`;
    li.querySelector("input").onchange = (e) => {
      state.kit = e.target.checked ? [...state.kit, i] : state.kit.filter((x) => x !== i);
      countKit(); store.set(state);
    };
    ul.appendChild(li);
  });
  $("#kittotal").textContent = KIT.length;
  countKit();
}
function countKit() { $("#kitcount").textContent = state.kit.length; }

$("#other").value = state.other;
$("#lang").value = state.lang;
$("#contact").value = state.contact;
$("#epi").checked = state.epi;
document.querySelector(`input[name=sev][value=${state.sev}]`).checked = true;

$("#other").oninput = (e) => { state.other = e.target.value; update(); };
$("#contact").oninput = (e) => { state.contact = e.target.value; update(); };
$("#lang").onchange = (e) => { state.lang = e.target.value; update(); };
$("#epi").onchange = (e) => { state.epi = e.target.checked; update(); };
document.querySelectorAll("input[name=sev]").forEach((r) => (r.onchange = (e) => { state.sev = e.target.value; update(); }));
$("#print").onclick = () => window.print();
$("#big").onclick = () => { $("#fullcard").innerHTML = $("#card").innerHTML; $("#full").hidden = false; $("#close").focus(); };
$("#close").onclick = () => { $("#full").hidden = true; $("#big").focus(); };
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#full").hidden) $("#close").click(); });

renderChips();
renderKit();
update();

if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
