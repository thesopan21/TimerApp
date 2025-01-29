# Timer App

A React Native app for creating, managing, and interacting with multiple customizable timers.

## Assumptions

*   Timers are stored locally using AsyncStorage.
*   The app assumes durations are provided in seconds.
*   Basic styling is provided; you can customize it further.

## Setup Instructions

1.  Clone the repository: `git clone https://github.com/thesopan21/TimerApp.git`
2.  Navigate to the project directory: `cd TimerApp`
3.  Install dependencies: `npm install`
4.  Start the development server: `npx react-native run-android` or `npx react-native run-ios`



## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
npm start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
npm run android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
npm run ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.


## Future Enhancements

*   Implement history tracking.
*   Add more advanced timer features (e.g., repeating timers, custom notifications).
*   Improve UI/UX.
*   Implement unit tests.
*   Add more robust error handling.