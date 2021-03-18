/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserData = async (name, email) => {
  console.log('UPDATING USER DATA', name, email);
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: {
        name,
        email
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Profile updated successfully!');
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
