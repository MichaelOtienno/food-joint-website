window.addEventListener('DOMContentLoaded', () => {
    fetch('/eventsad')
      .then(response => response.json())
      .then(events => {
        const eventList = document.querySelector('.event-list');

        events.forEach(event => {
          const eventCard = document.createElement('div');
          eventCard.classList.add('event-card');

          const eventName = document.createElement('h2');
          eventName.textContent = event.name;

          const eventDate = document.createElement('p');
          eventDate.classList.add('event-date');
          eventDate.textContent = `Date: ${event.event_date}`;

          const eventAddress = document.createElement('p');
          eventAddress.classList.add('event-address');

          // Truncate the address if it's longer than six letters
          const truncatedAddress = event.address.length > 10 ? event.address.slice(0, 10) + '...' : event.address;
          eventAddress.textContent = truncatedAddress;

          const eventOrganizer = document.createElement('p');
          eventOrganizer.textContent = `Organizer: ${event.organizer}`;

          const eventFooter = document.createElement('div');
          eventFooter.classList.add('event-footer');

          const eventActions = document.createElement('div');
          eventActions.classList.add('event-actions');

          const viewDetailsLink = document.createElement('a');
          viewDetailsLink.href = `/vev?id=${event.id}`;
          viewDetailsLink.textContent = 'View Details';

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';

          

          deleteButton.addEventListener('click', () => {
// Show confirmation dialog before deleting
const confirmDelete = confirm('Are you sure you want to delete this event?');
if (confirmDelete) {
  // Remove the event card from the DOM
  eventCard.remove();

  // Send delete request to the API endpoint
  fetch(`/devents/${event.id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(result => {
      // Handle the response or update the UI accordingly
      console.log(result);
    })
    .catch(error => {
      console.error('Failed to delete event:', error);
      // Handle the error and show appropriate message to the user
    });
}
});


          eventActions.appendChild(viewDetailsLink);
          eventActions.appendChild(deleteButton);

          eventFooter.appendChild(eventOrganizer);
          eventFooter.appendChild(eventActions);

          eventCard.appendChild(eventName);
          eventCard.appendChild(eventDate);
          eventCard.appendChild(eventAddress);
          eventCard.appendChild(eventFooter);

          eventList.appendChild(eventCard);
        });
      })
      .catch(error => {
        console.error('Failed to fetch events:', error);
      });
  });