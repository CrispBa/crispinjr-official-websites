// Inside your script tag in index.html
buildBtn.addEventListener('click', async () => {
    const name = document.getElementById('appName').value;
    const url = document.getElementById('appUrl').value;

    try {
        const response = await fetch('https://crispinjr-official-websites.onrender.com/api/build', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, url: url })
        });

        const data = await response.json();
        if (data.success) {
            window.location.href = data.downloadUrl;
        }
    } catch (err) {
        document.getElementById('status-text').innerText = "Server error: " + err.message;
    }
});