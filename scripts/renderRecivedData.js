const restCountriesAPIurl = 'https://restcountries.com/v3.1/name/';
const getweatherAPIurl = 'https://goweather.herokuapp.com/weather/';

/**get elements */
const countryEl = document.querySelector('.country');


const strObjData=(currencies)=>{
    const data=[];
    //pound sterling (£/GBP)
    for(const currency in currencies){        
        data.push(`${currencies[currency].name} (${currencies[currency].symbol}/${currency})`)
    }
    return data.join(', ');
}




const countryList = document.querySelector('.country-list');
let capital; 
let receivedData; //array of data received from fetch

const renderCountry = (data) => {
  console.log(data);
  capital = data.capital[0];
  //render here
  countryEl.querySelector('.country-name h2').innerHTML=data.name.official;
  countryEl.querySelector('.country-name img').src=data.flags.png;
  countryEl.querySelector('.country-area p').innerHTML=data.area;
  countryEl.querySelector('.country-population p').innerHTML=data.population;
  countryEl.querySelector('.country-capital p').innerHTML = data.capital[0];
  countryEl.querySelector('.country-currency p').innerHTML = strObjData(data.currencies);

  getWeather(capital);
};

const getCountry = async (searchCountry) => {
  const data = await fetchData(restCountriesAPIurl + searchCountry);
  console.log(data);
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
const renderWeather = (city) => {};
const getWeather = async (city) => {
  const data = await fetchData(getweatherAPIurl + city);

  console.log(data);
};

const chooseCountryHandler = (ev) => {
  console.log(receivedData);
  const ccn3 = ev.target.closest('li').dataset.option;
  const country = receivedData.find((country) => country.ccn3 === ccn3);
  renderCountry(country);
  console.log(country);
  countryList.innerHTML='';
  inputSearch.value='';
};

getCountry('GB');

countryList.addEventListener('click', chooseCountryHandler);
