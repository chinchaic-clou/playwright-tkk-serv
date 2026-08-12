// pages/login.page.js
const { getTestData } = require('../helpers/googleSheet');
const { DATA_GLOBAL } = require('../helpers/dataGlobal');
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // 📌 ประกาศ Locators ทั้งหมดของหน้านี้ไว้ที่นี่
    this.usernameInput = page.getByRole('textbox', { name: 'ชื่อผู้ใช้งาน' });
    this.passwordInput = page.getByRole('textbox', { name: 'รหัสผ่าน' });
    this.loginButton = page.getByRole('button', { name: 'เข้าสู่ระบบ' });
  }

  // 📌 สร้างฟังก์ชันทำงาน (Actions) ของหน้านี้
  async goto(link) {
    await this.page.goto(link);
  }

  async login(username, password) {
    const sheetName = DATA_GLOBAL.SHEET_NAME_LOGIN;
    const rows = await getTestData(sheetName);
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };