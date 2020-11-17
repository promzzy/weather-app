import {useState} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import CityWeather from './CityWeather'
import './App.css';

function App() {

  const [input, setInput] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cityWeathers, setCityWeathers] = useState([])

  const apiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;

  function handleWeatherCheck(e) {
    e.preventDefault();
    setIsLoading(true)


    if (cityWeathers.length > 0) {
      let inputValue = input;
      const filteredArray = cityWeathers.filter((el) => {
        let content = "";
        //Abuja,NG
        if (input.includes(",")) {
          //Abuja,nnnnnnnn->invalid country code, so we keep only the first part of inputVal
          if (input.split(",")[1].length > 2) {
            inputValue = input.split(",")[0];
            content = el.name;
          } else {
            content = `${el.name},${el.sys.country}`;
          }
        } else {
          //Abuja
          content = el.name;
        }
        return content.toLowerCase() === inputValue.toLowerCase();
      });
  
      if (filteredArray.length > 0) {
        setMessage(`You already know the weather for ${inputValue} ...otherwise be more specific by providing the country code as well 😉`)
        setInput("")
        setIsLoading(false)
        return;
      }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=metric`;
    axios.get(url)
    .then((response) => {
      console.log(response)
      const { main, name, sys, weather } = response.data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;
      const cityWeather = {
        main,
        name,
        sys,
        weather,
        icon
      }
      setCityWeathers([...cityWeathers, cityWeather])
    })
    .catch((err) => {
      console.log(err)
      setMessage("Sorry, we can't find the city entered");
    });

    setMessage("");
    setInput("")
    setIsLoading(false)
  }
  return (
    <>
    <section className="top-banner">
      <div className="container">
        <h1 className="heading">Javascript Weather App</h1>
        <form onSubmit={handleWeatherCheck}>
          <input type="text" placeholder="Search for a city" 
            value={input} onChange={(e) => setInput(e.target.value)} autoFocus 
          />
          <button type="submit">SUBMIT</button>
          <span className="msg">{message}</span>
        </form>
      </div>
    </section>
    <section className="ajax-section">
      <div className="container">
        <ul className="cities">
        {
          (cityWeathers && cityWeathers.length > 0) && (
            cityWeathers.map(cityWeather => {
              return (
              <CityWeather cityWeather = {cityWeather} key={`${cityWeather.name} ${cityWeather.sys.country}`} />
            )
            })
          )
        }
        {
          isLoading && <FontAwesomeIcon icon={faSpinner} color="white" />
        }
        </ul>
      </div>
    </section>
    </>
  );
}

export default App;
