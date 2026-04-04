# Web2APK Builder

Convert any website into a native Android APK in seconds! No coding required.

![Web2APK Builder](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop)

## Features

- **Lightning Fast** - Generate your APK in under 60 seconds
- **No Code Needed** - Just provide your URL and icon
- **Native Android App** - Get a real APK that installs on any Android device
- **Custom Icons** - Upload your own app icon
- **Secure** - All builds are temporary and deleted after download

## How It Works

1. Enter your app name
2. Provide your website URL (must include https://)
3. Upload your app icon (PNG, JPG, or SVG)
4. Click "Generate APK"
5. Download your Android app!

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express
- **Build System**: Android SDK + Gradle
- **Image Processing**: Sharp

## Local Development

### Prerequisites

- Node.js 18+ 
- Java Development Kit (JDK) 17+
- Android SDK

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web2apk-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
export JAVA_HOME=/path/to/jdk
export ANDROID_SDK_ROOT=/path/to/android-sdk
```

4. Start the development server:
```bash
npm run dev
```

5. In another terminal, start the API server:
```bash
npm run server
```

6. Open http://localhost:5173 in your browser

### Production Build

```bash
npm run build
npm start
```

The app will be available at http://localhost:3001

## Deployment

### Frontend (Static)

The frontend can be deployed to any static hosting service:

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### Backend (API Server)

The backend requires a Node.js server with:
- JDK 17+ installed
- Android SDK installed
- Sufficient disk space for builds

Recommended platforms:
- Render
- Railway
- DigitalOcean
- AWS EC2

#### Environment Variables

```bash
PORT=3001
JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ANDROID_SDK_ROOT=/opt/android-sdk
```

## API Endpoints

### POST /api/build

Build an APK from a website.

**Request**: multipart/form-data
- `appName` (string): Name of your app
- `appUrl` (string): Website URL (must include https://)
- `logo` (file): App icon image

**Response**:
```json
{
  "success": true,
  "buildId": "abc123",
  "downloadUrl": "/api/download/abc123/MyApp_v1.0.0.apk",
  "appName": "MyApp",
  "packageName": "com.web2apk.myapp"
}
```

### GET /api/download/:buildId/:filename

Download the generated APK file.

### GET /api/health

Health check endpoint.

## Project Structure

```
web2apk-builder/
├── src/
│   ├── App.tsx          # Main React component
│   ├── App.css          # Custom styles
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── server.js            # Express server
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## How the APK Generation Works

1. **Upload**: User uploads their app name, URL, and icon
2. **Project Creation**: Server creates a new Android project with:
   - Custom package name (com.web2apk.{appname})
   - WebView-based MainActivity that loads the user's URL
   - Custom icons in all required sizes
   - AndroidManifest.xml with proper permissions
3. **Build**: Gradle compiles the project into an APK
4. **Download**: User downloads the signed APK
5. **Cleanup**: Build files are deleted after download

## Limitations

- The generated app uses a WebView to display the website
- Some advanced PWA features may not work without additional configuration
- The app requires internet connection to function
- For production apps, consider using Trusted Web Activity (TWA) with Bubblewrap

## Future Enhancements

- [ ] Trusted Web Activity (TWA) support for address bar hiding
- [ ] Digital Asset Links generation
- [ ] Play Store App Bundle (AAB) generation
- [ ] Custom splash screens
- [ ] Offline caching
- [ ] Push notification support
- [ ] In-app purchase integration

## License

MIT License - feel free to use this for personal or commercial projects!

## Credits

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Android SDK](https://developer.android.com/studio)

---

Made with ❤️ by Web2APK Team
