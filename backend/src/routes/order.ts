import { celebrate } from 'celebrate';
import { Router } from 'express';
import ProductSheme from '../middleware/validate';
import order from '../controllers/orders';

const routerOrder = Router();

routerOrder.post('/', celebrate({
  body: ProductSheme.createOrder,
}), order.createOrder);

export default routerOrder;
