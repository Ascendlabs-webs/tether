import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { VaultMemory } from '../../types/tether';
import { 
  Lock, 
  Trash2, 
  Play, 
  Sparkles, 
  X, 
  Calendar, 
  User, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';

export const VaultScreen: React.FC = () => {
  const { 
    vaultMemories, 
    user, 
    partner, 
    removeFromVault, 
    selectedVaultMemory, 
    setSelectedVaultMemory, 
    triggerPaywall 
  } = useTether();

  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos' | 'audio'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // If user is not premium, present the Vault paywall teaser
  if (!user.isPremium) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
        <div className="max-w-md mx-auto px-5 pt-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F3ECE6] border border-[#E5DAD2] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#C86D51]" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#2B2320] mb-2">
            Private Vault
          </h1>
          <p className="text-xs text-[#736A64] max-w-xs mx-auto mb-6 leading-relaxed">
            Moments normally fade after 48 hours. Keep the ones that touch your heart forever in your shared digital memory box.
          </p>

          <button
            onClick={() => triggerPaywall('Private Vault')}
            className="px-6 py-3 rounded-xl bg-[#C86D51] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-[#B75F44] transition-colors"
          >
            Unlock Private Vault
          </button>
        </div>
      </div>
    );
  }

  const filteredMemories = vaultMemories.filter((mem) => {
    if (activeTab === 'photos') return mem.moment.mediaType === 'photo';
    if (activeTab === 'videos') return mem.moment.mediaType === 'video';
    if (activeTab === 'audio') return mem.moment.mediaType === 'audio';
    return true;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
      {/* Header */}
      <div className="sticky top-14 z-20 px-5 py-3 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD] flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-[#2B2320]">
            Private Vault
          </h1>
          <p className="text-[11px] text-[#736A64]">
            Your enduring couples memory box · {vaultMemories.length} saved
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#736A64] bg-[#EFE9E4] px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3 text-[#C86D51]" />
          <span>Biometric Secured</span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5">
        {/* Memory Filters */}
        <div className="flex items-center gap-1 p-1 bg-[#EFE9E4] rounded-xl mb-6">
          {(['all', 'photos', 'videos', 'audio'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-white text-[#2B2320] shadow-xs'
                  : 'text-[#736A64] hover:text-[#2B2320]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-14 h-14 rounded-full bg-[#F2ECE7] flex items-center justify-center mx-auto mb-3 text-[#A89F97]">
              <Sparkles className="w-7 h-7 text-[#C86D51]" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#2B2320] mb-1">
              Keep the moments that matter.
            </h3>
            <p className="text-xs text-[#736A64] max-w-xs mx-auto leading-relaxed">
              When a moment from {partner.name} feels too special to lose after 48 hours, tap the vault icon to preserve it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredMemories.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedVaultMemory(item)}
                className="group relative rounded-2xl overflow-hidden bg-white border border-[#ECE5DF] shadow-xs cursor-pointer hover:shadow-md transition-all flex flex-col"
              >
                {/* Media preview */}
                <div className="aspect-square relative bg-[#241F1C] overflow-hidden">
                  {item.moment.mediaType === 'audio' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#2E2724]">
                      <div className="w-10 h-10 rounded-full bg-[#C86D51] text-white flex items-center justify-center mb-2">
                        <Play className="w-4 h-4 ml-0.5 fill-white" />
                      </div>
                      <span className="text-[11px] text-white font-medium">Voice note</span>
                      <span className="text-[9px] text-[#A89F97]">{item.moment.durationSeconds || 11}s</span>
                    </div>
                  ) : (
                    <img
                      src={item.moment.mediaUrl}
                      alt="Vault memory"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Media type badge */}
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] text-white uppercase tracking-wider font-mono">
                    {item.moment.mediaType}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-medium text-[#2B2320] line-clamp-1 mb-0.5">
                    {item.note || item.moment.caption || 'Special Memory'}
                  </p>
                  <p className="text-[10px] text-[#8C837C]">
                    {formatDate(item.savedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VAULT MEMORY VIEWER MODAL */}
      {selectedVaultMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#1E1B19] text-[#FAF7F5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#A89F97] font-semibold">
                  Vault Memory
                </span>
              </div>
              <button
                onClick={() => setSelectedVaultMemory(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 text-[#A89F97] hover:text-white"
                aria-label="Close memory viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 space-y-4">
              <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                {selectedVaultMemory.moment.mediaType === 'audio' ? (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#C86D51] text-white flex items-center justify-center mb-3">
                      <Play className="w-7 h-7 ml-0.5 fill-white" />
                    </div>
                    <p className="text-sm font-medium text-white">Voice Note</p>
                    <p className="text-xs text-[#A89F97] mt-1">{selectedVaultMemory.moment.durationSeconds || 11} seconds</p>
                  </div>
                ) : (
                  <img
                    src={selectedVaultMemory.moment.mediaUrl}
                    alt="Memory"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Note / Caption */}
              <div>
                <p className="text-sm text-white font-medium mb-1">
                  {selectedVaultMemory.note || selectedVaultMemory.moment.caption || 'Cherished moment'}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#9E938B] mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(selectedVaultMemory.savedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Saved by {selectedVaultMemory.savedBy === user.id ? 'You' : partner.name}
                  </span>
                </div>
              </div>

              {/* Delete memory action */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                {deleteConfirmId === selectedVaultMemory.id ? (
                  <div className="flex items-center gap-2 w-full justify-between">
                    <span className="text-xs text-rose-400">Permanently delete?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromVault(selectedVaultMemory.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg font-medium"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(selectedVaultMemory.id)}
                    className="text-xs text-[#8C837C] hover:text-rose-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from Vault</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
