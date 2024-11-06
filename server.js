const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const url = "mongodb+srv://alvinalexabraham:alvinalexabraham@clusterteam27.uhyq1.mongodb.net/COP4331Cards?retryWrites=true&w=majority&appName=ClusterTeam27";
const client = new MongoClient(url);

// Initial card and user lists
const cardList = [
  'Roy Campanella', 'Paul Molitor', 'Tony Gwynn', 'Dennis Eckersley', 'Reggie Jackson',
  'Gaylord Perry', 'Buck Leonard', 'Rollie Fingers', 'Charlie Gehringer', 'Wade Boggs',
  'Carl Hubbell', 'Dave Winfield', 'Jackie Robinson', 'Ken Griffey, Jr.', 'Al Simmons',
  'Chuck Klein', 'Mel Ott', 'Mark McGwire', 'Nolan Ryan', 'Ralph Kiner',
  'Yogi Berra', 'Goose Goslin', 'Greg Maddux', 'Frankie Frisch', 'Ernie Banks',
  'Ozzie Smith', 'Hank Greenberg', 'Kirby Puckett', 'Bob Feller', 'Dizzy Dean',
  'Joe Jackson', 'Sam Crawford', 'Barry Bonds', 'Duke Snider', 'George Sisler',
  'Ed Walsh', 'Tom Seaver', 'Willie Stargell', 'Bob Gibson', 'Brooks Robinson',
  'Steve Carlton', 'Joe Medwick', 'Nap Lajoie', 'Cal Ripken, Jr.', 'Mike Schmidt',
  'Eddie Murray', 'Tris Speaker', 'Al Kaline', 'Sandy Koufax', 'Willie Keeler',
  'Pete Rose', 'Robin Roberts', 'Eddie Collins', 'Lefty Gomez', 'Lefty Grove',
  'Carl Yastrzemski', 'Frank Robinson', 'Juan Marichal', 'Warren Spahn', 'Pie Traynor',
  'Roberto Clemente', 'Harmon Killebrew', 'Satchel Paige', 'Eddie Plank', 'Josh Gibson',
  'Oscar Charleston', 'Mickey Mantle', 'Cool Papa Bell', 'Johnny Bench', 'Mickey Cochrane',
  'Jimmie Foxx', 'Jim Palmer', 'Cy Young', 'Eddie Mathews', 'Honus Wagner',
  'Paul Waner', 'Grover Alexander', 'Rod Carew', 'Joe DiMaggio', 'Joe Morgan',
  'Stan Musial', 'Bill Terry', 'Rogers Hornsby', 'Lou Brock', 'Ted Williams',
  'Bill Dickey', 'Christy Mathewson', 'Willie McCovey', 'Lou Gehrig', 'George Brett',
  'Hank Aaron', 'Harry Heilmann', 'Walter Johnson', 'Roger Clemens', 'Ty Cobb',
  'Whitey Ford', 'Willie Mays', 'Rickey Henderson', 'Babe Ruth'
];

const userList = [
  { Login: "user1", Password: "password1", FirstName: "John", LastName: "Doe", UserId: 1 },
  { Login: "user2", Password: "password2", FirstName: "Jane", LastName: "Smith", UserId: 2 },
  { Login: "user3", Password: "password3", FirstName: "Jim", LastName: "Brown", UserId: 3 }
];

client.connect()
  .then(async () => {
    console.log('Connected to MongoDB');

    const db = client.db("COP4331Cards");

    // Insert cards if the Cards collection is empty
    const cardsCollection = db.collection("Cards");
    const cardCount = await cardsCollection.countDocuments();
    if (cardCount === 0) {
      const cardDocuments = cardList.map(card => ({ Card: card }));
      await cardsCollection.insertMany(cardDocuments);
      console.log('Inserted initial card list into MongoDB');
    } else {
      console.log('Card list already exists in MongoDB');
    }

    // Insert users if the Users collection is empty
    const usersCollection = db.collection("Users");
    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
      await usersCollection.insertMany(userList);
      console.log('Inserted initial user list into MongoDB');
    } else {
      console.log('User list already exists in MongoDB');
    }
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// API endpoint to add a card
app.post('/api/addcard', async (req, res) => {
  const { userId, card } = req.body;
  const newCard = { Card: card, UserId: userId };
  let error = '';

  try {
    const db = client.db("COP4331Cards");
    const result = await db.collection('Cards').insertOne(newCard);
    console.log('New card added:', result);
  } catch (e) {
    console.error('MongoDB Insert Error:', e);
    error = e.toString();
  }

  cardList.push(card);
  res.status(200).json({ error });
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  let error = '';
  let id = -1, fn = '', ln = '';

  try {
    const db = client.db("COP4331Cards");
    const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

    if (results.length > 0) {
      id = results[0].UserId;
      fn = results[0].FirstName;
      ln = results[0].LastName;
    }
  } catch (e) {
    console.error('MongoDB Query Error:', e);
    error = e.toString();
  }

  res.status(200).json({ id, firstName: fn, lastName: ln, error });
});

// API endpoint to search cards
app.post('/api/searchcards', async (req, res) => {
  const { userId, search } = req.body;
  const _search = search.trim();
  let error = '';
  let _ret = [];

  try {
    const db = client.db("COP4331Cards");
    const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*', $options: 'i' } }).toArray();
    _ret = results.map(result => result.Card);
  } catch (e) {
    console.error('MongoDB Search Error:', e);
    error = e.toString();
  }

  res.status(200).json({ results: _ret, error });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
