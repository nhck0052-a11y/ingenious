import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'

// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import firebaseConfig from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Connect to Firebase Functions emulator during development
// In production, this line should be removed or commented out.
// Assuming the emulator is running on localhost:5001
connectFunctionsEmulator(functions, "localhost", 5001);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App firebaseFunctions={functions} />
  </StrictMode>,
)
