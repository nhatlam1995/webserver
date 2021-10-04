require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const authRouter = require('./routes/auth.js')
const postRouter = require('./routes/post')
const categoryRouter = require('./routes/category')
const foodRouter = require('./routes/food')
const favoriteRouter = require('./routes/favorites')
const orderRouter = require('./routes/order')

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
app.use('/api/foods', foodRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/favorites', favoriteRouter)
app.use('/api/orders', orderRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))