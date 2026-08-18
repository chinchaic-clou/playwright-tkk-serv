// page/addUser.page.js
const { expect } = require('@playwright/test');

class AddUserPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // 📌 ประกาศ Locators
    this.createButton = page.getByRole('button', { name: ' สร้างผู้ใช้' });
    this.empCodeInput = page.getByRole('textbox', { name: 'รหัสพนักงาน *' });
    this.usernameInput = page.getByRole('textbox', { name: 'ชื่อผู้ใช้ *' });
    this.firstNameInput = page.getByRole('textbox', { name: 'ชื่อ *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'นามสกุล *' });
    this.emailInput = page.getByRole('textbox', { name: 'อีเมล *' });
    
    this.roleDropdown = page.locator('#role').getByRole('combobox');
    this.dealerDropdown = page.locator('#default_dealer_id').getByRole('combobox');
    this.branchDropdown = page.locator('#default_branch_id').getByRole('combobox');
    
    this.saveButton = page.getByRole('button', { name: 'บันทึก' });
  }

  /**
   * ฟังก์ชันสร้างผู้ใช้ - ฟิลด์ไหนไม่ได้ส่งมา (undefined) จะถูกข้ามอัตโนมัติ
   * @param {Object} userData - ข้อมูลผู้ใช้งาน
   */
  async addUser(userData = {}) {
    // 1. กดปุ่มสร้างผู้ใช้
    await this.createButton.click();

    // 2. เติมข้อมูลเฉพาะที่มีการส่งค่าเข้ามา (ไม่เป็น undefined)
    if (userData.empCode !== undefined) {
      await this.empCodeInput.click();
      await this.empCodeInput.fill(userData.empCode);
    }

    if (userData.username !== undefined) {
      await this.usernameInput.click();
      await this.usernameInput.fill(userData.username);
    }

    if (userData.firstName !== undefined) {
      await this.firstNameInput.click();
      await this.firstNameInput.fill(userData.firstName);
    }

    if (userData.lastName !== undefined) {
      await this.lastNameInput.click();
      await this.lastNameInput.fill(userData.lastName);
    }

    if (userData.email !== undefined) {
      await this.emailInput.click();
      await this.emailInput.fill(userData.email);
    }

    // 3. เลือกตัวเลือกใน Dropdown เฉพาะที่มีการระบุมา
    if (userData.role !== undefined) {
      await this.roleDropdown.click();
      await this.page.getByLabel('Options List').getByText(userData.role).click();
    }

    if (userData.dealer !== undefined) {
      await this.dealerDropdown.click();
      await this.page.locator('span').filter({ hasText: userData.dealer }).first().click();
    }

    if (userData.branch !== undefined) {
      await this.branchDropdown.click();
      await this.page.locator('span').filter({ hasText: userData.branch }).first().click();
    }

    // 4. บันทึกข้อมูล
    await this.saveButton.click();
  }
}

module.exports = { AddUserPage };