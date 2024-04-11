require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
)

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

let persons = []

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params

  Person.findById(id).then((person) => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  response
    .send(
      `<p>Phonebook has info for ${persons.length}</p>
      <p>${new Date()}</p>`,
    )
    .end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: 'name and number must be completed' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((person) => {
    response.status(201).json(person)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
