import { Router, Request, Response } from 'express';
import {GameLogicController} from '../controllers/GameLogicController'
import * as cors from 'cors';

const router: Router = Router();
const controller: GameLogicController = new GameLogicController();

router.post('/sendOrder', (req: Request, res: Response) => {
  controller.placeOrder(req.body.pin, req.body.model);
  res.status(200).send('OK');
});

router.get('/getOrders/:id', async (req: Request, res: Response) => {
  res.send(await controller.getOrders(req.params.id));
});

router.post('/sendSupplyOrder/:id', (req: Request, res: Response) => {
  controller.addSupplyOrder(req.params.id, req.body.id, req.body["order[]"]);
});

export const GameLogicRouter: Router = router;