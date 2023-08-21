import { FirebaseOptions, initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

const firebaseConfig: FirebaseOptions = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
	databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
}

const app = initializeApp(firebaseConfig)
getDatabase(app)

const container = document.getElementById("root")
const root = createRoot(container as HTMLElement)
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
