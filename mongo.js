






person.save().then(result => {
    console.log('person added!')
    mongoose.connection.close()
})

console.log("phonebook:")
Persons.find({}).then(result => {
    result.forEach(person => {
        console.log(person.name, person.number)
    })
    mongoose.connection.close()
})