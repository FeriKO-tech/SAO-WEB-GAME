import fs from 'fs';
import { supportTranslations } from './src/translations/support';

function updateJson(lang, dict) {
    const filePath = `./sao-web-next/messages/${lang.toLowerCase()}.json`;
    if (!fs.existsSync(filePath)) return;
    
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Convert functions to strings or remove them
    const supportClean = {};
    for (const key in dict) {
        if (typeof dict[key] === 'function') {
            // We can handle variables directly in next-intl later if needed, but let's just make it a generic string for now
            supportClean[key] = dict[key]("{filename}");
        } else {
            supportClean[key] = dict[key];
        }
    }
    
    content.Support = supportClean;
    
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Updated ${filePath}`);
}

updateJson('RU', supportTranslations.RU);
updateJson('EN', supportTranslations.EN);
