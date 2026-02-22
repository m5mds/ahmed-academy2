const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./app/api', function (filePath) {
    if (filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = content.replace(/catch\s*\{/g, 'catch (error) {\n    console.error("[API Error]", error);');
        if (content !== modified) {
            fs.writeFileSync(filePath, modified, 'utf8');
            console.log('Fixed API catch block in:', filePath);
        }
    }
});
