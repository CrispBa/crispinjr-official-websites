const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { promisify } = require('util');
const archiver = require('archiver');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Ensure uploads and builds directories exist
fs.ensureDirSync('uploads');
fs.ensureDirSync('builds');

// Storage for uploaded logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper function to generate web manifest
async function generateWebManifest(appName, appUrl, logoPath, buildDir) {
  const manifest = {
    name: appName,
    short_name: appName,
    start_url: appUrl,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: 'icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ]
  };

  const manifestPath = path.join(buildDir, 'manifest.json');
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
  
  // Copy and resize logo to create icons
  const sharp = require('sharp');
  await sharp(logoPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(buildDir, 'icon-512x512.png'));
  
  await sharp(logoPath)
    .resize(192, 192)
    .png()
    .toFile(path.join(buildDir, 'icon-192x192.png'));

  return manifestPath;
}

// Helper function to create TWA manifest for Bubblewrap
async function createTWAManifest(appName, appUrl, buildDir, packageName) {
  const twaManifest = {
    packageId: packageName,
    host: new URL(appUrl).hostname,
    name: appName,
    launcherName: appName,
    display: 'standalone',
    themeColor: '#000000',
    navigationColor: '#000000',
    navigationColorDark: '#000000',
    navigationDividerColor: '#000000',
    navigationDividerColorDark: '#000000',
    backgroundColor: '#ffffff',
    enableNotifications: true,
    startUrl: '/',
    iconUrl: 'icon-512x512.png',
    maskableIconUrl: null,
    monochromeIconUrl: null,
    shortcuts: [],
    signingKey: {
      path: './android.keystore',
      alias: 'android'
    },
    appVersionName: '1.0.0',
    appVersionCode: 1,
    splashScreenFadeOutDuration: 300,
    isGooglePlayGamesForPc: false,
    isMetaQuest: false,
    enableSiteSettingsShortcut: true,
    orientation: 'default',
    fullScopeUrl: appUrl,
    minSdkVersion: 19,
    targetSdkVersion: 35,
    compileSdkVersion: 35,
    gradleVersion: '8.4',
    androidBuildToolsVersion: '35.0.0',
    manifestUrl: `${appUrl}/manifest.json`,
    manifest: {
      name: appName,
      short_name: appName,
      start_url: appUrl,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [
        {
          src: 'icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    generateAssetLinks: true
  };

  const twaManifestPath = path.join(buildDir, 'twa-manifest.json');
  await fs.writeJson(twaManifestPath, twaManifest, { spaces: 2 });
  
  return twaManifestPath;
}

// Helper function to generate signing keystore
async function generateKeystore(buildDir) {
  const keytoolPath = path.join(process.env.JAVA_HOME || '', 'bin', 'keytool');
  const keystorePath = path.join(buildDir, 'android.keystore');
  
  // Use default passwords for demo
  const storepass = 'android';
  const keypass = 'android';
  
  const keytoolCmd = `"${keytoolPath}" -genkey -v -keystore "${keystorePath}" -alias android -keyalg RSA -keysize 2048 -validity 10000 -storepass ${storepass} -keypass ${keypass} -dname "CN=Android Debug,O=Android,C=US"`;
  
  try {
    await execAsync(keytoolCmd);
  } catch (error) {
    // If keytool fails, try without JAVA_HOME
    const fallbackCmd = `keytool -genkey -v -keystore "${keystorePath}" -alias android -keyalg RSA -keysize 2048 -validity 10000 -storepass ${storepass} -keypass ${keypass} -dname "CN=Android Debug,O=Android,C=US"`;
    await execAsync(fallbackCmd);
  }
  
  return keystorePath;
}

// Helper function to run bubblewrap
async function runBubblewrap(buildDir) {
  const bubblewrapPath = path.join(__dirname, 'node_modules', '.bin', 'bubblewrap');
  
  // Set environment variables for non-interactive mode
  const env = {
    ...process.env,
    BUBBLEWRAP_KEYSTORE_PASSWORD: 'android',
    BUBBLEWRAP_KEY_PASSWORD: 'android'
  };

  // Build the project
  const buildCmd = `cd "${buildDir}" && "${bubblewrapPath}" build --skipPwaValidation`;
  
  const { stdout, stderr } = await execAsync(buildCmd, { 
    env,
    timeout: 300000 // 5 minute timeout
  });
  
  console.log('Bubblewrap build output:', stdout);
  if (stderr) console.error('Bubblewrap build errors:', stderr);
  
  // Find the generated APK
  const apkPath = path.join(buildDir, 'app-release-signed.apk');
  const unsignedApkPath = path.join(buildDir, 'app-release-unsigned-aligned.apk');
  
  if (await fs.pathExists(apkPath)) {
    return apkPath;
  } else if (await fs.pathExists(unsignedApkPath)) {
    return unsignedApkPath;
  } else {
    // Search for any APK file
    const files = await fs.readdir(buildDir);
    const apkFile = files.find(f => f.endsWith('.apk'));
    if (apkFile) {
      return path.join(buildDir, apkFile);
    }
  }
  
  throw new Error('APK file not generated');
}

// Helper function to create a simple Android project manually
async function createAndroidProject(appName, appUrl, packageName, buildDir, logoPath) {
  const androidDir = path.join(buildDir, 'android-project');
  
  // Create basic Android project structure
  await fs.ensureDir(path.join(androidDir, 'app', 'src', 'main', 'res', 'mipmap-hdpi'));
  await fs.ensureDir(path.join(androidDir, 'app', 'src', 'main', 'res', 'mipmap-mdpi'));
  await fs.ensureDir(path.join(androidDir, 'app', 'src', 'main', 'res', 'mipmap-xhdpi'));
  await fs.ensureDir(path.join(androidDir, 'app', 'src', 'main', 'res', 'mipmap-xxhdpi'));
  await fs.ensureDir(path.join(androidDir, 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi'));
  await fs.ensureDir(path.join(androidDir, 'app', 'src', 'main', 'res', 'values'));
  await fs.ensureDir(path.join(androidDir, 'app', 'src', 'main', 'java', ...packageName.split('.')));
  
  // Create icons in different sizes
  const sharp = require('sharp');
  const sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
  };
  
  for (const [folder, size] of Object.entries(sizes)) {
    await sharp(logoPath)
      .resize(size, size)
      .png()
      .toFile(path.join(androidDir, 'app', 'src', 'main', 'res', folder, 'ic_launcher.png'));
    
    await sharp(logoPath)
      .resize(size, size)
      .png()
      .toFile(path.join(androidDir, 'app', 'src', 'main', 'res', folder, 'ic_launcher_round.png'));
  }
  
  // Create AndroidManifest.xml
  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${appName}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`;
  
  await fs.writeFile(path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml'), manifestXml);
  
  // Create MainActivity.java
  const mainActivityJava = `package ${packageName};

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        setContentView(webView);
        
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());
        
        webView.loadUrl("${appUrl}");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;
  
  const packagePath = path.join(androidDir, 'app', 'src', 'main', 'java', ...packageName.split('.'));
  await fs.writeFile(path.join(packagePath, 'MainActivity.java'), mainActivityJava);
  
  // Create strings.xml
  const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${appName}</string>
</resources>`;
  
  await fs.writeFile(path.join(androidDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml'), stringsXml);
  
  // Create styles.xml
  const stylesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:colorPrimary">#000000</item>
        <item name="android:colorPrimaryDark">#000000</item>
        <item name="android:colorAccent">#000000</item>
    </style>
</resources>`;
  
  await fs.writeFile(path.join(androidDir, 'app', 'src', 'main', 'res', 'values', 'styles.xml'), stylesXml);
  
  // Create build.gradle for app
  const appBuildGradle = `apply plugin: 'com.android.application'

android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "${packageName}"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
}`;
  
  await fs.writeFile(path.join(androidDir, 'app', 'build.gradle'), appBuildGradle);
  
  // Create project build.gradle
  const projectBuildGradle = `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`;
  
  await fs.writeFile(path.join(androidDir, 'build.gradle'), projectBuildGradle);
  
  // Create settings.gradle
  await fs.writeFile(path.join(androidDir, 'settings.gradle'), 'include ":app"');
  
  // Create gradle.properties
  await fs.writeFile(path.join(androidDir, 'gradle.properties'), 
    'android.useAndroidX=true\nandroid.enableJetifier=true');
  
  // Create local.properties
  const androidSdkPath = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || '/opt/android-sdk';
  await fs.writeFile(path.join(androidDir, 'local.properties'), `sdk.dir=${androidSdkPath}`);
  
  return androidDir;
}

// Build APK using Gradle
async function buildWithGradle(androidDir, buildDir) {
  const gradlewPath = path.join(androidDir, 'gradlew');
  
  // Create gradle wrapper if it doesn't exist
  if (!await fs.pathExists(gradlewPath)) {
    await fs.ensureDir(path.join(androidDir, 'gradle', 'wrapper'));
    
    await fs.writeFile(path.join(androidDir, 'gradle', 'wrapper', 'gradle-wrapper.properties'), 
      'distributionBase=GRADLE_USER_HOME\n' +
      'distributionPath=wrapper/dists\n' +
      'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.0-bin.zip\n' +
      'zipStoreBase=GRADLE_USER_HOME\n' +
      'zipStorePath=wrapper/dists');
    
    // Download gradle wrapper
    const wrapperJarUrl = 'https://raw.githubusercontent.com/gradle/gradle/v8.0.0/gradle/wrapper/gradle-wrapper.jar';
    const https = require('https');
    
    await new Promise((resolve, reject) => {
      https.get(wrapperJarUrl, (response) => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(path.join(androidDir, 'gradle', 'wrapper', 'gradle-wrapper.jar'));
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        } else {
          reject(new Error(`Failed to download gradle wrapper: ${response.statusCode}`));
        }
      }).on('error', reject);
    });
    
    // Create gradlew script
    const gradlewScript = `#!/bin/sh
exec "$(dirname "$0")/gradle/wrapper/gradle-wrapper.jar" "$@"`;
    await fs.writeFile(gradlewPath, gradlewScript);
    await fs.chmod(gradlewPath, 0o755);
  }
  
  // Build APK
  const buildCmd = `cd "${androidDir}" && ./gradlew assembleRelease`;
  
  try {
    const { stdout, stderr } = await execAsync(buildCmd, { timeout: 300000 });
    console.log('Gradle build output:', stdout);
    if (stderr) console.error('Gradle build errors:', stderr);
  } catch (error) {
    console.error('Gradle build failed:', error);
    throw error;
  }
  
  // Find the generated APK
  const apkPath = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk');
  
  if (await fs.pathExists(apkPath)) {
    return apkPath;
  }
  
  throw new Error('APK file not generated');
}

// Main build endpoint
app.post('/api/build', upload.single('logo'), async (req, res) => {
  const { appName, appUrl } = req.body;
  const logoFile = req.file;
  
  if (!appName || !appUrl) {
    return res.status(400).json({ error: 'App name and URL are required' });
  }
  
  if (!logoFile) {
    return res.status(400).json({ error: 'App logo is required' });
  }
  
  const buildId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const buildDir = path.join('builds', buildId);
  
  try {
    await fs.ensureDir(buildDir);
    
    // Generate package name from app name
    const packageName = `com.web2apk.${appName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    
    console.log(`Starting build for ${appName}...`);
    console.log(`Build directory: ${buildDir}`);
    
    // Create Android project
    const androidDir = await createAndroidProject(appName, appUrl, packageName, buildDir, logoFile.path);
    
    console.log('Android project created, building APK...');
    
    // Build APK
    const apkPath = await buildWithGradle(androidDir, buildDir);
    
    // Copy APK to builds directory with a friendly name
    const finalApkName = `${appName.replace(/[^a-zA-Z0-9]/g, '_')}_v1.0.0.apk`;
    const finalApkPath = path.join(buildDir, finalApkName);
    await fs.copy(apkPath, finalApkPath);
    
    console.log(`Build complete: ${finalApkPath}`);
    
    res.json({
      success: true,
      buildId: buildId,
      downloadUrl: `/api/download/${buildId}/${finalApkName}`,
      appName: appName,
      packageName: packageName
    });
    
  } catch (error) {
    console.error('Build error:', error);
    
    // Clean up on error
    try {
      await fs.remove(buildDir);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Build failed'
    });
  }
});

// Download endpoint
app.get('/api/download/:buildId/:filename', async (req, res) => {
  const { buildId, filename } = req.params;
  const filePath = path.join('builds', buildId, filename);
  
  if (!await fs.pathExists(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
  
  // Clean up after download
  fileStream.on('close', async () => {
    try {
      await fs.remove(path.join('builds', buildId));
      console.log(`Cleaned up build ${buildId}`);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Web2APK Server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST /api/build - Build APK from website`);
  console.log(`  GET  /api/health - Health check`);
});

module.exports = app;
