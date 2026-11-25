const DEALS_KEY = "foodExpressDeals";

function getDeals() {
  return JSON.parse(localStorage.getItem(DEALS_KEY) || "[]");
}

function saveDeals(deals) {
  localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
}

function renderAdminDeals() {
  const container = document.getElementById("adminDeals");
  if (!container) return;

  container.replaceChildren();
  const deals = getDeals().filter(deal => deal.endsAt > Date.now());

  if (deals.length === 0) {
    container.textContent = "No active deals.";
    return;
  }

  deals.forEach(deal => {
    const row = document.createElement("div");
    row.className = "deal-row";

    const details = document.createElement("span");
    details.textContent =
      `${deal.name}: ₹${deal.discountedPrice} (${deal.discountPercent}% off)`;

    const endTime = document.createElement("span");
    endTime.textContent = `Ends: ${new Date(deal.endsAt).toLocaleString()}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "delete-btn";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      saveDeals(getDeals().filter(item => item.id !== deal.id));
      renderAdminDeals();
    });

    row.append(details, endTime, removeButton);
    container.appendChild(row);
  });
}

document.getElementById("dealForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("dealName").value.trim();
  const price = Number(document.getElementById("dealPrice").value);
  const discountPercent = Number(document.getElementById("dealDiscount").value);
  const minutes = Number(document.getElementById("dealMinutes").value);

  if (!name || price <= 0 || discountPercent < 1 ||
      discountPercent > 90 || minutes < 1) {
    alert("Please enter valid deal details.");
    return;
  }

  const deal = {
    id: String(Date.now()),
    name,
    originalPrice: price,
    discountPercent,
    discountedPrice: Math.round(price * (1 - discountPercent / 100)),
    endsAt: Date.now() + minutes * 60 * 1000
  };

  saveDeals([...getDeals(), deal]);
  event.target.reset();
  renderAdminDeals();
});

window.addEventListener("storage", renderAdminDeals);
renderAdminDeals();