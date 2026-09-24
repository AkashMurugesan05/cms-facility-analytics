document.addEventListener("DOMContentLoaded", async () => {
    Chart.register(ChartDataLabels);
    
    const urlParams = new URLSearchParams(window.location.search);
    const ccn = urlParams.get('ccn');
    if (!ccn) return;

    document.getElementById('backToFacilityBtn').href = `facility.html?ccn=${ccn}`;
    setupHeaderSearch();
    await loadStaffingDashboard(ccn);
});

window.staffingHoursChartInstance = null;
window.casemixChartInstance = null;
window.weekendChartInstance = null;
window.turnoverChartInstance = null;
window.totalNurseTrendInstance = null;
window.cnaTrendInstance = null;

async function loadStaffingDashboard(ccn) {
    try {
        const [summaryResponse, staffingResponse, extendedResponse, trendsResponse] = await Promise.all([
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/summary`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/staffing-hours`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/staffing-extended`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/staffing-trends`)
        ]);

        const summaryData = await summaryResponse.json();
        const staffingData = await staffingResponse.json();
        const extData = await extendedResponse.json();
        const trendsData = await trendsResponse.json();

        document.getElementById('facilityName').textContent = summaryData.provider_name || 'Unknown Facility';
        document.getElementById('facilityLocation').textContent = `${summaryData.city || 'Unknown City'}, ${summaryData.state || 'Unknown State'}`;
        document.getElementById('facilityCCN').textContent = summaryData.ccn || ccn;

        drawStaffingHoursChart(staffingData);
        drawCasemixChart(extData.casemix);
        drawWeekendChart(extData.weekend);
        drawTurnoverChart(extData.turnover);
        drawTrendChart('totalNurseTrendChart', 'totalNurseTrendInstance', trendsData.months, trendsData.total_nurse, 'Total Nurse Hrs/Res/Day', 'Natl Avg Nurse Hrs', 1.5, 4.0);
        drawTrendChart('cnaTrendChart', 'cnaTrendInstance', trendsData.months, trendsData.cna, 'CNA Hrs/Res/Day', 'Natl Avg CNA Hrs', 1.0, 3.0);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
    } catch (error) {
        console.error("Staffing Load Error:", error);
    }
}

// Reusable Line Chart Function for 12-Month Trends
function drawTrendChart(canvasId, instanceKey, months, seriesData, facilityLabel, nationalLabel, yMin, yMax) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window[instanceKey]) window[instanceKey].destroy();

    window[instanceKey] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: facilityLabel,
                    data: seriesData.facility,
                    borderColor: '#EAB308', // Yellow line
                    backgroundColor: '#EAB308',
                    borderWidth: 3,
                    tension: 0.3,
                    pointRadius: 3
                },
                {
                    label: nationalLabel,
                    data: seriesData.national,
                    borderColor: '#4285F4', // Blue line
                    backgroundColor: '#4285F4',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 20, right: 15 } },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 6, font: { size: 10 } } },
                datalabels: {
                    align: 'top',
                    font: { weight: 'bold', size: 9 },
                    formatter: (value) => value
                }
            },
            scales: {
                x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } },
                y: { min: yMin, max: yMax, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 9 } } }
            }
        }
    });
}

function drawStaffingHoursChart(data) {
    const ctx = document.getElementById('staffingHoursChart').getContext('2d');
    if (window.staffingHoursChartInstance) window.staffingHoursChartInstance.destroy();

    window.staffingHoursChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.roles,
            datasets: [
                { label: data.facility_name, data: data.series.facility, backgroundColor: '#4285F4', barPercentage: 0.8 },
                { label: `${data.state} State Avg`, data: data.series.state, backgroundColor: '#9CA3AF', barPercentage: 0.8 },
                { label: 'US Natl Avg', data: data.series.national, backgroundColor: '#EAB308', barPercentage: 0.8 },
                { label: 'Gap vs US', data: data.series.gap, backgroundColor: '#F97316', barPercentage: 0.8 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 6, font: { size: 10 } } },
                datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 9 } }
            },
            scales: { y: { min: -2.5, max: 4.5 } }
        }
    });
}

function drawCasemixChart(data) {
    const ctx = document.getElementById('casemixChart').getContext('2d');
    if (window.casemixChartInstance) window.casemixChartInstance.destroy();

    window.casemixChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.roles,
            datasets: [
                { label: 'Reported', data: data.reported, backgroundColor: '#4285F4', barPercentage: 0.7 },
                { label: 'Case-Mix Adj.', data: data.casemix, backgroundColor: '#F97316', barPercentage: 0.7 },
                { label: 'Adjusted', data: data.adjusted, backgroundColor: '#9CA3AF', barPercentage: 0.7 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 6, font: { size: 10 } } },
                datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 9 } }
            },
            scales: { y: { min: 0, max: 4 } }
        }
    });
}

function drawWeekendChart(data) {
    const ctx = document.getElementById('weekendChart').getContext('2d');
    if (window.weekendChartInstance) window.weekendChartInstance.destroy();

    window.weekendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.roles,
            datasets: [
                { label: 'Weekend Avg', data: data.weekend_vals, backgroundColor: '#F97316', barPercentage: 0.6 },
                { label: 'Weekday Avg', data: data.weekday_vals, backgroundColor: '#4285F4', barPercentage: 0.6 }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 6, font: { size: 10 } } },
                datalabels: { anchor: 'end', align: 'right', font: { weight: 'bold', size: 9 } }
            },
            scales: { x: { min: 0, max: 4 } }
        }
    });
}

function drawTurnoverChart(data) {
    const ctx = document.getElementById('turnoverChart').getContext('2d');
    if (window.turnoverChartInstance) window.turnoverChartInstance.destroy();

    window.turnoverChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.categories,
            datasets: [
                { label: 'Facility %', data: data.facility, backgroundColor: '#4285F4', barPercentage: 0.7 },
                { label: 'State %', data: data.state, backgroundColor: '#F97316', barPercentage: 0.7 },
                { label: 'National %', data: data.national, backgroundColor: '#9CA3AF', barPercentage: 0.7 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 6, font: { size: 10 } } },
                datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 9 } }
            },
            scales: { y: { min: 0, max: 80 } }
        }
    });
}

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
                const data = await response.json();
                quickAutocompleteList.innerHTML = '';
                data.slice(0, 5).forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'autocomplete-item';
                    div.innerHTML = `<strong>${item.provider_name}</strong>`;
                    div.onclick = () => window.location.href = `staffing.html?ccn=${item.ccn}`;
                    quickAutocompleteList.appendChild(div);
                });
            } catch (err) { console.error("Search failed", err); }
        }, 250);
    });
}