const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://kellylinoc:${password}@cluster0.bm5r8wa.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person= mongoose.model('names', personSchema)

const person = new Person({
  name: process.argv[3],
  number:process.argv[4],
})


if(process.argv.length === 3) {
    console.log()
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
} else {
    person.save().then(result => {
        console.log(`Added ${process.argv[3]} ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
      })
}      
