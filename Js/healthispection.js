document.addEventListener("DOMContentLoaded", async () => {
    Chart.register(ChartDataLabels);
    
    const urlParams = new URLSearchParams(window.location.search);
    const ccn = urlParams.get('ccn');
    
    if (!ccn) {
        alert("No facility selected.");
        return;
    }

    // Bind Back Button
    document.getElementById('backBtn').href = `facility.html?ccn=${ccn}`;

    setupHeaderSearch();

    try {
        const [deepDiveRes, healthHistoryRes] = await Promise.all([
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/health-inspection-deep-dive`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/health-history`)
        ]);

        if (!deepDiveRes.ok) throw new Error("Failed to load health inspection data");

        const data = await deepDiveRes.json();
        const historyData = healthHistoryRes.ok ? await healthHistoryRes.json() : null;

        document.getElementById('facilityName').textContent = data.provider_name;
        document.getElementById('facilitySub').textContent = `CCN: ${ccn} | Health Inspection Deep Dive`;

        drawCycleScoreChart(data.cycles);
        drawStandardComplaintChart(data.cycles);
        drawFireSafetyChart(data.fire_safety);
        drawDeficiencyTrendChart(historyData);
        drawCareCategoryChart(data.care_categories);
        drawStarRatingTrendChart(historyData);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';

    } catch (err) {
        console.error("Error loading inspection deep dive:", err);
        document.getElementById('loading').textContent = "Error loading inspection analytics.";
    }
});

function setupHeaderSearch() {
    let typingTimer;
    const quickSearchInput = document.getElementById('quickSearch');
    const quickAutocompleteList = document.getElementById('quickAutocomplete');

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
                    div.onclick = () => window.location.href = `healthispection.html?ccn=${item.ccn}`;
                    quickAutocompleteList.appendChild(div);
                });
            } catch (err) { console.error("Search failed", err); }
        }, 250);
    });
}

function drawCycleScoreChart(cycles) {
    const ctx = document.getElementById('cycleScoreChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cycles.labels,
            datasets: [{
                label: 'Total Deficiency Score',
                data: cycles.total_score,
                backgroundColor: '#3b82f6',
                barPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'right', font: { weight: 'bold', size: 11 } } },
            scales: { x: { beginAtZero: true }, y: { grid: { display: false } } }
        }
    });
}

function drawStandardComplaintChart(cycles) {
    const ctx = document.getElementById('standardComplaintChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cycles.labels,
            datasets: [
                { label: 'Standard', data: cycles.standard, backgroundColor: '#3b82f6', barPercentage: 0.6 },
                { label: 'Complaint', data: cycles.complaint, backgroundColor: '#f97316', barPercentage: 0.6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { boxWidth: 8 } }, datalabels: { color: '#fff', font: { weight: 'bold', size: 10 } } },
            scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true } }
        }
    });
}

function drawFireSafetyChart(fire) {
    const ctx = document.getElementById('fireSafetyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fire.categories,
            datasets: [{
                label: 'Citations',
                data: fire.counts,
                backgroundColor: '#60a5fa',
                barPercentage: 0.7
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 10 } } },
            scales: { x: { ticks: { font: { size: 9 }, maxRotation: 25 } }, y: { beginAtZero: true } }
        }
    });
}

function drawDeficiencyTrendChart(history) {
    const ctx = document.getElementById('deficiencyTrendChart').getContext('2d');
    const months = history && history.months ? history.months : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const defs = history && history.deficiencies ? history.deficiencies : Array(months.length).fill(5);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label: 'Survey Deficiencies', data: defs, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 3, fill: true, tension: 0.3 },
                { label: 'State Threshold', data: Array(months.length).fill(7), borderColor: '#f97316', borderWidth: 2, borderDash: [5, 5], pointRadius: 0 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { boxWidth: 8 } }, datalabels: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function drawCareCategoryChart(care) {
    const ctx = document.getElementById('careCategoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: care.categories,
            datasets: [{
                label: 'Citations Count',
                data: care.counts,
                backgroundColor: '#f97316',
                barPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'right', font: { weight: 'bold', size: 10 } } },
            scales: { x: { beginAtZero: true }, y: { grid: { display: false }, ticks: { font: { size: 10 } } } }
        }
    });
}

function drawStarRatingTrendChart(history) {
    const ctx = document.getElementById('starRatingTrendChart').getContext('2d');
    const months = history && history.months ? history.months : [];
    const ratings = history && history.ratings ? history.ratings : [];

    // Dynamically update the card title to reflect the actual number of months returned
    const countMonths = months.length;
    document.getElementById('starTrendTitle').textContent = `Health Inspection Star Rating — ${countMonths}-Month Trend`;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Health Inspection Star Rating',
                data: ratings,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.2,
                pointRadius: 5,
                pointBackgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, datalabels: { anchor: 'top', align: 'top', font: { weight: 'bold' } } },
            scales: { y: { min: 0, max: 6, ticks: { stepSize: 1 } } }
        }
    });
}