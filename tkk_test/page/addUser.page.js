// page/addUser.page.js
const { expect } = require('@playwright/test');
const { takeScreenshotFull, takeScreenshotCommon } = require('../helpers/takeScreenshot');
const { updateUserRow } = require('../helpers/writeGoogleSheet');
const { DATA_GLOBAL } = require('../helpers/dataGlobal');


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
    this.buttonConfirm = page.getByRole('button', { name: 'ยืนยัน' })
    // ใน constructor หรือที่รับค่า
    this.getConfirmUserLocator = (username) => page.getByText(`ต้องการสร้างผู้ใช้ "${username}"`);
    this.getUserFirstPassword = (username) => page.getByText(`รหัสผ่านชั่วคราวสำหรับผู้ใช้ "${username}"`);
    this.roleDropdown = page.locator('#role').getByRole('combobox');
    this.dealerDropdown = page.locator('#default_dealer_id').getByRole('combobox');
    this.branchDropdown = page.locator('#default_branch_id').getByRole('combobox');
    this.saveButton = page.getByRole('button', { name: 'บันทึก' });
    this.passwordCodeLocator = page.locator("//*[text()=' คัดลอก ']/../code");
    this.buttonFinish = page.getByRole('button', { name: 'เสร็จสิ้น' })
    
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

// page/addUser.page.js

// 3. เลือกตัวเลือกใน Dropdown เฉพาะที่มีการระบุมา
if (userData.role !== undefined) {
  await this.roleDropdown.click();
  // ใช้ getByRole('option') ภายใน 'Options List' แทนการค้นหา generic text
  await this.page.getByRole('listbox', { name: 'Options List' })
    .getByRole('option', { name: userData.role, exact: true })
    .click();
}

if (userData.dealer !== undefined) {
  await this.dealerDropdown.click();
  await this.page.getByRole('listbox', { name: 'Options List' })
    .getByRole('option', { name: userData.dealer, exact: true })
    .click();
}

if (userData.branch !== undefined) {
  await this.branchDropdown.click();
  // แก้ไขบรรทัดที่ 82: ระบุ target ไปที่ option ใน listbox โดยตรง
  await this.page.getByRole('listbox', { name: 'Options List' })
    .getByRole('option', { name: userData.branch, exact: true })
    .click();
}

    // 4. บันทึกข้อมูล
    await takeScreenshotCommon(this.page,userData.basePath,userData.caseNo,'add_user');
    await this.saveButton.click();
    //ตรวจชื่อผู้ใช้หน้าเพิ่มผู้ใช้
    await this.getConfirmUserLocator(userData.username).waitFor();
    await expect(this.getConfirmUserLocator(userData.username)).toBeVisible();
    await takeScreenshotCommon(this.page,userData.basePath,userData.caseNo,'confirm_add_user');
    await this.buttonConfirm.click();
    //ตรวจชื่อผู้ใช้หน้า first password
    await this.getUserFirstPassword(userData.username).waitFor();
    await expect(this.getUserFirstPassword(userData.username)).toBeVisible();
    //get first password and put first password to google sheet
    const customCode = await this.passwordCodeLocator.textContent();
    await updateUserRow(DATA_GLOBAL.SHEET_ID,DATA_GLOBAL.SHEET_NAME_ADD_USER,userData.username,{SystemPassword: customCode?.trim()});
    await takeScreenshotCommon(this.page,userData.basePath,userData.caseNo,'first_password');
    await this.buttonFinish.click();
  }
}

module.exports = { AddUserPage };