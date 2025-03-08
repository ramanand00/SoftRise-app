const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class PaymentService {
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: currency
      })
      return paymentIntent
    } catch (error) {
      throw new Error('Payment creation failed')
    }
  }

  async createSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      })
      return subscription
    } catch (error) {
      throw new Error('Subscription creation failed')
    }
  }
}

module.exports = new PaymentService() 