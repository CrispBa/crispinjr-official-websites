const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

// Storage for uploaded logos - ensure you have an 'uploads' folder in your root!
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

app.post('/api/build', upload.single('logo'), (req, res) => {
    const { name, url } = req.body;
    const logo = req.file;

    console.log(`Building APK for: ${name}`);

    // Simulation of the build process
    setTimeout(() => {
        res.json({
            success: true,
            // UPDATED LINK: This is a real, existing test APK to prevent 404 errors
            downloadUrl: "https://github.com/GoogleChromeLabs/bubblewrap/raw/main/packages/cli/test/data/test.apk"
        });
    }, 5000);
});