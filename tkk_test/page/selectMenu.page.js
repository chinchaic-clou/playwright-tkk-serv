// page/navigation.page.js
const { expect } = require("@playwright/test");
const {
  takeScreenshotFull,
  takeScreenshotCommon,
} = require("../helpers/takeScreenshot");

class NavigationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.mainTkkText = page.getByRole("link", {
      name: "TKK SERV SERVICE EXCELLENCE",
    });
  }

  /**
   * ฟังก์ชันเลือกเมนูแบบ Custom ตามเงื่อนไข subMenu
   * @param {string} mainMenu - ชื่อเมนูหลัก (เช่น 'จัดการผู้ใช้งาน')
   * @param {string} [subMenu] - ชื่อเมนูย่อย (เช่น 'ผู้ใช้งาน' หรือ 'นำเข้ารายวัน' หรือใส่ undefined กรณีไม่มีเมนูย่อยย่อยลงไปอีกระดับ)
   */
  async selectMenu(mainMenu, subMenu, basePath, caseNo) {
    if (subMenu) {
      // กรณี sub_menu != undefined: คลิกเมนูหลัก -> คลิกเมนูย่อยระดับแรก
      await this.page
        .getByText(mainMenu, { exact: true })
        .first()
        .click({ force: true });
      await this.page
        .getByRole("link", { name: subMenu, exact: true })
        .first()
        .click();
      await takeScreenshotFull(this.page, basePath, caseNo, "select_menu");
    } else {
      // กรณี sub_menu = undefined: คลิกเลือกเมนูย่อยตามที่ระบุ
      await this.page.getByRole("link", { name: mainMenu }).first().click();
      await takeScreenshotFull(this.page, basePath, caseNo, "select_menu");
    }
  }
  // page/navigation.page.js

  async selectTransmissionStatusTRCloud(mainMenu, basePath, caseNo) {
    // เปลี่ยนจาก getByRole("link") เป็น getByRole("button")
    await this.page
      .getByRole("button", { name: mainMenu, exact: true })
      .click();
    await takeScreenshotFull(
      this.page,
      basePath,
      caseNo,
      "select_transmission_status",
    );
  }

  /**
   * คลิกปุ่ม "ดูข้อมูล" ตามชื่อดีลเลอร์และแผนกที่ระบุ
   * @param {string} dealerName - ชื่อดีลเลอร์ (เช่น 'โตโยต้าขอนแก่น')
   * @param {string} department - ชื่อแผนก (เช่น 'GS')
   */
  async clickDetailButtonAllInvoice(dealerName, department, basePath, caseNo) {
    const cleanDealer = dealerName?.trim() || "";
    const cleanDept = department?.trim() || "";

    // ใช้ normalize-space() เพื่อจัดการช่องว่างทั้งใน XPath และข้อมูลที่ส่งเข้ามา
    const rowLocator = this.page.locator(
      `//td[normalize-space()='${cleanDealer}']/..//td[normalize-space()='${cleanDept}']/..//button[normalize-space()='ดูข้อมูล']`,
    );

    // รอดำเนินการคลิกปุ่มแรกที่พบ
    await rowLocator.first().click();
    await takeScreenshotFull(this.page, basePath, caseNo, "detail_all_invoice");
    
  }
}

module.exports = { NavigationPage };
