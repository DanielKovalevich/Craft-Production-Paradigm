import { Router, Request, Response } from 'express';
import {GameController} from '../controllers/GameController'

const router: Router = Router();

router.post('/', new GameController().addNewGame);

export const StartGameRouter: Router = router;