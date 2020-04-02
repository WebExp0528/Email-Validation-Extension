import exampleRoutes from './example.routes';
import apiExampleRoutes from './apiExample.routes';
import authRoutes from "./auth.routes";

export default function initializeRoutes(app) {
    app.use('/', exampleRoutes);
    app.use('/api/', apiExampleRoutes);
    app.use('/auth/', authRoutes);
}
