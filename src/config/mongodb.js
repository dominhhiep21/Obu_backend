import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

const MONGODB_URI = env.MONGODB_URI
const DATABASE_NAME = env.DATABASE_NAME

let databaseInstance = null

const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  databaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

export const GET_DB = () => {
  if (!databaseInstance) throw new Error('Must connect to database first')
  return databaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}