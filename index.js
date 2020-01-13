const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const {
  createCustomer,
  createPaymentMethod,
  attachPaymentMethod,
  createPaymentIntent,
  confirmCardPayment,
  createAccount,
  createTransfer
} = require("./stripe");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/create_customer", async (request, response) => {
  try {
    const { email, name } = request.body;
    const createdCustomer = await createCustomer(email, name);
    return response.status(200).send({ data: createdCustomer });
  } catch (err) {
    return response.status(400).send({ data: err });
  }
});

app.post("/create_payment_method", async (request, response) => {
  try {
    const { number, exp_month, exp_year, cvc } = request.body;
    const createdPaymentMethod = await createPaymentMethod(
      number,
      exp_month,
      exp_year,
      cvc
    );
    return response.status(200).send({ data: createdPaymentMethod });
  } catch (err) {
    return response.status(400).send({ data: err });
  }
});

app.post("/attach_payment_method", async (request, response) => {
  try {
    const { payment_method_id, customer_id } = request.body;

    const attachedPaymentMethod = await attachPaymentMethod(
      payment_method_id,
      customer_id
    );
    return response.status(200).send({ data: attachedPaymentMethod });
  } catch (err) {
    return response.status(400).send({ data: err });
  }
});

app.post("/create_payment_intent", async (request, response) => {
  try {
    const { amount, customer, payment_method } = request.body;
    const createdPaymentIntent = await createPaymentIntent(
      amount,
      customer,
      payment_method
    );
    return response.status(200).send({ data: createdPaymentIntent });
  } catch (err) {
    return response.status(400).send({ data: err });
  }
});

app.post("/confirm_card_payment", async (request, response) => {
  try {
    const { payment_method_id } = request.body;
    const confirmedCardPayment = await confirmCardPayment(payment_method_id);
    return response.status(200).send({ data: confirmedCardPayment });
  } catch (err) {
    return response.status(400).send({ data: err });
  }
});

app.post("/create_transfer", async (request, response) => {
  try {
    const { amount, destination, transfer_group } = request.body;
    const createdTransfer = await createTransfer(
      amount,
      destination,
      transfer_group
    );
    return response.status(200).send({ data: createdTransfer });
  } catch (err) {
    return response.status(400).send({ data: err });
  }
});

app.post("/create_account", async (request, response) => {
  try {
    const { email } = request.body;
    const createdAccount = await createAccount(email);
    return response.status(200).send({ data: createdAccount });
  } catch (err) {
    return response.status(400).send({ data: err });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server is listening on ${process.env.PORT}`)
);
