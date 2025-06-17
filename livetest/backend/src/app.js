import express from 'express';
import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;
import cors from 'cors';
import { swaggerDocs, swaggerUi } from '../swagger.js';
import routes from './routes/routes.js';
import morganMiddleware from './middlewares/morgan.js';
import { corsOptions } from './middlewares/security.js'; // ✅ Adjust the path if needed

const app = express();

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(morganMiddleware);

// ✅ Apply CORS with your custom options BEFORE any route
app.use(cors(corsOptions));

app.use(urlencoded({ extended: true, limit: '150mb' }));
app.use(json({ limit: '150mb' }));

const v1Route = '/api/v1';
app.use(v1Route, routes);

export default app;