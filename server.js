const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); // Allows your GitHub site to access this server
app.use(express.json());
app.use(express.static('Public')); // Match your folder name exactly

app.post('/api/build', (req, res) => {
    const { name, url } = req.body;
    console.log(`Building APK for: ${name}`);

    // This mimics the build process for now.
    // Replace with actual npx bubblewrap commands once Docker is set.
    setTimeout(() => {
        res.json({
            success: true,
            downloadUrl: "https://github.com/GoogleChromeLabs/bubblewrap/raw/main/packages/cli/test/data/test.apk"
        });
    }, 4000);
});

// Render uses process.env.PORT, often 10000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`APK Factory live on port ${PORT}`));