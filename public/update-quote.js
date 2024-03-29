const updateButton = document.getElementById('update-quote');
const updatedContainer = document.getElementById('updated-quote');
const quoteIdSelect = document.getElementById('quote-id');

const quoteId = quoteIdSelect.value;

// Populate the dropdown with quote IDs
populateQuoteIds();

function populateQuoteIds() {
  // Clear existing options
  quoteIdSelect.innerHTML = '';

  // Fetch the quotes from the server
  fetch('/api/quotes')
    .then(response => response.json())
    .then(data => {
      // Add new options for each quote ID
      data.quotes.forEach(quote => {
        const option = document.createElement('option');
        option.value = quote.id;
        option.textContent = quote.id;
        quoteIdSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching quotes:', error);
    });
}

updateButton.addEventListener('click', () => {
    const quote = document.getElementById('quote').value;
    const person = document.getElementById('person').value;
    const quoteId = document.getElementById('quote-id').value;

  fetch(`/api/quotes/${quoteId}?quote=${quote}&person=${person}`, {
    method: 'PUT',
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to update quote');
    }
  })
  .then(({quote}) => {
    const updatedQuote = document.createElement('div');
    updatedQuote.innerHTML = `
    <h3>Congrats, your quote was updated!</h3>
    <div class="quote-text">${quote.quote}</div>
    <div class="attribution">- ${quote.person}</div>
    <p>Go to the <a href="index.html">home page</a> to request and view all quotes.</p>
    `;
    updatedContainer.appendChild(updatedQuote);
  })
  .catch(error => {
    console.error('Error updating quote:', error);
  });
});

/* Deleting funcitonality */

const deleteButton = document.getElementById('delete-quote');

deleteButton.addEventListener('click', () => {
    const quoteId = document.getElementById('quote-id').value;

    fetch(`/api/quotes/${quoteId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
          if (response.status === 204) {
            const deletedQuote = document.createElement('div');
            deletedQuote.innerHTML = `
            <h3>Your quote under the ID ${quoteId} was deleted.</h3>
            <p>Go to the <a href="index.html">home page</a> to request and view all quotes.</p>
            `;
            updatedContainer.appendChild(deletedQuote);
          } else {
            throw new Error('Failed to update quote'); 
          }
        } else {
          throw new Error('Failed to update quote');
        }
    })
    .catch(error => {
        console.error('Error deleting quote:', error);
    });
})