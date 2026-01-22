/* =============================
   KARTAN ALUSTUS
   ============================= */
// Asetetaan kartta Mikkelin keskustaan
const map = L.map('map').setView([61.6887, 27.2723], 13);

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
        // HUOM: Jos eventillä ei ole koordinaatteja, käytetään oletusta (Mikkeli tori) 
        // tai hypätään yli. Tässä esimerkissä lisätään koordinaatit testiksi:
        let lat = event.lat || 61.6887; 
        let lng = event.lng || 27.2723;

        // Jos tapahtuma on esim. Jukurien peli, asetetaan se hallille
        if(event.location.includes("Areena") || event.location.includes("jäähalli")) {
            lat = 61.6991; lng = 27.2628;
        } else if(event.location.includes("Mikaeli")) {
            lat = 61.6963; lng = 27.2464;
        } else if(event.location.includes("ravirata")) {
            lat = 61.6985; lng = 27.2550;
        }

        const marker = L.marker([lat, lng]).addTo(map);
        
        // Luodaan pop-up ikkuna
        const popupContent = `
            <div style="font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 5px 0;">${event.name}</h3>
                <p><b>Aika:</b> ${event.date} klo ${event.time}</p>
                <p><b>Paikka:</b> ${event.location}</p>
                <p>${event.description}</p>
                <span class="event-category category-${event.category}">${event.category}</span>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

// Suoritetaan lataus
loadMarkers();