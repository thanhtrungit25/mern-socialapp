import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import template from '../template';

//comment out before building for production
import devBundle from './devBundle';

const app = express();

//comment out before building for production
devBundle.compile(app);

const CURRENT_WORKING_DIR = process.cwd();
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send(template());
});

export default app;
