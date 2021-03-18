/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export async function login (email, password) {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: {
          email,
          password,
        },
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully');
        window.setTimeout(() => {
          location.assign('/');
        }, 500);
      }
    } catch (err) {
      //console.error(err); 
      showAlert('error', err.response.data.message);
    }
  }

  export async function logout() {
    try {
      const res = await axios({
        method: 'GET',
        url: 'http://127.0.0.1:3000/api/v1/users/logout',  
      });

      if(res.data.status === 'success') location.reload();
    } catch(err) {
      showAlert('error', 'Error logging out! Try again.');
    }
  }
