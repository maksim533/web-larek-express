import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';
import NotFound from '../errors/not-found-error';

const order = {
  createOrder: async (req: Request, res: Response, next: NextFunction) => {
    const { items, total } = req.body;

    try {
      const products = await Product.find({
        _id: { $in: items },
      });

      if (products.length !== items.length) {
        return next(new NotFound('Товары не найдены'));
      }

      const priceProducts = products.filter((p) => p.price === null || p.price <= 0);

      if (priceProducts.length > 0) {
        return next(new BadRequestError('Товар недоступен для заказа'));
      }

      const calculatedTotal = products.reduce((sum, product) => {
        const price = product.price || 0;
        return sum + price;
      }, 0);

      if (calculatedTotal !== total) {
        return next(new BadRequestError('Сумма заказа не совпадает'));
      }

      const fakeObjectId = faker.database.mongodbObjectId();

      return res.status(200).send({
        id: fakeObjectId,
        total: calculatedTotal,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default order;
