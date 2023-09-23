
const { checkSchema } = require('express-validator');
const { groupList } = require('./database');


exports.messageSchema = checkSchema({
  city: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    isIn: { options: [['CONAPEPVH', 'Ariquemes', 'Jaru', 'JiParana', 'ImpelZL']] },
    errorMessage: 'Invalid city',
  },
  group: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    isIn: { options: [groupList] },
    errorMessage: 'Invalid group',
  },
  text: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Text is required',
  },
  sender: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Sender is required',
  },
});
