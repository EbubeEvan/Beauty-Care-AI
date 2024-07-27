import mongoose from 'mongoose'

const connection : {isconnected : number} = {isconnected : 0}

const dbConnect = async() => {
    if (connection.isconnected){
        return
    }

    const db = await mongoose.connect(process.env.MONGODB_URI!)

    connection.isconnected = db.connections[0].readyState
}

export default dbConnect