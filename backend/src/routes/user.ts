import { Router } from 'express';
import user from '../controllers/auth';
import auth from '../middleware/auth';

const userRoute = Router();

userRoute.post('/login', user.loginUser);
userRoute.post('/register', user.registerUser);
userRoute.get('/token', user.refreshAccessToken);
userRoute.get('/logout', user.logoutUser);
userRoute.get('/user', auth, user.getCurrentUser);

export default userRoute;
