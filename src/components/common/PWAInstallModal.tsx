import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { 
  Download, 
  Smartphone, 
  QrCode, 
  X, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Info,
  Globe
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'qr' | 'cli'>('android');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&color=24-17-15&bgcolor=255-255-255&margin=10`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleOpenFullTab = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank');
    }
  };

  const bubblewrapCommand = `npm i -g @bubblewrap/cli\nbubblewrap init --manifest=https://ais-dev-5s2t7lz7vshnzvik4nsxuo-857359023460.asia-east1.run.app/manifest.webmanifest\nbubblewrap build`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(bubblewrapCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#1B1412] text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="relative p-5 pb-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#C86D51]/30 border border-[#C86D51]/50 flex items-center justify-center text-[#F5C4B5]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Install Tether on Android
              </h2>
              <p className="text-[11px] text-[#A89F97]">
                WebAPK & Standalone App Testing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-white/10 bg-black/20 p-1.5 gap-1.5 mx-4 mt-3 rounded-xl">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-[#C86D51] text-white shadow-xs'
                : 'text-[#A89F97] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install on Android</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-[#C86D51] text-white shadow-xs'
                : 'text-[#A89F97] hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'cli'
                ? 'bg-[#C86D51] text-white shadow-xs'
                : 'text-[#A89F97] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Build .APK File</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* TAB 1: Android WebAPK */}
          {activeTab === 'android' && (
            <div className="space-y-3.5">
              
              {/* Important notice about AI Studio Share requirement */}
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-amber-300">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Why you saw "Page not found (404)":</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  The shared URL is only activated once you click <strong>"Share"</strong> (or <strong>"Publish"</strong>) in the top-right header of AI Studio! Until published, the live app runs securely inside your current development session.
                </p>
              </div>

              {/* Action 1: Open in Dedicated Tab (enables browser install prompt) */}
              <button
                onClick={handleOpenFullTab}
                className="w-full py-3 px-4 rounded-2xl bg-[#C86D51] hover:bg-[#B65D42] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-98"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open App in Full Browser Tab</span>
              </button>

              {/* Install trigger if browser supports beforeinstallprompt */}
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>1-Tap Install App to Home Screen</span>
                </button>
              )}

              {/* Step-by-Step for Android Phone */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-semibold text-[#DDD2CA] uppercase tracking-wider">
                  How to test & install on your Android device:
                </h4>
                <ol className="space-y-2 text-xs text-[#C2B7AE]">
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-[#C86D51]/30 text-[#F5C4B5] flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <span>In AI Studio, click <strong>"Share"</strong> at the top right to enable the public link.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-[#C86D51]/30 text-[#F5C4B5] flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <span>Open that link in <strong>Chrome</strong> on your Android phone.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-[#C86D51]/30 text-[#F5C4B5] flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <span>Tap Chrome's menu <strong>(⋮)</strong> → Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-[#C86D51]/30 text-[#F5C4B5] flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
                    <span>Android generates the official <strong>WebAPK</strong> with full-screen launcher and live picture widget support.</span>
                  </li>
                </ol>
              </div>

              {/* Copy URL */}
              <div className="pt-1">
                <label className="text-[11px] text-[#A89F97] block mb-1">Your current live app URL:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-[#DDD2CA] font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QR Code Scan */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-3">
              <p className="text-xs text-[#C2B7AE]">
                Scan with your phone camera to open in Chrome or Safari:
              </p>
              
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20">
                <img
                  src={qrCodeUrl}
                  alt="QR Code for Tether Installation"
                  className="w-48 h-48 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#A89F97]">
                <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
                <span>Requires active AI Studio session or published share link</span>
              </div>
            </div>
          )}

          {/* TAB 3: Build Standalone .APK File with Bubblewrap / CLI */}
          {activeTab === 'cli' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                <span className="font-semibold block mb-1">Generate a standalone signed .apk file:</span>
                Google’s official <strong>Bubblewrap CLI</strong> turns this PWA manifest into an Android APK package ready for offline testing via ADB:
              </div>

              <div className="relative">
                <pre className="p-3 rounded-xl bg-black/70 border border-white/15 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  {bubblewrapCommand}
                </pre>
                <button
                  onClick={handleCopyCli}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Copy command"
                >
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-[11px] text-[#A89F97] leading-relaxed">
                This downloads Android Gradle, generates the Android Java/Kotlin wrapper, signs the `.apk`, and outputs <code>app-release-signed.apk</code> in seconds.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/30 flex items-center justify-between text-xs text-[#A89F97]">
          <span>App ID: <code>tether.couples.app</code></span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default PWAInstallModal;
