const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },

    images: [],
    color: [{ type: Schema.Types.ObjectId, ref: "Color", required: true }],
    tags: [],

    retings: [
      {
        star: Number,
        comment: String,
        postedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: String,

      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre("save", function (next) {
  const title = this.title;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  this.slug = slug;
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
