const fs = require('fs');

try {
  if (fs.existsSync('c:\\Users\\Sonu Kumar\\OneDrive\\Documents\\portfolio\\backend\\package-lock.json')) {
    fs.unlinkSync('c:\\Users\\Sonu Kumar\\OneDrive\\Documents\\portfolio\\backend\\package-lock.json');
    console.log('✓ Deleted package-lock.json');
  }
} catch (e) {
  console.error(e.message);
}

try {
  if (fs.existsSync('c:\\Users\\Sonu Kumar\\OneDrive\\Documents\\portfolio\\backend\\node_modules\\.package-lock.json')) {
    fs.unlinkSync('c:\\Users\\Sonu Kumar\\OneDrive\\Documents\\portfolio\\backend\\node_modules\\.package-lock.json');
    console.log('✓ Deleted node_modules/.package-lock.json');
  }
} catch (e) {
  console.error(e.message);
}
