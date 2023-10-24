import express from 'express';
import cors from 'cors';
import { UserController } from './controllers/index.js';
import {authCheck} from './utils/authCheck.js';
import { config } from 'dotenv';
config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/test', (req, res) => res.send('Hello World!'));
app.get('/auth/get-me', authCheck, UserController.getme);

app.post('/auth/register', UserController.register);
app.post('/auth/login', UserController.login);
app.post('/add-to-list', authCheck, UserController.addtolist);
app.post('/remove-from-list', authCheck, UserController.removefromlist);
app.post('/change-rating', authCheck, UserController.changerating);
app.post('/change-episodes', authCheck, UserController.changeepisodes);

app.listen(process.env.HOST || 8000, () => {
    console.log('Server is started...');
});