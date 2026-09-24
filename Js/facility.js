document.addEventListener("DOMContentLoaded", async () => {
    Chart.register(ChartDataLabels);
    console.log("Facility JS Loaded!"); 
    
    const urlParams = new URLSearchParams(window.location.search);
    const ccn = urlParams.get('ccn');
    
    if (!ccn) {
        showError("No facility selected.");
        return;
    }

    setupHeaderSearch();
    await loadDashboard(ccn);
});

// Global Chart Instances
window.ratingChartInstance = null;
window.chainChartInstance = null;
window.qmChartInstance = null;
window.healthChartInstance = null;
window.bedsChartInstance = null;
window.comparisonChartInstance = null;
window.execCasemixInstance = null;
window.execClinicalInstance = null;
window.execDeficienciesInstance = null;
window.execTurnoverInstance = null;
window.execPenaltiesInstance = null;

async function loadDashboard(ccn) {
    try {
        const [summaryResponse, historyResponse, chainHistoryResponse, qmResponse, healthResponse] = await Promise.all([
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/summary`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/history`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/chain-history`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/qm-history`),
            fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/health-history`)
        ]);

        if (!summaryResponse.ok) throw new Error("Facility summary not found");
        
        const summaryData = await summaryResponse.json();
        const historyData = await historyResponse.json();
        const chainData = await chainHistoryResponse.json();
        const qmData = await qmResponse.json();
        const healthData = await healthResponse.json();

        document.getElementById('aiDownloadBtn').href = `http://127.0.0.1:8000/api/facilities/${ccn}/newsletter-pdf`;

        // 1. Title & Header Meta
        document.getElementById('facilityName').textContent = summaryData.provider_name || 'Unknown Facility';
        document.getElementById('facilityLegalName').textContent = summaryData.legal_business_name ? `Legal Name: ${summaryData.legal_business_name}` : '';
        document.getElementById('facilityLocation').textContent = `${summaryData.city || 'Unknown City'}, ${summaryData.state || 'Unknown State'}`;
        document.getElementById('facilityCCN').textContent = summaryData.ccn || ccn;

        // 2. Left Column Details
        document.getElementById('facilityStreet').textContent = summaryData.provider_address 
            ? `${summaryData.provider_address}, ${summaryData.city || ''}, ${summaryData.state || ''} ${summaryData.zip_code || ''}` 
            : 'N/A';
        document.getElementById('facilityPhone').textContent = summaryData.telephone_number || 'N/A';
        document.getElementById('facilityType').textContent = summaryData.provider_type || 'N/A';
        document.getElementById('facilityOwnership').textContent = summaryData.ownership_type || 'N/A';
        
        const specialFocus = summaryData.special_focus_status || 'None';
        const focusElem = document.getElementById('facilitySpecialFocus');
        focusElem.textContent = specialFocus;
        if (specialFocus !== 'None' && specialFocus !== 'SFF') {
            focusElem.style.background = '#fef2f2';
            focusElem.style.color = '#dc2626';
        } else {
            focusElem.style.background = '#f1f5f9';
            focusElem.style.color = '#475569';
        }

        // 3. Right Column Details
        document.getElementById('facilityChainName').textContent = summaryData.chain_name || 'Independent / Non-Chain';
        document.getElementById('facilityChainCount').textContent = summaryData.number_of_facilities_in_chain ? `${summaryData.number_of_facilities_in_chain} facilities` : 'N/A';
        
        const beds = summaryData.certified_beds || 'N/A';
        const avgRes = summaryData.avg_residents_per_day ? parseFloat(summaryData.avg_residents_per_day).toFixed(1) : 'N/A';
        document.getElementById('facilityBedsRes').textContent = `${beds} Beds / ${avgRes} Avg Residents`;
        document.getElementById('facilityOwnershipChanged').textContent = summaryData.ownership_changed || 'No';
        
        if (summaryData.certified_since) {
            const certDate = new Date(summaryData.certified_since);
            document.getElementById('facilityCertifiedSince').textContent = !isNaN(certDate) ? certDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : summaryData.certified_since;
        } else {
            document.getElementById('facilityCertifiedSince').textContent = 'N/A';
        }
        
        // 4. Star Ratings
        const overall = summaryData.overall_rating;
        document.getElementById('overallRating').textContent = overall ? `${overall}${overall == 1 ? ' Star' : ' Stars'}` : "N/A";

        const chain = summaryData.chain_rating;
        document.getElementById('chainRating').textContent = chain ? `${chain}${chain == 1 ? ' Star' : ' Stars'}` : "N/A";

        const qm = summaryData.qm_rating;
        document.getElementById('qmRating').textContent = qm ? `${qm}${qm == 1 ? ' Star' : ' Stars'}` : "N/A";

        const health = summaryData.health_inspection_rating;
        document.getElementById('healthRating').textContent = health ? `${health}${health == 1 ? ' Star' : ' Stars'}` : "N/A";

        // 5. Occupancy calculations
        const occupied = parseFloat(summaryData.avg_residents_per_day) || 0;
        const total = parseFloat(summaryData.certified_beds) || 0;
        const vacant = Math.max(0, Math.round(total - occupied));
        const percent = total > 0 ? Math.round((occupied / total) * 100) : 0;
        
        document.getElementById('occCount').textContent = Math.round(occupied);
        document.getElementById('vacCount').textContent = vacant;
        document.getElementById('occPercent').textContent = percent + "%";

        // ==========================================
        // FETCH ALL EXECUTIVE & COMPARISON METRICS
        // ==========================================
        try {
            const compRes = await fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/comparison-ratings`);
            if (compRes.ok) {
                const compData = await compRes.json();
                if (compData && compData.facility_name) {
                    const compFacilityElem = document.getElementById('compFacilityName');
                    if(compFacilityElem) compFacilityElem.textContent = compData.facility_name.toUpperCase();
                    drawComparisonChart(compData);
                }
            }
        } catch (e) { console.error("Failed comparison chart:", e); }

        try {
            const execRes = await fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/executive-metrics`);
            if (execRes.ok) {
                const execData = await execRes.json();
                drawExecCasemixChart(execData.casemix_staffing);
                drawExecClinicalChart(execData.clinical_risk);
                
                const mult = execData.vbp_performance.multiplier;
                document.getElementById('vbpMultiplierVal').textContent = mult.toFixed(3) + "x";
                const descElem = document.getElementById('vbpDesc');
                if (mult > 1.0) {
                    document.getElementById('vbpMultiplierVal').style.color = '#16a34a';
                    descElem.textContent = "Bonus multiplier earned! Medicare is increasing reimbursements for stellar clinical outcomes.";
                } else if (mult < 1.0) {
                    document.getElementById('vbpMultiplierVal').style.color = '#dc2626';
                    descElem.textContent = "Penalty multiplier active. Medicare reimbursements are reduced due to high readmissions/infections.";
                }
            }
        } catch (e) { console.error("Failed executive metrics:", e); }

        try {
            const defRes = await fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/deficiency-categories`);
            if (defRes.ok) drawExecDeficienciesChart(await defRes.json());
            
            const turnRes = await fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/turnover-comparison`);
            if (turnRes.ok) drawExecTurnoverChart(await turnRes.json());
            
            const penRes = await fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/penalties-summary`);
            if (penRes.ok) drawExecPenaltiesChart(await penRes.json());
        } catch (e) { console.error("Failed new executive charts:", e); }

        // Draw KPI Line Charts
        if (historyData.ratings && historyData.ratings.length > 0) {
            drawRatingTrend(historyData.months, historyData.ratings, 'ratingTrendChart', 'ratingChartInstance');
            drawRatingTrend(chainData.months, chainData.ratings, 'chainTrendChart', 'chainChartInstance');
            drawRatingTrend(qmData.months, qmData.ratings, 'qmTrendChart', 'qmChartInstance');
            drawRatingTrend(healthData.months, healthData.ratings, 'healthTrendChart', 'healthChartInstance');
        }
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';

    } catch (error) {
        console.error("Dashboard Load Error details:", error); 
        showError("Data connection issue. Check console (F12)."); 
    }
}

// =========================================================
// CHART RENDERING FUNCTIONS
// =========================================================

function drawComparisonChart(data) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    if (window.comparisonChartInstance) window.comparisonChartInstance.destroy();

    const chainName = data.chain_name ? data.chain_name.toUpperCase() : "CHAIN";
    const chainElem = document.getElementById('compChainName');
    if (chainElem) chainElem.textContent = chainName;

    const colors = { facility: '#4285F4', chain: '#F97316', state: '#9CA3AF', national: '#EAB308' };

    window.comparisonChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.categories,
            datasets: [
                { label: 'Facility', data: data.series.facility.map(Number), backgroundColor: colors.facility, barPercentage: 0.95, categoryPercentage: 0.95, maxBarThickness: 60, skipNull: true },
                { label: 'Chain Avg', data: data.series.chain.map(Number), backgroundColor: colors.chain, barPercentage: 0.95, categoryPercentage: 0.95, maxBarThickness: 60, skipNull: true },
                { label: `${data.state} State Avg`, data: data.series.state.map(Number), backgroundColor: colors.state, barPercentage: 0.95, categoryPercentage: 0.95, maxBarThickness: 60, skipNull: true },
                { label: 'US Natl Avg', data: data.series.national.map(Number), backgroundColor: colors.national, barPercentage: 0.95, categoryPercentage: 0.95, maxBarThickness: 60, skipNull: true }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            onClick: (e, activeElements) => {
                if (activeElements.length > 0) {
                    const categoryClicked = data.categories[activeElements[0].index];
                    const currentCcn = new URLSearchParams(window.location.search).get('ccn');
                    if (categoryClicked === "HEALTH INSPECTION") window.location.href = `healthispection.html?ccn=${currentCcn}`;
                    else if (categoryClicked === "QUALITY MEASURES") window.location.href = `qualitymeasures.html?ccn=${currentCcn}`;
                    else if (categoryClicked === "STAFFING") window.location.href = `staffing.html?ccn=${currentCcn}`;
                    else if (categoryClicked === "OVERALL RATING") window.location.href = `facilitystarrating.html?ccn=${currentCcn}`;
                }
            },
            onHover: (event, chartElement) => { event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default'; },
            layout: { padding: { top: 30, right: 20 } },
            plugins: {
                legend: { position: 'top', labels: { color: '#0f172a', usePointStyle: true, boxWidth: 8, font: { weight: 'bold', size: 12 } } },
                tooltip: { enabled: true },
                datalabels: {
                    color: '#0f172a', anchor: 'end', align: 'end', offset: 4, rotation: 0, font: { weight: '900', size: 14 },
                    formatter: (value) => value ? parseFloat(value).toFixed(1).replace('.0', '') : ''
                }
            },
            scales: {
                x: { grid: { color: 'rgba(0, 0, 0, 0.1)', drawOnChartArea: true, tickLength: 0 }, ticks: { color: '#0f172a', font: { weight: '900', size: 11 } } },
                y: { display: true, min: 0, max: 6.5, ticks: { color: '#64748b', font: { weight: 'bold', size: 10 }, stepSize: 1 }, grid: { color: 'rgba(0, 0, 0, 0.05)' } }
            }
        }  
    }); 
}

function drawExecCasemixChart(data) {
    const ctx = document.getElementById('execCasemixChart').getContext('2d');
    if (window.execCasemixInstance) window.execCasemixInstance.destroy();

    const reportedData = data.reported.map(Number);
    const adjustedData = data.adjusted.map(Number);
    const maxVal = Math.max(...reportedData, ...adjustedData, 1);

    window.execCasemixInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.roles,
            datasets: [
                { label: 'Reported', data: reportedData, backgroundColor: '#4285F4', barPercentage: 0.7 },
                { label: 'Case-Mix Adjusted', data: adjustedData, backgroundColor: '#34A853', barPercentage: 0.7 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            layout: { padding: { top: 30, right: 20 } },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 8, font: { size: 11, weight: 'bold' } } },
                datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 11 } }
            },
            scales: {
                x: { grid: { display: false } },
                y: { display: true, beginAtZero: true, suggestedMax: maxVal + 1, grid: { color: 'rgba(0,0,0,0.05)' } }
            }
        }
    });
}

function drawExecClinicalChart(data) {
    const ctx = document.getElementById('execClinicalChart').getContext('2d');
    if (window.execClinicalInstance) window.execClinicalInstance.destroy();

    const facilityData = data.facility.map(Number);
    const nationalData = data.national.map(Number);
    const maxVal = Math.max(...facilityData, ...nationalData, 1);

    window.execClinicalInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.categories,
            datasets: [
                { label: 'Facility Score', data: facilityData, backgroundColor: '#F97316', barPercentage: 0.7 },
                { label: 'Natl Benchmark', data: nationalData, backgroundColor: '#9CA3AF', barPercentage: 0.7 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            layout: { padding: { top: 30, right: 20 } },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 8, font: { size: 11, weight: 'bold' } } },
                datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 11 } }
            },
            scales: {
                x: { grid: { display: false } },
                y: { display: true, beginAtZero: true, suggestedMax: maxVal * 1.2, grid: { color: 'rgba(0,0,0,0.05)' } }
            }
        }
    });
}

function drawExecDeficienciesChart(data) {
    const ctx = document.getElementById('execDeficienciesChart').getContext('2d');
    if (window.execDeficienciesInstance) window.execDeficienciesInstance.destroy();

    const counts = data.counts.map(Number);
    const maxVal = Math.max(...counts, 5);

    window.execDeficienciesInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.categories,
            datasets: [{
                label: 'Citations Count',
                data: counts,
                backgroundColor: '#6367FF',
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            layout: { padding: { top: 25, right: 10 } },
            plugins: {
                legend: { display: false },
                datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 11 } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' }, maxRotation: 20, minRotation: 20 } },
                y: { display: true, beginAtZero: true, suggestedMax: maxVal + 2, grid: { color: 'rgba(0,0,0,0.05)' } }
            }
        }
    });
}

function drawExecTurnoverChart(data) {
    const ctx = document.getElementById('execTurnoverChart').getContext('2d');
    if (window.execTurnoverInstance) window.execTurnoverInstance.destroy();

    const fac = data.facility.map(Number);
    const st = data.state.map(Number);
    const nat = data.national.map(Number);
    const maxVal = Math.max(...fac, ...st, ...nat, 10);

    window.execTurnoverInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.categories,
            datasets: [
                { label: 'Facility', data: fac, backgroundColor: '#4285F4', barPercentage: 0.7 },
                { label: 'State Avg', data: st, backgroundColor: '#9CA3AF', barPercentage: 0.7 },
                { label: 'Natl Avg', data: nat, backgroundColor: '#EAB308', barPercentage: 0.7 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            layout: { padding: { top: 25, right: 10 } },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 6, font: { size: 10, weight: 'bold' } } },
                datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 10 } }
            },
            scales: {
                x: { grid: { display: false } },
                y: { display: true, beginAtZero: true, suggestedMax: maxVal * 1.2, grid: { color: 'rgba(0,0,0,0.05)' } }
            }
        }
    });
}

function drawExecPenaltiesChart(data) {
    const ctx = document.getElementById('execPenaltiesChart').getContext('2d');
    if (window.execPenaltiesInstance) window.execPenaltiesInstance.destroy();

    const values = data.values.map(Number);
    const maxVal = Math.max(...values, 3);

    window.execPenaltiesInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.metrics,
            datasets: [{
                label: 'Count',
                data: values,
                backgroundColor: ['#EF4444', '#F97316', '#8B5CF6'],
                barPercentage: 0.5
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            layout: { padding: { top: 25, right: 10 } },
            plugins: {
                legend: { display: false },
                datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold', size: 11 } },
                subtitle: {
                    display: true,
                    text: `Total Fines Accumulated: $${(data.total_fine_dollars || 0).toLocaleString()}`,
                    color: '#0f172a', font: { weight: 'bold', size: 12 }, padding: { bottom: 10 }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: { display: true, beginAtZero: true, suggestedMax: maxVal + 1, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } }
            }
        }
    });
}

function drawRatingTrend(labels, dataPoints, canvasId, instanceName) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window[instanceName]) window[instanceName].destroy();
    
    window[instanceName] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: dataPoints, borderColor: '#8494FF', backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#8494FF',
                datalabels: { anchor: 'end', align: 'top', color: '#0f172a', font: { weight: 'bold', size: 11 }, formatter: (value) => value }
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            layout: { padding: { top: 30 } },
            scales: { x: { display: false }, y: { display: false, min: 0, max: 6 } }
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
                    div.onclick = () => window.location.href = `facility.html?ccn=${item.ccn}`;
                    quickAutocompleteList.appendChild(div);
                });
            } catch (err) { console.error("Search failed", err); }
        }, 250);
    });
}

function formatStars(rating) {
    if (!rating || isNaN(rating)) return "N/A";
    const num = parseFloat(rating);
    return '★'.repeat(Math.floor(num)) + '☆'.repeat(5 - Math.floor(num));
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.style.display = 'block';
}