import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import facultyRoutes from './faculty.routes';
import adminRoutes from './admin.routes';
import publicRoutes from './public.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/student', studentRoutes);
rootRouter.use('/faculty', facultyRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/public', publicRoutes);

export default rootRouter;
