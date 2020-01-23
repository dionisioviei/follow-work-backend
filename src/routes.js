const { Router } = require('express');

const UserController = require('./controllers/UserController');
const WorkController = require('./controllers/WorkController');
const StepController = require('./controllers/StepController');
const SessionController = require('./controllers/SessionController');
const { protectRoute } = require('./middlewares/protectRoute');

const routes = Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routes.get('/users', protectRoute('admin'), UserController.index);

routes.post('/users', protectRoute('admin'), UserController.store);

routes.put('/users/:id', protectRoute('admin'), UserController.update);

routes.delete('/users/:id', protectRoute('admin'), UserController.destroy);

routes.put(
  '/works/:id/steps',
  protectRoute('all'),
  upload.single('image'),
  StepController.update
);

routes.get('/works/:id/steps', protectRoute('all'), StepController.index);

routes.get('/works', protectRoute('all'), WorkController.index);

routes.post('/works', protectRoute('admin'), WorkController.store);

routes.put('/works/:id', protectRoute('admin'), WorkController.update);

routes.delete('/works/:id', protectRoute('admin'), WorkController.destroy);

routes.post('/sessions', SessionController.store);

module.exports = routes;
