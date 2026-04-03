const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Serves all files inside the 'Public' folder
app.use(express.static(path.join(__dirname, 'Public')));

app.post('/api/build', (req, res) => {
    const { name, url } = req.body;
    console.log(`Received build request for: ${name} (${url})`);

    // For now, this sends back a sample APK link.
    // Once your Dockerfile is active, this will trigger a real build.
    setTimeout(() => {
        res.json({
            success: true,
            downloadUrl: "https://github.com/GoogleChromeLabs/bubblewrap/raw/main/packages/cli/test/data/test.apk"
        });
    }, 3000);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`APK Factory live on port ${PORT}`));