import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASEURL

export const getWeatherInfo = async() => {
  const info = await axios.get(`${baseUrl}`)
  // console.log(info.data.data.forecast.area)
  return info.data.data.forecast.area
}

export const fetchWeatherData = async () => {
  try {
    let urls = [
      `${baseUrl}`,
      `https://weather-api-tau-six.vercel.app/weather/DIYogyakarta`,
      `https://weather-api-tau-six.vercel.app/weather/JawaBarat`,
      `https://weather-api-tau-six.vercel.app/weather/JawaTimur`,
      `https://weather-api-tau-six.vercel.app/weather/DKIJakarta`,
      // Add more URLs as needed
    ];
    const allPromises = urls.map(url => fetch(url).then(response => response.json()));
    // console.log({ allPromis : allPromises })
    const results = await Promise.all(allPromises);
    let finalResults = []
    results.map((result) => {
      return finalResults = [...finalResults, result.data.forecast.area]
    })
    let flattedResults = finalResults.flat()
    console.log({flattedResults})
    // console.log(results[0].data.forecast.area); // Array of weather data for each province
    return flattedResults;
    // return results.data
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

export const getTemperatureInfo = async() => {
  const info = await axios.get(`https://weather-api-tau-six.vercel.app/weather/JawaTengah`)
  console.log(info.data.data.forecast.area)
  return info.data.data.forecast.area
}
