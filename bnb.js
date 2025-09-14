// ------- Mock Data -------
const PROPS = [
  {
    id: "p1",
    title: "Coastal Loft with Ocean View",
    location: "Mombasa",
    coords: [-4.0435, 39.6682],
    type: "Apartment",
    price: 88,
    rating: 4.7,
    guests: 3,
    beds: 2,
    baths: 1,
    amenities: ["Wi‑Fi", "AC", "Kitchen", "Sea view"],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d89?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Bright, airy loft right on the coast. Wake up to the sound of waves and sip coffee on your private balcony.",
  },
  {
    id: "p2",
    title: "Safari Chic Cottage",
    location: "Nairobi",
    coords: [-1.286389, 36.817223],
    type: "House",
    price: 120,
    rating: 4.9,
    guests: 5,
    beds: 3,
    baths: 2,
    amenities: ["Wi‑Fi", "Parking", "Outdoor area", "Smart TV"],
    images: [
      "https://images.unsplash.com/photo-1459535653751-d571815e906b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Modern meets rustic near national parks. Perfect base for weekend adventures.",
  },
  {
    id: "p3",
    title: "Urban Studio Near CBD",
    location: "Nairobi",
    coords: [-1.2833, 36.8167],
    type: "Studio",
    price: 55,
    rating: 4.4,
    guests: 2,
    beds: 1,
    baths: 1,
    amenities: ["Wi‑Fi", "Workspace", "Elevator"],
    images: [
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Compact, quiet, and central—ideal for business travelers and minimalist explorers.",
  },
];

// ------- Simple Router (hash-based) -------
const routes = {
  home: document.getElementById("home"),
  listings: document.getElementById("listings"),
  details: document.getElementById("details"),
  booking: document.getElementById("booking"),
};
function show(id) {
  Object.values(routes).forEach((el) => el.classList.remove("active"));
  routes[id].classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" });
}
function parseHash() {
  const h = location.hash || "#/";
  if (h.startsWith("#/property/")) {
    loadDetails(h.split("/")[2]);
    return;
  }
  if (h.startsWith("#/booking/")) {
    loadBooking(h.split("/")[2]);
    return;
  }
  if (h.startsWith("#/listings")) {
    loadListings();
    show("listings");
    return;
  }
  // default
  show("home");
}
window.addEventListener("hashchange", parseHash);

// ------- Header menu -------
function toggleMenu() {
  const nav = document.getElementById("nav");
  nav.classList.toggle("open");
  document
    .querySelector(".burger")
    .setAttribute("aria-expanded", nav.classList.contains("open"));
    if(nav.classList.contains('open')){
      
    }
    
}
window.toggleMenu = toggleMenu;

// ------- Home popular -------
function renderPopular() {
  const grid = document.getElementById("popularGrid");
  grid.innerHTML = PROPS.map((p) => cardHTML(p)).join("");
}

// ------- Listings page -------
let listState = {
  type: "All",
  maxPrice: 250,
  sort: "relevant",
  location: "",
  guests: 0,
};

function loadListings() {
  // read possible query from home search via location.hash like #/listings?location=Mombasa&guests=2
  const q = new URLSearchParams(location.hash.split("?")[1] || "");
  listState.location = (q.get("location") || "").toLowerCase();
  listState.guests = Number(q.get("guests") || 0);
  const typeSel = document.getElementById("fType");
  const priceRange = document.getElementById("fPrice");
  const priceVal = document.getElementById("priceVal");
  const sortSel = document.getElementById("fSort");
  typeSel.value = listState.type;
  priceRange.value = listState.maxPrice;
  priceVal.textContent = listState.maxPrice;
  sortSel.value = listState.sort;
  const apply = () => {
    listState.type = typeSel.value;
    listState.maxPrice = Number(priceRange.value);
    listState.sort = sortSel.value;
    priceVal.textContent = listState.maxPrice;
    renderCards();
  };
  typeSel.onchange = apply;
  priceRange.oninput = apply;
  sortSel.onchange = apply;
  renderCards();
}

function renderCards() {
  const cards = document.getElementById("cards");
  let data = PROPS.filter((p) =>
    listState.type === "All" ? true : p.type === listState.type
  )
    .filter((p) => p.price <= listState.maxPrice)
    .filter((p) => (listState.guests ? p.guests >= listState.guests : true))
    .filter((p) =>
      listState.location
        ? p.location.toLowerCase().includes(listState.location)
        : true
    );
  if (listState.sort === "price-asc")
    data = [...data].sort((a, b) => a.price - b.price);
  if (listState.sort === "price-desc")
    data = [...data].sort((a, b) => b.price - a.price);
  if (listState.sort === "rating")
    data = [...data].sort((a, b) => b.rating - a.rating);
  document.getElementById(
    "resultsMeta"
  ).textContent = `${data.length} result(s)`;
  cards.innerHTML = data.map((p) => cardHTML(p)).join("");
}

//page render function

function cardHTML(p) {
  return `
        <a class="card" href="#/property/${p.id}">
          <img src="${p.images[0]}" alt="${p.title}" />
          <div class="body">
            <div class="row-between">
              <h3 style="margin:.2rem 0" title="${p.title}">${p.title}</h3>
              <div class="rating">${p.rating}★</div>
            </div>
            <div class="muted">${p.location} • ${p.type}</div>
            <div style="margin-top:.5rem;font-weight:700">$${p.price}<span class="muted" style="font-weight:500"> / night</span></div>
          </div>
        </a>`;
}

// ------- Home search -> listings -------
function goSearch() {
  const loc = document.getElementById("qLocation").value.trim();
  const guests = document.getElementById("qGuests").value;
  const params = new URLSearchParams();
  if (loc) params.set("location", loc);
  if (guests) params.set("guests", guests);
  location.hash = `#/listings?${params.toString()}`;
}
window.goSearch = goSearch;

// ------- Details page -------
let mapObj = null; // Leaflet instance
function loadDetails(id) {
  const p = PROPS.find((x) => x.id === id);
  if (!p) {
    location.hash = "#/listings";
    return;
  }
  show("details");
  document.getElementById("dTitle").textContent = p.title;
  document.getElementById("dRating").textContent = `${p.rating}★`;
  document.getElementById("dMeta").textContent = `${p.location} • ${p.type}`;
  document.getElementById("dDesc").textContent = p.description;
  document.getElementById("dPrice").textContent = `$${p.price}`;
  document.getElementById(
    "dFacts"
  ).textContent = `Up to ${p.guests} guests • ${p.beds} beds • ${p.baths} baths`;
  document.getElementById("dGallery").innerHTML = p.images
    .map((src) => `<img src="${src}" alt="${p.title}">`)
    .join("");
  document.getElementById("dAmenities").innerHTML = p.amenities
    .map((a) => `<li class="chip">${a}</li>`)
    .join("");

  // Map
  setTimeout(() => {
    // ensure container is visible
    if (mapObj) {
      mapObj.remove();
      mapObj = null;
    }
    mapObj = L.map("map", { scrollWheelZoom: false }).setView(p.coords, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(mapObj);
    L.marker(p.coords).addTo(mapObj).bindPopup(p.title);
  }, 0);

  // attach booking info to state
  window.__current = p;
}

function goBook() {
  const p = window.__current;
  if (!p) return;
  const dates = document.getElementById("bDates").value || "—";
  const guests = Number(document.getElementById("bGuests").value || 1);
  location.hash = `#/booking/${p.id}?dates=${encodeURIComponent(
    dates
  )}&guests=${guests}`;
}
window.goBook = goBook;

// ------- Booking page -------
function loadBooking(id) {
  const p = PROPS.find((x) => x.id === id);
  if (!p) {
    location.hash = "#/listings";
    return;
  }
  const q = new URLSearchParams(location.hash.split("?")[1] || "");
  const dates = q.get("dates") || "—";
  const guests = Number(q.get("guests") || 1);
  document.getElementById("bImg").src = p.images[0];
  document.getElementById("bImg").alt = p.title;
  document.getElementById("bTitle").textContent = p.title;
  document.getElementById("bMeta").textContent = `${p.location} • ${p.type}`;
  document.getElementById(
    "bDatesMeta"
  ).textContent = `Dates: ${dates} • Guests: ${guests}`;
  document.getElementById("bTotal").textContent = `Total: $${
    (guests || 1) * p.price
  }`;
  show("booking");
  document.getElementById("bSuccess").style.display = "none";
}

function confirmBooking() {
  document.getElementById("bSuccess").style.display = "inline-block";
}
window.confirmBooking = confirmBooking;

// ------- Init -------
document.getElementById("year").textContent = new Date().getFullYear();
renderPopular();
parseHash();

// date flatpickr

  flatpickr("#dates", {
    mode: "range",          // allows selecting check-in & check-out
    dateFormat: "Y-m-d",    // format like 2025-09-12
    minDate: "today",       // no past dates
  });

