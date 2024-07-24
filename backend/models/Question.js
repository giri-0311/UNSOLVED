const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: String,
  question: String,
  link: String, 
  byuser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
