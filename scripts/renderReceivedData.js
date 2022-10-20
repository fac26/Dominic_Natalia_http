const restCountriesAPIurl = 'https://restcountries.com/v3.1/name/';
const getweatherAPIurl = 'https://goweather.herokuapp.com/weather/';
const countryList = document.querySelector('.country-list');
const countryEl = document.querySelector('.country');
const weatherEl = document.querySelector('.weather');
let capital;
let receivedData; //array of data received from fetch

const loader = createLoader();
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
  countryEl.querySelector('.country-borders p').innerHTML = data.borders
    ? data.borders.join(', ')
    : 'No data available';
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
  searchDataSection.append(loader);
  const data = await fetchData(restCountriesAPIurl + searchCountry);
  searchDataSection.removeChild(loader);
  if (data.length === 0) {
    const p = createElWithClass('p', 'not-found');
    p.innerHTML = 'Sorry, we could not find this country';
    searchDataSection.append(p);
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
  weatherEl.innerHTML = '';
  const pf = document.createElement('p');
  const ps = document.createElement('p');

  pf.innerHTML = `It is a ${data.description.toLowerCase()} day in ${city}.`;
  ps.innerHTML = `The temperature is ${data.temperature}, wind speed is ${data.wind}.`;
  weatherEl.append(pf, ps);
};

const getWeather = async (city) => {
  const data = await fetchData(getweatherAPIurl + city);
  if (data.message) {
    //catch block
    weatherEl.innerHTML = `${data.message} weather`;
  } else if (Array.isArray(data) && data.length === 0) {
    //404
    weatherEl.innerHTML = 'No data available';
  } else {
    renderWeather(capital, data);
  }
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
