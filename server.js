const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); // This prevents the "Failed to fetch" error
app.use(express.json());
app.use(express.static('public'));

// This is the actual build route
app.post('/api/build', (req, res) => {
    const { name, url } = req.body;
    console.log(`Building APK for ${name} at ${url}`);

    // In a full production setup, you would run 'bubblewrap build' here.
    // For now, we send a success response to your HTML.
    setTimeout(() => {
        res.json({ 
            success: true, 
            message: "APK Generated!",
            downloadUrl: "https://github.com/GoogleChromeLabs/bubblewrap/raw/main/packages/cli/test/data/test.apk" 
        });
    }, 3000);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));