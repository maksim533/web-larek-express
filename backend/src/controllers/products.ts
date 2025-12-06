import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import Product from '../models/product';
import moveFileToPermanent from '../utils/moveFileToPermanent';
import NotFound from '../errors/not-found-error';

const product = {
  getProducts: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [products, total] = await Promise.all([
        Product.find(),
        Product.estimatedDocumentCount(),
      ]);
      return res.status(200).send({
        items: products,
        total,
      });
    } catch (error) {
      return next(error);
    }
  },

  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    const {
      title, description, image: { fileName, originalName }, category, price,
    } = req.body;
    try {
      const file = moveFileToPermanent(fileName);
      const item = await Product.create({
        title,
        description,
        image: {
          fileName: file,
          originalName,
        },
        category,
        price,
      });
      return res.status(200).send({
        _id: item._id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        image: {
          fileName: item.image.fileName,
          originalName: item.image.originalName,
        },

      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError(error.message));
      }
      return next(error);
    }
  },

  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateProduct = req.body;
      const id = req.params;

      const productItem = await Product.findById(new mongoose.Types.ObjectId(id.productId));

      if (!productItem) {
        return next(new BadRequestError('Товар не найден'));
      }

      let image;

      if (updateProduct.image && updateProduct.image.fileName) {
        image = moveFileToPermanent(updateProduct.image.fileName);
      }

      productItem.title = updateProduct.title;
      productItem.description = updateProduct.description;
      productItem.price = updateProduct.price;
      productItem.category = updateProduct.category;

      if (image) {
        productItem.image = {
          fileName: image,
          originalName: updateProduct.image.originalName,
        };
      } else if (updateProduct.image) {
        productItem.image = updateProduct.image;
      }

      await productItem.save();

      return res.status(200).send({
        description: productItem.description,
        image: {
          fileName: productItem.image.fileName,
          originalName: productItem.image.originalName,
        },
        title: productItem.title,
        category: productItem.category,
        price: productItem.price,
        _id: productItem._id,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError(error.message));
      }

      return next(error);
    }
  },

  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    try {
      const productItem = await Product.findByIdAndDelete(new mongoose.Types.ObjectId(productId));

      if (!productItem) {
        return next(new NotFound('Товар не найден'));
      }

      return res.status(200).send({
        image: {
          fileName: productItem.image.fileName,
          originalName: productItem.image.originalName,
        },
        _id: productItem._id,
        title: productItem.title,
        category: productItem.category,
        description: productItem.description,
        price: productItem.price,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default product;
