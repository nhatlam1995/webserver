require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const authRouter = require('./routes/auth.js')
const categoryRouter = require('./routes/category')
const foodRouter = require('./routes/food')
const favoriteRouter = require('./routes/favorites')
const orderRouter = require('./routes/order')
const forgotPassRouter = require('./routes/passwordReset')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_LINK)

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
app.use('/api/foods', foodRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/favorites', favoriteRouter)
app.use('/api/orders', orderRouter)
app.use('/api/forgotPass', forgotPassRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))