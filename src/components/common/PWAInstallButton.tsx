import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallButton: React.FC = () => {
  const { isInstalled } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If already running inside standalone installed window, suppress button
  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C86D51] hover:bg-[#B65D42] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
        title="Download Tether APK / Install App"
        aria-label="Download Tether APK / Install App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install APK</span>
        <span className="sm:hidden">Install</span>
      </button>

      <PWAInstallModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default PWAInstallButton;
