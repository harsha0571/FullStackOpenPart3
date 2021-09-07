const express = require('express')
const cors = require('cors')
//var morgan = require('morgan')
const app = express()
app.use(express.static('build'))
app.use(express.json())
require('dotenv').config()
app.use(cors())
// morgan.token('body', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

const Persons = require('./models/person.model')

app.post('/api/persons', (req, res, next) => {

    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'number or name is missing' })
    }

    const person = new Persons({
        name: body.name,
        number: body.number

    })

    person.save()
        .then(newPerson => {
            console.log("user added sucessfully")
            res.status(200).json(newPerson)
        })
        .catch(error => {
            console.log("ths is acutal error: ", error.name)
            next(error)
        })
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

app.put('/api/persons/:id', (req, res, next) => {

    var query = { _id: req.params.id }
    Persons.findOneAndUpdate(query, req.body, { new: true, runValidators: true, context: 'query' }, function (err, doc) {
        if (err) { return next(err) }
        else if (doc === null) {
            return res.status(500).json("should have been error")
        }
        res.send("created succesfully")
    });
})

app.delete('/api/persons/:id', (request, response, next) => {

    Persons.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.log("already deleted")
            next(error)
        })

})
//must call errorhandler middleware after routes 
const errorHandler = (error, req, res, next) => {
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(403).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})