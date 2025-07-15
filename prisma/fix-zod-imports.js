// scripts/fix-zod-imports.js
const fs = require('fs');
const path = require('path');

const zodDir = path.join(process.cwd(), 'prisma/zod');
const files = fs.readdirSync(zodDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'common.ts');

// 1. Mapeia qual arquivo exporta qual tipo
const typeToFile = {};
files.forEach(file => {
    const filePath = path.join(zodDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    // Match: export const X = ...  ou export type X = ...
    const regex = /export (?:const|type|interface|class) (\w+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        typeToFile[match[1]] = file.replace(/\.ts$/, '');
    }
});

// 2. Para cada arquivo, reescreve os imports
files.forEach(file => {
    const filePath = path.join(zodDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    // Match import { A, B } from "./index"
    const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]\.\/index['"];?/g;
    let match;
    let newImports = [];
    let typesToReplace = [];
    while ((match = importRegex.exec(content)) !== null) {
        const types = match[1].split(',').map(t => t.trim()).filter(Boolean);
        typesToReplace.push(...types);
        // Agrupa por arquivo de origem
        const byFile = {};
        types.forEach(type => {
            const origin = typeToFile[type];
            if (origin && origin !== file.replace(/\.ts$/, '')) {
                byFile[origin] = byFile[origin] || [];
                byFile[origin].push(type);
            }
        });
        // Gera novos imports
        Object.entries(byFile).forEach(([origin, types]) => {
            newImports.push(`import { ${types.join(', ')} } from "./${origin}";`);
        });
    }
    if (typesToReplace.length > 0) {
        // Remove o(s) import(s) antigo(s)
        content = content.replace(importRegex, '');
        // Adiciona os novos imports no topo
        content = newImports.join('\n') + '\n' + content;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Corrigido: ${file}`);
    }
});