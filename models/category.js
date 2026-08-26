const { schema, model } = require('mongoose');

const categorySchema = schema({
     name: {
          type: String,
          requried: true
     },
     color: {
          type: String, default: '#000000'
     },
     image: {
          type: String, required: true
     },
     markedForDeletion: {
          type: Boolean, default: false
     }
});

categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });
exports.Category = model('Category', categorySchema);