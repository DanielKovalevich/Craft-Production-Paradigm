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

router.get('/getGameInfo/:id', cors(), (req: Request, res: Response) => {
  let game = new GameController();
  game.getGameInfo(req.params.id, (result: any) => {
    res.send(result);
  });
});

// if I create self-contained functions, I can write them like this
//router.post('/', new GameController().addNewGame);

export const StartGameRouter: Router = router;