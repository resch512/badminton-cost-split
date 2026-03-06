const STORAGE_KEY = "badminton-cost-split-v1";

const defaults = {
  players: 6,
  shuttles: 3,
  shuttlePrice: 90,
  courtPrice: 440,
};

const playersSelect = document.getElementById("players");
const shuttlesSelect = document.getElementById("shuttles");
const shuttlePriceInput = document.getElementById("shuttlePrice");
const courtPriceInput = document.getElementById("courtPrice");
const totalCostEl = document.getElementById("totalCost");
const perPlayerEl = document.getElementById("perPlayer");

function fillSelect(selectEl, min, max) {
  for (let i = min; i <= max; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    selectEl.appendChild(option);
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return { ...defaults };
    return {
      players: clampInt(saved.players, 2, 40, defaults.players),
      shuttles: clampInt(saved.shuttles, 0, 40, defaults.shuttles),
      shuttlePrice: toNumber(saved.shuttlePrice, defaults.shuttlePrice),
      courtPrice: toNumber(saved.courtPrice, defaults.courtPrice),
    };
  } catch {
    return { ...defaults };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function currentState() {
  return {
    players: clampInt(playersSelect.value, 2, 40, defaults.players),
    shuttles: clampInt(shuttlesSelect.value, 0, 40, defaults.shuttles),
    shuttlePrice: toNumber(shuttlePriceInput.value, defaults.shuttlePrice),
    courtPrice: toNumber(courtPriceInput.value, defaults.courtPrice),
  };
}

function render() {
  const state = currentState();
  const total = state.shuttles * state.shuttlePrice + state.courtPrice;
  const perPlayer = state.players > 0 ? total / state.players : 0;

  totalCostEl.textContent = total.toFixed(2);
  perPlayerEl.textContent = perPlayer.toFixed(2);

  saveState(state);
}

fillSelect(playersSelect, 2, 40);
fillSelect(shuttlesSelect, 0, 40);

const initial = loadState();
playersSelect.value = String(initial.players);
shuttlesSelect.value = String(initial.shuttles);
shuttlePriceInput.value = String(initial.shuttlePrice);
courtPriceInput.value = String(initial.courtPrice);

[playersSelect, shuttlesSelect, shuttlePriceInput, courtPriceInput].forEach((el) => {
  el.addEventListener("input", render);
});

render();
