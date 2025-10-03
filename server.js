import express from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
const port = process.env.PORT || 3000;

// Allow cross-domain access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

async function fetchEvents(fields) {
  const eventsRef = collection(db, "events");
  const snapshot = await getDocs(eventsRef);
  const results = [];
  snapshot.forEach((doc) => {
    const eventData = doc.data();
    const event = {};
    // Processing fields
    for (const field of fields) {
      if (field === "time") {
        if (eventData.time.toDate) {
          event.time = eventData.time.toDate().toLocaleString();
        } else {
          event.time = eventData.time;
        }
      } else {
        event[field] = eventData[field] || "";
      }
    }
    results.push(event);
  });

  return results;
}

// Get event data including location
app.get("/api/events/location", async (req, res) => {
  try {
    const events = await fetchEvents(["title", "content", "location"]);
    res.json({
      events: events,
      total: events.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get event data including time
app.get("/api/events/time", async (req, res) => {
  try {
    const events = await fetchEvents(["title", "content", "time"]);
    res.json({
      events: events,
      total: events.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});