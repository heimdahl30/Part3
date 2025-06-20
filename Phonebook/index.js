require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

console.log(Person)

const app = express()
app.use(express.json())

const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req) => {
  if (req.method === "POST"){
  return JSON.stringify(req.body)
  }

  else {
    return ""
  }
}
)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const requestTime = new Date()
 return (
  response.send(`<div><p>Phonebook has info for ${persons.length} people.</p><p>${requestTime}</p></div>`)
 )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id 
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const body = request.body
  const person = new Person({
  name: `${body.name}`,
  number: `${body.number}`
})

person.save().then(result => {
  console.log("new person added to the database")
})
})
  

app.get("/", (request,response) => {
response.send("Hello World!")
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})