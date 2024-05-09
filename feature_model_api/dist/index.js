import { promises as fs } from 'fs';
import { parseXML } from './utils/FeatureXmlParser.js';
const xmlData = await fs.readFile('src/storage/model.xml', 'utf-8');
parseXML(xmlData).then(features => {
    console.log('Parsed Features:', features);
    // Now, you can pass these features to your front end for visualization
});
//# sourceMappingURL=index.js.map