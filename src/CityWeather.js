export default function CityWeather(props) {
    const { main, name, sys, weather, icon } = props.cityWeather
    return (
        <li className="city">
            <h2 className="city-name" data-name={`${name},${sys.country}`}>
                <span>{name}</span>
                <sup>{sys.country}</sup>
            </h2>
            <div className="city-temp">{Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img className="city-icon" src={icon} alt={weather[0]["description"]} />
                <figcaption>{weather[0]["description"]}</figcaption>
            </figure>
        </li>
    )
}