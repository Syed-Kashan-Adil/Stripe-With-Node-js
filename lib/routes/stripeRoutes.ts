import { StripeController } from "../controllers/stripe-controller";
export class Routes {
  public stripeController: StripeController;
  constructor() {
    this.stripeController = new StripeController();
  }
  public routes(app) {
    app.route("/create_customer").post(this.stripeController.CreateCustomer);

    app
      .route("/create_payment_method")
      .post(this.stripeController.CreatePaymentMethod);

    app
      .route("/attach_payment_method")
      .post(this.stripeController.AttachPaymentMethod);

    app
      .route("/create_payment_intent")
      .post(this.stripeController.CreatePaymentIntent);

    app
      .route("/confirm_card_payment")
      .post(this.stripeController.ConfirmCardPayment);

    app.route("/create_transfer").post(this.stripeController.CreateTransfer);

    app.route("/reate_account").post(this.stripeController.CreateAccount);
  }
}
