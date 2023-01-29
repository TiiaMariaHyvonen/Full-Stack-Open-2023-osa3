const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
        name: 'Arto Hellas', 
        number: '040-123456',
        id: 1 
    },
    { 
        name: 'Ada Lovelace', 
        number: '39-44-5323523',
        id: 2 
    },
    {   
        name: 'Dan Abramov', 
        number: '12-43-234345',
        id: 3 
    },
    {   
        name: 'Mary Poppendieck', 
        number: '39-23-6423122',
        id: 4 
    }
]

  app.get('/info', (req, res) => {
    res.send(`<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`)
  })

  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
      response.status(404).end()
    } else {
      response.json(person)
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = Math.floor(Math.random() * 5000)
    return maxId + 1
  }

  app.post('/api/persons', (request, response) => {
    const person = request.body
    person.id = generateId()
    if (!person.name || !person.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    const existing_person = persons.find(p => p.name === person.name)
    if (existing_person) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    persons = persons.concat(person)
    response.json(person)
  })



  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })