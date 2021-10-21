import { Router } from 'express';

import { githubRouter } from './github.routes';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

import { AuthenticateUserController } from '../controllers/AuthenticateUserController';
import { CreateMessageController } from '../controllers/CreateMessageController';
import { GetLastThreeMessagesController } from '../controllers/GetLastThreeMessagesController';
import { ProfileUserController } from '../controllers/ProfileUserController';

const router = Router();

const authenticateUserController = new AuthenticateUserController();
const createMessageController = new CreateMessageController();
const getLastThreeMessagesController = new GetLastThreeMessagesController();
const profileUserController = new ProfileUserController();

router.use(githubRouter);

router.post('/authenticate', authenticateUserController.handle);

router.post('/messages', ensureAuthenticated, createMessageController.handle);

router.get('/messages/last_3', getLastThreeMessagesController.handle);

router.get('/profile', ensureAuthenticated, profileUserController.handle);

export { router };
