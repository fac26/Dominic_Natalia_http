const form = document.querySelector('#form-search-country');
const searchDataSection = document.querySelector('.search-data-section');
const inputSearch = document.querySelector('#search-country');

const renderInvalidMessage = (message) => {
  const p = document.createElement('p');
  p.classList.add('invalid-input');
  p.innerHTML = message;
  searchDataSection.append(p);
};

const searchFormHandler = (ev) => {
  ev.preventDefault();

  const formData = new FormData(form);
  const country = formData.get('search-country').trim();

  if (country.length > 1) {
    getCountry(country);
    inputSearch.value='';
  } else {
    renderInvalidMessage('Please enter at least 2 characters');
  }
};
const removeInvalidMessage = () => {
  const invalidMessageEl = document.querySelector('.invalid-input');
  const notFoundEl = document.querySelector('.not-found');
  if (invalidMessageEl) {
    searchDataSection.removeChild(invalidMessageEl);
  }
  if (notFoundEl) {
    searchDataSection.removeChild(notFoundEl);
  }
};
const removeCountryList = ()=>{
  countryList.innerHTML = '';
}
form.addEventListener('submit', searchFormHandler);
inputSearch.addEventListener('focus', removeInvalidMessage);
inputSearch.addEventListener('input', ()=>{
  removeCountryList();
  removeInvalidMessage();
});
document.addEventListener('click', removeCountryList);

