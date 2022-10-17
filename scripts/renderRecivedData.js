const restCountriesAPIurl = 'https://restcountries.com/v3.1/name/';
const getweatherAPIurl = 'https://goweather.herokuapp.com/weather/';
const countryList = document.querySelector('.country-list');
const countryEl = document.querySelector('.country');
const weatherEl = document.querySelector('.weather');
let capital;
let receivedData; //array of data received from fetch

const strCurrencyData = (currencies) => {
  const data = [];
  //pound sterling (£/GBP)
  for (const currency in currencies) {
    data.push(
      `${currencies[currency].name} (${currencies[currency].symbol}/${currency})`
    );
  }
  return data.join(', ');
};

const strLangsData = (langs) => {
  const data = [];
  //pound sterling (£/GBP)
  for (const lang in langs) {
    data.push(`${langs[lang]}`);
  }
  return data.join(', ');
};

const renderCountry = (data) => {
  capital = data.capital[0];
  //render here
  countryEl.querySelector('.country-name h2').innerHTML = data.name.official;
  countryEl.querySelector('.country-name img').src = data.flags.png;
  countryEl.querySelector('.country-area p').innerHTML = data.area;
  countryEl.querySelector('.country-population p').innerHTML = data.population;
  countryEl.querySelector('.country-capital p').innerHTML = data.capital[0];
  countryEl.querySelector('.country-currency p').innerHTML = strCurrencyData(
    data.currencies
  );
  countryEl.querySelector('.country-languages p').innerHTML = strLangsData(
    data.languages
  );
  countryEl.querySelector('.country-borders p').innerHTML =
    data.borders.join(', ');
  countryEl.querySelector('.country-continents p').innerHTML =
    data.continents.join(', ');
  countryEl.querySelector('.country-region p').innerHTML = data.region;
  countryEl.querySelector('.country-landlocked p').innerHTML = data.landlocked
    ? 'Yes'
    : 'No';
  countryEl.querySelector('.country-unmember p').innerHTML = data.unMember
    ? 'Yes'
    : 'No';
  countryEl.querySelector('a.google-maps').href = data.maps.googleMaps;
  countryEl.querySelector('a.open-street').href = data.maps.openStreetMaps;

  getWeather(capital);
};

const getCountry = async (searchCountry) => {
  const data = await fetchData(restCountriesAPIurl + searchCountry);
  if (data.length === 0) {
    const p = createElWithClass('p', 'not-found');
    p.innerHTML = 'Sorry, we could not find this country';
    document.querySelector('.search-data').append(p);
  } else if (data.length > 1) {
    //function ask user for country
    for (const country in data) {
      const li = createLi(
        'country-item',
        data[country].name.official,
        data[country].ccn3
      ); //data is array, country is index
      countryList.append(li);
    }
    receivedData = [...data];
  } else {
    renderCountry(data[0]);
  }
};
const renderWeather = (city, data) => {
  weatherEl.querySelector('.weather-description').innerHTML =
    data.description.toLowerCase();
  weatherEl.querySelector('.weather .capital').innerHTML = city;
  weatherEl.querySelector('.weather .weather-temperature').innerHTML =
    data.temperature;
  weatherEl.querySelector('.weather .weather-wind').innerHTML = data.wind;
};
const getWeather = async (city) => {
  const data = await fetchData(getweatherAPIurl + city);
  renderWeather(capital, data);
};

const chooseCountryHandler = (ev) => {
  const ccn3 = ev.target.closest('li').dataset.option;
  const country = receivedData.find((country) => country.ccn3 === ccn3);
  renderCountry(country);
  countryList.innerHTML = '';
  inputSearch.value = '';
};

getCountry('GB');

countryList.addEventListener('click', chooseCountryHandler);
