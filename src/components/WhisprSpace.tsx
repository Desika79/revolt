import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhisprSpace() {
  const [volume, setVolume] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    // Note: You'll need to add ambient-whispers.mp3 to your public folder
    const audio = new Audio("/ambient-whispers.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    
    // Start audio on user interaction to avoid autoplay restrictions
    const startAudio = () => {
      audio.play().catch(console.warn);
      document.removeEventListener('click', startAudio);
    };
    document.addEventListener('click', startAudio);

    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 64;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          source.connect(analyser);
          analyserRef.current = analyser;
          dataArrayRef.current = dataArray;

          const updateVolume = () => {
            if (analyserRef.current && dataArrayRef.current) {
              analyserRef.current.getByteFrequencyData(dataArrayRef.current);
              const avg = dataArrayRef.current.reduce((a, b) => a + b) / bufferLength;
              setVolume(avg);
            }
            requestAnimationFrame(updateVolume);
          };

          updateVolume();
        })
        .catch((error) => {
          console.warn("Microphone access denied:", error);
          // Fallback to random volume simulation
          const simulateVolume = () => {
            setVolume(Math.random() * 100);
            setTimeout(simulateVolume, 100);
          };
          simulateVolume();
        });
    }

    const timer = setTimeout(() => setIsLoaded(true), 3000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', startAudio);
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-ambient-primary via-ambient-secondary to-ambient-tertiary text-foreground font-sans overflow-hidden">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 bg-ambient-primary flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-t-cyber-cyan border-cyber-purple animate-spin mx-auto mb-6"
                style={{
                  borderTopColor: `hsl(var(--cyber-cyan))`,
                  borderRightColor: `hsl(var(--cyber-purple))`,
                  borderBottomColor: `hsl(var(--cyber-cyan))`,
                  borderLeftColor: `hsl(var(--cyber-purple))`,
                }}
              />
              <p className="text-lg text-muted-foreground">Entering the void...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background with Sound-Responsive Wave */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1440 320">
          <motion.path
            animate={{
              d: `M0,160L60,${160 + volume}C120,${160 + volume / 2},240,${160 + volume},360,${160 - volume / 2}C480,${160 + volume / 3},600,128,720,106.7C840,85,960,107,1080,133.3C1200,160,1320,192,1380,208L1440,224L1440,320L0,320Z`
            }}
            transition={{ duration: 0.3 }}
            fill="url(#whisprWaves)"
          />
          <defs>
            <linearGradient id="whisprWaves" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--cyber-cyan))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Whisper Elements */}
        <div className="absolute w-full h-full">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-whisper-float/5 backdrop-blur-sm shadow-lg border border-whisper-float/10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0.4],
                scale: [1, 1.2 + volume / 50, 1],
              }}
              transition={{
                delay: i * 0.5,
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent"
            animate={{ 
              textShadow: [
                "0 0 20px hsla(var(--cyber-cyan), 0.5)",
                "0 0 40px hsla(var(--cyber-purple), 0.8)",
                "0 0 20px hsla(var(--cyber-cyan), 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            WhisprSpace
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Enter the ambient realm where whispers become art and silence speaks louder than words.
          </motion.p>

          {/* Volume Indicator */}
          <motion.div
            className="w-64 h-2 bg-whisper-mist rounded-full mx-auto mb-8 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
              animate={{ width: `${(volume / 255) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <button className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary font-semibold rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyber-cyan/25">
              Enter the Void
            </button>
            <button className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan font-semibold rounded-lg hover:bg-cyber-cyan hover:text-ambient-primary transition-all duration-200">
              Listen
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Audio Status */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        <p>Volume: {Math.round((volume / 255) * 100)}%</p>
        <p className="text-cyber-cyan">Microphone: {volume > 0 ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  );
}