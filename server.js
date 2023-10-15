//client server
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios'); // Import the axios library for making HTTP requests
const { request } = require('http');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'foodjoint',
  port: 3306
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to MySQL database!');
});

// Serve static files from the "public" directory
app.use(express.static('publics'))

// API ROUTES
//                         ********** signup and sign in *********** 

// Route for the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// Endpoint to handle signup form submission
app.post('/signup', (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  const userData = {
    username,
    password,
    email,
    firstName,
    lastName
  };

  // Check if username already exists in the database
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error('Failed to retrieve user data:', err);
        res.sendFile(path.join(__dirname, 'signup.html')); // Redirect to signup page
      } else {
        if (results.length > 0) {
          console.log('Username already taken');
          res.send('Username is already taken. Please choose another username.');
        } else {
          // Save user data to the database
          connection.query('INSERT INTO users SET ?', userData, (err, results) => {
            if (err) {
              console.error('Failed to save user data:', err);
              res.sendFile(path.join(__dirname, 'signup.html')); // Redirect to signup page
            } else {
              console.log('User data saved successfully!');
              res.sendFile(path.join(__dirname, 'index.html')); // Redirect to index page (signin page)
            }
          });
        }
      }
    }
  );
});

// Endpoint to handle signin form submission
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  // Check username and password against the database
  connection.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error('Failed to retrieve user data:', err);
        res.sendFile(path.join(__dirname, 'index.html')); // Redirect to index page (signin page)
      } else {
        if (results.length > 0) {
          console.log('Signin successful!');
          res.sendFile(path.join(__dirname, 'home.html')); // Redirect to home page
        } else {
          console.log('Invalid username or password');
          res.sendFile(path.join(__dirname, 'index.html')); // Redirect to index page (signin page)
        }
      }
    }
  );
});
//                             *********home ***********
// Route for home page
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

//                             ******* food **********
// Route for the food page
app.get('/food', (req, res) => {
  res.sendFile(path.join(__dirname, 'food.html'));
});

// Route for food.html (client view)
app.get('/ret', (req, res) => {
  // Retrieve the food items from the database
connection.query('SELECT * FROM food_items', (error, results) => {
  if (error) {
    console.error('Error fetching food items:', error);
    res.status(500).send('Error fetching food items');
  } else {
    res.json(results); // Send the food items as JSON
  }
});
});

//                 ********** drinks ***********
//Route for drinks.html (client view)
app.get ('/drinks', (req, res) => {
  res.sendFile(path.join(__dirname, 'drinks.html'));
});
// Route for drink.html (client view)
app.get('/retd', (req,res) => {
  //Retrieve the drinks from the database
  connection.query('SELECT * FROM drinks', (error, results) => {
    if (error) {
      console.error('Error fetching drinks:', error);
      res.status(500).send('Error fetching drink items');
    } else {
      res.json(results); //send the food items as JSON
    }
  });
});

 //                      ************ Events ******************

//Route to event
app.get('/Event', (req, res) => {
  res.sendFile(path.join(__dirname, 'event.html'));
});

// Endpoint to handle event form submission
app.post('/event', (req, res) => {
  // Retrieve the event details from the form data
  const { name, description, event_date, start_time, event_days, end_time, contact, address, capacity, organizer } = req.body;

  

  // Check if the chosen date is a past date
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
  if (event_date < currentDate) {
    res.redirect('/event?error=Past dates are not allowed.'); // Redirect with an error message
    return;
  }

  // Check if the end time is before the start time
  if (end_time <= start_time) {
    res.redirect('/event?error=End time should be after the start time.'); // Redirect with an error message
    return;
  }

  // Check if the chosen date already exists in the database
  connection.query(
    'SELECT * FROM events WHERE event_date = ?',
    [event_date],
    (err, results) => {
      if (err) {
        console.error('Failed to retrieve event data:', err);
        res.redirect('/event?error=An error occurred.'); // Redirect with an error message
      } else {
        if (results.length > 0) {
          console.log('Date already exists');
          res.redirect('/event?error=The chosen date already exists. Please choose another date.'); // Redirect with an error message
        } else {
          const eventData = {
            name,
            description,
            event_date,
            start_time,
            end_time,
            contact,
            address,
            capacity,
            organizer,
            event_days
          };

          // Save event data to the database
          connection.query('INSERT INTO events SET ?', eventData, (err, results) => {
            if (err) {
              console.error('Failed to save event data:', err);
              res.redirect('/event?error=An error occurred.'); // Redirect with an error message
            } else {
              console.log('Event data saved successfully!');
              const eventDetails = {
                name,
                description,
                event_date,
                start_time,
                end_time,
                contact,
                address,
                capacity,
                organizer
              };
              const queryParams = new URLSearchParams(eventDetails).toString();
              res.redirect(`/thank_you?${queryParams}`); // Redirect to thank_you page with event details as query parameters
            }
          });
        }
      }
    }
  );
});

//Route to thank you
app.get('/thank_you', (req,res) => {
  res.sendFile(path.join(__dirname, 'tevent.html'))
})

//Route to checkout
app.get('/check', (req, res) => {
  res.sendFile(path.join(__dirname, 'orders.html'));
 });


// ********** access token *************
app.get('/access_token', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    res.send('Access Token: ' + accessToken);
  } catch (error) {
    res.status(500).send('Error obtaining access token: ' + error.message);
  }
});

async function getAccessToken() {
  const consumerKey = "KpS9enJHHoWV939vtXQ1HYgmpu4xG2zf";
  const consumerSecret = "2Rdte8gTXudF9pek";
  const auth = Buffer.from(consumerKey + ':' + consumerSecret).toString('base64');

  const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const headers = {
    'Authorization': 'Basic ' + auth,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(url, { headers });
    const accessToken = response.data.access_token;
    console.log('Access Token:', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error obtaining access token:', error.message);
    throw error;
  }
}


// Start the server
app.listen(8080, () => {
  console.log('Server started');
});



