# Pomodoro Timer

This project is a React Native application that implements a Pomodoro Timer with additional features such as dark mode, motivational quotes, and sound notifications.

## Light Mode 

![WhatsApp Image 2024-09-25 at 00 14 54_772e5007](https://github.com/user-attachments/assets/f8e830f6-f850-4121-bcfc-070e09cc75e7)

## Dark Mode

![WhatsApp Image 2024-09-25 at 00 14 53_a3232f82](https://github.com/user-attachments/assets/85407f8c-d57d-4db3-b928-2db28f8e009f)

## Features

- **Pomodoro Timer**: Work and break intervals with customizable durations.
- **Dark Mode**: Toggle between light and dark themes.
- **Motivational Quotes**: Display random motivational quotes during break times.
- **Sound Notifications**: Play a sound when the timer starts and stops.
- **Settings**: Customize work duration, break duration, and the number of sessions.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/drakeRAGE/Pomodoro-App.git
   cd pomodoro-App
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm expo start
   ```

## Usage

1. **Start/Pause Timer**: Tap the start button to begin the timer. Tap again to pause.
2. **Reset Timer**: Tap the reset button to reset the timer to the initial state.
3. **Toggle Dark Mode**: Tap the sun/moon icon to switch between light and dark modes.
4. **Toggle Sound**: Tap the sound icon to enable or disable sound notifications.
5. **Open Settings**: Tap the gear icon to open the settings menu where you can adjust work duration, break duration, and the number of sessions.

## Code Overview

### Main Components

- **PomodoroTimer**: The main component that handles the timer logic, state management, and rendering.
- **Settings**: A section within the main component to adjust timer settings.

### Key State Variables

- `time`: The current time in seconds.
- `isActive`: Boolean indicating if the timer is active.
- `isDarkMode`: Boolean indicating if dark mode is enabled.
- `showSettings`: Boolean indicating if the settings menu is visible.
- `workDuration`: Duration of the work interval in minutes.
- `breakDuration`: Duration of the break interval in minutes.
- `mode`: Current mode of the timer (`work`, `break`, or `completed`).
- `sessions`: Total number of work sessions.
- `currentSession`: Current session number.
- `progress`: Progress percentage of the current interval.
- `soundEnabled`: Boolean indicating if sound notifications are enabled.
- `showMotivationalQuote`: Boolean indicating if a motivational quote should be displayed.
- `currentQuoteIndex`: Index of the current motivational quote.

### Styling

Styles are defined using JavaScript objects with properties in camelCase. The styles are applied using the `style` prop on React Native components.

### Sound Management

Sound notifications are managed using the `expo-av` library. The sound is played when the timer starts and stops, and can be toggled on or off.

## Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)
