import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      min: [1, "price should be greater than or equal to 1"],
      required: [true, "price is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "stock can not be negative"],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "sold items can not be negative"],
    },
    rating: {
      type: [
        {
        _id:false,
          email: {
            type: String,
          },
          rated: {
            type: Number,
            min: [1, "rating should be greater or equal to one"],
            max: [5, "rating should be less than or equal to 5"],
          },
        },
      ],
      validate(ratings)
      {
        if (ratings.length > 0) {
            const emails = new Set();
            for (const rating of ratings) {
              if (emails.has(rating.email)) {
                return false; // Not unique
              }
              console.log(emails)
              emails.add(rating.email);
            }
            return true
          }
          return true
      }
      },

    
    createdBy: {
      type: String,
    },
    categoery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoery",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Product", productSchema);
