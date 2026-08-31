// helpers/googleSheet.js
const { DATA_GLOBAL } = require('../helpers/dataGlobal');
const { request } = require('@playwright/test');
/**
 * ฟังก์ชันดึงข้อมูลจาก Google Sheet ผ่าน OpenSheet API
 * @param {string} sheet_name - ชื่อ Sheet ที่ต้องการดึงข้อมูล
 * @param {number} retries - จำนวนครั้งสูงสุดที่จะลองดึงใหม่เมื่อล้มเหลว (Default: 3)
 * @returns {Promise<Array>} ข้อมูล JSON จาก Sheet
 */

async function getTestData(sheet_name, retries = 3) {
  const sheetID = DATA_GLOBAL.SHEET_ID;
  const url = `https://opensheet.elk.sh/${sheetID}/${sheet_name}`;

  // สร้าง request context สำหรับดึง API
  const apiContext = await request.newContext();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // เพิ่ม timeout เป็น 20 วินาที
      const response = await apiContext.get(url, { timeout: 20000 });

      if (!response.ok()) {
        throw new Error(`HTTP Status ${response.status()}`);
      }

      const data = await response.json();
      await apiContext.dispose();
      return data;
    } catch (error) {
      console.warn(`[พยายามครั้งที่ ${attempt}/${retries}] ดึงข้อมูล Google Sheet (${sheet_name}) ไม่สำเร็จ: ${error.message}`);

      if (attempt === retries) {
        await apiContext.dispose();
        throw new Error(`ไม่สามารถดึงข้อมูลจาก Sheet: ${sheet_name} ได้ (${error.message})`);
      }

      // หน่วงเวลา 2 วินาทีก่อนลองใหม่
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

module.exports = { getTestData };
