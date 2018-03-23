const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = global.Promise;

const recipeSchema = new mongoose.Schema ({
  recipeName:{ type: String, required: true },
  espressoType:{ type: String, required: true },
  blurb:{ type:String },
  created:{ type: Date, default: Date.now },
  authorId:{ type:ObjectId,ref:'User', required:true },
  steps:[ {type:String} ],
  authorName:{ type:String, required:true}
});




module.exports = mongoose.model('recipe',recipeSchema);
