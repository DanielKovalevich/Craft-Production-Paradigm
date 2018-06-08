import { Router, Request, Response } from 'express';
import {GameController} from '../controllers/GameController'

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
  let game = new GameController();
  game.addNewGame(req);
  // TODO: Make sure it actually does something
  res.send('good');
});

// if I create self-contained functions, I can write them this
//router.post('/', new GameController().addNewGame);

export const StartGameRouter: Router = router;