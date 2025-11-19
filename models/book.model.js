import Joi from 'joi';
 
export const validateBook = {
  addBook: Joi.object({
    name: Joi.string().min(1).required(),
    category: Joi.string().required(),
    price: Joi.number().required()
  }),
  borrowBook: Joi.object({
    userId: Joi.number().required()
  }),
  returnBook: Joi.object({
    userId: Joi.number().required()
  })
};
