import { Router } from 'express';
import { celebrate } from 'celebrate';
import productsControllers from '../controllers/products';
import ProductSheme from '../middleware/validate';
import auth from '../middleware/auth';

const routerProduct = Router();

routerProduct.get('/', productsControllers.getProducts);

routerProduct.post(
  '/',
  auth,
  celebrate({
    body: ProductSheme.createProduct,
  }),
  productsControllers.createProduct,
);

routerProduct.patch(
  '/:productId',
  auth,
  celebrate({
    params: ProductSheme.productId,
    body: ProductSheme.updateProduct,
  }),
  productsControllers.updateProduct,
);

routerProduct.delete(
  '/:productId',
  auth,
  celebrate({ params: ProductSheme.productId }),
  productsControllers.deleteProduct,
);

export default routerProduct;
