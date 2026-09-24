document.addEventListener("DOMContentLoaded", async () => {
    Chart.register(ChartDataLabels);
    
    const urlParams = new URLSearchParams(window.location.search);
    const ccn = urlParams.get('ccn');
    
    if (!ccn) {
        alert("No facility selected.");
        return;
    }

    // Dynamically link buttons with current CCN
    document.getElementById('backBtn').href = `facility.html?ccn=${ccn}`;
    document.getElementById('longStayLink').href = `longstay.html?ccn=${ccn}`;
    document.getElementById('shortStayLink').href = `shortstay.html?ccn=${ccn}`;

    setupHeaderSearch();

    try {
        const [summaryRes, qmHistoryRes] = await Promise.all([
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/summary`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/qm-history`)
        ]);

        if (!summaryRes.ok) throw new Error("Facility data not found");

        const summaryData = await summaryRes.json();
        const qmHistoryData = qmHistoryRes.ok ? await qmHistoryRes.json() : null;

        document.getElementById('facilityName').textContent = summaryData.provider_name;
        document.getElementById('facilitySub').textContent = `CCN: ${ccn} | Quality Measures Hub`;

        drawQmTrendChart(qmHistoryData);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';

    } catch (err) {
        console.error("Error loading Quality Measures hub:", err);
        document.getElementById('loading').textContent = "Error connecting to database.";
    }
});

function drawQmTrendChart(history) {
    const ctx = document.getElementById('qmTrendChart').getContext('2d');
    const months = history && history.months ? history.months : [];
    const ratings = history && history.ratings ? history.ratings : [];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'QM Star Rating',
                data: ratings,
                borderColor: '#6367FF',
                backgroundColor: 'rgba(99, 103, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: '#6367FF'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, datalabels: { anchor: 'top', align: 'top', font: { weight: 'bold' } } },
            scales: { y: { min: 0, max: 6, ticks: { stepSize: 1 } } }
        }
    });
}

function setupHeaderSearch() {
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
                    div.onclick = () => window.location.href = `qualitymeasures.html?ccn=${item.ccn}`;
                    quickAutocompleteList.appendChild(div);
                });
            } catch (err) { console.error("Search failed", err); }
        }, 250);
    });
}