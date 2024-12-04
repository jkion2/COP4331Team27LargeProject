const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const EMAIL = 'eventify.xyz@gmail.com';
const EMAIL_APP_PASSWORD = 'uhhvysdwmltbfvzi';

const emailTemplate = (title, body) => `
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Modak&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #CC6C67;
      color: white;
      text-align: center;
      padding: 30px;
    }
    .header h1 {
      font-family: 'Modak', cursive;
      font-size: 42px; /* Increased font size */
      margin: 0;
      font-weight: bold; /* Make it bolder */
    }
    .content {
      padding: 25px; /* Increased padding for more spacing */
      text-align: left;
      font-size: 16px; /* Increased base font size */
      line-height: 1.6; /* Improved readability */
    }
    .content p {
      margin: 15px 0;
    }
    .footer {
      background-color: #f1f1f1;
      text-align: center;
      padding: 20px; /* Increased padding */
      font-size: 1rem; /* Slightly larger font size */
      color: #98383B; /* Footer text color change */
      font-weight: bold; /* Footer text is bolder */
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EVENTIFY</h1>
    </div>
    <div class="content">
      ${body}
    </div>
    <div class="footer">
      <p>Make Plans. Send Invites. Create Memories.</p>
    </div>
  </div>
</body>
</html>`;

const url =
  'mongodb+srv://alvinalexabraham:root@clusterteam27.uhyq1.mongodb.net/COP4331Cards?retryWrites=true&w=majority&appName=ClusterTeam27';
const client = new MongoClient(url);

client
  .connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

const app = express();
app.use(cors({ origin: 'https://event-ify.xyz', credentials: true }));

app.use(bodyParser.json({ limit: '10mb' })); // Increase limit to 10MB
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // For URL-encoded payloads

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: EMAIL_APP_PASSWORD,
  },
});

// USER MANAGEMENT WITH EMAIL VERIFICATION

// Register a new user with email verification
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  try {
    const db = client.db('LargeProjectTeam27');
    const result = await db.collection('Users').insertOne({
      username,
      email,
      password,
      isVerified: false,
      verificationCode,
    });

    await transporter.sendMail({
      from: EMAIL,
      to: email,
      subject: 'Your Verification Code - Eventify',
      html: emailTemplate(
        'Email Verification',
        `<p>Hello ${username},</p>
     <p>Welcome to Eventify! Your verification code is:</p>
     <h2 style="text-align: center; color: #CC6C67;">${verificationCode}</h2>
     <p>Please enter this code in the app to verify your email.</p>
     <p>If you did not request this, you can safely ignore this email.</p>`
      ),
    });

    res
      .status(201)
      .json({ userId: result.insertedId, message: 'Verification email sent' });
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

app.post('/api/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const db = client.db('LargeProjectTeam27');
    const user = await db.collection('Users').findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: 'If the account exists, an email will be sent.' }); // Security: Don't reveal if user exists
    }

    const resetToken = new ObjectId().toString(); // Create a unique token
    await db.collection('Users').updateOne(
      { _id: user._id },
      {
        $set: { resetToken, resetTokenExpires: new Date(Date.now() + 3600000) },
      } // 1-hour expiry
    );

    const resetLink = `https://event-ify.xyz/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: EMAIL,
      to: email,
      subject: 'Reset Your Password - Eventify',
      html: emailTemplate(
        'Reset Your Password',
        `<p>Hi there,</p>
    <p>We received a request to reset your password for your Eventify account.</p>
    <p>If this was you, click the button below to reset your password:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p>If you did not request this, you can ignore this email and your password will remain unchanged.</p>`,
        '<p>Need help? <a href="mailto:support@event-ify.xyz">Contact Support</a></p>'
      ),
    });

    res.status(200).json({ message: 'Email sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const db = client.db('LargeProjectTeam27');
    const user = await db.collection('Users').findOne({
      resetToken,
      resetTokenExpires: { $gte: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    await db.collection('Users').updateOne(
      { _id: user._id },
      {
        $set: { password: newPassword },
        $unset: { resetToken: '', resetTokenExpires: '' },
      }
    );

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = client.db('LargeProjectTeam27');
    const user = await db.collection('Users').findOne({ email, password });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: 'Email not verified' });
    }

    res.status(200).json({
      message: 'Login successful',
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
    const db = client.db('LargeProjectTeam27');
    const result = await db
      .collection('Contacts')
      .insertOne({ userId, name, email });
    res
      .status(201)
      .json({ message: 'Contact added', contactId: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Delete a contact
app.delete('/api/contacts/:id/delete', async (req, res) => {
  const contactId = req.params.id;
  try {
    const db = client.db('LargeProjectTeam27');
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
    const db = client.db('LargeProjectTeam27');
    await db
      .collection('Contacts')
      .updateOne({ _id: ObjectId(contactId) }, { $set: { name, email } });
    res.status(200).json({ message: 'Contact updated' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Search contacts
app.post('/api/contacts/search', async (req, res) => {
  const { userId, search } = req.body;
  try {
    const db = client.db('LargeProjectTeam27');
    const results = await db
      .collection('Contacts')
      .find({ userId, name: { $regex: search, $options: 'i' } })
      .toArray();
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// EVENT MANAGEMENT WITH NOTIFICATIONS

// Create an event
app.post('/api/events/create', async (req, res) => {
  const { title, description, date, location, organizerId, image } = req.body;

  try {
    const db = client.db('LargeProjectTeam27');

    const event = { title, description, date, location, organizerId };
    if (image) {
      event.image = image; // Add image only if it exists
    }

    const result = await db.collection('Events').insertOne(event);
    res
      .status(201)
      .json({ message: 'Event created', eventId: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Edit an event
app.put('/api/events/:id/edit', async (req, res) => {
  const eventId = req.params.id; // Event ID from the request parameters
  const { title, description, date, location, image } = req.body; // Extract fields from the request body

  try {
    const db = client.db('LargeProjectTeam27');

    // Use `new ObjectId` to create a valid MongoDB ObjectId
    await db.collection('Events').updateOne(
      { _id: new ObjectId(eventId) }, // Query filter
      { $set: { title, description, date, location, image } } // Fields to update
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
    const db = client.db('LargeProjectTeam27');

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
    const db = client.db('LargeProjectTeam27');

    // Fetch the event
    const event = await db
      .collection('Events')
      .findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the recipient user
    const recipient = await db
      .collection('Users')
      .findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    // Add the recipient to the event's sharedWith field
    await db.collection('Events').updateOne(
      { _id: new ObjectId(eventId) },
      { $addToSet: { sharedWith: recipient._id.toString() } } // Ensure no duplicates
    );

    await transporter.sendMail({
      from: EMAIL,
      to: recipientEmail,
      subject: `You're Invited to: ${event.title} - Eventify`,
      html: emailTemplate(
        `You're Invited!`,
        `<p>Hello,</p>
     <p>You have been invited to an event on Eventify:</p>
     <p><strong>Event:</strong> ${event.title}</p>
     <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
     <p><strong>Location:</strong> ${event.location}</p>
     <p><strong>Details:</strong> ${event.description}</p>
     <p>We hope to see you there! Click the button below to view the event page:</p>
     <a href="https://event-ify.xyz/event/${
       event._id
     }" style="display: inline-block; padding: 10px 20px; background-color: #CC6C67; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Event</a>
     `
      ),
    });

    res
      .status(200)
      .json({ message: 'Invitation sent and user associated with the event!' });
  } catch (err) {
    console.error('Error in invite endpoint:', err);
    res.status(500).json({ error: err.message });
  }
});

// Event update notification
app.post('/api/events/:id/notify-update', async (req, res) => {
  const eventId = req.params.id;
  try {
    const db = client.db('LargeProjectTeam27');

    // Fetch the event
    const event = await db
      .collection('Events')
      .findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Fetch attendees from the `sharedWith` field
    const attendees = await db
      .collection('Users')
      .find({ _id: { $in: event.sharedWith.map((id) => new ObjectId(id)) } })
      .toArray();

    // Send notifications to each attendee
    for (let attendee of attendees) {
      if (attendee.email) {
        await transporter.sendMail({
          from: EMAIL,
          to: attendee.email,
          subject: `Updated Details for: ${event.title} - Eventify`,
          html: emailTemplate(
            `Event Update`,
            `<p>Hello,</p>
     <p>The event <strong>${event.title}</strong> has been updated:</p>
     <p><strong>New Date:</strong> ${new Date(event.date).toLocaleString()}</p>
     <p><strong>New Location:</strong> ${event.location}</p>
     <p><strong>Details:</strong> ${event.description}</p>
     <p>Click the button below to view the updated event page:</p>
     <a href="https://event-ify.xyz/event/${
       event._id
     }" style="display: inline-block; padding: 10px 20px; background-color: #CC6C67; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Event</a>
     <p>We look forward to seeing you there!</p>
     `
          ),
        });
      }
    }

    res.status(200).json({ message: 'Update notifications sent' });
  } catch (error) {
    console.error('Error sending update notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch all or filtered events, or a single event by ID
app.get('/api/events', async (req, res) => {
  const { userId, dateFilter, eventId } = req.query;

  try {
    const db = client.db('LargeProjectTeam27');

    // If eventId is provided, fetch a single event
    if (eventId) {
      const event = await db
        .collection('Events')
        .findOne({ _id: new ObjectId(eventId) });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Fetch the organizer details
      const organizer = await db
        .collection('Users')
        .findOne({ _id: new ObjectId(event.organizerId) });

      // Attach organizer info to the response
      event.organizer = organizer;

      // Optionally, fetch attendees if needed
      if (event.sharedWith && event.sharedWith.length > 0) {
        const attendees = await db
          .collection('Users')
          .find({
            _id: { $in: event.sharedWith.map((id) => new ObjectId(id)) },
          })
          .toArray();
        event.attendees = attendees;
      }

      return res.status(200).json(event);
    }

    // If userId is provided, fetch all or filtered events
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    const filter = {
      $or: [
        { organizerId: userId }, // User is the organizer
        { sharedWith: userId }, // User is invited
      ],
    };

    // Handle dateFilter conditions
    if (dateFilter === 'upcoming') {
      filter.date = { $gte: new Date() }; // Upcoming events
    } else if (dateFilter === 'past') {
      filter.date = { $lt: new Date() }; // Past events
    } else if (dateFilter) {
      // Assume dateFilter is a specific date (e.g., '2024-12-02')
      // Convert dateFilter to a Date object at UTC midnight
      const startOfDay = new Date(`${dateFilter}T00:00:00Z`);
      const endOfDay = new Date(`${dateFilter}T23:59:59Z`);

      filter.date = { $gte: startOfDay, $lte: endOfDay }; // Events within the specified day
    }

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
    const db = client.db('LargeProjectTeam27');
    const upcomingEvents = await db
      .collection('Events')
      .find({
        date: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      })
      .toArray();

    for (let event of upcomingEvents) {
      const attendees = await db
        .collection('EventResponses')
        .find({ eventId: event._id.toString() })
        .toArray();

      for (let attendee of attendees) {
        const user = await db
          .collection('Users')
          .findOne({ _id: ObjectId(attendee.userId) });
        if (user) {
          await transporter.sendMail({
            from: 'your_email@gmail.com',
            to: user.email,
            subject: `Reminder: Upcoming Event "${event.title}"`,
            text: `This is a reminder that the event "${event.title}" is happening soon.\nDate: ${event.date}\nDescription: ${event.description}`,
          });
        }
      }
    }
    res.status(200).json({ message: 'Reminders sent for upcoming events' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
