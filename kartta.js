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
        // Oletuskoordinaatit (Mikkelin tori)
        let lat = 61.6887; 
        let lng = 27.2723;

        // Muunnetaan paikkatieto pieniksi kirjaimiksi vertailua varten
        const loc = event.location.toLowerCase();

        /* Sijaintien määrittely avainsanojen perusteella */
        
        if (loc.includes("areena") || loc.includes("jäähalli")) {
            // Jukurit - Saipa
            lat = 61.6991; lng = 27.2628;
        } 
        else if (loc.includes("mikaeli")) {
            // HUGO ja Raskasta Joulua
            lat = 61.6963; lng = 27.2464;
        } 
        else if (loc.includes("ravirata")) {
            // Mikkelin ravit
            lat = 61.6985; lng = 27.2550;
        }
        else if (loc.includes("stella")) {
            // Lucia-tapahtuma
            lat = 61.6895; lng = 27.2730;
        }
        else if (loc.includes("tori")) {
            // Mikkelin joulutori
            lat = 61.6887; lng = 27.2723;
        }

        // Luodaan markkeri
        const marker = L.marker([lat, lng]).addTo(map);
        
        // Luodaan pop-up ikkuna tyyliteltynä
        const popupContent = `
            <div style="font-family: sans-serif; min-width: 160px;">
                <h3 style="margin: 0 0 5px 0; color: #2ea177; font-size: 1.1rem;">${event.name}</h3>
                <p style="margin: 2px 0; font-size: 0.9rem;"><b>📅 Päivä:</b> ${event.date}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><b>⏰ Klo:</b> ${event.time}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><b>📍 Paikka:</b> ${event.location}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 8px 0;">
                <p style="margin: 5px 0; font-size: 0.85rem; color: #555;">${event.description}</p>
                <span style="
                    display: inline-block; 
                    background: #2ea177; 
                    color: white; 
                    padding: 2px 8px; 
                    border-radius: 12px; 
                    font-size: 0.75rem; 
                    text-transform: uppercase;
                    margin-top: 5px;
                ">${event.category}</span>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

// Suoritetaan lataus heti kun skripti ajetaan
loadMarkers();