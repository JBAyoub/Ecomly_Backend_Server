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

exports.Category = model('Category', categorySchema);