import { Router, Request, Response } from 'express';
import {GameController} from '../controllers/GameController'
import * as cors from 'cors';

const router: Router = Router();

router.post('/', cors(), (req: Request, res: Response) => {
  let game: GameController = new GameController();
  let result: any = {"pin" : 0};
  result.pin = game.addNewGame(req);
  res.send(result);
});

router.get('/getGameInfo/:id', cors(), async (req: Request, res: Response) => {
  let game = new GameController();
  res.send(await game.getGameInfo(req.params.id));
});

router.get('/addActivePlayer/:id', cors(), (req: Request, res: Response) => {
  let game = new GameController();
  game.addActivePlayer(req.params.id);
  res.send(200);
});

router.get('/removeActivePlayer/:id', cors(), (req: Request, res: Response) => {
  let game = new GameController();
  game.removeActivePlayer(req.params.id);
  res.send(200);
})

// if I create self-contained functions, I can write them like this
//router.post('/', new GameController().addNewGame);

export const StartGameRouter: Router = router;