import express from "express";
import featureRoutes from './routes/featureRoutes.js';
import cors from 'cors';
const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());
app.use('/', featureRoutes);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map