const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const url = "mongodb+srv://alvinalexabraham:root@clusterteam27.uhyq1.mongodb.net/COP4331Cards?retryWrites=true&w=majority&appName=ClusterTeam27";
const client = new MongoClient(url);

client.connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// USER MANAGEMENT WITH EMAIL VERIFICATION

// Register a new user with email verification
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const db = client.db("LargeProjectTeam27");
    const result = await db.collection('Users').insertOne({ username, email, password, isVerified: false, verificationCode });
    
    await transporter.sendMail({
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`
    });
    
    res.status(201).json({ userId: result.insertedId, message: 'Verification email sent' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.post('/api/verify-email', async (req, res) => {
  const { verificationCode } = req.body;

  try {
    const db = client.db('LargeProjectTeam27');
    const user = await db.collection('Users').findOne({ verificationCode });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    await db.collection('Users').updateOne(
      { _id: user._id }, // Use the user's unique ID to ensure the correct document is updated
      { $set: { isVerified: true }, $unset: { verificationCode: '' } } // Mark as verified and remove the verificationCode
    );

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = client.db('LargeProjectTeam27');
    const user = await db.collection('Users').findOne({ email, password });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "Email not verified" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});



// CONTACT MANAGEMENT

// Add a contact
app.post('/api/contacts/add', async (req, res) => {
  const { userId, name, email } = req.body;
  try {
    const db = client.db("LargeProjectTeam27");
    const result = await db.collection('Contacts').insertOne({ userId, name, email });
    res.status(201).json({ message: 'Contact added', contactId: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Delete a contact
app.delete('/api/contacts/:id/delete', async (req, res) => {
  const contactId = req.params.id;
  try {
    const db = client.db("LargeProjectTeam27");
    await db.collection('Contacts').deleteOne({ _id: ObjectId(contactId) });
    res.status(200).json({ message: 'Contact deleted' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Edit a contact
app.put('/api/contacts/:id/edit', async (req, res) => {
  const contactId = req.params.id;
  const { name, email } = req.body;
  try {
    const db = client.db("LargeProjectTeam27");
    await db.collection('Contacts').updateOne({ _id: ObjectId(contactId) }, { $set: { name, email } });
    res.status(200).json({ message: 'Contact updated' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Search contacts
app.post('/api/contacts/search', async (req, res) => {
  const { userId, search } = req.body;
  try {
    const db = client.db("LargeProjectTeam27");
    const results = await db.collection('Contacts').find({ userId, name: { $regex: search, $options: 'i' } }).toArray();
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// EVENT MANAGEMENT WITH NOTIFICATIONS

// Create an event
app.post('/api/events/create', async (req, res) => {
  const { title, description, date, location, organizerId } = req.body;
  try {
    const db = client.db("LargeProjectTeam27");
    const result = await db.collection('Events').insertOne({ title, description, date, location, organizerId });
    res.status(201).json({ message: 'Event created', eventId: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
  console.log('Creating event:', req.body);
});

// Edit an event
app.put('/api/events/:id/edit', async (req, res) => {
  const eventId = req.params.id; // Event ID from the request parameters
  const { title, description, date, location } = req.body; // Extract fields from the request body

  try {
    const db = client.db("LargeProjectTeam27");

    // Use `new ObjectId` to create a valid MongoDB ObjectId
    await db.collection('Events').updateOne(
      { _id: new ObjectId(eventId) }, // Query filter
      { $set: { title, description, date, location } } // Fields to update
    );

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});


// Delete an event
app.delete('/api/events/:id/delete', async (req, res) => {
  const eventId = req.params.id; // Event ID from the request parameters

  try {
    const db = client.db("LargeProjectTeam27");

    // Use `new ObjectId` to create a valid MongoDB ObjectId
    await db.collection('Events').deleteOne({ _id: new ObjectId(eventId) });

    res.status(200).json({ message: 'Event deleted' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Event invitation notification
app.post('/api/events/:id/invite', async (req, res) => {
  const eventId = req.params.id;
  const { recipientEmail } = req.body;

  try {
    const db = client.db("LargeProjectTeam27");

    // Fetch the event
    const event = await db.collection('Events').findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the recipient user
    const recipient = await db.collection('Users').findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    // Add the recipient to the event's sharedWith field
    await db.collection('Events').updateOne(
      { _id: new ObjectId(eventId) },
      { $addToSet: { sharedWith: recipient._id.toString() } } // Ensure no duplicates
    );

    // Send the email invite
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: `You're invited to: ${event.title}`,
      text: `You are invited to the event "${event.title}".\nDate: ${event.date}\nLocation: ${event.location}\nDetails: ${event.description}`,
    });

    res.status(200).json({ message: 'Invitation sent and user associated with the event!' });
  } catch (err) {
    console.error('Error in invite endpoint:', err);
    res.status(500).json({ error: err.message });
  }
});


// Event update notification
app.post('/api/events/:id/notify-update', async (req, res) => {
  const eventId = req.params.id;
  try {
    const db = client.db("LargeProjectTeam27");
    const event = await db.collection('Events').findOne({ _id: ObjectId(eventId) });
    const attendees = await db.collection('EventResponses').find({ eventId }).toArray();

    for (let attendee of attendees) {
      const user = await db.collection('Users').findOne({ _id: ObjectId(attendee.userId) });
      if (user) {
        await transporter.sendMail({
          from: 'your_email@gmail.com',
          to: user.email,
          subject: `Update for event: ${event.title}`,
          text: `The event "${event.title}" has updates.\nNew Details:\n${event.description}\nDate: ${event.date}`
        });
      }
    }
    res.status(200).json({ message: 'Update notifications sent' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Fetch all or filtered events
app.get('/api/events', async (req, res) => {
  const { userId, dateFilter } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId parameter' });

  const filter = {
    $or: [
      { organizerId: userId }, // User is the organizer
      { sharedWith: userId },  // User is invited
    ],
  };

  if (dateFilter === 'upcoming') {
    filter.date = { $gte: new Date() }; // Upcoming events
  } else if (dateFilter === 'past') {
    filter.date = { $lt: new Date() }; // Past events
  }

  try {
    const db = client.db("LargeProjectTeam27");
    const events = await db.collection('Events').find(filter).toArray();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});


// Event reminder
app.post('/api/events/reminder', async (req, res) => {
  try {
    const db = client.db("LargeProjectTeam27");
    const upcomingEvents = await db.collection('Events').find({
      date: { $gte: new Date(), $lte: new Date(Date.now() + 48 * 60 * 60 * 1000) }
    }).toArray();

    for (let event of upcomingEvents) {
      const attendees = await db.collection('EventResponses').find({ eventId: event._id.toString() }).toArray();
      
      for (let attendee of attendees) {
        const user = await db.collection('Users').findOne({ _id: ObjectId(attendee.userId) });
        if (user) {
          await transporter.sendMail({
            from: 'your_email@gmail.com',
            to: user.email,
            subject: `Reminder: Upcoming Event "${event.title}"`,
            text: `This is a reminder that the event "${event.title}" is happening soon.\nDate: ${event.date}\nDescription: ${event.description}`
          });
        }
      }
    }
    res.status(200).json({ message: 'Reminders sent for upcoming events' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
