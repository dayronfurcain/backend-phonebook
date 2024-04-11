const moongose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please introduce password as argument. If you want add a new register introduce name and number as arguments too',
  )
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.cfjg7oz.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

moongose.set('strictQuery', false)

moongose.connect(url)

const personSchema = new moongose.Schema({
  name: String,
  number: String,
})

const Person = moongose.model('Person', personSchema)

if (name && number) {
  const person = new Person({ name, number })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    moongose.connection.close()
  })
} else {
  Person.find({}).then((result) => {
    console.log('phonebook:')

    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })

    moongose.connection.close()
  })
}
