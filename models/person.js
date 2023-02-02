require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI


console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(p) {
        const nums = ['0','1','2','3','4','5','6','7','8','9']
        const p1 = Array.from([...p])
        const p2 = Array.from([...p])
        const i2 = String(p1.splice(2,1))
        const i3 = String(p2.splice(3,1))
        return ((String(i2) === '-' && p1.every(c => (nums.includes(c)))) || (String(i3) === '-' && p2.every(c => (nums.includes(c)))))
      },
      message: 'Phone number in wrong format. The format should be xx-xxxxx... or xxx-xxxx...'
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)