const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not processed",
        "Cash on Delivery",
        "processing",
        "Discaptched",
        "Cancelled",
        "Delivered",
      ],
    },
    orderBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
