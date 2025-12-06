import { Schema, model } from 'mongoose';
import deleteFile from '../utils/deleteFile';
import ServerError from '../errors/server-error';

interface IProduct {
    title: String,
    image: {
        fileName: string,
        originalName: string;
    },
    category: String,
    description: String,
    price: number | null;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
  },
  image: {
    fileName: {
      type: String,
      required: [true, 'Поле "fileName" должно быть заполнено'],
    },
    originalName: {
      type: String,
      required: [true, 'Поле "originalName" должно быть заполнено'],
    },
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

productSchema.post('findOneAndDelete', async (image: IProduct) => {
  if (image && image.image) {
    try {
      deleteFile(image.image.fileName);
    } catch (error) {
      return new ServerError('Ошибка при удалении файла');
    }
  }
  return new ServerError('Ошибка');
});

export default model<IProduct>('product', productSchema);
