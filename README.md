# tinypng

A simple CLI tool to compress PNG and JPEG images in bulk using the TinyPNG API.

## Features
- Detects all PNG, JPG, and JPEG files in a directory (recursively)
- Shows total file count and size before compression
- Asks for confirmation before starting
- Compresses images in-place using the TinyPNG API
- Shows before/after size and reduction percentage

## Requirements
- Node.js (v14 or higher recommended)
- A TinyPNG API key ([Get one here](https://tinypng.com/developers))

## Installation
1. Clone this repository:
   ```sh
   git clone <your-repo-url>
   cd tinypng
   ```
2. Install dependencies:
   ```sh
   yarn install
   # or
   npm install
   ```

## Usage
1. Set your TinyPNG API key in `index.js`:
   ```js
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```
2. Run the script:
   ```sh
   node index.js [target_directory]
   ```
   - If no directory is specified, the current directory is used.

3. The script will:
   - Detect all image files
   - Show the total count and size
   - Ask you to press Enter to continue
   - Compress all images in-place
   - Show the results

## Example
```
$ node index.js ./test
Detected 3 image files, total size is 5.23 MB.
Press Enter to continue. (Any other input will cancel)
> 
Compressing: test/image1.png ... Done
Compressing: test/image2.jpg ... Done
Compressing: test/image3.jpeg ... Done

--- Result ---
Original: 3 files, size 5.23 MB
After: 3 files, size 2.11 MB (59.6% size reduced)
```

## Notes
- All images are overwritten in-place. Make backups if needed.
- The script stops if you enter anything other than Enter at the prompt.
- API usage is subject to TinyPNG's free/commercial limits.

## License
MIT
