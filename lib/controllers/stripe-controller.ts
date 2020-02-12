import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2019-12-03"
});

export class StripeController {
  public async CreateCustomer(req: Request, res: Response) {
    const { email, name } = req.body;
    try {
      const customer = await stripe.customers.create({
        email,
        name
      });
      return res.status(200).send({ data: customer });
    } catch (err) {
      return res.status(400).send({ data: err });
    }
  }

  public async CreatePaymentMethod(req: Request, res: Response) {
    try {
      const { number, exp_month, exp_year, cvc } = req.body;
      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          number,
          exp_month,
          exp_year,
          cvc
        }
      });
      return res.status(200).send({ data: paymentMethod });
    } catch (err) {
      return res.status(400).send({ data: err });
    }
  }

  public async AttachPaymentMethod(req: Request, res: Response) {
    try {
      const { payment_method_id, customer_id: customer } = req.body;
      const attachedPaymentMethod = await stripe.paymentMethods.attach(
        payment_method_id,
        {
          customer
        }
      );
      return res.status(200).send({ data: attachedPaymentMethod });
    } catch (err) {
      return res.status(400).send({ data: err });
    }
  }

  public async CreatePaymentIntent(req: Request, res: Response) {
    try {
      const { amount, customer, payment_method } = req.body;
      const createdPaymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        customer,
        payment_method
      });

      return res.status(200).send({ data: createdPaymentIntent });
    } catch (err) {
      return res.status(400).send({ data: err });
    }
  }

  public async ConfirmCardPayment(req: Request, res: Response) {
    try {
      const { payment_intent_id } = req.body;
      const confirmedPayment = await stripe.paymentIntents.confirm(
        payment_intent_id
      );
      return res.status(200).send({ data: confirmedPayment });
    } catch (err) {
      return res.status(400).send({ data: err });
    }
  }

  public async CreateTransfer(req: Request, res: Response) {
    try {
      const { amount, destination, transfer_group } = req.body;
      const createdTransfer = await stripe.transfers.create({
        amount,
        currency: "usd",
        destination,
        transfer_group
      });
      return res.status(200).send({ data: createdTransfer });
    } catch (err) {
      return res.status(400).send({ data: err });
    }
  }

  public async CreateAccount(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const createdAccount = await stripe.accounts.create({
        type: "custom",
        country: "US",
        email,
        requested_capabilities: ["card_payments", "transfers"]
      });
      return res.status(200).send({ data: createdAccount });
    } catch (err) {
      return res.status(400).send({ data: err });
    }
  }
}
