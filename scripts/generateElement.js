const createLi = (classN, value, ccn3) => {
  const li = document.createElement('li');
  const p = document.createElement('p');

  li.setAttribute('data-option', ccn3);
  li.classList.add(classN);
  p.innerHTML = value;
  li.append(p);
  return li;
};

const createElWithClass = (tag, classN) => {
  const el = document.createElement(tag);
  el.classList.add(classN);
  return el;
};

const createLoader = () => {
  const div = createElWithClass('div', 'loader');
  const span = createElWithClass('span', 'spinner');
  div.append(span);
  return div;
};
