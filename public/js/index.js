/*eslint-disable*/
import '@babel/polyfill';
import { login } from './login';
import { displayMap } from './mapbox';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

// Values
let email = '';
let password = '';

// Delegation
if (mapBox) {
  const locations = JSON.parse(document.getElementById('map').dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    login(email, password);
  });
}
