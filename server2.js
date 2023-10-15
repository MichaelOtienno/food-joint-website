//                                ****** manager(admin) server **********
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//                              ********** storage **********
const storage = multer.diskStorage({
  destination: 'publics/img/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname);
  }
});
const upload = multer({ storage: storage });

//                          ****** database connection ************
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'foodjoint',
  port: 8080
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to MySQL database!');
});
 
//                       *************** stattic files ************
// Serve static files from the "public" directory
app.use(express.static('publics'))


//                              ******* API ROUTES ***********

//     Route for the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

//                           *************** food ***********************
// Route for food.html (client view)
app.get('/food', (req, res) => {
  res.sendFile(path.join(__dirname, 'food.html'));
});

//    Route for food.html (client view)
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

// Route for food2.html (admin view)
app.get('/food2', (req, res) => {
  res.sendFile(path.join(__dirname, 'food2.html'));
});

// Route to handle the food form submission
app.post('/food2', upload.single('image'), (req, res) => {
  const { name, description, price, category } = req.body;
  const imageUrl = '/img/' + req.file.filename;

  let categoryId;
  switch (category) {
    case 'Chips Foonga':
      categoryId = 1;
      break;
    case 'Quickies':
      categoryId = 2;
      break;
    case 'Satisfy My Hunger':
      categoryId = 3;
      break;
    case "Swahili Kiss":
      categoryId = 4;
      break;
    case "Naughty Chef's Romance":
      categoryId = 5;
      break;
    case 'Squeeze Me in the Bread Sheets':
      categoryId = 6;
      break;
    case 'Seduce Me by the Sea':
      categoryId = 7;
      break;
    case 'Platters':
      categoryId = 10;
      break;
    case 'Offer':
        categoryId = 14;
        break;
    case 'Pizza':
          categoryId = 15;
          break;
    case 'New':
            categoryId = 16;
            break;
    default:
      categoryId = null;
  }

  if (categoryId === null) {
    console.error('Invalid category:', category);
    res.status(500).send('Invalid category');
    return;
  }

  const foodItem = {
    name: name,
    description: description,
    price: price,
    category_id: categoryId,
    image_url: imageUrl
  };

  connection.query('INSERT INTO food_items SET ?', foodItem, (error, result) => {
    if (error) {
      console.error('Error adding food item:', error);
      res.status(500).send('Error adding food item');
    } else {
      console.log('Drink item added successfully!');
      res.redirect('/food');
    }
  });
});

//Route to food edit page
app.get ('/fedit', (req,res) => {
  res.sendFile(path.join(__dirname, 'fedit.html'));
});

// Endpoint for handling the search request
app.post('/search', (req, res) => {
  const searchTerm = req.body.search;

  const query = 'SELECT * FROM food_items WHERE name = ?';
  connection.query(query, [searchTerm], (error, results) => {
    if (error) {
      console.error('Error searching for food:', error);
      res.status(500).send('An error occurred while searching for the food.');
    } else {
      if (results.length > 0) {
        // Food item found
        const food = results[0];
        // Send the food details as a response
        res.json(food);
      } else {
        // Food item not found
        res.status(404).send('Food not found.');
      }
    }
  });
});

app.post('/updateFood', upload.single('image'), (req, res) => {
  const { name, description, price, category } = req.body;
  let imageUrl;

  if (req.file) {
    imageUrl = '/img/' + req.file.filename;
  }

  // Retrieve the food item ID from the request
  const foodId = req.body.foodId;

  let categoryId;
  switch (category) {
    case 'Chips Foonga':
      categoryId = 1;
      break;
    case 'Quickies':
      categoryId = 2;
      break;
    case 'Satisfy My Hunger':
      categoryId = 3;
      break;
    case "Swahili Kiss":
      categoryId = 4;
      break;
    case "Naughty Chef's Romance":
      categoryId = 5;
      break;
    case 'Squeeze Me in the Bread Sheets':
      categoryId = 6;
      break;
    case 'Seduce Me by the Sea':
      categoryId = 7;
      break;
    case 'Platters':
      categoryId = 10;
      break;
    case 'Offer':
      categoryId = 14;
      break;
    case 'Pizza':
      categoryId = 15;
      break;
    case 'New':
      categoryId = 16;
      break;
    default:
      categoryId = null;
  }

  if (categoryId === null) {
    console.error('Invalid category:', category);
    res.status(500).send('Invalid category');
    return;
  }

  // First, retrieve the current image URL from the database
  const getImageQuery = 'SELECT image_url FROM food_items WHERE id = ?';
  connection.query(getImageQuery, [foodId], (error, result) => {
    if (error) {
      console.error('Error retrieving current image URL:', error);
      res.status(500).send('Error updating food item');
      return;
    }

    const currentImageUrl = result[0].image_url;

    // Delete the old image file from the storage
    if (currentImageUrl && req.file) {
      const imagePath = path.join(__dirname, 'publics', currentImageUrl);
      fs.unlink(imagePath, (error) => {
        if (error) {
          console.error('Error deleting old image file:', error);
        }
      });
    }

    // Update the food item in the database using the retrieved ID and correct category ID
    const query = 'UPDATE food_items SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?';
    connection.query(query, [name, description, price, categoryId, imageUrl, foodId], (error, result) => {
      if (error) {
        console.error('Error updating food item:', error);
        res.status(500).send('Error updating food item');
      } else {
        console.log('Food item updated successfully!');
        res.redirect('/food'); // Redirect to the food listing page
      }
    });
  });
});

app.post('/deleteFood', (req, res) => {
  const foodId = req.body.foodId;

  // Retrieve the image URL of the food item first
  connection.query('SELECT image_url FROM food_items WHERE id = ?', [foodId], (error, results) => {
    if (error) {
      console.error('Error retrieving food item:', error);
      res.status(500).send('Error retrieving food item');
    } else {
      if (results.length > 0) {
        const imageUrl = results[0].image_url;
        // Delete the food item entry from the database
        connection.query('DELETE FROM food_items WHERE id = ?', [foodId], (error, result) => {
          if (error) {
            console.error('Error deleting food item:', error);
            res.status(500).send('Error deleting food item');
          } else {
            console.log('Food item deleted successfully!');
            // Delete the image file from the storage
            const imagePath = path.join(__dirname, 'publics', imageUrl);
            fs.unlink(imagePath, (error) => {
              if (error) {
                console.error('Error deleting image file:', error);
                res.status(500).send('Error deleting image file');
              } else {
                console.log('Image file deleted successfully!');
                res.sendStatus(200);
              }
            });
          }
        });
      } else {
        console.log('Food item not found.');
        res.status(404).send('Food item not found.');
      }
    }
  });
});



//                             ************ drinks *********************

//Route for drinks.html (client view)
app.get ('/drinks', (req, res) => {
  res.sendFile(path.join(__dirname, 'drinks.html'));
});

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

//Route for drink2.html (admin view)
app.get('/drink2', (req,res) => {
  res.sendFile(path.join(__dirname,  'drink2.html'));
});

// Route to drink edit page (admin view)
app.get('/dredit', (req, res) => {
  res.sendFile(path.join(__dirname, 'dredit.html'));
});

// Endpoint for handling the search request for drinks (admin)
app.post('/searchDrink', (req, res) => {
  const searchTerm = req.body.search;

  const query = 'SELECT * FROM drinks WHERE name = ?';
  connection.query(query, [searchTerm], (error, results) => {
    if (error) {
      console.error('Error searching for drink:', error);
      res.status(500).send('An error occurred while searching for the drink.');
    } else {
      if (results.length > 0) {
        // Drink item found
        const drink = results[0];
        // Send the drink details as a response
        res.json(drink);
      } else {
        // Drink item not found
        res.status(404).send('Drink not found.');
      }
    }
  });
});

app.post('/updateDrink', upload.single('image'), (req, res) => {
  const { name, description, price, category } = req.body;
  let imageUrl;
  if (req.file) {
    imageUrl = '/img/' + req.file.filename;
  }
  // Retrieve the drink item ID from the request
  const drinkId = req.body.drinkId;
  let categoryId;
  switch (category) {
    case 'Juice':
      categoryId = 1;
      break;
    case 'Smoothies':
      categoryId = 2;
      break;
    case 'Cocktail':
      categoryId = 3;
      break;
    case 'New':
      categoryId = 4;
      break;
    case 'Offer':
      categoryId = 5;
      break;
    default:
      categoryId = null;
  }

  if (categoryId === null) {
    console.error('Invalid category:', category);
    res.status(500).send('Invalid category');
    return;
  }

  // Update the drink item in the database using the retrieved ID and correct category ID
  const query = 'UPDATE drinks SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?';
  connection.query(query, [name, description, price, categoryId, imageUrl, drinkId], (error, result) => {
    if (error) {
      console.error('Error updating drink item:', error);
      res.status(500).send('Error updating drink item');
    } else {
      console.log('Drink item updated successfully!');
      res.redirect('/drinks'); // Redirect to the drink listing page 
    }
  });
});

app.post('/deleteDrink', (req, res) => {
  const drinkId = req.body.drinkId;
  // Retrieve the image URL of the drink item first
  connection.query('SELECT image_url FROM drinks WHERE id = ?', [drinkId], (error, results) => {
    if (error) {
      console.error('Error retrieving drink item:', error);
      res.status(500).send('Error retrieving drink item');
    } else {
      if (results.length > 0) {
        const imageUrl = results[0].image_url;
        // Delete the drink item entry from the database
        connection.query('DELETE FROM drinks WHERE id = ?', [drinkId], (error, result) => {
          if (error) {
            console.error('Error deleting drink item:', error);
            res.status(500).send('Error deleting drink item');
          } else {
            console.log('Drink item deleted successfully!');
            // Delete the image file from the storage
            const imagePath = path.join(__dirname, 'publics', imageUrl);
            fs.unlink(imagePath, (error) => {
              if (error) {
                console.error('Error deleting image file:', error);
                res.status(500).send('Error deleting image file');
              } else {
                console.log('Image file deleted successfully!');
                res.sendStatus(200);
              }
            });
          }
        });
      } else {
        console.log('Drink item not found.');
        res.status(404).send('Drink item not found.');
      }
    }
  });
});




// Route to handle the drink form submission
app.post('/drink2', upload.single('image'), (req, res) => {
  const { name, description, price, category } = req.body;
  const imageUrl = '/img/' + req.file.filename;

  let categoryId;
  switch (category) {
    case 'Juice':
      categoryId = 1;
      break;
    case 'Smoothies':
      categoryId = 2;
      break;
    case "Cocktail":
      categoryId = 3;
      break;
    case 'New':
      categoryId = 4;
      break;
    case 'Offer':
      categoryId = 5;
      break;
    default:
      categoryId = null;
  }

  if (categoryId === null) {
    console.error('Invalid category:', category);
    res.status(500).send('Invalid category');
    return;
  }

  const drinkItem = {
    name: name,
    description: description,
    price: price,
    category_id: categoryId,
    image_url: imageUrl
  };

  connection.query('INSERT INTO drinks SET ?', drinkItem, (error, result) => {
    if (error) {
      console.error('Error adding food item:', error);
      res.status(500).send('Error adding food item');
    } else {
      console.log('Food item added successfully!');
      res.redirect('/drinks');
    }
  });
});

// ***********events************

//Route to admin events
app.get('/event2', (req, res) => {
  res.sendFile(path.join(__dirname, 'event2.html'));
});

// Endpoint to fetch events data
app.get('/eventsad', (req, res) => {
  // Retrieve events data from the database
  connection.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Failed to retrieve events data:', err);
      res.status(500).json({ error: 'Failed to retrieve events data' });
    } else {
      res.json(results);
    }
  });
});

//Route to event details
app.get('/vev', (req, res) => {
  res.sendFile(path.join(__dirname, 'vevents.html'));
});

app.get('/event-details', (req, res) => {
  const eventId = req.query.id;

  // Retrieve the event details from the database based on the eventId
  connection.query('SELECT * FROM events WHERE id = ?', [eventId], (error, results) => {
    if (error) {
      console.error('Error fetching event details:', error);
      res.status(500).send('Error fetching event details');
    } else {
      if (results.length > 0) {
        const event = results[0];
        // Send the event details as JSON
        res.json(event);
      } else {
        // Event not found
        res.status(404).send('Event not found.');
      }
    }
  });
});

// Endpoint to handle the delete request for events
app.delete('/devents/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  // Perform the deletion operation using the eventId
  connection.query('DELETE FROM events WHERE id = ?', [eventId], (error, result) => {
    if (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Error deleting event' });
    } else {
      console.log('Event deleted successfully!');
      res.sendStatus(200);
    }
  });
});

// Start the server
app.listen(8080, () => {
  console.log('Server started on port 3000');
});




