/* =============================
   LOCALSTORAGE FUNKTIOT
   ============================= */
const STORAGE_KEY = 'mikkeliEvents';

// Hae tapahtumat localStoragesta
function getEventsFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

// Tallenna tapahtumat localStorageen
function saveEventsToStorage(eventsArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsArray));
}

// Lisää tai päivitä yksittäinen tapahtuma localStoragessa
function updateEventInStorage(updatedEvent) {
    let eventsArray = getEventsFromStorage() || [];
    const index = eventsArray.findIndex(e => e.name === updatedEvent.name && e.date === updatedEvent.date);
    if (index !== -1) {
        eventsArray[index] = updatedEvent; // päivitä olemassa oleva
    } else {
        eventsArray.push(updatedEvent); // lisää uusi
    }
    saveEventsToStorage(eventsArray);
}

/* =============================
   OLETUSTAPAHTUMAT
   ============================= */
const defaultEvents = [
    {
        name: "Mikkelin ravit",
        date: "29.11.2025",
        time: "13:00",
        location: "Mikkelin ravirata",
        address: "Mikkelin ravirata, Raviradantie 22, Mikkeli",
        category: "urheilu",
        price: "Tarkista hinta",
        description: "Ravikilpailut",
        image: "kuvat/ravit.jpg"
    },
    { 
        name: "Jukurit - Saipa",
        date: "5.12.2025",
        time: "18:30",
        location: "Let's Go Areena",
        address: "Mikkelin jäähalli, Raviradantie 24, Mikkeli",
        category: "urheilu",
        price: "Alkaen 16 euroa",
        description: "Jääkiekko",
        image: "kuvat/jaakiekko.jpg"
    },
    { 
        name: "HUGO",
        date: "22.11.2025",
        time: "19:00",
        location: "Mikaeli",
        address: "Martti Talvela-sali, Sointukatu 1, Mikkeli",
        category: "kulttuuri",
        price: "Alkaen 29,50 euroa",
        description: "Konsertti",
        image: "kuvat/hugo.jpg"
    },
    { 
        name: "Raskasta Joulua",
        date: "7.12.2025",
        time: "19:00",
        location: "Mikaeli",
        address: "Martti Talvela-sali, Sointukatu 1, Mikkeli",
        category: "kulttuuri",
        price: "Alkaen 44,90 euroa",
        description: "Konsertti",
        image: "kuvat/raskastajoulua.jpg"
    },
    { 
        name: "Lucia-tapahtuma",
        date: "13.12.2025",
        time: "12:00 - 13:00",
        location: "Kauppakeskus Stella",
        address: "Hallituskatu 3-5, Mikkeli",
        category: "kulttuuri",
        price: "Ilmainen",
        description: "Konsertti",
        image: "kuvat/lucia.jpg"
    },
    {
        name: "Mikkelin joulutori",
        date: "13.12.-23.12.2025",
        time: "10:00 - 18:00",
        location: "Mikkelin tori",
        address: "Hallituskatu 3, Mikkeli",
        category: "kulttuuri",
        price: "0 euroa",
        description: "Toritapahtuma",
        image: "kuvat/joulutori.jpg"
    },
];

/* =============================
   LADATAAN TAPAHTUMAT
   ============================= */
let events = getEventsFromStorage() || defaultEvents;

// Tallennetaan localStorageen jos sitä ei ole vielä
if (!getEventsFromStorage()) {
    saveEventsToStorage(events);
}

/* =============================
   MUUT MUUTTUJAT SUODATUKSEEN
   ============================= */
let currentCategory = 'kaikki';
let currentSearch = '';
let selectedDate = null;
let selectedWeek = null;
let selectedMonth = null;
let startTime = null;
let endTime = null;

/* =============================
   FUNKTIOT PÄIVÄMÄÄRÄVÄLILLE
   ============================= */
function Paivavali(dateStr) {
    if (dateStr.includes('-')) {
        const [startStr, endStr] = dateStr.split('-');
        const [startDay, startMonth] = startStr.split('.');
        const [endDay, endMonth, endYear] = endStr.split('.');

        const startDate = new Date(endYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);

        return [startDate, endDate];
    }
    const [day, month, year] = dateStr.split('.');
    const date = new Date(year, month - 1, day);
    return [date, date];
}

/* =============================
   NÄYTÄ TAPAHTUMAT
   ============================= */
function displayEvents(eventsToShow) {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';

    if (eventsToShow.length === 0) {
        grid.innerHTML = '<p class="no-events">Ei tapahtumia annetuilla hakuehdoilla.</p>';
        return;
    }

    eventsToShow.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        // Määritellään kuva: jos event.image puuttuu tai on tyhjä, käytetään oletuskuvaa
        const imageUrl = event.image || 'kuvat/oletus.png';
        
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`;
        
        card.innerHTML = `
          <img src="${imageUrl}" class="event-image" alt="${event.name}" onerror="this.src='kuvat/oletus.png'">
          <div class="event-content">
            <span class="event-category category-${event.category}">${event.category}</span>
            <h2 class="event-title">${event.name}</h2>
            <p class="event-info">${event.date} klo ${event.time}</p>
            <p class="event-info">${event.location}</p>
            <p class="event-info">${event.description}</p>
            <p class="event-price">${event.price}</p>
            <a href="${mapsUrl}" target="_blank" class="map-button">Näytä kartalla</a>
          </div>
        `;
        
        grid.appendChild(card);
    });
}

/* =============================
   SUODATUSFUNKTIO
   ============================= */
function filterEvents() {
    let filtered = events;

    if (currentCategory !== 'kaikki') {
        filtered = filtered.filter(e => e.category === currentCategory);
    }

    if (currentSearch) {
        filtered = filtered.filter(e => 
            e.name.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    // Päivä suodatus
    if (selectedDate) {
        filtered = filtered.filter(e => {
            const [start, end] = Paivavali(e.date);
            const [sDay, sMonth, sYear] = selectedDate.split('.');
            const selected = new Date(sYear, sMonth - 1, sDay);
            return selected >= start && selected <= end;
        });

    // Viikko suodatus
    } else if (selectedWeek) {
        filtered = filtered.filter(e => {
            const [eventStart, eventEnd] = Paivavali(e.date);
            const [yearStr, weekStr] = selectedWeek.split('-W');
            const year = parseInt(yearStr);
            const week = parseInt(weekStr);

            const simple = new Date(year, 0, 1 + (week - 1) * 7);
            const dow = simple.getDay();
            let isoWeekStart = new Date(simple);

            if (dow <= 4 && dow > 0) {
                isoWeekStart.setDate(simple.getDate() - (dow - 1)); 
            } else {
                isoWeekStart.setDate(simple.getDate() + (8 - dow)); 
            }

            const endDate = new Date(isoWeekStart);
            endDate.setDate(isoWeekStart.getDate() + 6);

            return eventStart <= endDate && eventEnd >= isoWeekStart;
        });

    // Kuukausi suodatus
    } else if (selectedMonth) {
        filtered = filtered.filter(e => {
            const [eventStart, eventEnd] = Paivavali(e.date);
            const [sMonth, sYear] = selectedMonth.split('.');
            const monthStart = new Date(sYear, sMonth - 1, 1);
            const monthEnd = new Date(sYear, sMonth, 0);
            return eventStart <= monthEnd && eventEnd >= monthStart;
        });
    }

    // Aika suodatus
    if (startTime && endTime) {
        filtered = filtered.filter(e => {
            const eventStartTime = e.time.split(' - ')[0];
            return eventStartTime >= startTime && eventStartTime <= endTime;
        });
    }

    displayEvents(filtered);
}

/* =============================
   KATEGORIAPAINIKKEET
   ============================= */
function filterByCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    filterEvents();
}

document.getElementById('searchInput').addEventListener('input', function(e) {
    currentSearch = e.target.value;
    filterEvents();
});

/* =============================
   PÄIVÄMÄÄRÄDROPDOWN
   ============================= */
function toggleDropdown() {
    document.getElementById('dateDropdown').classList.toggle('show');
}

function Suodatavalitut() {
    selectedDate = null;
    selectedWeek = null;
    selectedMonth = null;
    startTime = null;
    endTime = null;

    document.querySelectorAll('.date-picker').forEach(el => {
        el.style.display = 'none';
        el.value = '';
    });

    document.querySelectorAll('.btn-aika').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.time-picker').forEach(el => {
        el.style.display = 'none';
        el.value = '';
    });

    document.querySelectorAll('#dateDropdown .btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    filterEvents();
}

function showDateFilter(type) {
    document.querySelectorAll('.date-picker').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.btn-aika').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.time-picker').forEach(el => {
        el.style.display = 'none';
        el.value = '';
    });

    if (type === 'paiva') {
        const input = document.getElementById('paivaInput');
        input.style.display = 'inline-block';
        document.getElementById('aikaPaivaBtn').style.display = 'inline-block';
        input.onchange = function () {
            if (this.value) {
                const [year, month, day] = this.value.split('-');
                selectedDate = `${parseInt(day)}.${parseInt(month)}.${year}`;
            } else {
                selectedDate = null;
            }
            filterEvents();
        };
    }

    if (type === 'viikko') {
        selectedDate = null;  
        selectedMonth = null;
        const input = document.getElementById('viikkoInput');
        input.style.display = 'inline-block';
        document.getElementById('aikaViikkoBtn').style.display = 'inline-block';
        input.onchange = function () {
            selectedWeek = this.value;
            filterEvents();
        };
    }

    if (type === 'kuukausi') {
        selectedDate = null;  
        selectedWeek = null;
        const input = document.getElementById('kuukausiInput');
        input.style.display = 'inline-block';
        document.getElementById('aikaKuukausiBtn').style.display = 'inline-block';
        input.onchange = function () {
            if (this.value) {
                const [year, month] = this.value.split('-');
                selectedMonth = `${parseInt(month)}.${year}`;
            } else {
                selectedMonth = null;
            }
            filterEvents();
        };
    }
}

/* =============================
   AIKA VALINTA
   ============================= */
function Aikavalinta(type) {
    const startInput = document.getElementById(`aika${type.charAt(0).toUpperCase() + type.slice(1)}Al`);
    const endInput = document.getElementById(`aika${type.charAt(0).toUpperCase() + type.slice(1)}Lo`);

    const show = startInput.style.display !== 'inline-block';
    document.querySelectorAll('.time-picker').forEach(t => t.style.display = 'none');
    startInput.style.display = show ? 'inline-block' : 'none';
    endInput.style.display = show ? 'inline-block' : 'none';

    if (!show) {
        startInput.value = '';
        endInput.value = '';
        startTime = null;
        endTime = null;
        filterEvents();
        return;
    }

    startInput.onchange = function () {
        startTime = this.value;
        filterEvents();
    };

    endInput.onchange = function () {
        endTime = this.value;
        filterEvents();
    };
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn') && !event.target.closest('#dateDropdown')) {
        document.getElementById('dateDropdown').classList.remove('show');
    }
};

/* =============================
   NÄYTÄ TAPAHTUMAT ENSIMMÄISEKSI
   ============================= */
displayEvents(events);
