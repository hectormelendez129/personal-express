const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const app = express()
require('dotenv').config();

const PORT = process.env.PORT || 3000
const connectionString = process.env.MONGO_URI
const dbName = process.env.DB_NAME

MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to MongoDB')
        const db = client.db(dbName)
        const quotesCollection = db.collection('quotes')

        // Middleware
        app.set('view engine', 'ejs')
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())
        app.use(express.static('public'))

        // GET all quotes
        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(err => console.error(err))
        })

        // POST new quote
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(() => {
                    res.redirect('/')
                })
                .catch(err => console.error(err))
        })

        // PUT (update) specific quote by ID
        app.put('/quotes/:id', (req, res) => {
            const id = req.params.id
            const { name, quote } = req.body

            quotesCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { name, quote } }
            )
                .then(result => {
                    if (result.modifiedCount > 0) {
                        res.json({ message: 'Quote updated successfully!' })
                    } else {
                        res.json({ message: 'No quote updated.' })
                    }
                })
                .catch(err => console.error(err))
        })

        // DELETE specific quote by ID
        app.delete('/quotes/:id', (req, res) => {
            const id = req.params.id
            quotesCollection.deleteOne({ _id: new ObjectId(id) })
                .then(result => {
                    if (result.deletedCount === 0) {
                        res.json({ message: 'No quote to delete.' })
                    } else {
                        res.json({ message: 'Quote deleted.' })
                    }
                })
                .catch(err => console.error(err))
        })

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    })
    .catch(error => console.error(error))
