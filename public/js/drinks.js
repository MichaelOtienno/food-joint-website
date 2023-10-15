// Cart count variable
let cartCount = 0;
let cartItems = [];

// Function to increment cart count
function addToCart(event) {
  event.preventDefault();

  const drinkItemContainer = event.target.closest('.drink-item');
  const drinkName = drinkItemContainer.querySelector('.drink-name').textContent;
  const drinkPrice = parseFloat(drinkItemContainer.querySelector('.drink-price').textContent.replace('Ksh ', ''));

  // Check if the item already exists in the cart
  const existingItem = cartItems.find(item => item.name === drinkName);
  if (existingItem) {
    // Increment the quantity of the existing item
    existingItem.quantity++;
  } else {
    // Add the item to the cartItems array with initial quantity as 1
    cartItems.push({ name: drinkName, price: drinkPrice, quantity: 1 });
  }

  cartCount++;
  document.querySelector('.cart-items').textContent = cartCount;
}

fetch('/retd')
  .then(response => response.json())
  .then(data => {
    console.log('Data:', data);

    // Create an array to store the category names and their corresponding IDs
    const categories = [
      { id: 1, name: 'Juice' },
      { id: 2, name: 'Smoothies' },
      { id: 3, name: 'Cocktail' },
      { id: 4, name: 'New' },
      { id: 5, name: 'Offer' }
    ];

    // Create an object to store the drink items by category
    const drinkItemsByCategory = {};

    // Group the drink items by category
    data.forEach(drinkItem => {
      const categoryId = drinkItem.category_id;
      if (categoryId in drinkItemsByCategory) {
        drinkItemsByCategory[categoryId].push(drinkItem);
      } else {
        drinkItemsByCategory[categoryId] = [drinkItem];
      }
    });

    // Sort the drink categories so that "New" and "Offer" are displayed first
    const sortedCategories = categories.sort((a, b) => {
      if (a.id === 4 || a.id === 5) return -1;
      if (b.id === 4 || b.id === 5) return 1;
      return 0;
    });

    // Create the HTML elements for each category and its drink items
    const drinkSection = document.getElementById('drinkSection');
    sortedCategories.forEach(category => {
      const categoryId = category.id;

      // Skip categories that have no drink items
      if (!(categoryId in drinkItemsByCategory)) {
        return;
      }

      const categoryContainer = document.createElement('div');
      categoryContainer.classList.add('category-container');

      const categoryTitle = document.createElement('h2');
      categoryTitle.textContent = category.name;
      categoryTitle.classList.add('category-title');
      categoryContainer.appendChild(categoryTitle);

      const drinkItemsContainer = document.createElement('div');
      drinkItemsContainer.classList.add('drink-items-container');

      drinkItemsByCategory[categoryId].forEach(drinkItem => {
        const drinkItemContainer = document.createElement('div');
        drinkItemContainer.classList.add('drink-item');

        const drinkItemImage = document.createElement('img');
        drinkItemImage.src = drinkItem.image_url;
        drinkItemImage.classList.add('drink-image');
        drinkItemContainer.appendChild(drinkItemImage);

        const drinkDetails = document.createElement('div');
        drinkDetails.classList.add('drink-details');

        const drinkItemName = document.createElement('div');
        drinkItemName.textContent = drinkItem.name;
        drinkItemName.classList.add('drink-name');
        drinkDetails.appendChild(drinkItemName);

        const drinkItemDescription = document.createElement('div');
        drinkItemDescription.textContent = drinkItem.description;
        drinkItemDescription.classList.add('drink-description');
        drinkDetails.appendChild(drinkItemDescription);

        const drinkItemPrice = document.createElement('div');
        drinkItemPrice.textContent = 'Ksh ' + drinkItem.price;
        drinkItemPrice.classList.add('drink-price');
        drinkDetails.appendChild(drinkItemPrice);

        const buyButton = document.createElement('a');
        buyButton.href = '#';
        buyButton.textContent = 'Buy Now';
        buyButton.classList.add('buy-button');
        buyButton.addEventListener('click', addToCart);
        drinkDetails.appendChild(buyButton);

        drinkItemContainer.appendChild(drinkDetails);
        drinkItemsContainer.appendChild(drinkItemContainer);
      });

      categoryContainer.appendChild(drinkItemsContainer);
      drinkSection.appendChild(categoryContainer);
    });
  })
  .catch(error => {
    console.error('Error fetching drink items:', error);
    // Display an error message
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Error fetching drink items';
    document.body.appendChild(errorMessage);
  });

function goToCheckout() {
  // Convert the cartItems array to a JSON string
  const cartItemsParam = encodeURIComponent(JSON.stringify(cartItems));

  // Navigate to the orders page with the cart items data in the URL
  window.location.href = `/check?cartItems=${cartItemsParam}`;
}






