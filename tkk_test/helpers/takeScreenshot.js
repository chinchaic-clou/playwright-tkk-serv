// helpers/takeScreenshot.js
const { getDateTimeString } = require('./getDateTimeString'); // นำเข้าฟังก์ชันดึงวันเวลาที่สร้างไว้
const timeScreenshot = 1500;

/**
 * ฟังก์ชันสำหรับจับภาพหน้าจอแบบกำหนดชื่อโครงสร้างมาตรฐาน
 * @param {import('@playwright/test').Page} page - ตัวแปร page ของ Playwright
 * @param {string} basePath - Path โฟลเดอร์หลักที่ต้องการเซฟภาพ (เช่น 'screenshots/addUser')
 * @param {string|number} caseNo - หมายเลข Test Case (เช่น 'TC01' หรือ 1)
 * @param {string} stepName - ชื่อฟังก์ชัน หรือ ชื่อขั้นตอนการทำงาน (เช่น 'login_success')
 */
async function takeScreenshotFull(page, basePath, caseNo, stepName) {
  const timestamp = getDateTimeString();
  
  // ฟอร์แมตชื่อไฟล์: [CaseNo]_[StepName]_[YYYY-MM-DD_HH-mm-ss].png
  const fileName = `${stepName}_${timestamp}.png`;
  const fullPath = `${basePath}/${caseNo}/${fileName}`;

  // บันทึกภาพหน้าจอ
  await page.waitForTimeout(timeScreenshot);
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`📸 Bounded Screenshot: ${fullPath}`);
}

async function takeScreenshotCommon(page, basePath, caseNo, stepName) {
  const timestamp = getDateTimeString();
  
  // ฟอร์แมตชื่อไฟล์: [CaseNo]_[StepName]_[YYYY-MM-DD_HH-mm-ss].png
  const fileName = `${stepName}_${timestamp}.png`;
  const fullPath = `${basePath}/${caseNo}/${fileName}`;

  // บันทึกภาพหน้าจอ
  await page.waitForTimeout(timeScreenshot);
  await page.screenshot({ path: fullPath});
  console.log(`📸 Bounded Screenshot: ${fullPath}`);
}

module.exports = { takeScreenshotFull, takeScreenshotCommon};