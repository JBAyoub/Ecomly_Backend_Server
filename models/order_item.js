const { schema, model, Schema } = require('mongoose');



const orderItemSchema = schema({
     quantity: { type: Number, default: 1 },
     product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
     productName: { type: String, required: true },
     productImage: { type: String, required: true },
     productPrice: { type: Number, required: true },
     selectedSize: String,
     selectedColor: String,
});


exports.OrderItem = model('OrderItem', orderItemSchema);