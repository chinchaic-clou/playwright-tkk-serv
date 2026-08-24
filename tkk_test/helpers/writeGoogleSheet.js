// helpers/writeGoogleSheet.js
const { JWT } = require("google-auth-library");
const path = require("path");
const { DATA_GLOBAL } = require("../helpers/dataGlobal");

// ดึงไฟล์ credentials.json จาก Root โปรเจกต์
const creds = require(path.join(process.cwd(), "credentials.json"));

/**
 * ฟังก์ชันค้นหา User แล้วอัปเดตข้อมูลลงคอลัมน์ที่กำหนด
 * @param {string} sheetID - ID ของ Google Sheet
 * @param {string} sheetName - ชื่อแท็บที่ต้องการทำงาน (เช่น 'Sheet1')
 * @param {string} targetUser - ชื่อ User ที่ต้องการค้นหา (เช่น 'Test001')
 * @param {string} columnTarget - column ที่เป็นเป้าหมาย
 * @param {Object} updateData - ข้อมูลที่ต้องการเขียนลงไป รูปแบบ { ColumnName: 'Value' }
 */
async function updateUserRow(
  sheetID,
  sheetName,
  columnTarget,
  targetUser,
  updateData,
) {
  try {
    const targetUserText = columnTarget;
    const { GoogleSpreadsheet } = await import("google-spreadsheet");

    // 1. ยืนยันตัวตน
    const serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(sheetID, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) {
      throw new Error(`ไม่พบแท็บชื่อ "${sheetName}" ใน Google Sheet`);
    }

    // 2. ดึงแถวข้อมูลทั้งหมดออกมา
    const rows = await sheet.getRows();

    // 3. ค้นหาแถวที่คอลัมน์ User ตรงกับ targetUser
    const targetRow = rows.find(
      (row) => row.get(targetUserText) === targetUser,
    );

    if (targetRow) {
      // 4. วนลูปอัปเดตค่าตาม Key ใน updateData (เช่น Password)
      Object.keys(updateData).forEach((columnName) => {
        targetRow.set(columnName, updateData[columnName]);
      });

      // 5. บันทึกการเปลี่ยนแปลงลง Google Sheet
      await targetRow.save();
      console.log(`✅ อัปเดตข้อมูลของ User: "${targetUser}" เรียบร้อยแล้ว`);
    } else {
      console.log(`⚠️ ไม่พบข้อมูล: "${targetUser}" ในระบบ`);
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการอัปเดต Google Sheet:", error);
    throw error;
  }
}

module.exports = { updateUserRow };
