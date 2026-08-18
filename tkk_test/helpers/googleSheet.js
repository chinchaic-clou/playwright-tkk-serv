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

/**
 * ฟังก์ชันดึงจำนวน Row ทั้งหมดที่มีข้อมูลจาก Google Sheet
 * @param {Array} rows - ข้อมูลที่อ่านได้จาก getTestData()
 * @returns {number} จำนวน Row ที่มีข้อมูล
 */
async function getValidRowsLength(rows) {
  if (!rows || !Array.isArray(rows)) return 0;

  // กรองเฉพาะ Row ที่มีข้อมูลอย่างน้อย 1 ช่อง (ไม่เป็นค่าว่าง/spaces/null/undefined)
  const nonValueRows = rows.filter(row => {
    // ดึงค่าของแต่ละ Cell ใน Row มาเช็ก
    const values = Object.values(row);
    
    // คืนค่า true ถ้ามีอย่างน้อย 1 ช่องที่มีข้อความจริง
    return values.some(val => val !== null && val !== undefined && String(val).trim() !== '');
  });

  return nonValueRows.length;
}

module.exports = { getTestData, getValidRowsLength };