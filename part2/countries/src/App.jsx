import { useState } from "react";
import axios from "axios";

const Search = ({ searchTerm, handleSearchTermChange, handleSubmit }) => {
    return (
        <>
            <p>
                Find Countries: <input value={searchTerm} onChange={handleSearchTermChange} />
                <button onClick={handleSubmit}>Submit</button>
            </p>
        </>
    );
};

const SpecificCountry = ({ country }) => {
    console.log(country);
    return (
        <>
            <h2>{country.name.official}</h2>
            <ul className="no-bullets">
                <li>Capital {country.capital}</li>
                <li>Area {country.area}</li>
            </ul>
            <h3>Languages:</h3>
            <ul>
                {Object.keys(country.languages).map((key, index) => (
                    <li key={index}>{country.languages[key]}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt="flag" width="200" />
        </>
    );
};

const ListCountries = ({ countries }) => {
    return (
        <table>
            <tbody>
                {countries.map((country) => (
                    <tr>{country.name.official}</tr>
                ))}
            </tbody>
        </table>
    );
};

function App() {
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.get("https://restcountries.com/v3.1/name/" + searchTerm).then((response) => setCountries(response.data));
    };

    return (
        <div className="App">
            <Search
                searchTerm={searchTerm}
                handleSearchTermChange={handleSearchTermChange}
                handleSubmit={handleSubmit}
            />
            {countries.length > 10 ? (
                <p>Too many countries, please narrow search term.</p>
            ) : countries.length === 1 ? (
                <SpecificCountry country={countries[0]} />
            ) : (
                <ListCountries countries={countries} />
            )}
        </div>
    );
}

export default App;
