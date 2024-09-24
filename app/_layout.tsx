import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ImageBackground, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const PomodoroTimer = () => {
  // const [time, setTime] = useState(25 * 60);
  const [time, setTime] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(0.5);
  const [mode, setMode] = useState('work');
  const [sessions, setSessions] = useState(4);
  const [currentSession, setCurrentSession] = useState(1);
  const [progress, setProgress] = useState(0);
  // const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMotivationalQuote, setShowMotivationalQuote] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundRef = useRef(null);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const motivationalQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson"
  ];

  // useEffect(() => {
  //   let interval = null;
  //   if (isActive && time > 0) {
  //     interval = setInterval(() => {
  //       setTime((prevTime) => {
  //         const newTime = prevTime - 1;
  //         const totalTime = mode === 'work' ? workDuration * 60 : breakDuration * 60;
  //         setProgress(((totalTime - newTime) / totalTime) * 100);
  //         return newTime;
  //       });

  //       // Cycle through quotes during break time
  //       if (mode === 'break') {
  //         setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % motivationalQuotes.length);
  //       }
  //     }, 1000);
  //   } else if (time === 0) {
  //     clearInterval(interval);
  //     if (mode === 'work') {
  //       if (currentSession < sessions) {
  //         setMode('break');
  //         setTime(breakDuration * 60);
  //         setShowMotivationalQuote(true);
  //         setCurrentQuoteIndex(0); // Reset quote index at the start of break
  //       } else {
  //         setIsActive(false);
  //         setMode('completed');
  //       }
  //     } else {
  //       setMode('work');
  //       setCurrentSession((prev) => prev + 1);
  //       setTime(workDuration * 60);
  //       setShowMotivationalQuote(false);
  //     }
  //     setProgress(0);
  //   }
  //   return () => clearInterval(interval);
  // }, [isActive, time, mode, workDuration, breakDuration, currentSession, sessions, soundEnabled]);
  
  useEffect(() => {
  let interval = null;
  if (isActive && time > 0) {
    interval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime - 1;
        const totalTime = mode === 'work' ? workDuration * 60 : breakDuration * 60;
        setProgress(((totalTime - newTime) / totalTime) * 100);
        return newTime;
      });

      if (mode === 'break') {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % motivationalQuotes.length);
      }
    }, 1000);
  } else if (time === 0) {
    clearInterval(interval);
    if (mode === 'work') {
      setMode('break');
      setTime(breakDuration * 60);
      setShowMotivationalQuote(true);
      setCurrentQuoteIndex(0);
    } else {
      setMode('work');
      setTime(workDuration * 60);
      setShowMotivationalQuote(false);
      setCurrentSession((prev) => (prev % sessions) + 1);
    }
    setProgress(0);
  }
  return () => clearInterval(interval);
}, [isActive, time, mode, workDuration, breakDuration, currentSession, sessions, soundEnabled]);

  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(workDuration * 60);
    setMode('work');
    setCurrentSession(1);
    setProgress(0);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleSound = async () => {
    setSoundEnabled(!soundEnabled);
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const playSound = async () => {
    if (!soundEnabled ) return;

    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(require('../assets/clock.mp3'));
      soundRef.current = sound;

      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleWorkDurationChange = (value) => {
    const newValue = Math.max(1, Math.min(60, value));
    setWorkDuration(newValue);
  };

  const handleBreakDurationChange = (value) => {
    const newValue = Math.max(5, Math.min(30, value));
    setBreakDuration(newValue);
  };

  useEffect(() => {
  const handleSound = async () => {
    if (isActive && soundEnabled) {
      await playSound();
    } else {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    }
  };

  handleSound();
}, [isActive, soundEnabled]);

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          source={{ uri: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=600' }}
          style={styles.background}
        >
          <View style={[styles.overlay, isDarkMode ? styles.darkOverlay : styles.lightOverlay]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={toggleDarkMode} style={styles.iconButton}>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>{isDarkMode ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSound} style={styles.iconButton}>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>{soundEnabled ? '🔊' : '🔇'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSettings} style={styles.iconButton}>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>⚙️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <View style={styles.modeContainer}>
                <Text style={[styles.modeIcon, isDarkMode ? styles.darkText : styles.lightText]}>
                  {mode === 'work' ? '🧠' : mode === 'break' ? '☕' : '✅'}
                </Text>
                <Text style={[styles.modeText, isDarkMode ? styles.darkText : styles.lightText]}>
                  {mode === 'work' ? 'Work Time' : mode === 'break' ? 'Break Time' : 'Sessions Completed!'}
                </Text>
              </View>
              <Text style={[styles.timer, isDarkMode ? styles.darkText : styles.lightText]}>
                {mode === 'completed' ? 'Done!' : formatTime(time)}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
              <Text style={[styles.sessionText, isDarkMode ? styles.darkText : styles.lightText]}>
                Session {currentSession} of {sessions}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleTimer} style={styles.startButton} disabled={mode === 'completed'}>
                  <Text style={styles.buttonText}>{isActive ? '⏸️ Pause' : '▶️ Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={resetTimer} style={styles.resetButton}>
                  <Text style={styles.buttonText}>🔄 Reset</Text>
                </TouchableOpacity>
              </View>
              {showMotivationalQuote && (
                <View style={[styles.quoteContainer, isDarkMode ? styles.darkQuote : styles.lightQuote]}>
                  <Text style={isDarkMode ? styles.darkText : styles.lightText}>
                    {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
                  </Text>
                </View>
              )}
              {showSettings && (
      <View style={[styles.settingsContainer, isDarkMode ? styles.darkSettings : styles.lightSettings]}>
        <Text style={[styles.settingsTitle, isDarkMode ? styles.darkText : styles.lightText]}>Settings</Text>
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, isDarkMode ? styles.darkText : styles.lightText]}>Work Duration: {workDuration} minutes</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity onPress={() => handleWorkDurationChange(workDuration - 1)} style={styles.sliderButton}>
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>-</Text>
            </TouchableOpacity>
            <View style={styles.slider}>
              <View style={[styles.sliderFill, { width: `${(workDuration - 1) / 40 * 100}%` }]} />
            </View>
            <TouchableOpacity onPress={() => handleWorkDurationChange(workDuration + 1)} style={styles.sliderButton}>
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, isDarkMode ? styles.darkText : styles.lightText]}>Break Duration: {breakDuration} minutes</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity onPress={() => handleBreakDurationChange(breakDuration - 1)} style={styles.sliderButton}>
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>-</Text>
            </TouchableOpacity>
            <View style={styles.slider}>
              <View style={[styles.sliderFill, { width: `${(breakDuration - 5) / 25 * 100}%` }]} />
            </View>
            <TouchableOpacity onPress={() => handleBreakDurationChange(breakDuration + 1)} style={styles.sliderButton}>
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, isDarkMode ? styles.darkText : styles.lightText]}>Number of Sessions: {sessions}</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity onPress={() => setSessions(Math.max(1, sessions - 1))} style={styles.sliderButton}>
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>-</Text>
            </TouchableOpacity>
            <View style={styles.slider}>
              <View style={[styles.sliderFill, { width: `${(sessions - 1) / 9 * 100}%` }]} />
            </View>
            <TouchableOpacity onPress={() => setSessions(Math.min(10, sessions + 1))} style={styles.sliderButton}>
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 5,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    // paddingTop: (StatusBar.currentHeight ?? 0) + 20, // Add extra padding at the top
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
  },
  lightOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFA500',
  },
  sessionText: {
    fontSize: 18,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4500',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  modeIcon: {
    fontSize: 40,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  quoteContainer: {
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  lightQuote: {
    backgroundColor: '#FFF3E0',
  },
  darkQuote: {
    backgroundColor: '#333',
  },
  settingsContainer: {
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  lightSettings: {
    backgroundColor: '#FFF3E0',
  },
  darkSettings: {
    backgroundColor: '#333',
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
  },
  sliderButton: {
    padding: 10,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  slider: {
    flex: 1,
    height: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#FFA500',
  },
});

export default PomodoroTimer;