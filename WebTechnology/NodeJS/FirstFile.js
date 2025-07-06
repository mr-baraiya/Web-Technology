// const path = require('path')
// const fs = require('fs')

// const path = './crypto.mjs';

// if (fs.existsSync(path)) {
//   console.log('✅ File exists:', path);
// } else {
//   console.log('❌ File does NOT exist:', path);
// }

// Synchronus Approach
// const data = fs.readFileSync("crypto.mjs")
// console.log(data.toString())

// Asynchronus Approach
// fs.readFile("crypto.mjs", (err, data) => {
//     console.log(data.toString());
// });

// fs.rename('crypto.mjs', 'crypto-renamed.mjs', (err) => {
//     if (err) {
//         return console.error('❌ Error renaming file:', err);
//     }
// });

// fs.unlink('crypto-renamed.mjs', (err) => {
//     if (err) {
//         return console.error('❌ Error deleting file:', err);
//     }

//     console.log('File deleted: crypto-renamed.mjs');
// });