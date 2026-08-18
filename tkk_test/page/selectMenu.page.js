// page/navigation.page.js
const { expect } = require('@playwright/test');
const { takeScreenshotFull, takeScreenshotCommon } = require('../helpers/takeScreenshot');

class NavigationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.mainTkkText = page.getByRole('link', { name: 'TKK SERV SERVICE EXCELLENCE' });
  }

  /**
   * ฟังก์ชันเลือกเมนูแบบ Custom ตามเงื่อนไข subMenu
   * @param {string} mainMenu - ชื่อเมนูหลัก (เช่น 'จัดการผู้ใช้งาน')
   * @param {string} [subMenu] - ชื่อเมนูย่อย (เช่น 'ผู้ใช้งาน' หรือ 'นำเข้ารายวัน' หรือใส่ undefined กรณีไม่มีเมนูย่อยย่อยลงไปอีกระดับ)
   */
  async selectMenu(mainMenu, subMenu,basePath,caseNo) {
    if (subMenu !== undefined) {
      // กรณี sub_menu != undefined: คลิกเมนูหลัก -> คลิกเมนูย่อยระดับแรก
      await this.page.getByText(mainMenu,{ exact: true }).click({ force: true });
      await this.page.getByRole('link', { name: subMenu, exact: true }).click();
      await takeScreenshotFull(this.page,basePath,caseNo,'select_menu');
    } else {
      // กรณี sub_menu = undefined: คลิกเลือกเมนูย่อยตามที่ระบุ
      await this.page.getByRole('link', { name: mainMenu }).click();
      await takeScreenshotFull(this.page,basePath,caseNo,'select_menu');
    }
  }
}

module.exports = { NavigationPage };