import { Router, Request, Response } from 'express';
import {GameController} from '../controllers/GameController'

const router: Router = Router();

router.get('/', new GameController().addNewGame);

export const StartGameRouter: Router = router;