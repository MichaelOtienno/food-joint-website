   // Cart count variable
   let cartCount = 0;
   let cartItems = [];
   // Function to increment cart count
   function addToCart(event) {
 event.preventDefault();

 const foodItemContainer = event.target.closest('.food-item');
 const foodName = foodItemContainer.querySelector('.food-name').textContent;
 const foodPrice = parseFloat(foodItemContainer.querySelector('.food-price').textContent.replace('Ksh ', ''));

 // Check if the item already exists in the cart
 const existingItem = cartItems.find(item => item.name === foodName);
 if (existingItem) {
   // Increment the quantity of the existing item
   existingItem.quantity++;
 } else {
   // Add the item to the cartItems array with initial quantity as 1
   cartItems.push({ name: foodName, price: foodPrice, quantity: 1 });
 }

 cartCount++;
 document.querySelector('.cart-items').textContent = cartCount;
}

   fetch('/ret')
 .then(response => response.json())
 .then(data => {
   console.log('Data:', data);

   // Create an array to store the category names and their corresponding IDs
   const categories = [
     { id: 1, name: 'Chips Foonga' },
     { id: 2, name: 'Quickies' },
     { id: 3, name: 'Satisfy My Hunger' },
     { id: 4, name: 'Swahili Kiss' },
     { id: 5, name: "Naughty Chef's Romance" },
     { id: 6, name: 'Squeeze Me in the Bread Sheets' },
     { id: 7, name: 'Seduce Me by the Sea' },
     { id: 10, name: 'Platters' },
     { id: 14, name: 'Offer' },
     { id: 15, name: 'Pizza' },
     { id: 16, name: 'New' }
   ];

   // Create an object to store the food items by category
   const foodItemsByCategory = {};

   // Group the food items by category
   data.forEach(foodItem => {
     const categoryId = foodItem.category_id;
     if (categoryId in foodItemsByCategory) {
       foodItemsByCategory[categoryId].push(foodItem);
     } else {
       foodItemsByCategory[categoryId] = [foodItem];
     }
   });

   // Sort the food categories so that "New" and "Offer" are displayed first
   const sortedCategories = categories.sort((a, b) => {
     if (a.id === 16 || a.id === 14) return -1;
     if (b.id === 16 || b.id === 14) return 1;
     return 0;
   });

   // Create the HTML elements for each category and its food items
   const foodSection = document.getElementById('foodSection');
   sortedCategories.forEach(category => {
     const categoryId = category.id;

     // Skip categories that have no food items
     if (!(categoryId in foodItemsByCategory)) {
       return;
     }

     const categoryContainer = document.createElement('div');
     categoryContainer.classList.add('category-container');

     const categoryTitle = document.createElement('h2');
     categoryTitle.textContent = category.name;
     categoryTitle.classList.add('category-title');
     categoryContainer.appendChild(categoryTitle);

     const foodItemsContainer = document.createElement('div');
     foodItemsContainer.classList.add('food-items-container');

     foodItemsByCategory[categoryId].forEach(foodItem => {
       const foodItemContainer = document.createElement('div');
       foodItemContainer.classList.add('food-item');

       const foodItemImage = document.createElement('img');
       foodItemImage.src = foodItem.image_url;
       foodItemImage.classList.add('food-image');
       foodItemContainer.appendChild(foodItemImage);

       const foodDetails = document.createElement('div');
       foodDetails.classList.add('food-details');

       const foodItemName = document.createElement('div');
       foodItemName.textContent = foodItem.name;
       foodItemName.classList.add('food-name');
       foodDetails.appendChild(foodItemName);

       const foodItemDescription = document.createElement('div');
       foodItemDescription.textContent = foodItem.description;
       foodItemDescription.classList.add('food-description');
       foodDetails.appendChild(foodItemDescription);

       const foodItemPrice = document.createElement('div');
       foodItemPrice.textContent = 'Ksh ' + foodItem.price;
       foodItemPrice.classList.add('food-price');
       foodDetails.appendChild(foodItemPrice);

       const buyButton = document.createElement('a');
       buyButton.href = '#';
       buyButton.textContent = 'Buy Now';
       buyButton.classList.add('buy-button');
       buyButton.addEventListener('click', addToCart);
       foodDetails.appendChild(buyButton);

       foodItemContainer.appendChild(foodDetails);
       foodItemsContainer.appendChild(foodItemContainer);
     });

     categoryContainer.appendChild(foodItemsContainer);
     foodSection.appendChild(categoryContainer);
   });
 })
 .catch(error => {
   console.error('Error fetching food items:', error);
   // Display an error message
   const errorMessage = document.createElement('p');
   errorMessage.textContent = 'Error fetching food items';
   document.body.appendChild(errorMessage);
 });


 function goToCheckout() {
 // Convert the cartItems array to a JSON string
 const cartItemsParam = encodeURIComponent(JSON.stringify(cartItems));

 // Navigate to the orders page with the cart items data in the URL
 window.location.href = `/check?cartItems=${cartItemsParam}`;
}
