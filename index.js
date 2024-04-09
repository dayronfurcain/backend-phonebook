const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
)

app.use(cors())
app.use(express.json())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateId = () => {
  const id = Math.floor(Math.random() * persons.length) + 1
  if (persons.every((person) => person.id !== id)) {
    return id
  } else {
    return Math.max(...persons.map((person) => person.id)) + 1
  }
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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

  const isExitPerson = persons.some(
    (person) => person.name.toLowerCase() === body.name.toLowerCase(),
  )

  if (isExitPerson) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  console.log(persons)

  response.status(201).json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
