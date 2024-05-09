import express from "express";
import featureRoutes from './routes/featureRoutes.js'
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/', featureRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});