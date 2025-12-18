import { useCallback, useRef } from 'react';

export const useGameSound = () => {
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initialize AudioContext lazily (browsers require user interaction first)
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            audioContextRef.current = new AudioContext();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    const playTone = useCallback((freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number, vol: number = 0.1) => {
        initAudio();
        if (!audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, [initAudio]);

    const playTick = useCallback(() => {
        // Crisp, short mechanical click/tick
        playTone(800, 'square', 0.05, 0.05);
    }, [playTone]);

    const playClick = useCallback(() => {
        // Deeper UI select sound
        playTone(400, 'sine', 0.1, 0.1);
        setTimeout(() => playTone(600, 'sine', 0.1, 0.1), 50);
    }, [playTone]);

    const playHover = useCallback(() => {
        // Very subtle high air sound
        playTone(1200, 'sine', 0.03, 0.02);
    }, [playTone]);

    const playFanfare = useCallback(() => {
        // Simple major triad arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'triangle', 0.3, 0.1), i * 100);
        });
    }, [playTone]);

    const playError = useCallback(() => {
        playTone(150, 'sawtooth', 0.3, 0.1);
    }, [playTone]);

    return { playTick, playClick, playHover, playFanfare, playError };
};
