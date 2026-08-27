const { model, Schema } = require('mongoose');



const orderItemSchema = Schema({
     quantity: { type: Number, default: 1 },
     product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
     productName: { type: String, required: true },
     productImage: { type: String, required: true },
     productPrice: { type: Number, required: true },
     selectedSize: String,
     selectedColor: String,
});


orderItemSchema.set('toObject', { virtuals: true });
orderItemSchema.set('toJSON', { virtuals: true });
exports.OrderItem = model('OrderItem', orderItemSchema);