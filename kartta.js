/* =============================
   KARTAN ALUSTUS
   ============================= */

// Asetetaan kartta Mikkelin keskustaan (Tori)
const map = L.map('map').setView([61.6887, 27.2723], 14);

// Lisätään OpenStreetMap-tiilet
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

/* =============================
   URL-PARAMETRIEN LUKEMINEN
   ============================= */
const urlParams = new URLSearchParams(window.location.search);
const targetLat = parseFloat(urlParams.get('lat'));
const targetLng = parseFloat(urlParams.get('lng'));

// Jos URL:ssa on koordinaatit, keskitetään niihin lähemmäs
if (!isNaN(targetLat) && !isNaN(targetLng)) {
    map.setView([targetLat, targetLng], 16);
}

/* =============================
   TAPAHTUMIEN HAKU JA PIIRTO
   ============================= */

const STORAGE_KEY = 'mikkeliEvents';

// Haetaan tapahtumat localStoragesta
function getEvents() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Funktio, joka lisää markerit kartalle
function loadMarkers() {
    const events = getEvents();

    events.forEach(event => {
        // Määritetään sijainti (käytetään tallennettuja koordinaatteja tai oletuksia)
        let lat = event.lat;
        let lng = event.lng;

        // Jos koordinaatteja ei ole, yritetään tunnistaa ne paikan nimen perusteella
        if (!lat || !lng) {
            const loc = event.location.toLowerCase();
            if (loc.includes("areena") || loc.includes("jäähalli")) { lat = 61.6991; lng = 27.2628; }
            else if (loc.includes("mikaeli")) { lat = 61.6963; lng = 27.2464; }
            else if (loc.includes("ravirata")) { lat = 61.6985; lng = 27.2550; }
            else if (loc.includes("stella")) { lat = 61.6895; lng = 27.2730; }
            else if (loc.includes("tori")) { lat = 61.6887; lng = 27.2723; }
            else { lat = 61.6887; lng = 27.2723; } // Viimeinen oletus
        }

        // Luodaan markkeri
        const marker = L.marker([lat, lng]).addTo(map);
        
        // Määritellään kuva
        const imageUrl = event.image || 'kuvat/oletus.png';

        // Luodaan pop-up ikkuna tyyliteltynä ja KUVALLA
        const popupContent = `
            <div style="font-family: sans-serif; min-width: 180px; max-width: 220px;">
                <img src="${imageUrl}" alt="${event.name}" 
                     style="width: 100%; height: 100px; object-fit: cover; border-radius: 5px; margin-bottom: 8px;"
                     onerror="this.src='kuvat/oletus.png'">
                <h3 style="margin: 0 0 5px 0; color: #2ea177; font-size: 1.1rem;">${event.name}</h3>
                <p style="margin: 2px 0; font-size: 0.9rem;"><b>📅:</b> ${event.date}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><b>📍:</b> ${event.location}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 8px 0;">
                <p style="margin: 5px 0; font-size: 0.85rem; color: #555;">${event.description}</p>
                <span style="background: #2ea177; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${event.category}</span>
            </div>
        `;
        
        marker.bindPopup(popupContent);

        // AUTOMAATTINEN POP-UP: Jos markkeri vastaa URL:n koordinaatteja, avataan se
        if (lat === targetLat && lng === targetLng) {
            marker.openPopup();
        }
    });
}

// Suoritetaan lataus heti kun skripti ajetaan
loadMarkers();