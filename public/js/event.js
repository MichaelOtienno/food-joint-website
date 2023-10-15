const errorMessage = document.getElementById('error-message');
const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');

if (error) {
  errorMessage.textContent = error;
}

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  const startTimeInput = document.getElementById('start_time');
  const endTimeInput = document.getElementById('end_time');
  const eventDateInput = document.getElementById('event_date');
  const eventDaysInput = document.getElementById('event_days');
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;
  const eventDate = eventDateInput.value;
  const eventDays = parseInt(eventDaysInput.value);

  // Check if the end time is before or the same as the start time
  if (eventDays < 1 || (eventDays === 1 && endTime <= startTime)) {
    event.preventDefault();
    errorMessage.textContent = 'Invalid event duration. Please provide a valid number of event days or adjust the start/end time.';
  }
});