'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}M people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const getCountryFullName = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response1 => {
      if (!response1.ok) {
        throw new Error(`Country not found (${response1.status})`);
      }
      return response1.json();
    })
    .then(data1 => {
      let fullName = data1[0].name;
      console.log(fullName);
      getCountryData(fullName);
    });
  document.querySelector('.input').value = '';
};

const getCountryData = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Country not found (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbours = data[0].borders;
      neighbours.forEach(neighbour => {
        return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`)
          .then(response => response.json())
          .then(data => renderCountry(data, 'neighbour'));
      });
    })
    .catch(err => {
      console.error(`${err} 😳😳`);
      renderError(err.message);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function (e) {
  countriesContainer.innerHTML = '';
  let country = document.querySelector('.input').value;
  getCountryFullName(country);
});
