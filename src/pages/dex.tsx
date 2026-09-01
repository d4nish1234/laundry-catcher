import { useState } from 'react';
import { useLaundryDex } from '@/hooks/use-laundry-dex';
import { LOCATIONS } from '@/data/locations';
import { getCreaturesForLocation, type Discovery } from '@/data/creatures';
import { DiscoveryArtwork } from '@/components/discovery-artwork';
import { X, RotateCcw } from 'lucide-react';

export default function DexScreen() {
  const { caughtCountForLocation, totalCountForLocation, isCreatureCaught, reset } = useLaundryDex();
  const [activeLocationId, setActiveLocationId] = useState<string>(LOCATIONS[0]?.id || '');
  const [selected, setSelected] = useState<Discovery | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleReset = () => {
    reset();
    setConfirmingReset(false);
  };

  const creatures = getCreaturesForLocation(activeLocationId);
  const caughtCount = caughtCountForLocation(activeLocationId);
  const totalCount = totalCountForLocation(activeLocationId);

  return (
    <div className="min-h-full bg-slate-900 p-4 pb-8 font-sans text-slate-100 flex flex-col">
      <div className="mb-4 bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Collection</h1>
          <p className="text-sm text-slate-400">Your journey's discoveries</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-display font-bold text-primary">{caughtCount} <span className="text-lg text-slate-400 font-sans">/ {totalCount}</span></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Found</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 shrink-0 -mx-4 px-4 pb-1">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setActiveLocationId(loc.id)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeLocationId === loc.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {loc.shortName}
          </button>
        ))}
      </div>

      <div className="mb-4 flex justify-end shrink-0">
        <button onClick={() => setConfirmingReset(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-destructive transition-colors px-3 py-2 rounded-lg border border-slate-700">
          <RotateCcw size={14} /> Reset Collection
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {creatures.map((c) => {
          const caught = isCreatureCaught(c.id);

          return (
            <button
              key={c.id}
              onClick={() => caught && setSelected(c)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-2 flex flex-col items-center justify-center gap-2
                ${caught ? 'bg-slate-800 border-amber-400/50 hover:scale-[1.02] active:scale-[0.98] shadow-lg' : 'bg-slate-800/50 border-slate-700 opacity-60 cursor-not-allowed'}`}
            >
              {caught ? (
                <DiscoveryArtwork discovery={c} className="h-24 w-24 text-sm" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-600/50 bg-slate-900/40 text-4xl font-black text-slate-600" aria-label="Undiscovered item">
                  ?
                </div>
              )}
              
              <div className="mt-auto w-full text-center">
                <p className={`font-bold font-display leading-tight ${caught ? 'text-white' : 'text-slate-500'}`}>{caught ? c.name : '???'}</p>
              </div>
            </button>
          );
        })}
      </div>

      {confirmingReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border border-slate-700 p-6 text-center">
            <h3 className="font-display text-xl font-bold text-white mb-2">Reset Collection?</h3>
            <p className="text-sm text-slate-400 mb-6">This clears all discoveries on this device. This can't be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmingReset(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm uppercase tracking-wider">Cancel</button>
              <button onClick={handleReset} className="flex-1 py-3 bg-destructive text-white rounded-xl font-bold text-sm uppercase tracking-wider">Reset</button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 border border-slate-700 max-h-[90dvh] flex flex-col">
            <div className="relative pt-12 pb-6 px-6 flex flex-col items-center text-center shrink-0 bg-gradient-to-b from-amber-500/10 to-transparent">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white"><X size={20} /></button>
              <DiscoveryArtwork discovery={selected} className="h-40 w-40 text-2xl animate-float" />
              <h2 className="text-3xl font-display font-bold mt-2 text-white">{selected.name}</h2>
              <p className="text-sm font-semibold opacity-80 italic text-white/80">"{selected.tagline}"</p>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto bg-slate-900 flex-1 no-scrollbar">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 border-b border-slate-800 pb-1">Description</h3>
                <p className="text-sm leading-relaxed text-slate-300">{selected.description}</p>
              </div>
              
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 border-b border-slate-800 pb-1">Origin</h3>
                <p className="text-sm text-slate-300">{selected.origin}</p>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 border-b border-slate-800 pb-1">Material</h3>
                <p className="text-sm text-slate-300 capitalize">{selected.material}{selected.secondaryMaterial ? ` / ${selected.secondaryMaterial}` : ''}</p>
              </div>
              
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-800 pb-1">Features</h3>
                <div className="space-y-3">
                  {selected.details.map(d => (
                    <div key={d.name} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-white">{d.name}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">{d.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}