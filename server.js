const express = require('express')
const app = express()
app.use(express.json())
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<div> PhoneBook has ${persons.length} entries 
    <br>
    as of ${Date()}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(400).json(`person with id=${id} doesn't exist`)
    }

})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    const name = person.name
    // const maxId = persons.length > 0
    //     ? Math.max(...persons.map(n => n.id))
    //     : 0
    const flag = (persons.some(p => p.name === name))
    if (person.name && person.number && !flag) {
        const maxId = Math.floor(Math.random() * 100000000)
        person.id = maxId + 1
        persons = persons.concat(person)
        res.json(person)
    }
    else if (flag) {
        res.json("name must be unique")
    }
    else {
        res.status(400).json("name and number must be provided")
    }


})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})