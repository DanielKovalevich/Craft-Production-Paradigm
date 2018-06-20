import { Router, Request, Response } from 'express';
import {GameController} from '../controllers/GameController'
import * as cors from 'cors';

const router: Router = Router();
const controller: GameController = new GameController();

router.post('/', cors(), (req: Request, res: Response) => {
  let result: any = {"pin" : 0};
  result.pin = controller.addNewGame(req);
  res.send(result);
});

router.post('/joinGame/:id', (req: Request, res: Response) => {
  controller.joinGame(req);
  res.status(200).send('OK');
});

router.get('/getGameInfo/:id', cors(), async (req: Request, res: Response) => {
  res.send(await controller.getGameInfo(req.params.id));
});

router.get('/addActivePlayer/:id', cors(), (req: Request, res: Response) => {
  controller.addActivePlayer(req.params.id);
  res.sendStatus(200);
});

router.get('/removeActivePlayer/:id', cors(), (req: Request, res: Response) => {
  controller.removeActivePlayer(req.params.id);
  res.sendStatus(200);
});

router.get('/checkIfPinExists/:id', cors(), (req: Request, res: Response) => {
  controller.checkIfPinExists(req.params.id, (result:any) => {
    res.send(result);
  });
});

router.get('/getPossiblePositions/:id', cors(), async (req: Request, res: Response) => {
  res.send(await controller.getPossiblePositions(req.params.id));
});

// if I create self-contained functions, I can write them like this
//router.post('/', new GameController().addNewGame);

export const StartGameRouter: Router = router;