// helpers/clearDirectory.js
const fs = require('fs');
const path = require('path');

/**
 * ฟังก์ชันลบไฟล์ทั้งหมดในโฟลเดอร์ที่ระบุ
 * @param {string} dirPath - Path ของโฟลเดอร์ที่ต้องการลบไฟล์ข้างใน
 */
function clearDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    // อ่านไฟล์ทั้งหมดในโฟลเดอร์แล้ววนลบลบทิ้ง
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      // ตรวจว่าเป็นไฟล์ (ไม่ใช่โฟลเดอร์ย่อย) แล้วลบ
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    }
  } else {
    // ถ้ายังไม่มีโฟลเดอร์ ให้สร้างขึ้นมารองรับไว้เลย
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

module.exports = { clearDirectory };