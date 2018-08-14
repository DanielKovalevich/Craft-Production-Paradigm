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
  controller.addSupplyOrder(req.params.id, req.body.id, req.body.order, req.body.colors);
  res.status(200).send('OK');
});

router.get('/getSupplyOrder/:id/:orderId', async (req: Request, res: Response) => {
  res.send(await controller.getSupplyOrder(req.params.id, req.params.orderId));
});

router.get('/colors/:id/:orderId', async(req: Request, res: Response) => {
  let result = await controller.getColors(req.params.id, req.params.orderId);
  res.send(result);
});

router.post('/updatePieces/:id/:orderId', (req: Request, res: Response) => {
  res.send(controller.updatePieces(req.params.id, req.params.orderId, req.body.pieces));
});

router.post('/sendAssembledModel/:id/:orderId', (req: Request, res: Response) => {
  console.log('Assembled model has been sent');
  res.send(controller.updateAssembledModel(req.params.id, req.params.orderId, req.body.model));
});

router.get('/getAssembledModel/:id/:orderId', async (req: Request, res: Response) => {
  res.send(await controller.getAssembledModel(req.params.id, req.params.orderId));
});

router.get('/getManufacturerRequest/:id/:orderId', async (req: Request, res: Response) => {
  res.send(await controller.getManufacturerRequest(req.params.id, req.params.orderId));
});

router.post('/updateManufacturerRequest/:id/:orderId', (req: Request, res: Response) => {
  res.send(controller.updateManufacturerRequest(req.params.id, req.params.orderId, req.body.request));
});

router.post('/rejectOrder/:id/:orderId', (req: Request, res: Response) => {
  res.send(controller.rejectOrder(req.params.id, req.params.orderId));
});

export const GameLogicRouter: Router = router;