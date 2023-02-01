require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')


const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

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
    Person.find({}).then(personsdb => {
      res.send(`<div>Phonebook has info for ${personsdb.length} people</div><div>${new Date()}</div>`)
    })
  })

  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(personsdb => {
      res.json(personsdb)
    })
  })

  app.get('/api/persons/:id', (request, response) => { 
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

  app.delete('/api/persons/:id', (request, response) => { //not in database yet
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => { //doesn't take existing names into account yet
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })



  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })