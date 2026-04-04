import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Smartphone, 
  Globe, 
  Type, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Download,
  Sparkles,
  Code2,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import './App.css';

interface BuildStatus {
  status: 'idle' | 'uploading' | 'building' | 'success' | 'error';
  message: string;
  progress: number;
  downloadUrl?: string;
  appName?: string;
}

function App() {
  const [appName, setAppName] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [buildStatus, setBuildStatus] = useState<BuildStatus>({
    status: 'idle',
    message: '',
    progress: 0
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file must be less than 5MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleBuild = async () => {
    if (!appName.trim()) {
      toast.error('Please enter an app name');
      return;
    }
    if (!appUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }
    if (!logoFile) {
      toast.error('Please upload an app logo');
      return;
    }

    // Validate URL
    try {
      new URL(appUrl);
    } catch {
      toast.error('Please enter a valid URL (include https://)');
      return;
    }

    setBuildStatus({
      status: 'uploading',
      message: 'Uploading assets...',
      progress: 10
    });

    const formData = new FormData();
    formData.append('appName', appName);
    formData.append('appUrl', appUrl);
    formData.append('logo', logoFile);

    try {
      setBuildStatus({
        status: 'building',
        message: 'Generating Android project...',
        progress: 30
      });

      const response = await fetch('/api/build', {
        method: 'POST',
        body: formData
      });

      setBuildStatus(prev => ({
        ...prev,
        message: 'Building APK...',
        progress: 60
      }));

      const data = await response.json();

      if (data.success) {
        setBuildStatus({
          status: 'success',
          message: 'APK built successfully!',
          progress: 100,
          downloadUrl: data.downloadUrl,
          appName: data.appName
        });
        toast.success('APK generated successfully!');
      } else {
        throw new Error(data.error || 'Build failed');
      }
    } catch (error) {
      setBuildStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Build failed',
        progress: 0
      });
      toast.error('Build failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDownload = () => {
    if (buildStatus.downloadUrl) {
      window.location.href = buildStatus.downloadUrl;
    }
  };

  const resetForm = () => {
    setAppName('');
    setAppUrl('');
    setLogoFile(null);
    setLogoPreview(null);
    setBuildStatus({
      status: 'idle',
      message: '',
      progress: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Convert any website to Android APK</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Web2APK
            </span>{' '}
            Builder
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Transform your website into a native Android app in seconds. 
            No coding required, just upload your icon and go!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-slate-400 text-sm">Generate your APK in under 60 seconds with our optimized build pipeline.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No Code Needed</h3>
              <p className="text-slate-400 text-sm">Just provide your URL and icon. We handle all the Android development.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Native App</h3>
              <p className="text-slate-400 text-sm">Get a real Android APK that can be installed on any device.</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <Card className="max-w-2xl mx-auto bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              Build Your App
            </CardTitle>
            <CardDescription className="text-slate-400">
              Fill in the details below to generate your Android APK
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* App Name */}
            <div className="space-y-2">
              <Label htmlFor="appName" className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-400" />
                App Name
              </Label>
              <Input
                id="appName"
                placeholder="e.g., My Awesome App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                disabled={buildStatus.status === 'building' || buildStatus.status === 'uploading'}
                className="bg-slate-950 border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="appUrl" className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                Website URL
              </Label>
              <Input
                id="appUrl"
                type="url"
                placeholder="https://your-website.com"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                disabled={buildStatus.status === 'building' || buildStatus.status === 'uploading'}
                className="bg-slate-950 border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
              <p className="text-xs text-slate-500">
                Must include https:// prefix
              </p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-slate-400" />
                App Icon
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${logoPreview 
                    ? 'border-cyan-500/50 bg-cyan-500/5' 
                    : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                  }
                  ${(buildStatus.status === 'building' || buildStatus.status === 'uploading') && 'opacity-50 pointer-events-none'}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                
                {logoPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-24 h-24 rounded-xl object-cover mb-4 shadow-lg"
                    />
                    <p className="text-sm text-slate-400">
                      {logoFile?.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-300 mb-1">
                      Drop your icon here or click to browse
                    </p>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, or SVG (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            {(buildStatus.status === 'uploading' || buildStatus.status === 'building') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    {buildStatus.message}
                  </span>
                  <span className="text-slate-500">{buildStatus.progress}%</span>
                </div>
                <Progress value={buildStatus.progress} className="h-2" />
              </div>
            )}

            {/* Success */}
            {buildStatus.status === 'success' && (
              <Alert className="bg-green-500/10 border-green-500/30">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <AlertDescription className="ml-2">
                  <span className="font-medium text-green-400">Success!</span>{' '}
                  <span className="text-slate-300">{buildStatus.message}</span>
                </AlertDescription>
              </Alert>
            )}

            {/* Error */}
            {buildStatus.status === 'error' && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <AlertDescription className="ml-2">
                  <span className="font-medium text-red-400">Error</span>{' '}
                  <span className="text-slate-300">{buildStatus.message}</span>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {buildStatus.status === 'success' ? (
                <>
                  <Button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download APK
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    Build Another
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleBuild}
                  disabled={buildStatus.status === 'building' || buildStatus.status === 'uploading'}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {buildStatus.status === 'building' || buildStatus.status === 'uploading' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Building...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate APK
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-500 text-sm">
          <p>Built with React, Node.js & Android SDK</p>
          <p className="mt-1">Your APK is generated locally and deleted after download</p>
        </div>
      </div>
    </div>
  );
}

export default App;
