/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
admin.initializeApp();

setGlobalOptions({maxInstances: 10});

exports.countUsers = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const usersCollection = admin.firestore().collection("users");
      const snapshot = await usersCollection.get();
      const roleCounts = {};
      snapshot.forEach((doc) => {
        const userData = doc.data();
        const role = userData.role;
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
      res.status(200).send({roleCounts});
    } catch (error) {
      console.error("Error counting users:", error.message);
      res.status(500).send("Error counting users");
    }
  });
});

/**
 * Fetch event data from Firestore
 * @param {Array} fields - fields to include in the result
 * @return {Promise<Array>} events data
 */
async function fetchEvents(fields) {
  const eventsRef = admin.firestore().collection("events");
  const snapshot = await eventsRef.get();
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
exports.eventsLocation = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const events = await fetchEvents(["title", "content", "location"]);
      res.status(200).send({events});
    } catch (error) {
      console.error("Error getting events with location:", error.message);
      res.status(500).send("Error getting events with location");
    }
  });
});

// Get event data including time
exports.eventsTime = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const events = await fetchEvents(["title", "content", "time"]);
      res.status(200).send({events});
    } catch (error) {
      console.error("Error getting events with time:", error.message);
      res.status(500).send("Error getting events with time");
    }
  });
});

// Send email using SendGrid API
const sendGrid = require("@sendgrid/mail");
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
exports.sendEmail = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const {to, subject, content, attachment} = req.body;
      if (!to.length || !subject || !content) {
        return res.status(400).json({error: "Missing required fields"});
      }
      const msg = {
        to: to.map((email) => email.trim()),
        from: {email: "v50kfc4@gmail.com", name: "NutriPublic Admin"},
        subject,
        text: content,
      };
      if (attachment) msg.attachments = [attachment];
      await sendGrid.send(msg);
      res.json({success: true, message: "Email sent successfully"});
    } catch (error) {
      res.status(500).json({error: error.message, success: false});
    }
  });
});
// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
