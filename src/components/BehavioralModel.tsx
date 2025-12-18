import { useState, useMemo, useRef, useEffect } from 'react';
import {
    Sword, Shield, Skull, Zap, Scroll, Map as MapIcon,
    Backpack, X, Save, Sparkles, Flame, CloudRain, Heart, Volume2, VolumeX
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import backgroundImage from '../assets/background.png';

// --- Assets & Constants ---

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@600;800&display=swap";

const MOOD_BIAS = {
    POSITIVE: 2.5,   // "Buffed"
    NEUTRAL: 0.0,    // "Normal"
    DEPRESSED: -2.0  // "Cursed"
};
const BETA_SCALING = 0.05;

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

const RPGModel = () => {
    // --- Game State (Inputs) ---
    const [urgency, setUrgency] = useState(5);      // Agility
    const [reward, setReward] = useState(8);        // Loot Value
    const [baseLevel, setBaseLevel] = useState(3);  // Stamina
    const [why, setWhy] = useState(1.5);            // Spirit

    const [uncertainty, setUncertainty] = useState(2); // Fog
    const [complexity, setComplexity] = useState(3);   // Difficulty
    const [fear, setFear] = useState(2);               // Dread
    const [friction, setFriction] = useState(2);       // Terrain
    const [habitInertia, setHabitInertia] = useState(2); // Curse

    const [mood, setMood] = useState<'POSITIVE' | 'NEUTRAL' | 'DEPRESSED'>('NEUTRAL');
    const [showMap, setShowMap] = useState(false); // Toggles the Chart Modal
    const [questAccepted, setQuestAccepted] = useState(false); // Controls main flow: false = show quest intro, true = show stats
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Play music when quest is accepted
    useEffect(() => {
        if (questAccepted && audioRef.current && !isMusicPlaying) {
            audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => { });
        }
    }, [questAccepted]);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => { });
            }
            setIsMusicPlaying(!isMusicPlaying);
        }
    };

    // --- Calculation Engine ---
    const stats = useMemo(() => {
        const valueGap = reward - baseLevel;
        const positiveDrive = urgency * (valueGap * why);
        const totalBlockers = uncertainty + complexity + fear + friction + habitInertia;
        const rawNetDrive = positiveDrive - totalBlockers;
        const z = (rawNetDrive * BETA_SCALING) + MOOD_BIAS[mood];
        const prob = sigmoid(z);

        return {
            netDrive: rawNetDrive,
            probability: prob,
            logit: z,
            rawDrive: positiveDrive,
            totalBlockers: totalBlockers,
            level: Math.max(1, Math.floor((rawNetDrive + 20) / 5)) // Fake "RPG Level" calc
        };
    }, [urgency, reward, baseLevel, why, uncertainty, complexity, fear, friction, habitInertia, mood]);

    // --- Chart Data ---
    const chartData = useMemo(() => {
        const points = [];
        for (let i = -6; i <= 6; i += 0.5) {
            points.push({
                drive: i,
                prob: sigmoid(i + MOOD_BIAS[mood]),
                base: sigmoid(i),
            });
        }
        return points;
    }, [mood]);

    // --- Theme Helpers ---
    const getSuccessText = (p: number) => {
        if (p < 0.3) return "IMPOSSIBLE";
        if (p < 0.6) return "RISKY";
        if (p < 0.85) return "LIKELY";
        return "GUARANTEED";
    };

    const getOracleMessage = () => {
        if (stats.netDrive < 0) return "The darkness is too strong! Your fear and habits outweigh your desire for the loot. You must shed some burdens.";
        if (stats.probability < 0.5) return "You have the strength, but your spirit is cursed (Mood Debuff). Drink a potion or rest before attacking.";
        if (stats.probability > 0.8) return "The stars align! Your power is overwhelming. Strike now while the path is clear!";
        return "The path is open, but treachery awaits. Focus on your 'Why' to land the critical hit.";
    };

    return (
        <div className="min-h-screen bg-[#2d3b29] font-['Nunito'] overflow-hidden selection:bg-amber-300 relative">
            <style>{`@import url('${FONTS_URL}');`}</style>

            {/* BACKGROUND IMAGE */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
            </div>

            {/* --- HUD HEADER --- */}
            <div className="relative z-20 p-4 flex justify-between items-start max-w-6xl mx-auto">

                {/* PLAYER PLATE */}
                <div className="flex items-center gap-3 animate-slide-down">
                    <div className="w-16 h-16 bg-slate-800 rounded-xl border-4 border-[#4a3c31] overflow-hidden relative shadow-xl">
                        <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${stats.probability}&backgroundColor=b6e3f4`} alt="Avatar" className="w-full h-full" />
                        <div className="absolute bottom-0 w-full text-[10px] text-center bg-black/60 text-white font-bold">HERO</div>
                    </div>
                    <div className="relative">
                        <div className="bg-[#e69d45] border-2 border-[#6d4c41] px-4 py-1 rounded-lg shadow-lg relative z-10">
                            <span className="font-['Fredoka'] text-white text-lg drop-shadow-md">Player One</span>
                        </div>
                        <div className="bg-slate-900/80 text-white text-xs px-3 pt-4 pb-1 -mt-3 rounded-b-lg font-bold flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 transition-all duration-500"
                                    style={{ width: `${stats.probability * 100}%` }}
                                ></div>
                            </div>
                            <span>LVL {stats.level}</span>
                        </div>
                    </div>
                </div>

                {/* TITLE BADGE */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 hidden md:block">
                    <div className="bg-[#3e352f] px-6 py-2 rounded-xl border-b-4 border-black shadow-2xl">
                        <h1 className="font-['Fredoka'] text-3xl text-[#f3e5d0] tracking-wide uppercase drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
                            Quest <span className="text-yellow-400">Logic</span>
                        </h1>
                    </div>
                </div>

                {/* MENU BUTTONS */}
                <div className="flex flex-col gap-3">
                    <GameButton icon={isMusicPlaying ? <Volume2 /> : <VolumeX />} label={isMusicPlaying ? "Mute" : "Music"} onClick={toggleMusic} />
                    <GameButton icon={<Backpack />} label="Bag" />
                    <GameButton icon={<MapIcon />} label="Map" onClick={() => setShowMap(true)} alert={true} />
                </div>
            </div>

            {/* --- MAIN CONTENT: Conditional based on quest acceptance --- */}
            {!questAccepted ? (
                /* --- QUEST INTRO SCREEN (Before Acceptance) --- */
                <div className="relative z-10 flex items-center justify-center min-h-[70vh] p-4">
                    <div className="max-w-2xl w-full animate-slide-up">

                        {/* Quest Scroll Container */}
                        <div className="bg-[#f4e4bc] p-2 rounded-xl shadow-2xl border-b-8 border-r-4 border-[#8b5a2b] relative">

                            {/* Decorative Seal */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full border-4 border-[#8b5a2b] flex items-center justify-center shadow-xl z-10">
                                <Scroll className="w-8 h-8 text-yellow-200" />
                            </div>

                            <div className="bg-[#5c4033] p-8 pt-12 rounded-lg border-2 border-[#3e2723] text-center">

                                {/* Quest Title */}
                                <h2 className="font-['Fredoka'] text-3xl md:text-4xl text-yellow-400 uppercase tracking-wider mb-4 drop-shadow-lg">
                                    A New Quest Awaits!
                                </h2>

                                {/* Quest Description */}
                                <div className="bg-black/30 rounded-lg p-6 mb-6">
                                    <p className="text-lg md:text-xl text-[#f4e4bc] font-['Nunito'] leading-relaxed">
                                        The Oracle presents you with a challenge. Will you take action, or will doubt cloud your path?
                                    </p>
                                    <p className="text-md text-gray-400 mt-4 italic">
                                        Accept this quest to discover your <span className="text-yellow-400 font-bold">probability of success</span> based on your inner stats and outer obstacles.
                                    </p>
                                </div>

                                {/* Quest Info Cards */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-green-900/50 p-4 rounded-lg border border-green-600/50">
                                        <Sword className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                        <p className="text-green-300 font-bold text-sm">Drivers</p>
                                        <p className="text-xs text-gray-400">Urgency, Reward, Spirit</p>
                                    </div>
                                    <div className="bg-red-900/50 p-4 rounded-lg border border-red-600/50">
                                        <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                        <p className="text-red-300 font-bold text-sm">Blockers</p>
                                        <p className="text-xs text-gray-400">Fear, Friction, Habits</p>
                                    </div>
                                </div>

                                {/* Accept Quest Button */}
                                <button
                                    onClick={() => setQuestAccepted(true)}
                                    className="bg-gradient-to-r from-[#e69d45] to-[#d68c35] hover:from-[#f0a850] hover:to-[#e69d45] text-white font-['Fredoka'] px-12 py-4 rounded-xl border-b-4 border-[#b57b32] active:border-b-0 active:translate-y-1 transition-all text-2xl uppercase shadow-xl flex items-center justify-center gap-3 mx-auto"
                                >
                                    <Sword size={24} />
                                    Accept Quest
                                    <Zap size={24} />
                                </button>

                            </div>
                        </div>

                        {/* Oracle Character */}
                        <div className="absolute -bottom-16 -right-8 w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl filter brightness-110 pointer-events-none">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Eve&backgroundColor=ffdfbf" alt="Oracle" className="w-full h-full transform scale-x-[-1]" />
                        </div>
                    </div>
                </div>
            ) : (
                /* --- STATS GAMEPLAY AREA (After Acceptance) --- */
                <>
                    <main className="relative z-10 max-w-5xl mx-auto p-4 pb-64 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-4">

                        {/* LEFT: HERO STATS (DRIVERS) */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Sword className="w-8 h-8 text-yellow-500 drop-shadow-md fill-current" />
                                <h2 className="font-['Fredoka'] text-2xl text-white drop-shadow-lg stroke-black">HERO STATS</h2>
                            </div>

                            <div className="bg-[#f4e4bc] p-1 rounded-xl shadow-2xl border-b-8 border-r-4 border-[#8b5a2b]">
                                <div className="bg-[#5c4033] p-4 rounded-lg border-2 border-[#3e2723] space-y-5">
                                    <StatSlider label="Urgency" icon="⚡" value={urgency} setValue={setUrgency} color="bg-yellow-400" />
                                    <StatSlider label="Loot Value" icon="💎" value={reward} setValue={setReward} color="bg-blue-400" />
                                    <StatSlider label="Spirit (Why)" icon="🔥" value={why} setValue={setWhy} max={5} step={0.1} color="bg-purple-400" />

                                    {/* Inverse Logic for Base Level */}
                                    <div className="pt-2 border-t border-white/10">
                                        <StatSlider label="Comfort Zone" icon="🛌" value={baseLevel} setValue={setBaseLevel} color="bg-green-400" />
                                        <p className="text-[10px] text-orange-200 text-right mt-1">*Higher comfort reduces drive</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: DUNGEON HAZARDS (BLOCKERS) */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2 justify-end">
                                <h2 className="font-['Fredoka'] text-2xl text-white drop-shadow-lg">DUNGEON HAZARDS</h2>
                                <Skull className="w-8 h-8 text-red-500 drop-shadow-md fill-current" />
                            </div>

                            <div className="bg-[#f4e4bc] p-1 rounded-xl shadow-2xl border-b-8 border-r-4 border-[#8b5a2b]">
                                <div className="bg-[#2c3e50] p-4 rounded-lg border-2 border-[#1a252f] space-y-5">
                                    <StatSlider label="Fog (Clarity)" icon="☁️" value={uncertainty} setValue={setUncertainty} color="bg-slate-400" />
                                    <StatSlider label="Difficulty" icon="⛰️" value={complexity} setValue={setComplexity} color="bg-red-400" />
                                    <StatSlider label="Dread (Fear)" icon="👻" value={fear} setValue={setFear} color="bg-purple-600" />
                                    <StatSlider label="Terrain (Friction)" icon="🕸️" value={friction} setValue={setFriction} color="bg-orange-600" />
                                    <StatSlider label="Curse (Habit)" icon="⚓" value={habitInertia} setValue={setHabitInertia} color="bg-teal-600" />
                                </div>
                            </div>
                        </div>

                    </main>

                    {/* --- PREDICTION FEEDBACK PANEL (Bottom) --- */}
                    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-8 flex justify-center">
                        <div className="max-w-4xl w-full relative animate-slide-up">


                            {/* Prediction Container */}
                            <div className="bg-[#1e1e24]/95 border-4 border-[#f4e4bc] rounded-2xl p-4 md:p-5 shadow-2xl relative text-white">

                                {/* Speaker Name Tag */}
                                <div className="absolute -top-5 left-8 bg-[#e69d45] px-6 py-2 rounded-lg border-2 border-[#f4e4bc] shadow-lg transform -rotate-2">
                                    <span className="font-['Fredoka'] text-white text-xl uppercase tracking-wider">Oracle Eve</span>
                                </div>

                                {/* Layout Grid inside Box */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                                    {/* Left: Oracle Message */}
                                    <div className="md:col-span-2">
                                        <p className="text-lg md:text-xl font-medium leading-relaxed font-['Nunito'] text-gray-200">
                                            • {getOracleMessage()}
                                        </p>
                                        <div className="mt-4 flex gap-4 text-sm text-yellow-500 font-bold uppercase tracking-widest">
                                            <span>Chance: {getSuccessText(stats.probability)}</span>
                                            <span>•</span>
                                            <span>Roll: {(stats.probability * 100).toFixed(0)}/100</span>
                                        </div>
                                    </div>

                                    {/* Right: Mood Selection + Probability Display */}
                                    <div className="flex flex-col gap-2 justify-center md:border-l border-white/10 md:pl-6">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1 text-center">Status Effect (Mood)</p>
                                        <div className="flex gap-2 justify-center">
                                            <PotionButton color="bg-rose-500" icon={<CloudRain size={16} />} active={mood === 'DEPRESSED'} onClick={() => setMood('DEPRESSED')} />
                                            <PotionButton color="bg-blue-500" icon={<Sparkles size={16} />} active={mood === 'NEUTRAL'} onClick={() => setMood('NEUTRAL')} />
                                            <PotionButton color="bg-yellow-500" icon={<Flame size={16} />} active={mood === 'POSITIVE'} onClick={() => setMood('POSITIVE')} />
                                        </div>

                                        {/* Big Probability Display */}
                                        <div className="mt-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-['Fredoka'] py-3 px-4 rounded-lg text-center shadow-lg">
                                            <p className="text-xs uppercase tracking-wider opacity-80">Probability of Action</p>
                                            <p className="text-3xl font-bold">{(stats.probability * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* --- MODAL: MAP (CHARTS) --- */}
            {showMap && (
                <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[#f3e5d0] w-full max-w-2xl rounded-sm shadow-2xl relative p-8 border-[12px] border-[#5c4033]">
                        <button onClick={() => setShowMap(false)} className="absolute top-4 right-4 text-[#5c4033] hover:text-red-600">
                            <X size={32} strokeWidth={3} />
                        </button>

                        <h2 className="font-['Fredoka'] text-3xl text-[#5c4033] mb-6 text-center underline decoration-wavy">Quest Probability Map</h2>

                        <div className="h-64 w-full bg-white/50 border-2 border-[#5c4033] p-4 rounded-lg">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <XAxis dataKey="drive" hide />
                                    <YAxis domain={[0, 1]} hide />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontFamily: 'Nunito' }} />
                                    <Line type="monotone" dataKey="base" stroke="#ccc" strokeDasharray="5 5" dot={false} strokeWidth={2} />
                                    <Line type="monotone" dataKey="prob" stroke="#d97706" strokeWidth={4} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <p className="text-center mt-4 text-[#5c4033] font-bold italic">
                            "The curve shows the path of destiny. Current Position: <span className="text-xl">{stats.logit.toFixed(2)}</span>"
                        </p>
                    </div>
                </div>
            )}

            {/* Background Music */}
            <audio
                ref={audioRef}
                loop
                src="https://cdn.pixabay.com/audio/2022/10/25/audio_946dc1f04f.mp3"
            />

        </div>
    );
};

// --- Subcomponents ---

const GameButton = ({ icon, label, onClick, alert }: any) => (
    <button
        onClick={onClick}
        className="group relative bg-[#8b5a2b] w-14 h-14 rounded-xl border-2 border-[#5c3a1b] shadow-lg flex items-center justify-center text-[#f3e5d0] hover:bg-[#a06832] active:scale-95 transition-all"
    >
        {alert && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>}
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
        <span className="absolute -bottom-8 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {label}
        </span>
    </button>
);

const StatSlider = ({ label, icon, value, setValue, max = 10, step = 1, color }: any) => {
    const percentage = (value / max) * 100;
    return (
        <div className="relative">
            <div className="flex justify-between text-white/90 text-sm font-bold mb-1 font-['Fredoka'] tracking-wide">
                <span className="flex items-center gap-1.5">{icon} {label}</span>
                <span>{value}</span>
            </div>
            <div className="h-5 bg-black/40 rounded-full border-2 border-black/20 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>

                {/* Fill Bar */}
                <div
                    className={`h-full ${color} transition-all duration-300 relative`}
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10"></div>
                </div>
            </div>

            <input
                type="range"
                min={0} max={max} step={step}
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
    );
};

const PotionButton = ({ color, icon, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-200 transform hover:scale-110
      ${active
                ? `${color} border-white scale-110 ring-4 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.5)]`
                : 'bg-slate-700 border-slate-500 text-slate-400 hover:bg-slate-600'
            } text-white`}
    >
        {icon}
    </button>
);

export default RPGModel;