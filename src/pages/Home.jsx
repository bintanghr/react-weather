import { useEffect, useState } from "react";
import { fetchWeatherData } from "../api";

const weatherConditions = {
  0: "Cerah / Clear Skies",
  1: "Cerah Berawan / Partly Cloudy",
  2: "Cerah Berawan / Partly Cloudy",
  3: "Berawan / Mostly Cloudy",
  4: "Berawan Tebal / Overcast",
  5: "Udara Kabur / Haze",
  10: "Asap / Smoke",
  45: "Kabut / Fog",
  60: "Hujan Ringan / Light Rain",
  61: "Hujan Sedang / Rain",
  63: "Hujan Lebat / Heavy Rain",
  80: "Hujan Lokal / Isolated Shower",
  95: "Hujan Petir / Severe Thunderstorm",
  97: "Hujan Petir / Severe Thunderstorm"
};

const Home = () => {
  const [weatherInfo, setWeatherInfo] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedDay, setSelectedDay] = useState('today');
  const [currentArea, setCurrentArea] = useState('')

  useEffect(() => {
    // getWeatherInfo().then((result) => {
    fetchWeatherData().then((result) => {
      // console.log(result)
      setWeatherInfo(result);
      navigator.geolocation.getCurrentPosition(success, error);
    })

    // untuk clear up function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    searchRegion(currentArea);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentArea])

  async function getCityName(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      const cityName = data.address.county || data.address.city;
      // console.log("Nama Kabupaten/Kota: ", cityName);
      // console.log(cityName);
      setCurrentArea(cityName);
      // console.log(selectedArea[0]);
    } catch (error) {
      console.error("Terjadi kesalahan saat mendapatkan nama kabupaten/kota: ", error);
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Setelah mendapatkan latitude dan longitude, gunakan API Geocoding untuk mendapatkan nama kabupaten
    getCityName(latitude, longitude);
  }

  function error() {
    console.log("Tidak dapat mengakses lokasi Anda.");
  }

  const searchRegion = (region) => {
    // setSelectedArea(weatherInfo.filter(info => info.description.includes(region)));
    // console.log({weatherIngo : weatherInfo})
    region ? 
    setSelectedArea(searchByLetters(weatherInfo, region)) : 
    setSelectedArea(searchByLetters(weatherInfo, currentArea));
  }

  function searchByLetters(array, query) {
    // Membuat RegExp, 'i' berarti case-insensitive
    const regex = new RegExp(query.split('').join('.*'), 'i');
    // console.log({query : query})
    // console.log({array : array})
  
    // Filter array berdasarkan regex
    return array?.filter(word => regex.test(word.description));
  }

  const DayOptions = () => {
    return (
      <div className="day-options-wrap">
        <div className="chance-of-rain">
          <h3>Chance of Rain</h3>
        </div>
        <div className="day-options">
          <button className={selectedDay === 'today' ? 'select-button selected-day' : 'select-button'} onClick={() => setSelectedDay('today')}>Today</button>
          <button className={selectedDay === 'tomorrow' ? 'select-button selected-day' : 'select-button'} onClick={() => setSelectedDay('tomorrow')}>Tomorroow</button>
          <button className={selectedDay === 'besoknya' ? 'select-button selected-day' : 'select-button'} onClick={() => setSelectedDay('besoknya')}>H + 2</button>
        </div>
      </div>
    )
  }

  const WeatherLists = () => {
    return selectedArea?.map((weather, i) => (
      weather.parameter && (
        <div className="weather-lists" key={i}>
          <div className="name">{weather.name[0]}</div>
          <div className="name">{weather.name[1]}</div>
          <ConditionList parameters={weather.parameter} key={i} />
          {/* {console.log(weather.parameter)} */}
        </div>
      )
    ))
  }
  
  const ConditionList = ({ parameters }) => {
    return parameters?.map((parameter, i) => {
      return (
        <div className="condition-list" key={i}>
          { 
            parameter.description === 'Weather' && 
            <ConditionDetails timeranges={parameter.timerange} key={i} />
          }
        </div>
      )
    })
  }

  const ConditionDetails = ({ timeranges }) => {
    const [selectedRange, setSelectedRange] = useState([])

    useEffect(() => {
      if (selectedDay === 'today') {
        setSelectedRange(timeranges?.slice(0,4));
      } else if (selectedDay === 'tomorrow') {
        setSelectedRange(timeranges?.slice(4,8));
      } else if (selectedDay === 'besoknya') {
        setSelectedRange(timeranges?.slice(8, 12));
      }
    }, [timeranges]);

    function dateTimeConverter(dateString) {
      const year = parseInt(dateString.substring(0, 4), 10);
      const month = parseInt(dateString.substring(4, 6), 10) - 1; // Bulan dimulai dari 0
      const day = parseInt(dateString.substring(6, 8), 10);
      const hours = parseInt(dateString.substring(8, 10), 10);
      const minutes = parseInt(dateString.substring(10, 12), 10);

      const date = new Date(Date.UTC(year, month, day, hours, minutes));
      const isoString = date.toISOString();
      // return isoString.substring(0, 10) + '\n' + isoString.substring(11, 16); // Menggabungkan tanggal dan waktu tanpa T
      return isoString.substring(11, 16); // Menggabungkan tanggal dan waktu tanpa T
    }

    return selectedRange?.map((timerange, i) => {
      return (
        <div className="condition-details" key={i}>
          <img className="weather-icon" src={"../images/" + timerange.value[0]['text'] + ".png"} alt="icon cuaca" />
          <div className="details-wrapper">
            <div className="time">{dateTimeConverter(timerange.datetime)}</div>
            <div className="weather">{weatherConditions[timerange.value[0]['text']]}</div>
          </div>
          {/* <img src={"../../public/images/" + timerange.value[0]['text'] + ".png".toString()} alt="icon cuaca" ></img> */}
        </div>
      )
    })
  }

  return (
    <>
      <div className="content">
        <div className="weather-list-wrap">
          <SearchArea searchRegion={searchRegion} />
          <DayOptions />
          <WeatherLists />
        </div>
        <OtherInfo weatherList={selectedArea[0]} />
      </div>
    </>
  )
}

const OtherInfo = ({ weatherList }) => {
  // Fungsi untuk menemukan rentang waktu saat ini
  const now = new Date();
  function findCurrentRange() {
    // Mendapatkan objek tanggal saat ini
    // Mendapatkan jam saat ini dari objek tanggal
    const currentHour = now.getHours();
    // Mendefinisikan rentang jam dalam format 24 jam

    const ranges = [
      { id: 0, start: 0, end: 6, label: "00.00" }, // Rentang jam 00:00 - 05:59
      { id: 1, start: 6, end: 12, label: "06.00" }, // Rentang jam 06:00 - 11:59
      { id: 2, start: 12, end: 18, label: "12.00" }, // Rentang jam 12:00 - 17:59
      { id: 3, start: 18, end: 24, label: "18.00" }, // Rentang jam 18:00 - 23:59
    ];

    // Mencari rentang waktu yang sesuai dengan jam saat ini
    const currentRange = ranges.find(range => 
      currentHour >= range.start && currentHour < range.end);
    // Mengembalikan label rentang waktu jika ditemukan, atau 'Tidak ditemukan' jika tidak ada yang cocok
    // return currentRange ? currentRange.label : "Tidak ditemukan";
    return currentRange ? currentRange.id : "Tidak ditemukan";
    // Contoh penggunaan
    // console.log(`Rentang waktu saat ini adalah pada jam: ${currentRange.label}`);
  }
  // console.log(`Rentang waktu saat ini adalah pada jam: ${findCurrentRange()}`);

  return (
    <>
      <div className="other-info">
        <OtherInfoTitle weatherList={weatherList} onFindCurrentRange={findCurrentRange} now={now} />
        <Overview weatherList={weatherList} onFindCurrentRange={findCurrentRange} />
      </div>
    </>
  )
}

const OtherInfoTitle = ({ weatherList, onFindCurrentRange, now }) => {
  return (
    <>
    <div className="other-info-title">
      <div className="location-title">
        <h3>{weatherList?.description}</h3>
        <p>{weatherList?.domain}, Indonesia</p>
      </div>
      <p>{now.getHours()}:{now.getMinutes()}</p>
    </div>
    <hr></hr>
    <div className="current-weather">
      <img src={"../images/" + weatherList?.parameter[6]?.timerange[onFindCurrentRange()]?.value[0]['text'] + ".png"} alt="current-weather" className="current-weather-image"></img>
      <p>{weatherConditions[weatherList?.parameter[6]?.timerange[onFindCurrentRange()]?.value[0]['text']]}</p>
      {/* {console.log(weatherConditions[weatherList?.parameter[6].timerange[findCurrentRange()].value[0]['text']])} */}
    </div>
    </>
  )
}

const Overview = ({ weatherList, onFindCurrentRange }) => {
  return (
    <div className="overview">
      <p>Overview</p>
      {
        weatherList?.parameter?.map((overview, i) => (
          overview.timerange[0]['type'] === 'hourly' &&
          overview.description !== 'Weather' && (
            <div className="overview-list" key={i}>
              <p className="overview-list-title">{overview.description}</p>
              <p>{overview?.timerange[onFindCurrentRange()]?.value[0]['text']} {overview?.timerange[onFindCurrentRange()]?.value[0]['unit']}</p>
            </div>
          )
        ))
      }
      <div className="overview-list">
        <p className="overview-list-title">{weatherList?.parameter[2]?.description}</p>
        <p>{weatherList?.parameter[2]?.timerange[0]?.value[0]['text']} {weatherList?.parameter[2]?.timerange[0]?.value[0]['unit']}</p>
      </div>
      <div className="overview-list">
        <p className="overview-list-title">{weatherList?.parameter[4]?.description}</p>
        <p>{weatherList?.parameter[4]?.timerange[0]?.value[0]['text']} {weatherList?.parameter[2]?.timerange[0]?.value[0]['unit']}</p>
      </div>
    </div>
  )
}

const SearchArea = ({searchRegion}) => {
  const [searchedRegion, setSearchedRegion] = useState('');
  const now = new Date();

  const day = ['Sunday', 'Moday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember'];

  // const [debouncedSearchedArea, setdebouncedSearchedArea] = useState('');

  useEffect(() => {
    // Menetapkan timeout untuk debouncing
    const handler = setTimeout(() => {
      searchRegion(searchedRegion); // Memperbarui state debouncedSearchedArea dengan nilai terbaru dari searchedRegion
    }, 500); // Delay 500 ms
  
    // Fungsi bersihkan untuk membatalkan timeout jika input berubah
    return () => {
      clearTimeout(handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedRegion]); // Tambahkan searchedRegion sebagai dependensi
  

  return (
    <>
    <div className="search-area">
      <div className="title-search">
        <h2>{day[now.getDay()]}</h2>
        <p>{month[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</p>
        <br/>
      </div>
      <input
        // key="search-input"
        className="input-area"
        placeholder="Search location here" 
        value={searchedRegion} 
        onChange={(e) => setSearchedRegion(e.target.value)}
        id="search-location"
        ></input>
    </div>
    <hr className="horizontal-rule"></hr>
    </>
  )
}



export default Home;