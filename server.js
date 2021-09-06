const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()
app.use(express.static('build'))
app.use(express.json())
require('dotenv').config()
app.use(cors())
// morgan.token('body', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

const Persons = require('./models/person.model')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

app.post('/api/persons', (req, res) => {

    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'number or name is missing' })
    }

    const person = new Persons({
        name: body.name,
        number: body.number

    })

    person.save().then(newPerson => {
        res.json(newPerson)
    })
        .catch(err => console.log(err))
})

app.get('/api/persons', (req, res) => {

    Persons.find({})
        .then(result => { res.json(result) })
        .catch(err => console.log(err))
})

app.get('/info', (req, res) => {

    Persons.count({}, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(`<div> PhoneBook has ${result} entries 
            <br>
            as of ${Date()}</div>`)
        }
    });

})

app.get('/api/persons/:id', (req, res) => {
    Persons.findById(req.params.id).then(person => {
        res.json(person)
    })
        .catch(err => console.log(err))
})

app.put('/api/persons/:id', (req, res) => {
    console.log("req.body: ", req.body)
    console.log("req.params.id ", req.params.id)

    var query = { _id: req.params.id }
    Persons.findOneAndUpdate(query, req.body, { new: true }, function (err, doc) {
        if (err) { return res.status(500).json("error: ", err) }
        if (doc === null) {
            console.log("should have been error", doc)
            return res.status(500).json("should have been error")
        }
        res.send("created succesfully")
    });
    // Persons.findOne({ id: req.params.id }).then(doc => {
    //     doc["number"] = req.body.number;
    //     doc.save();
    //     res.json(req.body)
    // }).catch(err => {
    //     console.log('Oh! no', err)
    // });
})



app.delete('/api/persons/:id', (request, response, next) => {

    Persons.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => { next(error) })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})