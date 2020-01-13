const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const createCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name
    });
    return customer;
  } catch (err) {
    throw err;
  }
};

const createPaymentMethod = async (number, exp_month, exp_year, cvc) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number,
        exp_month,
        exp_year,
        cvc
      }
    });
    return paymentMethod;
  } catch (err) {
    throw err;
  }
};

const attachPaymentMethod = async (payment_method_id, customer) => {
  try {
    const attachedPaymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      {
        customer
      }
    );
    return attachedPaymentMethod;
  } catch (err) {
    throw err;
  }
};

const createPaymentIntent = async (amount, customer, payment_method) => {
  try {
    const createdPaymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer,
      payment_method
    });

    return createdPaymentIntent;
  } catch (err) {
    throw err;
  }
};

const confirmCardPayment = async payment_method_id => {
  try {
    const confirmedPayment = await stripe.paymentIntents.confirm(
      payment_method_id
    );
    return confirmedPayment;
  } catch (err) {
    throw err;
  }
};

const createTransfer = async (amount, destination, transfer_group) => {
  try {
    const createdTransfer = await stripe.transfers.create({
      amount,
      currency: "usd",
      destination,
      transfer_group
    });
    return createdTransfer;
  } catch (err) {
    throw err;
  }
};

const createAccount = async email => {
  try {
    const createdAccount = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email,
      requested_capabilities: ["card_payments", "transfers"]
    });
    return createdAccount;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createCustomer,
  createPaymentMethod,
  attachPaymentMethod,
  createPaymentIntent,
  confirmCardPayment,
  createAccount,
  createTransfer
};
