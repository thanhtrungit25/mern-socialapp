import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import template from '../template';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

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

// mount routes
app.use('/', authRoutes);
app.use('/', userRoutes);

app.get('*', (req, res) => {
  res.status(200).send(template());
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: `${err.name}: ${err.message}` });
  } else if (err) {
    res.status(400).json({ error: `${err.name}: ${err.message}` });
    console.log(err);
  }
});

export default app;
