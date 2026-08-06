const restCountriesAPIurl = "/api/countries?name=";
const getweatherAPIurl = "https://goweather.herokuapp.com/weather/";

const countryList = document.querySelector(".country-list");
const countryEl = document.querySelector(".country");
const weatherEl = document.querySelector(".weather");

let capital;
let receivedData = []; //array of data received from fetch

const loader = createLoader();

const displayValue = (value, fallback = "No data available") =>
  value ?? fallback;

const formatNumber = (value) =>
  typeof value === "number" ? value.toLocaleString() : "No data available";

const formatCurrencies = (currencies = []) => {
  if (!currencies.length) {
    return "No data available";
  }

  return currencies
    .map(({ name, symbol, code }) => {
      const details = [symbol, code].filter(Boolean).join("/");

      return details ? `${name} (${details})` : name;
    })
    .join(", ");
};

const formatLanguages = (languages = []) => {
  if (!languages.length) {
    return "No data available";
  }

  return languages
    .map((language) => language.name)
    .filter(Boolean)
    .join(", ");
};

const getCountryId = (country) =>
  country.codes?.ccn3 ??
  country.codes?.alpha_3 ??
  country.codes?.alpha_2 ??
  country.uuid;

const extractCountries = (responseData) => {
  if (!Array.isArray(responseData)) {
    return responseData;
  }

  return responseData?.data?.objects ?? [];
};

const renderCountry = (country) => {
  capital = country.capitals?.[0]?.name;
  //render here
  countryEl.querySelector(".country-name h2").textContent = displayValue(
    country.names?.official,
  );

  const flag = countryEl.querySelector(".country-name img");
  flag.src = country.flag?.url_png ?? "";
  flag.alt =
    country.flag?.description ??
    `${displayValue(country.names?.common, "Country")} flag`;

  countryEl.querySelector(".country-area p").innerHTML =
    typeof country.area?.kilometres === "number"
      ? `${formatNumber(country.area?.kilometres)} km<sup>2</sup>`
      : "No data available";

  countryEl.querySelector(".country-population p").textContent = formatNumber(
    country.population,
  );

  countryEl.querySelector(".country-capital p").textContent =
    displayValue(capital);

  countryEl.querySelector(".country-currency p").textContent = formatCurrencies(
    country.currencies,
  );

  countryEl.querySelector(".country-languages p").textContent = formatLanguages(
    country.languages,
  );

  countryEl.querySelector(".country-borders p").textContent = country.borders
    ?.length
    ? country.borders.join(", ")
    : "No land borders";

  countryEl.querySelector(".country-continents p").textContent = country
    .continents?.length
    ? country.continents.join(", ")
    : "No data available";

  countryEl.querySelector(".country-region p").textContent = displayValue(
    country.region,
  );

  countryEl.querySelector(".country-landlocked p").textContent =
    country.landlocked ? "Yes" : "No";

  countryEl.querySelector(".country-unmember p").textContent = country
    .memberships?.un
    ? "Yes"
    : "No";

  const googleMapsLink = countryEl.querySelector("a.google-maps");
  googleMapsLink.href = country.links?.google_maps ?? "#";

  const openStreetMapsLink = countryEl.querySelector("a.open-street");
  openStreetMapsLink.href = country.links?.open_street_maps ?? "#";

  if (capital) {
    getWeather(capital);
  } else {
    weatherEl.textContent = "Weather unavailable because no capital is listed";
  }
};

const getCountry = async (searchCountry) => {
  searchDataSection.append(loader);

  const url = restCountriesAPIurl + encodeURIComponent(searchCountry.trim());

  const responseData = await fetchData(url);

  loader.remove();

  if (responseData?.message) {
    renderInvalidMessage(responseData.message);
    return;
  }

  const countries = extractCountries(responseData);

  if (countries.length === 0) {
    const message = createElWithClass("p", "not-found");
    message.textContent = "Sorry, we could not find this country";
    searchDataSection.append(message);
    return;
  }

  receivedData = countries;

  countries.forEach((country) => {
    const listItem = createLi(
      "country-item",
      displayValue(country.names?.official),
      getCountryId(country),
    );

    countryList.append(listItem);
  });
};

const renderWeather = (city, data) => {
  weatherEl.innerHTML = "";

  const description = document.createElement("p");
  const conditions = document.createElement("p");

  description.textContent = data.description
    ? `It is a ${data.description.toLowerCase()} day in ${city}.`
    : `Weather information for ${city}.`;

  conditions.textContent =
    `The temperature is ${displayValue(data.temperature)}, ` +
    `wind speed is ${displayValue(data.wind)}.`;

  weatherEl.append(description, conditions);
};

const getWeather = async (city) => {
  const data = await fetchData(getweatherAPIurl + encodeURIComponent(city));

  if (data?.message) {
    //catch block
    weatherEl.textContent = `${data.message} weather`;
    return;
  }

  if ((Array.isArray(data) && data.length === 0) || !data?.temperature) {
    weatherEl.textContent = "No data available";
    return;
  }

  renderWeather(city, data);
};

const chooseCountryHandler = (event) => {
  const listItem = event.target.closest("li");

  if (!listItem) {
    return;
  }

  renderCountry(country);
  countryList.innerHTML = "";
  inputSearch.value = "";
};

getCountry("GB");

countryList.addEventListener("click", chooseCountryHandler);
