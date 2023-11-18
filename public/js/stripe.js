/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      "pk_test_51OBRSXC4cWDaA4xTvFu45MCz7wkkXG8eOMDyOlr6z8sH3xauL0F9SjAcjgAp81aVSXUUyLcNEnV63475nWrIOaF000eZzZSUlI"
    );

    // 1) Get the session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
