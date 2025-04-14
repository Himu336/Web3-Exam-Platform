const fs = require('fs');
const path = require('path');

function findMongooseReferences(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      findMongooseReferences(fullPath);
    } else if (stats.isFile() && file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('mongoose') || 
          content.includes('../models/') || 
          content.includes('./models/')) {
        console.log(`Found potential Mongoose reference in: ${fullPath}`);
      }
    }
  }
}

// Run from the src directory
findMongooseReferences(path.join(__dirname)); 