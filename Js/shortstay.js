document.addEventListener("DOMContentLoaded", async () => {
    Chart.register(ChartDataLabels);
    
    const urlParams = new URLSearchParams(window.location.search);
    const ccn = urlParams.get('ccn');
    
    if (!ccn) {
        alert("No facility selected.");
        return;
    }

    document.getElementById('qmHubBtn').href = `qualitymeasures.html?ccn=${ccn}`;
    document.getElementById('longStayNav').href = `longstay.html?ccn=${ccn}`;

    setupHeaderSearch(ccn);

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/quality-measures-split`);
        if (!response.ok) throw new Error("Failed to load short-stay metrics");

        const data = await response.json();
        document.getElementById('facilityName').textContent = `${data.provider_name} — Short-Stay Analysis`;

        drawShortStayBarChart(data.short_stay);
        drawShortStayRehabChart(data.short_stay);
        drawShortStayEdChart(data.short_stay);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';

    } catch (err) {
        console.error("Error loading short-stay data:", err);
        document.getElementById('loading').textContent = "Error connecting to database.";
    }
});

function drawShortStayBarChart(data) {
    const ctx = document.getElementById('shortStayBarChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.categories,
            datasets: [
                { label: 'Facility Rate (%)', data: data.facility, backgroundColor: '#f97316', barPercentage: 0.6 },
                { label: 'Natl Benchmark (%)', data: data.national, backgroundColor: '#9ca3af', barPercentage: 0.6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top' }, datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 10 } } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function drawShortStayRehabChart(data) {
    const ctx = document.getElementById('shortStayRehabChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [data.categories[1]],
            datasets: [
                { label: 'Facility', data: [data.facility[1]], backgroundColor: '#f97316', barPercentage: 0.4 },
                { label: 'National Benchmark', data: [data.national[1]], backgroundColor: '#9ca3af', barPercentage: 0.4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top' }, datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold' } } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function drawShortStayEdChart(data) {
    const ctx = document.getElementById('shortStayEdChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [data.categories[0]],
            datasets: [
                { label: 'Facility', data: [data.facility[0]], backgroundColor: '#f97316', barPercentage: 0.4 },
                { label: 'National Benchmark', data: [data.national[0]], backgroundColor: '#9ca3af', barPercentage: 0.4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top' }, datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold' } } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function setupHeaderSearch(currentCcn) {
    let typingTimer;
    const quickSearchInput = document.getElementById('quickSearch');
    const quickAutocompleteList = document.getElementById('quickAutocomplete');
    if (!quickSearchInput) return;

    quickSearchInput.addEventListener('input', function(e) {
        clearTimeout(typingTimer);
        const query = e.target.value.trim();
        if (!query) { quickAutocompleteList.innerHTML = ''; return; }
        
        typingTimer = setTimeout(async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/search?q=${encodeURIComponent(query)}`);
                const results = await response.json();
                quickAutocompleteList.innerHTML = '';
                results.slice(0, 5).forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'autocomplete-item';
                    div.innerHTML = `<strong>${item.provider_name}</strong> (${item.city}, ${item.state})`;
                    div.onclick = () => window.location.href = `shortstay.html?ccn=${item.ccn}`;
                    quickAutocompleteList.appendChild(div);
                });
            } catch (err) { console.error("Search failed", err); }
        }, 250);
    });
}