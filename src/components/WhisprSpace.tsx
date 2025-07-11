import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserPlus, Sparkles, Volume2, VolumeX } from 'lucide-react';
import EnterRoomsPage from '@/components/rooms/EnterRoomsPage';
import FindIndividualsPage from '@/components/individuals/FindIndividualsPage';
import RoomLogsView from '@/components/navigation/RoomLogsView';
import IndividualLogsView from '@/components/navigation/IndividualLogsView';
import FooterNavigation from '@/components/navigation/FooterNavigation';

type ViewState = 'home' | 'rooms' | 'individuals' | 'room-logs' | 'individual-logs';

const WhisprSpace = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize ambient audio
    const ambientAudio = new Audio('/eclipse-ambient-melancholic-background-351771.mp3');
    ambientAudio.loop = true;
    ambientAudio.volume = 0.3;
    setAudio(ambientAudio);

    return () => {
      if (ambientAudio) {
        ambientAudio.pause();
        ambientAudio.src = '';
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audio) {
      if (isAudioEnabled) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rooms':
        return <EnterRoomsPage onBack={handleBackToHome} />;
      case 'individuals':
        return <FindIndividualsPage onBack={handleBackToHome} />;
      case 'room-logs':
        return <RoomLogsView onBack={handleBackToHome} />;
      case 'individual-logs':
        return <IndividualLogsView onBack={handleBackToHome} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-ambient-primary via-ambient-secondary to-ambient-tertiary relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0">
              {/* Floating whisper elements */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-cyber-glow rounded-full opacity-30"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${10 + i * 8}%`,
                    top: `${20 + (i % 3) * 30}%`,
                  }}
                />
              ))}

              {/* Ambient glow effects */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-3xl animate-ambient-glow" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl animate-ambient-glow" style={{ animationDelay: '1s' }} />
            </div>

            {/* Audio Control */}
            <motion.div
              className="absolute top-6 right-6 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAudio}
                className="bg-ambient-secondary/50 backdrop-blur-sm border border-whisper-mist hover:bg-ambient-secondary/70 text-whisper-float"
              >
                {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
              {/* Title Section */}
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.h1
                  className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyber-cyan via-whisper-float to-cyber-purple bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  WhisprSpace
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-whisper-mist max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  Enter the ambient realm where whispers become art and silence speaks louder than words
                </motion.p>
              </motion.div>

              {/* Navigation Cards */}
              <motion.div
                className="grid md:grid-cols-2 gap-8 max-w-4xl w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                {/* Enter Rooms Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="bg-ambient-secondary/50 backdrop-blur-sm border-whisper-mist hover:border-cyber-cyan transition-all duration-300 group cursor-pointer h-full">
                    <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                      <motion.div
                        className="mb-6"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Users className="h-16 w-16 text-cyber-cyan mx-auto group-hover:text-cyber-cyan/80 transition-colors" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-whisper-float mb-4 group-hover:text-cyber-cyan transition-colors">
                        Enter Rooms
                      </h3>
                      <p className="text-whisper-mist mb-6 leading-relaxed">
                        Join collective whispers in shared ambient spaces where thoughts flow freely
                      </p>
                      <Button
                        onClick={() => setCurrentView('rooms')}
                        className="bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan border border-cyber-cyan/50 hover:border-cyber-cyan transition-all duration-300"
                        size="lg"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Explore Rooms
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Find Individuals Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="bg-ambient-secondary/50 backdrop-blur-sm border-whisper-mist hover:border-cyber-purple transition-all duration-300 group cursor-pointer h-full">
                    <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                      <motion.div
                        className="mb-6"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <UserPlus className="h-16 w-16 text-cyber-purple mx-auto group-hover:text-cyber-purple/80 transition-colors" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-whisper-float mb-4 group-hover:text-cyber-purple transition-colors">
                        Find Individuals
                      </h3>
                      <p className="text-whisper-mist mb-6 leading-relaxed">
                        Connect with souls in intimate one-on-one whisper sessions
                      </p>
                      <Button
                        onClick={() => setCurrentView('individuals')}
                        className="bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple border border-cyber-purple/50 hover:border-cyber-purple transition-all duration-300"
                        size="lg"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Find Souls
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Ambient Quote */}
              <motion.div
                className="mt-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                <p className="text-whisper-mist/70 italic text-lg max-w-xl mx-auto">
                  "In the space between words, we find the truest conversations"
                </p>
              </motion.div>
            </div>

            {/* Footer Navigation */}
            <FooterNavigation
              onRoomsClick={() => setCurrentView('room-logs')}
              onIndividualsClick={() => setCurrentView('individual-logs')}
            />
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {renderCurrentView()}
      </motion.div>
    </AnimatePresence>
  );
};

export default WhisprSpace;