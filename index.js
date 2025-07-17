import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import readline from 'readline';

const API_KEY = '-';
const API_URL = 'https://api.tinify.com/shrink';

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function percentReduce(before, after) {
  if (before === 0) return '0%';
  return ((1 - after / before) * 100).toFixed(1) + '%';
}

async function compressImage(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    // Upload to tinypng API
    const response = await axios.post(
      API_URL,
      fileData,
      {
        auth: { username: 'api', password: API_KEY },
        headers: { 'Content-Type': 'application/octet-stream' },
        responseType: 'json',
      }
    );
    const compressedUrl = response.data.output.url;
    // Download compressed image
    const compressedImage = await axios.get(compressedUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, compressedImage.data);
    return true;
  } catch (err) {
    console.error(`Compression failed: ${filePath} (${err.response?.data?.message || err.message})`);
    return false;
  }
}

async function main() {
  const dir = process.argv[2] || '.';
  const exts = ['png', 'jpg', 'jpeg'];
  const patterns = exts.map(ext => path.join(dir, `**/*.${ext}`));
  const files = await globby(patterns, { onlyFiles: true });

  if (files.length === 0) {
    console.log('No image files found.');
    return;
  }

  let beforeTotal = 0;
  for (const file of files) {
    beforeTotal += fs.statSync(file).size;
  }

  console.log(`Detected ${files.length} image files, total size is ${formatBytes(beforeTotal)}.`);
  console.log('Press Enter to continue. (Any other input will cancel)');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const userInput = await new Promise(resolve => {
    rl.question('> ', answer => {
      rl.close();
      resolve(answer);
    });
  });

  if (userInput.trim() !== '') {
    console.log('Operation cancelled.');
    return;
  }

  let afterTotal = 0;

  // Compression
  for (const file of files) {
    process.stdout.write(`Compressing: ${file} ... `);
    const ok = await compressImage(file);
    console.log(ok ? 'Done' : 'Failed');
  }

  // Sum size after compression
  for (const file of files) {
    afterTotal += fs.statSync(file).size;
  }

  // Print result
  console.log('\n--- Result ---');
  console.log(`Original: ${files.length} files, size ${formatBytes(beforeTotal)}`);
  console.log(`After: ${files.length} files, size ${formatBytes(afterTotal)} (${percentReduce(beforeTotal, afterTotal)} size reduced)`);
}

main();
