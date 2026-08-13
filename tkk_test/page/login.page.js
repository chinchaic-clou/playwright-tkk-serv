// pages/login.page.js
const { expect } = require('@playwright/test'); // 👈 นำเข้า expect
const { getTestData } = require('../helpers/googleSheet');
const { DATA_GLOBAL } = require('../helpers/dataGlobal');
const { getDateTimeString } = require('../helpers/getDateTimeString');
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
    this.mainTkkText = page.getByRole('link', { name: 'TKK SERV SERVICE EXCELLENCE' });
  }

  // 📌 สร้างฟังก์ชันทำงาน (Actions) ของหน้านี้
  async goto(link) {
    await this.page.goto(link);
  }

  async login(username, password) {
    const timeString = await getDateTimeString();
    const sheetName = DATA_GLOBAL.SHEET_NAME_LOGIN;
    const pathCapAddUser = DATA_GLOBAL.PATH_CAP_ADD_USER;
    const rows = await getTestData(sheetName);

    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.page.screenshot({ path: `${pathCapAddUser}/${timeString}_login.png` });
    await this.loginButton.click();
    await expect(this.mainTkkText).toBeVisible();
    await this.page.screenshot({ path: `${pathCapAddUser}/${timeString}_login_success.png`, fullPage: true});
  }
}

module.exports = { LoginPage };