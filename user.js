const DEALS_KEY = "foodExpressDeals";

function renderLimitedDeals() {
  const container = document.getElementById("limitedDeals");
  if (!container) return;

  const deals = JSON.parse(localStorage.getItem(DEALS_KEY) || "[]");
  const activeDeals = deals.filter(deal => deal.endsAt > Date.now());

  container.replaceChildren();

  if (activeDeals.length === 0) {
    container.textContent = "No active deals right now. Check back soon!";
    return;
  }

  activeDeals.forEach(deal => {
    const card = document.createElement("article");
    card.className = "limited-deal-card";

    const title = document.createElement("h3");
    title.textContent = `🔥 ${deal.name}`;

    const price = document.createElement("p");
    const oldPrice = document.createElement("del");
    oldPrice.textContent = `₹${deal.originalPrice}`;
    const newPrice = document.createElement("strong");
    newPrice.textContent = ` ₹${deal.discountedPrice}`;
    price.append(oldPrice, newPrice);

    const discount = document.createElement("p");
    discount.textContent = `${deal.discountPercent}% off`;

    const timer = document.createElement("p");
    timer.className = "deal-countdown";

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.textContent = "Add Deal to Cart";
    addButton.addEventListener("click", () => addDealToCart(deal));

    card.append(title, price, discount, timer, addButton);
    container.appendChild(card);

    function updateTimer() {
      const remaining = deal.endsAt - Date.now();

      if (remaining <= 0) {
        renderLimitedDeals();
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      timer.textContent =
        `⏳ Ends in ${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    updateTimer();

    const interval = setInterval(() => {
      if (!document.body.contains(card)) {
        clearInterval(interval);
        return;
      }
      updateTimer();
    }, 1000);
  });
}

function addDealToCart(deal) {
  const existing = cart.find(item => item.id === deal.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: deal.id,
      name: deal.name,
      category: "Limited Time Deal",
      restaurant: "FoodExpress Deal",
      price: deal.discountedPrice,
      emoji: "⚡",
      quantity: 1
    });
  }

  saveCart();
  updateCartCount();
  alert(`${deal.name} added to your cart at the discounted price!`);
}

document.addEventListener("DOMContentLoaded", renderLimitedDeals);
window.addEventListener("storage", renderLimitedDeals);