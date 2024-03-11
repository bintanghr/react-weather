import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASEURL

export const getWeatherInfo = async() => {
  const info = await axios.get(`https://weather-api-tau-six.vercel.app/weather/JawaTengah`)
  console.log(info.data.data.forecast.area)
  return info.data.data.forecast.area
}

export const getTemperatureInfo = async() => {
  const info = await axios.get(`https://weather-api-tau-six.vercel.app/weather/JawaTengah`)
  console.log(info.data.data.forecast.area)
  return info.data.data.forecast.area
}
