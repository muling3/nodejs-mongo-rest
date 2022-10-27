const mongoose = require('mongoose')

module.exports = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("Successfully connected to database")
    } catch (error) {
        console.log("Eroor Occurred: Check your connection string")
        process.exit(1)
    }
}
