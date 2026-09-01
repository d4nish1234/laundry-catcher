/**
 * Synthesised sound effects using the Web Audio API.
 * No audio files needed — tones are generated on the fly.
 */

function ctx() {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

/** Soft descending swish for the rope entering the Laundry Sea. */
export function playRopeCast() {
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ac.currentTime + 0.35);
    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.38);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.38);
    osc.onended = () => ac.close();
  } catch (_) { /* ignore in unsupported environments */ }
}

/** Wooden click and low tug when the clothespin is pulled back. */
export function playClothespinPull() {
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ac.currentTime + 0.16);
    gain.gain.setValueAtTime(0.1, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.2);
    osc.onended = () => ac.close();
  } catch (_) { /* ignore */ }
}

/** Gentle two-note chime when an item returns from the Laundry Sea. */
export function playItemFound() {
  try {
    const ac = ctx();
    const notes = [392, 523.25];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      const t = ac.currentTime + i * 0.16;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t);
      osc.stop(t + 0.55);
    });
    setTimeout(() => ac.close(), 1100);
  } catch (_) { /* ignore */ }
}
