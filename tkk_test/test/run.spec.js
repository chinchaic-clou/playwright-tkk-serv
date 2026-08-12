import { test, expect } from '@playwright/test';
const { getTestData } = require('../helpers/googleSheet');

test('test', async ({ page }) => {
  const rows = await getTestData('Sheet1');
  console.log("Chin Eiei >> ",rows[0].link);
  await page.goto(rows[0].link);
  await page.getByRole('textbox', { name: 'ชื่อผู้ใช้งาน' }).click();
  await page.getByRole('textbox', { name: 'ชื่อผู้ใช้งาน' }).fill('admin');
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).click();
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('admin');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
});