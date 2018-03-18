const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = global.Promise;

const recipeSchema = new mongoose.Schema ({
  recipeName:{ type: String, required: true },
  brewMethod:{ type: String, required: true },
  created:{ type: Date, default: Date.now },
  author:{type:ObjectId,ref:'User', required:true},
  steps:[{type:String}]
});




module.exports = mongoose.model('recipe',recipeSchema);
