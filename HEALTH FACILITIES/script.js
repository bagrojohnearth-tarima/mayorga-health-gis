// 1. Initialize Map Object Directly Centered on Mayorga, Leyte
const map = L.map('map', {
    center: [10.9031, 125.0059],
    zoom: 14, 
    zoomControl: false // Configured false to layout zoom control tools cleanly on top-right
});

L.control.zoom({ position: 'topright' }).addTo(map);

// 2. Base View Layer Channels
const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
});

// 3. Define Vector Category Groups for the Layer Controls
const rhuLayer = L.layerGroup().addTo(map);
const barangayLayer = L.layerGroup().addTo(map);
const pharmacyLayer = L.layerGroup().addTo(map);

// 4. Color and Icon Logo Mapper Helper
function getFacilityMeta(category) {
    switch(category) {
        case 'Hospital': 
            return { color: '#e74c3c', icon: 'local_hospital' }; // Red + Hospital Cross Logo
        case 'Clinic':   
            return { color: '#e67e22', icon: 'medical_services' }; // Orange + Clinic Shield Logo
        case 'Pharmacy': 
            return { color: '#2ecc71', icon: 'medication' }; // Green + Pill Logo
        default:         
            return { color: '#34495e', icon: 'place' };
    }
}

let markerList = [];

// 5. Parse Mayorga GeoJSON Elements and Plot Custom Vector Markers
L.geoJSON(healthFacilitiesData, {
    pointToLayer: function (feature, latlng) {
        const category = feature.properties.category;
        const meta = getFacilityMeta(category);
        
        // Define Custom HTML Marker Element Housing the Icon Logo
        const customHtmlIcon = L.divIcon({
            html: `
                <div class="custom-marker-pin" style="background-color: ${meta.color};">
                    <span class="material-icons">${meta.icon}</span>
                </div>
            `,
            className: 'custom-leaflet-icon',
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -15]
        });

        const geoMarker = L.marker(latlng, { icon: customHtmlIcon });

        // Cache parameters to internal listing table for Search Engine lookups
        markerList.push({
            id: feature.properties.id || Math.random(),
            name: feature.properties.name,
            category: category,
            desc: feature.properties.desc,
            markerInstance: geoMarker,
            coords: latlng
        });

        // Responsive Popup Layout Injecting Data
        const popupContent = `
            <div class="custom-popup" style="width: 240px; font-family: sans-serif;">
                <div style="font-weight:700; font-size:1.05rem; color:#2c3e50; line-height:1.2;">${feature.properties.name}</div>
                <span style="background-color:${meta.color}; display:inline-block; padding:3px 8px; border-radius:4px; font-size:0.7rem; color:white; font-weight:bold; margin: 6px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">${category}</span>
                
                <div style="width:100%; height:120px; margin-bottom:10px; overflow:hidden; border-radius:6px; background-color:#eee; border: 1px solid #e2e8f0;">
                    <img src="${feature.properties.image_url}" alt="${feature.properties.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src='https://placehold.co/240x120?text=No+Photo+Available';">
                </div>

                <p style="font-size:0.85rem; color:#4a5568; line-height:1.4; margin-bottom:8px;">${feature.properties.desc}</p>
                <div style="margin-top:8px; font-size:0.75rem; color:#718096; border-top:1px solid #edf2f7; padding-top:6px; display:flex; align-items:center; gap:4px;">
                    <span class="material-icons" style="font-size:12px;">contact_phone</span>
                    <span><b>Contact:</b> ${feature.properties.contact}</span>
                </div>
            </div>
        `;
        
        geoMarker.bindPopup(popupContent);

        if (category === 'Hospital') { rhuLayer.addLayer(geoMarker); }
        else if (category === 'Clinic') { barangayLayer.addLayer(geoMarker); }
        else if (category === 'Pharmacy') { pharmacyLayer.addLayer(geoMarker); }

        return geoMarker;
    }
});

// Layer Control Switcher Panel Placement Setup
const baseMaps = { "<span style='font-size: 0.85rem; font-weight:500;'>Street View</span>": openStreetMap, "<span style='font-size: 0.85rem; font-weight:500;'>Satellite View</span>": satelliteMap };
const overlayMaps = { " Main RHU": rhuLayer, " Barangay Stations": barangayLayer, " Pharmacies": pharmacyLayer };
L.control.layers(baseMaps, overlayMaps, { collapsed: false, position: 'topright' }).addTo(map);

// 6. User Live Geo-Tracking Target Control Addition
const locateControl = L.control({ position: 'topright' });
locateControl.onAdd = function() {
    const btnContainer = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    btnContainer.innerHTML = `
        <button id="map-locate-btn" title="Find My Location" style="background: white; border: none; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px;">
            <span class="material-icons" style="color: #4a5568; font-size: 20px;">my_location</span>
        </button>
    `;
    return btnContainer;
};
locateControl.addTo(map);

document.getElementById('map-locate-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    map.locate({setView: true, maxZoom: 16});
});

map.on('locationfound', function(e) {
    L.circle(e.latlng, e.accuracy).addTo(map);
    L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
});


// 7. Interactive Sidebar Drawer Actions (Mobile Friendly)
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const sidebar = document.getElementById('sidebar');

toggleSidebarBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('sidebar-visible')) {
        sidebar.classList.remove('sidebar-visible');
        sidebar.classList.add('sidebar-hidden');
        toggleSidebarBtn.innerHTML = '<span class="material-icons">menu</span>';
    } else {
        sidebar.classList.remove('sidebar-hidden');
        sidebar.classList.add('sidebar-visible');
        toggleSidebarBtn.innerHTML = '<span class="material-icons">close</span>';
    }
});


// 8. Auto-Filter & Interactive Sidebar Directory Logic
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const directoryList = document.getElementById('directory-list');

function focusOnFacility(coords, markerInstance) {
    map.setView(coords, 16);
    markerInstance.openPopup();
    
    // Auto collapse drawer layout on mobile once target focus executes
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('sidebar-visible');
        sidebar.classList.add('sidebar-hidden');
        toggleSidebarBtn.innerHTML = '<span class="material-icons">menu</span>';
    }
}

function renderDirectory(filterText = "") {
    directoryList.innerHTML = "";
    const cleanFilter = filterText.toLowerCase().trim();
    
    const matches = markerList.filter(item => 
        item.name.toLowerCase().includes(cleanFilter) || 
        item.category.toLowerCase().includes(cleanFilter) ||
        item.desc.toLowerCase().includes(cleanFilter)
    );

    if (matches.length === 0) {
        directoryList.innerHTML = '<p class="no-results">No facilities discovered.</p>';
        return;
    }

    matches.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'directory-card';
        const meta = getFacilityMeta(item.category);
        
        itemCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background-color: ${meta.color}; color: white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <span class="material-icons" style="font-size: 18px;">${meta.icon}</span>
                </div>
                <div>
                    <div class="card-name">${item.name}</div>
                    <div class="card-meta">${item.category}</div>
                </div>
            </div>
            <span class="material-icons card-arrow">near_me</span>
        `;
        
        itemCard.addEventListener('click', () => focusOnFacility(item.coords, item.markerInstance));
        directoryList.appendChild(itemCard);
    });
}

// Monitor User Key Inputs inside Search Bar
searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.length > 0) {
        clearSearchBtn.classList.remove('hidden');
    } else {
        clearSearchBtn.classList.add('hidden');
    }
    renderDirectory(val);
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = "";
    clearSearchBtn.classList.add('hidden');
    renderDirectory("");
});

// Run Initial Setup Inits on Startup View
renderDirectory("");