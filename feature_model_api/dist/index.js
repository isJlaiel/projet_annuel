import express from "express";
import featureRoutes from './routes/featureRoutes.js';
const app = express();
const PORT = 3002;
app.use(express.json());
app.use('/', featureRoutes);
console.log("hey");
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// import { promises as fs } from 'fs';
// import { parseXML } from './utils/FeatureXmlParser.js';
// const xmlData = await fs.readFile('src/storage/model.xml', 'utf-8');
// parseXML(xmlData);
//# sourceMappingURL=index.js.map