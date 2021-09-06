const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://harsha571:${password}@cluster0.6zkop.mongodb.net/fsoPhoneBook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Persons = mongoose.model('Persons', personSchema)

if (process.argv.length === 5) {
    const person = new Persons({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log('person added!')
        mongoose.connection.close()
    })
}
console.log("phonebook:")
Persons.find({}).then(result => {
    result.forEach(person => {
        console.log(person.name, person.number)
    })
    mongoose.connection.close()
})