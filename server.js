const express = require('express');
const app = express();

const {quotes} = require('./data');
const {getRandomElement} = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

app.get('/api/quotes/random', (req, res, next) => {
    const randomQuote = getRandomElement(quotes);
    console.log(randomQuote);
    res.send({
        quote: randomQuote
    });
});

app.get('/api/quotes', (req, res, next) => {
    if (req.query.person) {
        res.send({
            quotes: quotes.filter(item => item.person === req.query.person)
        })
    } else if (req.query.person && !req.query.quote) {
        res.send({
            quotes: []
        });
    } 
    res.send({
        quotes: quotes
    });
});

const generateRandomID = () => Math.floor(Math.random() * 100 + 1)

app.post('/api/quotes', (req, res, next) => {
    const {quote, person} = req.query;
    if (quote && person) {
        const newQuote = {
            id: generateRandomID(),
            quote: quote,
            person: person
        }
        quotes.push(newQuote)
        res.status(201).send({
            quote: newQuote
        });
    } else {
        res.status(400).send();
    }
})

app.put('/api/quotes/:id', (req, res, next) => {
   const id = parseInt(req.params.id);
   const {quote, person} = req.query;

   const index = quotes.findIndex(i => i.id === id);

   if (index !== -1 && quote && person) {
      quotes[index] = {id, quote, person}
      res.status(200).send({quote: quotes[index]})
   } else {
    res.status(404).send('Quote not found or details missing')
   }
});

app.delete('/api/quotes/:id', (req, res, next) => {
    const id = parseInt(req.params.id)
    const index = quotes.findIndex(i => i.id === id);
    if (index !== -1) {
       quotes.splice(index, 1);
       res.status(204).send('Quote successfully deleted.')
    } else {
       res.status(404).send('Quote not found. Specify the correct ID')
    }
});

app.listen(PORT, () => {
    console.log("Listening to the port 4001...");
})