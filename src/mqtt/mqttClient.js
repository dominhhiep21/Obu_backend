import mqtt from 'mqtt'
import { gpsValidation } from '~/validations/gpsValidation.js'
import { gpsModel } from '~/models/gpsModel.js'
import { env } from '~/config/environment'
import { getStreetName } from '~/utils/getRouteName'
import { tollHistoryModel } from '~/models/tollHistoryModel'
import { getIO } from '~/utils/constants'

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
      let [device_id, lat, lng, alt] = message.toString().split(',').map((val, index) =>
        index === 0 ? val.trim() : parseFloat(val.trim())
      )

      let route_name = await getStreetName(lat, lng)
      //Data phải có cấu trúc message mqtt có cấu trúc device_id, lat, lon
      const data = { device_id, lat, lng, alt, route_name }
      const _io = getIO()

      if (Math.abs(data.lat) != 0 && Math.abs(data.lng) != 0 && Math.abs(data.alt) != 0) {
        await gpsValidation.createNew(data)
        await gpsModel.createNew(data)
        await tollHistoryModel.updateTollFee(device_id, lat, lng)
      }
      const msg = message.toString()

      if (_io) {
        _io.emit('location message', msg)
      }

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
