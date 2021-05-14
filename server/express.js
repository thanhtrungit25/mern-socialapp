import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import template from '../template';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

// modules for server side renderin
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import StaticRouter from 'react-router-dom/StaticRouter';
import MainRouter from './../client/MainRouter';

import {
  ServerStyleSheets,
  ThemeOfStyles,
  ThemeProvider,
} from '@material-ui/styles';
import theme from './../client/theme';
// end

//comment out before building for production
import devBundle from './devBundle';

const app = express();

//comment out before building for production
devBundle.compile(app);

const CURRENT_WORKING_DIR = process.cwd();
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// mount routes
app.use('/', authRoutes);
app.use('/', userRoutes);

app.get('*', (req, res) => {
  // 1. Generate CSS styles using Material-UI's ServerStyleSheets
  const sheets = new ServerStyleSheets();
  const context = {};
  // 2. Use renderToString to generate markup which renders components specific to the route requested
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );
  // 3. Return the template with markup and CSS styles in the response
  if (context.url) {
    return res.redirect(303, context.url);
  }

  const css = sheets.toString();
  res.status(200).send(
    template({
      markup: markup,
      css: css,
    })
  );
});

// Catch unauthorized errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: `${err.name}: ${err.message}` });
  } else if (err) {
    res.status(400).json({ error: `${err.name}: ${err.message}` });
  }
});

export default app;
