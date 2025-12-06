import { Joi } from 'celebrate';

const ProductSheme = {
  createProduct: Joi.object({
    title: Joi.string().trim().min(2).max(30)
      .required()
      .messages({
        'string.empty': 'Поле "title" должно быть заполнено',
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
        'any.required': 'Поле "title" обязательно для заполнения',
      }),
    image: {
      fileName: Joi.string().trim().required().messages({
        'string.empty': 'Поле "fileName" должно быть заполнено',
        'any.required': 'Поле "fileName" обязательно для заполнения',
      }),
      originalName: Joi.string().trim().required().messages({
        'string.empty': 'Поле "originalName" должно быть заполнено',
        'any.required': 'Поле "originalName" обязательно для заполнения',
      }),
    },
    category: Joi.string().trim().required().messages({
      'string.empty': 'Поле "category" должно быть заполнено',
      'any.required': 'Поле "category" обязательно для заполнения',
    }),
    price: Joi.number().default(null).messages({
      'number.base': 'Поле "price" должно быть числом',
    }),
    description: Joi.string().trim(),
  }),

  createOrder: Joi.object({
    items: Joi.array()
      .items(
        Joi.string().hex().length(24).required()
          .messages({
            'string.hex': 'ID товара должен быть в hex-формате',
            'string.length': 'ID товара должен содержать 24 символа',
            'any.required': 'Элемент массива items обязателен',
          }),
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Массив items должен содержать минимум 1 элемент',
        'any.required': 'Поле "items" обязательно для заполнения',
      }),
    total: Joi.number().required().messages({
      'number.base': 'Поле "total" должно быть числом',
      'any.required': 'Поле "total" обязательно для заполнения',
    }),
    payment: Joi.string().valid('card', 'online').required().messages({
      'any.only': 'Метод оплаты должен быть "card" или "online"',
      'any.required': 'Поле "payment" обязательно для заполнения',
    }),
    email: Joi.string().email().trim().required()
      .messages({
        'string.email': 'Введите корректный email адрес',
        'string.empty': 'Поле "email" должно быть заполнено',
        'any.required': 'Поле "email" обязательно для заполнения',
      }),
    phone: Joi.string()
      .pattern(/^[\\+]?[0-9\s\-\\(\\)]{10,20}$/)
      .trim()
      .required()
      .messages({
        'string.pattern.base': 'Введите корректный номер телефона',
        'string.empty': 'Поле "phone" должно быть заполнено',
        'any.required': 'Поле "phone" обязательно для заполнения',
      }),
    address: Joi.string().trim().required().messages({
      'string.empty': 'Поле "address" должно быть заполнено',
      'any.required': 'Поле "address" обязательно для заполнения',
    }),
  }),

  productId: Joi.object({
    productId: Joi.string().trim().required().messages({
      'string.empty': 'Поле "productId" должно быть заполнено',
      'any.required': 'Поле "productId" обязательно для заполнения',
    }),
  }),

  updateProduct: Joi.object({
    title: Joi.string().trim().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
      }),
    image: {
      fileName: Joi.string().trim(),
      originalName: Joi.string().trim(),
    },
    category: Joi.string().trim(),
    price: Joi.number().default(null).messages({
      'number.base': 'Поле "price" должно быть числом',
    }),
    description: Joi.string().trim(),
  }),
};

export default ProductSheme;
