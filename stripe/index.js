import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'animation 1',
          },
          unit_amount: 50 * 100,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'animation 2',
          },
          unit_amount: 20 * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment', //or subscription
    shipping_address_collection: {
      allowed_countries: ['FR', 'US'],
    },
    success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`, //url when payment is completed
    cancel_url: `${process.env.BASE_URL}/cancel`,
  });

  res.redirect(session.url);
});

app.get('/complete', async (req, res) => {
  const result = Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ['payment_intent.payment_method'],
    }),
    stripe.checkout.sessions.listLineItems(req.query.session_id),
  ]);

  //   const session = await stripe.checkout.sessions.retrieve(
  //     req.query.session_id,
  //     { expand: ['payment_intent.payment_method'] }
  //   );
  //   const lineItems = await stripe.checkout.sessions.listLineItems(
  //     req.query.session_id
  //   );

  console.log(JSON.stringify(await result));
  res.send('your payment was successful');
});

app.get('/cancel', (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => console.log('server started'));
