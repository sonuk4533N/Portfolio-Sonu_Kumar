const fs = require('fs');

try {
  fs.mkdirSync('c:\\Users\\Sonu Kumar\\OneDrive\\Documents\\portfolio\\frontend\\images', { recursive: true });
  fs.copyFileSync(
    'C:\\Users\\Sonu Kumar\\.gemini\\antigravity-ide\\brain\\18e83b62-3953-4652-9278-413f419db8fb\\profile_1779953406733.png',
    'c:\\Users\\Sonu Kumar\\OneDrive\\Documents\\portfolio\\frontend\\images\\profile.jpg'
  );
  console.log('✓ Image copied successfully');
} catch (e) {
  console.error('Copy failed:', e.message);
  process.exit(1);
}
