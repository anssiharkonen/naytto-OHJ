const STORAGE_KEY = 'mikkeliEvents';
const ADMIN_PASS = "mikkeli2026"; 
let adminMap, adminMarker;
let currentImageData = "";

/* =============================
   KIRJAUTUMINEN
   ============================= */
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
        alert("Väärä salasana!");
        window.location.href = "index.html";
    }
}

function naytaSisalto() {
    document.getElementById('adminContent').style.display = 'block';
    renderAdminTable();
    initAdminMap();
}

/* =============================
   ADMIN-KARTTA
   ============================= */
function initAdminMap() {
    adminMap = L.map('adminMap').setView([61.6887, 27.2723], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(adminMap);

    adminMap.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        document.getElementById('lat').value = lat;
        document.getElementById('lng').value = lng;

        if (adminMarker) {
            adminMarker.setLatLng(e.latlng);
        } else {
            adminMarker = L.marker(e.latlng).addTo(adminMap);
        }
    });
}

/* =============================
   KUVAN KÄSITTELY
   ============================= */
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
   TALLENNUS
   ============================= */
document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const rawDate = document.getElementById('date').value;
    let formattedDate = rawDate.split("-").reverse().join(".");

    const newEvent = {
        name: document.getElementById('name').value,
        date: formattedDate,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value,
        lat: parseFloat(document.getElementById('lat').value),
        lng: parseFloat(document.getElementById('lng').value),
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        image: currentImageData || "kuvat/oletus.png"
    };

    const events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    events.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

    this.reset();
    if(adminMarker) adminMap.removeLayer(adminMarker);
    adminMarker = null;
    document.getElementById('imagePreview').style.display = 'none';
    currentImageData = "";
    alert('Tallennettu!');
    renderAdminTable();
});

function renderAdminTable() {
    const list = document.getElementById('adminEventList');
    const events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    list.innerHTML = '';
    events.forEach((event, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${event.name}</td>
            <td>${event.date} klo ${event.time}</td>
            <td><button class="delete-btn" onclick="deleteEvent(${index})">Poista</button></td>
        `;
        list.appendChild(tr);
    });
}

window.deleteEvent = function(index) {
    if (confirm('Poistetaanko?')) {
        const events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        events.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        renderAdminTable();
    }
};

tarkistaKirjautuminen();