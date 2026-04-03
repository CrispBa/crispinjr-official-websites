const express = require('express');
const cors = require('cors');
const { exec } = require('child_process'); // This runs terminal commands in the cloud
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/build', (req, res) => {
    const { name, url } = req.body;
    const outputDir = path.join(__dirname, 'builds');

    // COMMAND: This tells the server to build the APK
    // Note: In a real project, you'd configure a manifest first
    const buildCommand = `npx @bubblewrap/cli build --url ${url} --name ${name}`;

    console.log(`Executing: ${buildCommand}`);

    exec(buildCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Build Error: ${error}`);
            return res.status(500).json({ success: false, error: "Build failed on server" });
        }

        // Send the file back to the user
        res.json({ 
            success: true, 
            downloadUrl: `/download/${name}.apk` 
        });
    });
});

// Route to actually download the generated file
app.get('/download/:filename', (req, res) => {
    const file = path.join(__dirname, 'builds', req.params.filename);
    res.download(file);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`APK Factory live on port ${PORT}`));