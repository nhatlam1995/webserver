require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const authRouter = require('./routes/auth.js')
const postRouter = require('./routes/post')

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://quanlilophoc:quanlilophoc@studentmanagement.rm1ko.mongodb.net/studentManagement?retryWrites=true&w=majority`)

        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()

const app = express()

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))