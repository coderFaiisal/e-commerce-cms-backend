import express from 'express';

const router = express.Router();

const moduleRoutes = [
  /**
   * ! Dummy route! Replace with actual routes
   **/
  {
    path: '/',
    route: router.get('/'),
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
