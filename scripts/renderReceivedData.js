const restCountriesAPIurl = "/api/countries?name=";
const getweatherAPIurl = "https://api.open-meteo.com/v1/forecast";

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
  if (Array.isArray(responseData)) {
    return responseData;
  }

  return responseData?.data?.objects ?? [];
};

const renderCountry = (country) => {
  capital = country.capitals?.[0]?.name;
  const capitalCoordinates = country.capitals?.[0]?.coordinates;

  countryEl.querySelector(".country-name h2").textContent = displayValue(
    country.names?.official,
  );

  const flag = countryEl.querySelector(".country-name img");
  flag.src = country.flag?.url_png ?? "";
  flag.alt =
    country.flag?.description ??
    `${displayValue(country.names?.common, "Country")} flag`;

  countryEl.querySelector(".country-area p").innerHTML =
    typeof country.area?.kilometers === "number"
      ? `${formatNumber(country.area?.kilometers)} km<sup>2</sup>`
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

  countryEl.querySelector(".country-subregion p").textContent = displayValue(
    country.subregion,
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

  if (capital && capitalCoordinates) {
    getWeather(capital, capitalCoordinates);
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

  if (countries.length === 1) {
    renderCountry(countries[0]);
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

const getWeatherDescription = (code) => {
  const descriptions = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "foggy",
    48: "foggy with frost",
    51: "light drizzle",
    53: "moderate drizzle",
    55: "dense drizzle",
    56: "light freezing drizzle",
    57: "dense freezing drizzle",
    61: "light rain",
    63: "moderate rain",
    65: "heavy rain",
    66: "light freezing rain",
    67: "heavy freezing rain",
    71: "light snow",
    73: "moderate snow",
    75: "heavy snow",
    77: "snow grains",
    80: "light rain showers",
    81: "moderate rain showers",
    82: "violent rain showers",
    85: "light snow showers",
    86: "heavy snow showers",
    95: "a thunderstorm",
    96: "a thunderstorm with light hail",
    99: "a thunderstorm with heavy hail",
  };

  return descriptions[code] ?? "unknown weather conditions";
};

const renderWeather = (city, data) => {
  weatherEl.innerHTML = "";

  const description = document.createElement("p");
  const conditions = document.createElement("p");

  const current = data.current;
  const units = data.current_units ?? {};

  const weatherDescription = getWeatherDescription(current.weather_code);

  description.textContent =
    `Current weather conditions in ${city} are ${weatherDescription} based on WMO code ` +
    `${current.weather_code}.`;

  conditions.textContent =
    `The temperature is ${current.temperature_2m}` +
    `${units.temperature_2m ?? "°C"}, and the wind speed is ` +
    `${current.wind_speed_10m}${units.wind_speed_10m ?? " km/h"}.`;

  weatherEl.append(description, conditions);
};

const getWeather = async (city, coordinates) => {
  const { lat, lng } = coordinates; // for weather API, we can use coordinates if available

  const url = new URL(getweatherAPIurl);
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lng);
  url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m");

  const data = await fetchData(url);

  if (data?.message) {
    weatherEl.textContent = data.message;
    return;
  }

  if (!data?.current) {
    weatherEl.textContent = "No weather data available";
    return;
  }

  renderWeather(city, data);
};

const chooseCountryHandler = (event) => {
  const listItem = event.target.closest("li");

  if (!listItem) {
    return;
  }

  const countryId = listItem.dataset.option;

  const country = receivedData.find(
    (item) => String(getCountryId(item)) === countryId,
  );

  if (!country) {
    return;
  }

  renderCountry(country);
  countryList.innerHTML = "";
  inputSearch.value = "";
};

getCountry("United Kingdom");

countryList.addEventListener("click", chooseCountryHandler);
