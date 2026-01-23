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
            lat = 61.6991; lng = 27.2628;
        } 
        else if (loc.includes("mikaeli")) {
            // HUGO-tapahtuma ja Mikaeli
            lat = 61.6963; lng = 27.2464;
        } 
        else if (loc.includes("ravirata")) {
            lat = 61.6985; lng = 27.2550;
        }
        else if (loc.includes("stella")) {
            lat = 61.6895; lng = 27.2730;
        }
        else if (loc.includes("tori")) {
            lat = 61.6887; lng = 27.2723;
        }

        // Jos tapahtumalla on omat koordinaatit (Admin-paneelista tallennettu), käytetään niitä
        if (event.lat && event.lng) {
            lat = event.lat;
            lng = event.lng;
        }

        // Määritellään kuva: oletuskuva jos event.image puuttuu
        const imageUrl = event.image || 'kuvat/oletus.png';

        // Luodaan markkeri
        const marker = L.marker([lat, lng]).addTo(map);
        
        // Luodaan pop-up ikkuna kuvalla ja tyyleillä
        const popupContent = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-width: 200px; max-width: 250px;">
                <img src="${imageUrl}" alt="${event.name}" 
                     style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;"
                     onerror="this.src='kuvat/oletus.png'">
                
                <h3 style="margin: 0 0 5px 0; color: #2ea177; font-size: 1.1rem; line-height: 1.2;">${event.name}</h3>
                
                <div style="font-size: 0.85rem; color: #333; margin-bottom: 8px;">
                    <p style="margin: 2px 0;"><b>📅 Päivä:</b> ${event.date}</p>
                    <p style="margin: 2px 0;"><b>⏰ Klo:</b> ${event.time}</p>
                    <p style="margin: 2px 0;"><b>📍 Paikka:</b> ${event.location}</p>
                </div>

                <p style="margin: 5px 0; font-size: 0.8rem; color: #666; border-top: 1px solid #eee; padding-top: 5px;">
                    ${event.description}
                </p>

                <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="
                        background: #2ea177; 
                        color: white; 
                        padding: 2px 10px; 
                        border-radius: 20px; 
                        font-size: 0.7rem; 
                        text-transform: uppercase;
                        font-weight: bold;
                    ">${event.category}</span>
                    <span style="font-size: 0.75rem; font-weight: bold; color: #2ea177;">${event.price}</span>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

// Suoritetaan lataus heti kun skripti ajetaan
loadMarkers();