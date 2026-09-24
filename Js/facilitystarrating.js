document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ccn = urlParams.get('ccn');

    // 1. Fetch Summary for basic info
    const summary = await fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/summary`).then(r => r.json());
    
    // 2. Fetch 12-month trend (Update your backend to return 12 instead of 6 if needed)
    const trend = await fetch(`http://127.0.0.1:8000/api/facilities/${ccn}/history`).then(r => r.json());
    
    // 3. Fetch Distribution
    const dist = await fetch(`http://127.0.0.1:8000/api/state-distribution/${summary.state}`).then(r => r.json());

    // Draw your charts using the same logic as before...
});