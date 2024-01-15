import { createHttpServer } from './server.js';
import { createRouter } from './router.js';
import { getController, postController, optionsController } from './controllers.js';

const router = createRouter();

router.addRoute('/', 'GET', getController);
router.addRoute('/nodepost', 'POST', postController);
router.addRoute('/nodeoptions', 'OPTIONS', optionsController);

createHttpServer(router.routes);
