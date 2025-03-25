import mqtt from 'mqtt'
import { gpsValidation } from '~/validations/gpsValidation.js'
import { gpsModel } from '~/models/gpsModel.js'
import { env } from '~/config/environment'
import { getStreetName } from '~/utils/getRouteName'

const MQTT_BROKER_URL = env.MQTT_BROKER
const TOPIC = env.MQTT_TOPIC

let client = null

const initMQTT = () => {
  if (client) {
    console.log('MQTT client already initialized')
    return client
  }

  client = mqtt.connect(MQTT_BROKER_URL)

  client.on('connect', () => {
    console.log('Connected to MQTT broker')
    client.subscribe(TOPIC, (err) => {
      if (err) {
        console.error('Subscribe failed:', err)
      } else {
        console.log(`Subscribed to topic: ${TOPIC}`)
      }
    })
  })

  client.on('message', async (topic, message) => {
    try {
      let [device_id, lat, lng] = message.toString().split(',').map((val, index) =>
        index === 0 ? val.trim() : parseFloat(val.trim())
      )

      let route_name = await getStreetName(lat, lng)
      //console.log(routeName)
      const data = { device_id, lat, lng, route_name }

      await gpsValidation.createNew(data)
      await gpsModel.createNew(data)

    } catch (error) {
      console.error('Error processing MQTT message:', error)
    }
  })

  client.on('error', (err) => {
    console.error('MQTT Error:', err)
  })

  return client
}

export const mqttClient = {
  initMQTT
}
