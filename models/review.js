const { Schema, model } = require('mongoose');

const reviewSchema = Schema({
     product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
     },

     user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
     },

     userName: {
          type: String,
          required: true
     },

     comment: {
          type: String,
          trim: true
     },

     rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
     },

     date: {
          type: Date,
          default: Date.now
     }
});

reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

exports.Review = model('Review', reviewSchema);