const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

// Configure where to store uploaded logos temporarily
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// The route now accepts a single file named 'logo'
app.post('/api/build', upload.single('logo'), (req, res) => {
    const { name, url } = req.body;
    const logo = req.file;

    if (!logo) {
        return res.status(400).json({ success: false, error: "No logo uploaded" });
    }

    console.log(`Building APK: ${name}`);
    console.log(`URL: ${url}`);
    console.log(`Logo saved at: ${logo.path}`);

// Inside your app.post('/api/build', ...)
setTimeout(() => {
    res.json({
        success: true,
        // Use this updated link which is currently active for testing:
        downloadUrl: "https://raw.githubusercontent.com/GoogleChromeLabs/bubblewrap/main/packages/cli/test/data/test.apk"
    });
}, 5000);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Factory live on port ${PORT}`));