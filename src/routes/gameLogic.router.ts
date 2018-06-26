import { Router, Request, Response } from 'express';
import {GameLogicController} from '../controllers/GameLogicController'
import * as cors from 'cors';

const router: Router = Router();
const controller: GameLogicController = new GameLogicController();

router.post('/sendOrder', (req: Request, res: Response) => {

});

export const GameLogicRouter: Router = router;