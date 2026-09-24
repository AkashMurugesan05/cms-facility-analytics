// js/search.js

// ==========================================
// 1. AUTOCOMPLETE LOGIC
// ==========================================
let typingTimer;
const searchInput = document.getElementById('searchInput');
const autocompleteList = document.getElementById('autocomplete-list');

searchInput.addEventListener('input', function(e) {
    clearTimeout(typingTimer);
    const query = e.target.value.trim();
    
    if (!query) {
        autocompleteList.innerHTML = '';
        
        // Lock the radius dropdown if they delete the facility name
        const radiusSelect = document.getElementById('radiusSelect');
        radiusSelect.disabled = true;
        radiusSelect.innerHTML = '<option value="">Select a facility first...</option>';
        
        return;
    }
    
    typingTimer = setTimeout(async () => {
        try {
            const apiUrl = `http://127.0.0.1:8000/api/search?q=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            autocompleteList.innerHTML = ''; 
            const suggestions = data.slice(0, 8);
            
            suggestions.forEach(item => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.innerHTML = `<strong>${item.provider_name}</strong> <br><span style="color: #64748b; font-size: 0.85em;">${item.city}, ${item.state} (CCN: ${item.ccn})</span>`;
                
                div.addEventListener('click', async () => {
                    // 1. Fill the search box and hide the dropdown
                    searchInput.value = item.provider_name;
                    autocompleteList.innerHTML = '';
                    
                    // 2. Set the State dropdown
                    const stateSelect = document.getElementById('stateSelect');
                    stateSelect.value = item.state;
                    
                    // 3. Fetch the Cities for that new State dynamically
                    const citySelect = document.getElementById('citySelect');
                    citySelect.disabled = true;
                    citySelect.innerHTML = '<option value="">Loading...</option>';
                    
                    try {
                        const cityRes = await fetch(`http://127.0.0.1:8000/api/cities?state=${item.state}`);
                        const cities = await cityRes.json();
                        
                        citySelect.innerHTML = `<option value="">All Cities in ${item.state}</option>`;
                        cities.forEach(c => {
                            const option = document.createElement('option');
                            option.value = c;
                            option.textContent = c;
                            citySelect.appendChild(option);
                        });
                        citySelect.disabled = false;
                        
                        // 4. Set the specific City
                        citySelect.value = item.city;
                        
                        // 5. Unlock the radius dropdown
                        const radiusSelect = document.getElementById('radiusSelect');
                        radiusSelect.disabled = false;
                        radiusSelect.innerHTML = `
                            <option value="">Any distance</option>
                            <option value="5">Within 5 Miles</option>
                            <option value="10">Within 10 Miles</option>
                            <option value="25">Within 25 Miles</option>
                            <option value="50">Within 50 Miles</option>
                        `;
                        
                    } catch (error) {
                        console.error("Failed to load cities for auto-fill", error);
                    }

                    // 6. Finally, execute the search!
                    performSearch(); 
                });
                
                autocompleteList.appendChild(div);
            });
        } catch (err) {
            console.error("Autocomplete failed:", err);
        }
    }, 250); 
});

document.addEventListener('click', function(e) {
    if (e.target !== searchInput) {
        autocompleteList.innerHTML = '';
    }
});

// ==========================================
// 2. DYNAMIC DROPDOWNS (State -> City -> Radius)
// ==========================================
const stateSelect = document.getElementById('stateSelect');
const citySelect = document.getElementById('citySelect');
const radiusSelect = document.getElementById('radiusSelect');

// Watch State to unlock Cities
stateSelect.addEventListener('change', async function() {
    const state = this.value;
    
    // Reset City and Radius if State is cleared
    if (!state) {
        citySelect.disabled = true;
        citySelect.innerHTML = '<option value="">Select a State first...</option>';
        radiusSelect.disabled = true;
        radiusSelect.innerHTML = '<option value="">Select city to enable radius</option>';
        return;
    }

    citySelect.disabled = true;
    citySelect.innerHTML = '<option value="">Loading cities...</option>';

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/cities?state=${state}`);
        const cities = await response.json();
        
        citySelect.innerHTML = '<option value="">All Cities in ' + state + '</option>';
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        
        citySelect.disabled = false;
    } catch (error) {
        console.error("Failed to fetch cities", error);
        citySelect.innerHTML = '<option value="">Error loading cities</option>';
    }
});


// ==========================================
// 3. MAIN SEARCH GRID LOGIC
// ==========================================
async function performSearch() {
    const query = searchInput.value.trim();
    const city = citySelect.value;
    const state = stateSelect.value;
    const radius = radiusSelect.value;
    const resultsContainer = document.getElementById('resultsContainer');
    
    autocompleteList.innerHTML = '';
    
    if (!query && !city && !state) {
        resultsContainer.innerHTML = `<div class="status-msg" style="color: #dc2626;">Please enter a Facility Name, City, or select a State.</div>`;
        return;
    }

    resultsContainer.innerHTML = `<div class="status-msg">Searching database registry...</div>`;

    try {
        const encodedQ = encodeURIComponent(query);
        const encodedCity = encodeURIComponent(city);
        const apiUrl = `http://127.0.0.1:8000/api/search?q=${encodedQ}&city=${encodedCity}&state=${state}&radius=${radius}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Server status: ${response.status}`);
        
        const data = await response.json();

        if (data.length === 0) {
            resultsContainer.innerHTML = `<div class="status-msg">No facilities found matching those filters.</div>`;
            return;
        }

        resultsContainer.innerHTML = "";

        data.forEach(facility => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Show distance if the radius filter was used
            const distanceTag = facility.distance !== undefined ? 
                `<br><span style="color: #004080; font-weight: 600; font-size: 0.85rem;">📍 ${facility.distance} miles away</span>` : '';

            // Handle the Star Rating format
            let ratingHtml = '';
            if (facility.overall_rating && facility.overall_rating !== 'Not Available') {
                // Creates a nice gold star format like "4 ⭐"
                ratingHtml = `<span style="color: #ca8a04; font-weight: 700; background: #fef08a; padding: 2px 8px; border-radius: 4px; font-size: 0.85rem;">${facility.overall_rating} ⭐</span>`;
            } else {
                ratingHtml = `<span style="color: #94a3b8; font-size: 0.85rem; font-weight: 500;">Rating N/A</span>`;
            }

            card.innerHTML = `
                <div>
                    <h4><a href="facility.html?ccn=${facility.ccn}">${facility.provider_name}</a></h4>
                    <p class="card-meta">Location: ${facility.city}, ${facility.state} ${distanceTag}</p>
                    <div style="margin-bottom: 12px;">${ratingHtml}</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="card-badge">CCN: ${facility.ccn}</span>
                </div>
            `;
            resultsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Search failed:", error);
        resultsContainer.innerHTML = `<div class="status-msg" style="color: #dc2626;">Failed to connect to the backend system. Is your terminal running?</div>`;
    }
}

searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') performSearch(); });