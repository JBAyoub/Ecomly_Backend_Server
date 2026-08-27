const { Category } = require("../models/category");

exports.getCategories = async (_, res) => {

     try {
          const categories = await Category.find();
          if (!categories) return res.status(404).json({ message: "Could not find any category" });
          return res.json(categories);
     } catch (error) {
          console.error(error)
          return res.status(500).json({
               type: error.name,
               message: error.message
          })
     }

}
exports.getCategoryById = async (req, res) => {
     try {
          const category = await Category.findById(req.params.id);
          if (!category) return res.status(404).json({ message: 'Could not find the requested category' });
          return res.json(category);
     } catch (error) {
          console.error(error)
          return res.status(500).json({
               type: error.name,
               message: error.message
          })
     }
}