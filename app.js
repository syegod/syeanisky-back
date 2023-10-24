import express from 'express';
import cors from 'cors';
import { UserController } from './controllers/index.js';
import { authCheck } from './utils/authCheck.js';
import { config } from 'dotenv';

config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/auth/get-me', authCheck, UserController.getme);
app.post('/api/auth/register', UserController.register);
app.post('/api/auth/login', UserController.login);
app.post('/api/add-to-list', authCheck, UserController.addtolist);
app.post('/api/remove-from-list', authCheck, UserController.removefromlist);
app.post('/api/change-rating', authCheck, UserController.changerating);
app.post('/api/change-episodes', authCheck, UserController.changeepisodes);

export default app;