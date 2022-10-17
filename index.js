const form = document.querySelector('#form-search-country');
const searchBlock = document.querySelector('.search-data');
const inputSearch = document.querySelector('#search-country');

const renderInvalidMessage = (message) => {
  const p = document.createElement('p');
  p.classList.add('invalid-input');
  p.innerHTML = message;
  searchBlock.append(p);
};

const searchFormHandler = (ev) => {
  ev.preventDefault();

  const formData = new FormData(form);
  const country = formData.get('search-country').trim();

  if (country.length > 1) {
    getCountry(country);
  } else {
    renderInvalidMessage('Please enter at least 2 characters');
  }
};
const removeInvalidMessage = () => {
  const invalidMessageEl = document.querySelector('.invalid-input');
  if (invalidMessageEl) {
    searchBlock.removeChild(invalidMessageEl);
  }
};
form.addEventListener('submit', searchFormHandler);
inputSearch.addEventListener('focus', removeInvalidMessage);
