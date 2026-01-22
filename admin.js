/* =============================
   SALASANASUOJAUS JA ISTUNTO
   ============================= */
const STORAGE_KEY = 'mikkeliEvents';
const ADMIN_PASS = "mikkeli2026"; 

function tarkistaKirjautuminen() {
    if (sessionStorage.getItem('isAdmin') === 'true') {
        naytaSisalto();
        return;
    }

    const syote = prompt("Syötä salasana päästäksesi hallintaan:");

    if (syote === ADMIN_PASS) {
        sessionStorage.setItem('isAdmin', 'true');
        naytaSisalto();
    } else {
        alert("Väärä salasana! Ohjataan takaisin pääsivulle.");
        window.location.href = "index.html";
    }
}

function naytaSisalto() {
    document.getElementById('adminContent').style.display = 'block';
    renderAdminTable();
}

tarkistaKirjautuminen();

/* =============================
   KUVAESIKATSELU
   ============================= */
let currentImageData = "";

const imageInput = document.getElementById('imageInput');
if (imageInput) {
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentImageData = event.target.result;
                const preview = document.getElementById('imagePreview');
                preview.src = currentImageData;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

/* =============================
   TALLENNUS JA MUOTOILU
   ============================= */
document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Haetaan raaka-arvot HTML-kentistä
    const rawDate = document.getElementById('date').value; // 2026-01-22
    const rawTime = document.getElementById('time').value; // 18:00

    // Muunnetaan ISO-päivämäärä suomalaiseen muotoon PP.KK.VVVV
    let formattedDate = rawDate;
    if (rawDate) {
        const parts = rawDate.split("-");
        formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    const newEvent = {
        name: document.getElementById('name').value,
        date: formattedDate,
        time: rawTime,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value,
        mapsLink: document.getElementById('mapsLink').value,
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        image: currentImageData || "kuvat/oletus.png"
    };

    const events = getEvents();
    events.push(newEvent);
    saveEvents(events);

    // Tyhjennys
    this.reset();
    document.getElementById('imagePreview').style.display = 'none';
    currentImageData = "";
    alert('Tapahtuma tallennettu onnistuneesti!');
});

/* =============================
   APUFUNKTIOT
   ============================= */
function getEvents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    renderAdminTable();
}

function deleteEvent(index) {
    if (confirm('Haluatko varmasti poistaa tämän tapahtuman?')) {
        const events = getEvents();
        events.splice(index, 1);
        saveEvents(events);
    }
}

function renderAdminTable() {
    const list = document.getElementById('adminEventList');
    if (!list) return;
    
    const events = getEvents();
    list.innerHTML = '';
    
    events.forEach((event, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${event.name}</strong></td>
            <td>${event.date} klo ${event.time}</td>
            <td><button class="delete-btn" onclick="deleteEvent(${index})">Poista</button></td>
        `;
        list.appendChild(tr);
    });
}