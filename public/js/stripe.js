/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';


export const bookTour = async tourId => {
  try {
    const stripe = Stripe('pk_test_51Id4QlCgjPAsaIeh0M9xpWsDnCuVtNsHVU6mlu0BSyGLg7I0DBnLYMxwOf4rFtMRSpFA5Dq4SHeXfM6DXN0T9IkP00mkarj1oz')
    // get checkout session from API
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
  
    // create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

  } catch (err) {
    showAlert('error', err);
  }
};
