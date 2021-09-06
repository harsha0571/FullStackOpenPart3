const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()
app.use(express.json())
require('dotenv').config()
app.use(cors())
// morgan.token('body', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(express.static('build'))
const Persons = require('./models/person.model')

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
})

app.get('/api/persons', (req, res) => {

    Persons.find({})
        .then(result => {
            res.json(result)
        })

})

// app.get('/info', (req, res) => {
//     res.send(`<div> PhoneBook has ${persons.length} entries 
//     <br>
//     as of ${Date()}</div>`)
// })

// app.get('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     const person = persons.find(person => person.id === id)
//     if (person) {
//         res.json(person)
//     }
//     else {
//         res.status(400).json(`person with id=${id} doesn't exist`)
//     }

// })

app.get('/api/persons/:id', (req, res) => {
    Persons.findById(req.params.id).then(person => {
        res.json(person)
    })
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

// app.post('/api/persons', (req, res) => {
//     const person = req.body
//     const name = person.name
//     // const maxId = persons.length > 0
//     //     ? Math.max(...persons.map(n => n.id))
//     //     : 0
//     const flag = (persons.some(p => p.name === name))
//     if (person.name && person.number && !flag) {
//         const maxId = Math.floor(Math.random() * 100000000)
//         person.id = maxId + 1
//         persons = persons.concat(person)
//         res.json(person)
//     }
//     else if (flag) {
//         res.json("name must be unique")
//     }
//     else {
//         res.status(400).json("error :name and number must be provided")
//     }


// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})