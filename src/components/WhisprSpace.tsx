import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhisprSpace() {
  const [volume, setVolume] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'main'>('landing');
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the void...", sender: "system", timestamp: new Date() },
    { id: 2, text: "Your whispers echo eternally here", sender: "void", timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const handleEnterVoid = () => {
    setCurrentView('main');
  };

  const handleListenClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneGranted(true);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
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
    } catch (error) {
      console.warn("Microphone access denied:", error);
      alert("Microphone access is required to enter the whisper realm");
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: "me",
        timestamp: new Date()
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Simulate void response
      setTimeout(() => {
        const responses = [
          "The void acknowledges your whisper...",
          "Your words echo through eternity...",
          "The shadows hear you...",
          "Whispers return from the abyss...",
          "The silence speaks back..."
        ];
        const voidMsg = {
          id: messages.length + 2,
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: "void",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, voidMsg]);
      }, 1000 + Math.random() * 2000);
    }
  };

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

  if (currentView === 'main') {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-ambient-primary via-ambient-secondary to-ambient-tertiary text-foreground font-sans overflow-hidden">
        {/* Animated Background with Sound-Responsive Wave */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1440 320">
            <motion.path
              animate={{
                d: `M0,160L60,${160 + volume * 2}C120,${160 + volume},240,${160 + volume * 1.5},360,${160 - volume}C480,${160 + volume / 2},600,128,720,106.7C840,85,960,107,1080,133.3C1200,160,1320,192,1380,208L1440,224L1440,320L0,320Z`
              }}
              transition={{ duration: 0.2 }}
              fill="url(#whisprWaves)"
            />
            <defs>
              <linearGradient id="whisprWaves" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--cyber-cyan))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>

          {/* Enhanced Floating Orbs */}
          <div className="absolute w-full h-full">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-whisper-float/10 backdrop-blur-sm shadow-lg border border-cyber-cyan/20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.3],
                  scale: [1, 1.5 + volume / 30, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  delay: i * 0.3,
                  duration: 6 + i * 0.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                style={{
                  width: `${15 + Math.random() * 30}px`,
                  height: `${15 + Math.random() * 30}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <motion.div 
            className="p-4 bg-ambient-primary/80 backdrop-blur-sm border-b border-cyber-cyan/20"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
                  WhisprSpace
                </h1>
                <p className="text-sm text-muted-foreground">General lobby</p>
              </div>
              <button 
                onClick={() => setCurrentView('landing')}
                className="px-4 py-2 text-cyber-cyan border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/10 transition-all duration-200"
              >
                Exit Void
              </button>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <div className="flex-1 flex items-center justify-center">
            <motion.h2
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Welcome to the Lobby
            </motion.h2>
          </div>

          {/* Messages Area */}
          <div className="overflow-y-auto p-4 space-y-4 max-h-[300px]">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'me'
                      ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary shadow-lg shadow-cyber-cyan/25'
                      : message.sender === 'system'
                      ? 'bg-whisper-mist/20 text-cyber-cyan border border-cyber-cyan/30'
                      : 'bg-ambient-secondary/80 text-muted-foreground border border-cyber-purple/30'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <motion.div 
            className="p-4 bg-ambient-primary/80 backdrop-blur-sm border-t border-cyber-cyan/20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Whisper something..."
                className="flex-1 px-4 py-2 bg-whisper-mist/10 border border-cyber-cyan/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary font-semibold rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyber-cyan/25"
              >
                Send
              </button>
            </div>
          </motion.div>

          {/* Enhanced Volume Indicator */}
          <div className="absolute top-4 right-20 z-20">
            <motion.div
              className="w-32 h-1 bg-whisper-mist/30 rounded-full overflow-hidden"
              animate={{ opacity: volume > 0 ? 1 : 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
                animate={{ width: `${(volume / 255) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
            <p className="text-xs text-cyber-cyan mt-1">
              {microphoneGranted ? `Volume: ${Math.round((volume / 255) * 100)}%` : 'No Mic'}
            </p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Shadow Figures - Men in Black Suits */}
      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shadow-${i}`}
            className="absolute"
            initial={{ x: -200, opacity: 0 }}
            animate={{
              x: [window?.innerWidth + 200 || 1200],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 15 + i * 3,
              delay: i * 5,
              repeat: Infinity,
              repeatDelay: 10,
              ease: "easeInOut",
            }}
            style={{
              top: `${60 + i * 15}%`,
              filter: `blur(${0.5 + i * 0.2}px)`,
            }}
          >
            {/* Shadow Figure SVG */}
            <svg width="80" height="120" viewBox="0 0 80 120" className="opacity-60">
              <defs>
                <filter id={`shadow-blur-${i}`}>
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                </filter>
              </defs>
              
              {/* Figure Body */}
              <path
                d="M40 20 L35 25 L30 40 L28 60 L30 80 L35 100 L40 110 L45 100 L50 80 L52 60 L50 40 L45 25 Z"
                fill="rgba(0,0,0,0.8)"
                filter={`url(#shadow-blur-${i})`}
              />
              
              {/* Head */}
              <circle cx="40" cy="15" r="8" fill="rgba(0,0,0,0.9)" />
              
              {/* Arms (running pose) */}
              <motion.path
                d="M30 45 L20 55 L25 65"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="4"
                fill="none"
                animate={{ d: ["M30 45 L20 55 L25 65", "M30 45 L15 50 L20 60", "M30 45 L20 55 L25 65"] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.path
                d="M50 45 L60 35 L55 25"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="4"
                fill="none"
                animate={{ d: ["M50 45 L60 35 L55 25", "M50 45 L65 40 L60 30", "M50 45 L60 35 L55 25"] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              />
              
              {/* Legs (running pose) */}
              <motion.path
                d="M35 100 L30 110 L25 120"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="5"
                fill="none"
                animate={{ d: ["M35 100 L30 110 L25 120", "M35 100 L40 115 L45 125", "M35 100 L30 110 L25 120"] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
              <motion.path
                d="M45 100 L50 110 L55 120"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="5"
                fill="none"
                animate={{ d: ["M45 100 L50 110 L55 120", "M45 100 L40 115 L35 125", "M45 100 L50 110 L55 120"] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
              />
            </svg>

            {/* Sound Waves from Whispers */}
            <div className="absolute left-16 top-2">
              {[...Array(4)].map((_, waveIndex) => (
                <motion.div
                  key={`wave-${i}-${waveIndex}`}
                  className="absolute rounded-full border-2 border-cyber-cyan/30"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{
                    scale: [0, 3 + waveIndex * 0.5],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: waveIndex * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    left: `${waveIndex * 10}px`,
                    transformOrigin: "center",
                  }}
                />
              ))}
              
              {/* Reply Waves Coming Back */}
              {[...Array(3)].map((_, replyIndex) => (
                <motion.div
                  key={`reply-${i}-${replyIndex}`}
                  className="absolute rounded-full border-2 border-cyber-purple/40"
                  initial={{ scale: 2, opacity: 0, x: 100 }}
                  animate={{
                    scale: [2, 0.5],
                    opacity: [0, 0.6, 0],
                    x: [100, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: replyIndex * 0.4 + 1,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  style={{
                    width: "15px",
                    height: "15px",
                    top: `${replyIndex * 8}px`,
                    transformOrigin: "center",
                  }}
                />
              ))}

              {/* Whisper Text Particles */}
              <motion.div
                className="absolute text-xs text-cyber-cyan/50 font-mono"
                animate={{
                  x: [0, 50, 100],
                  y: [-5, -15, -25],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                whispers...
              </motion.div>
              
              <motion.div
                className="absolute text-xs text-cyber-purple/40 font-mono"
                animate={{
                  x: [80, 40, 0],
                  y: [-10, -5, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                ...echoes
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

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
            <button 
              onClick={handleEnterVoid}
              className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary font-semibold rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyber-cyan/25"
            >
              Enter the Void
            </button>
            <button 
              onClick={handleListenClick}
              className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan font-semibold rounded-lg hover:bg-cyber-cyan hover:text-ambient-primary transition-all duration-200"
            >
              {microphoneGranted ? 'Listening...' : 'Listen'}
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