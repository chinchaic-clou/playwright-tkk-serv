// helpers/googleSheet.js

// 1. ใส่ SHEET_ID ที่ดึงมาจาก URL
const SHEET_ID = '1zGYNjECNXzrjpcBjfl41-qk8HGZ6dgvUGt08sA126nE';

async function getTestData(sheet_name) {
  // ใช้ OpenSheet API แปลง Google Sheet เป็น JSON
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheet_name}`;
  
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