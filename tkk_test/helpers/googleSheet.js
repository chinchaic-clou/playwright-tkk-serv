// helpers/googleSheet.js
const { DATA_GLOBAL } = require('../helpers/dataGlobal');
async function getTestData(sheet_name) {
  const sheetID = DATA_GLOBAL.SHEET_ID;
  // ใช้ OpenSheet API แปลง Google Sheet เป็น JSON
  const url = `https://opensheet.elk.sh/${sheetID}/${sheet_name}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ไม่สามารถดึงข้อมูลได้ Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
    return [];
  }
}

module.exports = { getTestData };