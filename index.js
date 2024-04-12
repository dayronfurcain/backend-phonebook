require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('data', function (request, response) {
  return JSON.stringify(request.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
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

  Person.findById(id)
    .then((person) => {
      response.json(person)
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person.length
  response
    .send(
      `<p>Phonebook has info for ${Person.length}</p>
      <p>${new Date()}</p>`
    )
    .end()
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then((person) => {
      response.status(201).json(person)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((person) => {
      response.json(person)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
