import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import maleSample1 from "../assets/avatars/male-sample-1.png";
import femaleSample1 from "../assets/avatars/female-sample-1.png";
import maleSample2 from "../assets/avatars/male-sample-2.png";
import femaleSample2 from "../assets/avatars/female-sample-2.png";

export default function WhisprSpace() {
  const [volume, setVolume] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'main' | 'rooms' | 'individuals' | 'chat'>('landing');
  const [currentRoom, setCurrentRoom] = useState<{name: string, id: string, description: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the void...", sender: "system", timestamp: new Date() },
    { id: 2, text: "Your whispers echo eternally here", sender: "void", timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [roomMode, setRoomMode] = useState<'create' | 'search'>('search');
  const [roomTopic, setRoomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoom, setGeneratedRoom] = useState<{name: string, id: string, description: string} | null>(null);
  const [activeRooms, setActiveRooms] = useState([
    { id: 'echo-001', name: 'Echo Chamber', description: 'Active whispers flowing...', listeners: Math.floor(Math.random() * 20) },
    { id: 'silent-002', name: 'Silent Hall', description: 'Silence awaits your voice...', listeners: Math.floor(Math.random() * 20) },
    { id: 'whisper-003', name: 'Whisper Grove', description: 'Nature\'s secrets shared...', listeners: Math.floor(Math.random() * 20) },
    { id: 'void-004', name: 'Void Sanctuary', description: 'Deep contemplation space...', listeners: Math.floor(Math.random() * 20) },
    { id: 'phantom-005', name: 'Phantom Lounge', description: 'Ethereal conversations...', listeners: Math.floor(Math.random() * 20) },
    { id: 'ethereal-006', name: 'Ethereal Space', description: 'Beyond reality whispers...', listeners: Math.floor(Math.random() * 20) },
    { id: 'cosmic-007', name: 'Cosmic Void', description: 'Universe\'s hidden truths...', listeners: Math.floor(Math.random() * 20) },
    { id: 'shadow-008', name: 'Shadow Realm', description: 'Dark whispers emerge...', listeners: Math.floor(Math.random() * 20) },
    { id: 'crystal-009', name: 'Crystal Cave', description: 'Resonant echoes within...', listeners: Math.floor(Math.random() * 20) },
    { id: 'dream-010', name: 'Dream Portal', description: 'Subconscious murmurs...', listeners: Math.floor(Math.random() * 20) }
  ]);
  const [roomReloadKey, setRoomReloadKey] = useState(0);
  const [showGenderSelect, setShowGenderSelect] = useState(false);
  const [userProfile, setUserProfile] = useState<{id: string, gender: 'male' | 'female', avatar: string} | null>(null);
  const [savedRooms, setSavedRooms] = useState<Array<{name: string, id: string, description: string, timestamp: Date}>>([]);
  const [savedIndividuals, setSavedIndividuals] = useState<Array<{id: string, name: string, avatar: string, lastSeen: Date}>>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Move useEffect to top before any conditional returns
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

  const generateRoom = async () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const roomNames = [
      'Ethereal Echo Chamber', 'Mystic Whisper Grove', 'Phantom Sanctuary', 'Shadow Nexus', 
      'Void Confluence', 'Silent Observatory', 'Dream Resonance Hall', 'Astral Meeting Point',
      'Temporal Whisper Hub', 'Cosmic Meditation Space', 'Spectral Discussion Realm'
    ];
    
    const descriptions = [
      `A mystical space for ${roomTopic} discussions where thoughts merge with the cosmos`,
      `Dedicated to exploring ${roomTopic} through whispered revelations and shared insights`,
      `An ethereal realm where ${roomTopic} enthusiasts gather to exchange profound truths`,
      `A sanctuary for deep ${roomTopic} conversations that transcend ordinary reality`,
      `Where ${roomTopic} mysteries unfold through collective consciousness and whispered wisdom`
    ];
    
    const randomName = roomNames[Math.floor(Math.random() * roomNames.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setGeneratedRoom({
      name: randomName,
      id: roomId,
      description: randomDescription
    });
    setIsGenerating(false);
  };

  const handleSearchRoom = () => {
    if (searchQuery.trim()) {
      // Check if it's a room ID that exists in active rooms
      const foundRoom = activeRooms.find(room => 
        room.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (foundRoom) {
        setCurrentRoom(foundRoom);
        setCurrentView('chat');
      } else {
        alert(`Room with ID "${searchQuery}" not found. Please check the room ID and try again.`);
      }
    }
  };

  const handleLaunchRoom = (room: {name: string, id: string, description: string}) => {
    console.log('handleLaunchRoom called with room:', room);
    setCurrentRoom(room);
    setCurrentView('chat');
    console.log('Set currentView to chat and currentRoom to:', room);
  };

  const handleEnterRoom = (room: {name: string, id: string, description: string, listeners: number}) => {
    console.log('handleEnterRoom called with room:', room);
    setCurrentRoom(room);
    setCurrentView('chat');
    
    // Save room to history
    const roomToSave = {
      name: room.name,
      id: room.id,
      description: room.description,
      timestamp: new Date()
    };
    setSavedRooms(prev => {
      const exists = prev.some(r => r.id === room.id);
      if (!exists) {
        return [roomToSave, ...prev.slice(0, 9)]; // Keep max 10 rooms
      }
      return prev;
    });
    
    console.log('Set currentView to chat and currentRoom to:', room);
  };

  const reloadRooms = () => {
    const newRooms = [
      'Nebula Chat', 'Quantum Whispers', 'Digital Séance', 'Cyber Monastery', 'Virtual Vortex',
      'Binary Dreams', 'Code Confessions', 'Data Meditation', 'Algorithm Asylum', 'Matrix Murmurs',
      'Neural Network', 'Silicon Sanctuary', 'Pixel Portal', 'Wireless Wisdom', 'Bandwidth Bliss'
    ].map((name, index) => ({
      id: `reload-${Date.now()}-${index}`,
      name,
      description: index % 2 === 0 ? 'Active whispers flowing...' : 'Silence awaits your voice...',
      listeners: Math.floor(Math.random() * 25) + 1
    })).slice(0, 10);
    
    setActiveRooms(newRooms);
    setRoomReloadKey(prev => prev + 1);
  };

  // Gender selection functions
  const generateUserProfile = (gender: 'male' | 'female') => {
    const uniqueId = `${gender}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    // Use 3D character avatars
    const male3DAvatars = [maleSample1, maleSample2];
    const female3DAvatars = [femaleSample1, femaleSample2];
    
    const avatars = gender === 'male' ? male3DAvatars : female3DAvatars;
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    return {
      id: uniqueId,
      gender,
      avatar: randomAvatar
    };
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    const profile = generateUserProfile(gender);
    setUserProfile(profile);
    setShowGenderSelect(false);
    setCurrentView('main');
  };

  const handleEnterVoid = () => {
    setShowGenderSelect(true);
  };

  console.log('Current state:', { currentView, currentRoom }); // Debug log
  
  if (currentView === 'chat' && currentRoom) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-ambient-primary via-ambient-secondary to-ambient-tertiary text-foreground font-sans overflow-hidden">
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
                  {currentRoom.name}
                </h1>
                <p className="text-sm text-muted-foreground">Room ID: {currentRoom.id}</p>
              </div>
              <div className="flex items-center gap-4">
                {userProfile && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-whisper-mist/10 rounded-lg">
                    {typeof userProfile.avatar === 'string' && userProfile.avatar.startsWith('src/') ? (
                      <img 
                        src={userProfile.avatar} 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <img 
                        src={userProfile.avatar} 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-xs text-muted-foreground">ID: {userProfile.id}</span>
                  </div>
                )}
                <button 
                  onClick={() => setCurrentView('main')}
                  className="px-4 py-2 text-cyber-cyan border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/10 transition-all duration-200"
                >
                  Leave Room
                </button>
              </div>
            </div>
          </motion.div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <motion.div 
              className="max-w-2xl mx-auto space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, x: message.sender === 'me' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'me' 
                      ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary' 
                      : message.sender === 'system'
                      ? 'bg-whisper-mist/20 border border-cyber-cyan/30 text-cyber-cyan'
                      : 'bg-whisper-mist/10 border border-cyber-purple/30 text-cyber-purple'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'me' ? 'text-ambient-primary/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Message Input */}
          <motion.div 
            className="p-6 bg-ambient-primary/50 backdrop-blur-sm border-t border-cyber-cyan/20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="max-w-2xl mx-auto flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Whisper your thoughts..."
                className="flex-1 px-4 py-3 bg-whisper-mist/10 border border-cyber-cyan/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Send
              </button>
            </div>
          </motion.div>

          {/* Footer Navigation */}
          <div className="p-4 bg-ambient-primary/90 backdrop-blur-sm border-t border-cyber-cyan/20">
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setCurrentView('main')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">🏠</span>
                <span className="text-xs font-medium">Home</span>
              </button>
              <button
                onClick={() => setCurrentView('rooms')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-purple hover:bg-cyber-purple/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">🏢</span>
                <span className="text-xs font-medium">Rooms</span>
              </button>
              <button
                onClick={() => setCurrentView('individuals')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">👥</span>
                <span className="text-xs font-medium">Individuals</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'rooms') {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-ambient-primary via-ambient-secondary to-ambient-tertiary text-foreground font-sans overflow-hidden">
        <div className="relative z-10 min-h-screen flex flex-col">
          <motion.div 
            className="p-4 bg-ambient-primary/80 backdrop-blur-sm border-b border-cyber-cyan/20"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
                  WhisprSpace - Rooms
                </h1>
                <p className="text-sm text-muted-foreground">Discover whisper chambers</p>
              </div>
              <button 
                onClick={() => setCurrentView('main')}
                className="px-4 py-2 text-cyber-cyan border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/10 transition-all duration-200"
              >
                Back to Void
              </button>
            </div>
          </motion.div>

          <div className="flex-1 p-6">
            {/* Navigation Buttons */}
            <motion.div 
              className="flex gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => setRoomMode('create')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  roomMode === 'create' 
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary' 
                    : 'border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10'
                }`}
              >
                Create Room
              </button>
              <button
                onClick={() => setRoomMode('search')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  roomMode === 'search' 
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary' 
                    : 'border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10'
                }`}
              >
                Search Active Rooms
              </button>
            </motion.div>

            {/* Create Room Section */}
            {roomMode === 'create' && (
              <motion.div
                className="max-w-md mx-auto bg-whisper-mist/10 border border-cyber-cyan/20 rounded-lg p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold text-cyber-cyan mb-4">Create Anonymous Room</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Room Topic</label>
                    <input
                      type="text"
                      value={roomTopic}
                      onChange={(e) => setRoomTopic(e.target.value)}
                      placeholder="Enter desired topic for AI generation..."
                      className="w-full px-4 py-3 bg-whisper-mist/10 border border-cyber-cyan/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan"
                    />
                  </div>
                  <button
                    onClick={generateRoom}
                    disabled={!roomTopic.trim() || isGenerating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary font-semibold rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Room with AI'}
                  </button>
                  {generatedRoom && (
                    <motion.div
                      className="mt-4 p-4 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h4 className="font-semibold text-cyber-cyan">{generatedRoom.name}</h4>
                      <p className="text-sm text-muted-foreground">ID: {generatedRoom.id}</p>
                      <p className="text-sm mt-2">{generatedRoom.description}</p>
                      <button 
                        onClick={() => handleLaunchRoom(generatedRoom)}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-cyber-purple to-cyber-cyan text-ambient-primary text-sm rounded-md hover:scale-105 transition-transform"
                      >
                        Launch Room
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Search Active Rooms Section */}
            {roomMode === 'search' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-cyber-cyan">Active Rooms</h3>
                  <button
                    onClick={reloadRooms}
                    className="px-4 py-2 border border-cyber-purple/30 text-cyber-purple rounded-lg hover:bg-cyber-purple/10 transition-all duration-200"
                  >
                    🔄 Reload
                  </button>
                </div>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  key={roomReloadKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeRooms.map((room, index) => (
                    <motion.div
                      key={room.id}
                      className="p-4 bg-whisper-mist/10 border border-cyber-cyan/20 rounded-lg hover:bg-cyber-cyan/5 transition-all duration-200 cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-lg font-semibold text-cyber-cyan mb-2">{room.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-cyber-purple flex items-center gap-1">
                          <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></span>
                          {room.listeners} listeners
                        </span>
                        <button 
                          onClick={() => handleEnterRoom(room)}
                          className="px-3 py-1 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary text-sm rounded-md hover:scale-105 transition-transform"
                        >
                          Enter
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-4 bg-ambient-primary/90 backdrop-blur-sm border-t border-cyber-cyan/20">
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setCurrentView('main')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">🏠</span>
                <span className="text-xs font-medium">Home</span>
              </button>
              <button
                onClick={() => setCurrentView('rooms')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-purple hover:bg-cyber-purple/10 rounded-lg transition-all duration-200 bg-cyber-purple/10"
              >
                <span className="text-xl">🏢</span>
                <span className="text-xs font-medium">Rooms</span>
              </button>
              <button
                onClick={() => setCurrentView('individuals')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">👥</span>
                <span className="text-xs font-medium">Individuals</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'individuals') {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-ambient-primary via-ambient-secondary to-ambient-tertiary text-foreground font-sans overflow-hidden">
        <div className="relative z-10 min-h-screen flex flex-col">
          <motion.div 
            className="p-4 bg-ambient-primary/80 backdrop-blur-sm border-b border-cyber-cyan/20"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
                  WhisprSpace - Individuals
                </h1>
                <p className="text-sm text-muted-foreground">Connect with fellow whisperers</p>
              </div>
              <button 
                onClick={() => setCurrentView('main')}
                className="px-4 py-2 text-cyber-cyan border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/10 transition-all duration-200"
              >
                Back to Void
              </button>
            </div>
          </motion.div>

          <div className="flex-1 p-6">
            {/* Saved Individuals Section */}
            {savedIndividuals.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-cyber-purple mb-4">Recent Connections</h3>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {savedIndividuals.map((individual, index) => (
                    <motion.div
                      key={individual.id}
                      className="p-4 bg-whisper-mist/10 border border-cyber-purple/20 rounded-lg hover:bg-cyber-purple/5 transition-all duration-200 cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        {individual.avatar.startsWith('src/') ? (
                          <img 
                            src={individual.avatar} 
                            alt="Avatar" 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">{individual.avatar}</span>
                        )}
                      </div>
                      <h3 className="text-center text-cyber-purple font-medium mb-1">{individual.name}</h3>
                      <p className="text-xs text-muted-foreground text-center mb-3">
                        Last seen: {individual.lastSeen.toLocaleDateString()}
                      </p>
                      <button className="w-full px-3 py-1 bg-gradient-to-r from-cyber-purple to-cyber-cyan text-ambient-primary text-sm rounded-md hover:scale-105 transition-transform">
                        Whisper
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Discover New Individuals */}
            <div>
              <h3 className="text-xl font-bold text-cyber-cyan mb-4">Discover New Voices</h3>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {Array.from({ length: 8 }, (_, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-whisper-mist/10 border border-cyber-purple/20 rounded-lg hover:bg-cyber-purple/5 transition-all duration-200 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      const newIndividual = {
                        id: `user-${Date.now()}-${index}`,
                        name: `Whisperer ${String.fromCharCode(65 + index)}`,
                        avatar: ['🧔', '👨', '👩', '👧', '🧓', '👴', '👵', '🧑‍💼'][index] || '👤',
                        lastSeen: new Date()
                      };
                      setSavedIndividuals(prev => [newIndividual, ...prev.slice(0, 9)]);
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-ambient-primary font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <h3 className="text-center text-cyber-purple font-medium mb-1">Whisperer {String.fromCharCode(65 + index)}</h3>
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      {index % 3 === 0 ? 'Listening...' : index % 3 === 1 ? 'Whispering...' : 'Silent...'}
                    </p>
                    <button className="w-full px-3 py-1 bg-gradient-to-r from-cyber-purple to-cyber-cyan text-ambient-primary text-sm rounded-md hover:scale-105 transition-transform">
                      Whisper
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="p-4 bg-ambient-primary/90 backdrop-blur-sm border-t border-cyber-cyan/20">
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setCurrentView('main')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">🏠</span>
                <span className="text-xs font-medium">Home</span>
              </button>
              <button
                onClick={() => setCurrentView('rooms')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-purple hover:bg-cyber-purple/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">🏢</span>
                <span className="text-xs font-medium">Rooms</span>
              </button>
              <button
                onClick={() => setCurrentView('individuals')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all duration-200 bg-cyber-cyan/10"
              >
                <span className="text-xl">👥</span>
                <span className="text-xs font-medium">Individuals</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Main Void Interface */}
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
                <p className="text-sm text-muted-foreground">The void awaits</p>
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
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <motion.h2
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent text-center mb-12"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Welcome to the void
            </motion.h2>

            {/* Search Bar */}
            <motion.div 
              className="w-full max-w-md mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter room ID to join..."
                  className="flex-1 px-6 py-3 bg-whisper-mist/10 border border-cyber-cyan/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchRoom()}
                />
                <button
                  onClick={handleSearchRoom}
                  className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
                >
                  Search
                </button>
              </div>
            </motion.div>

            {/* Navigation Options */}
            <motion.div 
              className="flex gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <button
                onClick={() => setCurrentView('rooms')}
                className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-ambient-primary font-semibold rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyber-cyan/25"
              >
                Enter Rooms
              </button>
              <button
                onClick={() => setCurrentView('individuals')}
                className="px-8 py-4 border-2 border-cyber-purple text-cyber-purple font-semibold rounded-lg hover:bg-cyber-purple hover:text-ambient-primary transition-all duration-200"
              >
                Find Individuals
              </button>
            </motion.div>
          </div>

          {/* Footer Navigation */}
          <div className="p-4 bg-ambient-primary/90 backdrop-blur-sm border-t border-cyber-cyan/20">
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setCurrentView('main')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all duration-200 bg-cyber-cyan/10"
              >
                <span className="text-xl">🏠</span>
                <span className="text-xs font-medium">Home</span>
              </button>
              <button
                onClick={() => setCurrentView('rooms')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-purple hover:bg-cyber-purple/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">🏢</span>
                <span className="text-xs font-medium">Rooms</span>
              </button>
              <button
                onClick={() => setCurrentView('individuals')}
                className="flex flex-col items-center gap-1 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">👥</span>
                <span className="text-xs font-medium">Individuals</span>
              </button>
            </div>
          </div>

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

      {/* Gender Selection Modal */}
      <AnimatePresence>
        {showGenderSelect && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-ambient-primary/90 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg p-8 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
                Select Your Identity
              </h3>
              <p className="text-center text-muted-foreground mb-8">
                Choose your gender to generate a unique avatar and ID for your whisper journey
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleGenderSelect('male')}
                  className="flex flex-col items-center gap-3 px-8 py-6 bg-whisper-mist/10 border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/10 transition-all duration-200 hover:scale-105"
                >
                  <div className="text-4xl">👨</div>
                  <span className="text-cyber-cyan font-semibold">Male</span>
                </button>
                
                <button
                  onClick={() => handleGenderSelect('female')}
                  className="flex flex-col items-center gap-3 px-8 py-6 bg-whisper-mist/10 border border-cyber-purple/30 rounded-lg hover:bg-cyber-purple/10 transition-all duration-200 hover:scale-105"
                >
                  <div className="text-4xl">👩</div>
                  <span className="text-cyber-purple font-semibold">Female</span>
                </button>
              </div>

              <button
                onClick={() => setShowGenderSelect(false)}
                className="w-full mt-6 px-4 py-2 text-muted-foreground border border-muted-foreground/30 rounded-lg hover:bg-muted-foreground/10 transition-all duration-200"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}