
import mongoose from "mongoose";

const CheckoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
 
        productId: { 
          type: String, 
          ref: "Product", 
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
        imageUrl: { type: String }, 
      },
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    payment: {
      method: {
        type: String,
        enum: ["COD", "Razorpay", "Stripe", "PayPal"],
        default: "COD",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      transactionId: { type: String },
    },

    priceSummary: {
      itemsTotal: { type: Number, required: true },
      shippingCharge: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    deliveredAt: { type: Date },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Checkout = mongoose.model("Checkout", CheckoutSchema);
export default Checkout;