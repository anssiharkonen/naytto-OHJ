const STORAGE_KEY = 'mikkeliEvents';
let currentImageData = ""; // Tähän tallennetaan kuva tekstimuodossa

// 1. KUVAESIKATSELU JA MUUNNOS
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageData = event.target.result; // Base64-merkkijono
            const preview = document.getElementById('imagePreview');
            preview.src = currentImageData;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file); // Muuntaa tiedon tekstiksi
    }
});

// 2. TALLENNUS
document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newEvent = {
        name: document.getElementById('name').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value,
        mapsLink: document.getElementById('mapsLink').value,
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        image: currentImageData || "kuvat/default.jpg" // Käytetään valittua kuvaa
    };

    const events = getEvents();
    events.push(newEvent);
    saveEvents(events);

    // Tyhjennys
    this.reset();
    document.getElementById('imagePreview').style.display = 'none';
    currentImageData = "";
    alert('Tapahtuma tallennettu!');
});

// APUFUNKTIOT
function getEvents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    renderAdminTable();
}

function deleteEvent(index) {
    if (confirm('Poistetaanko tapahtuma?')) {
        const events = getEvents();
        events.splice(index, 1);
        saveEvents(events);
    }
}

function renderAdminTable() {
    const list = document.getElementById('adminEventList');
    const events = getEvents();
    list.innerHTML = '';
    events.forEach((event, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${event.name}</strong></td>
            <td>${event.date}</td>
            <td><button class="delete-btn" onclick="deleteEvent(${index})">Poista</button></td>
        `;
        list.appendChild(tr);
    });
}

renderAdminTable();