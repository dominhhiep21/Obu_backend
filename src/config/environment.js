import 'dotenv/config'

export const env = {
  MONGODB_URI : process.env.MONGODB_URI,
  DATABASE_NAME : process.env.DATABASE_NAME,
  LOCAL_DEV_APP_HOST : process.env.LOCAL_DEV_APP_HOST,
  LOCAL_DEV_APP_PORT : process.env.LOCAL_DEV_APP_PORT,
  BUILD_MODE : process.env.BUILD_MODE,
  MQTT_BROKER : process.env.MQTT_BROKER,
  MQTT_TOPIC : process.env.MQTT_TOPIC,
  JWT_ACCESS_KEY : process.env.JWT_ACCESS_KEY,
  JWT_REFRESH_KEY : process.env.JWT_REFRESH_KEY
}