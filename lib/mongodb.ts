import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

export async function connectToDatabase() {
  if (global.mongoose?.conn) {
    return global.mongoose.conn
  }

  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null }
  }

  if (!global.mongoose.promise) {
    const promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose.connection)
    global.mongoose.promise = promise
  }

  try {
    global.mongoose.conn = await global.mongoose.promise
    return global.mongoose.conn
  } catch (error) {
    global.mongoose.promise = null
    throw error
  }
}
