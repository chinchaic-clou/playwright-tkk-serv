const { expect } = require("@playwright/test");
const { takeScreenshotFull } = require("../helpers/takeScreenshot");

class MainTRCloud {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // 1. ระบุ Dialog เพื่อตีกรอบ Scope ให้เจาะจง
    this.datePickerDialog = page.getByRole("dialog", { name: "วันที่" });
    this.datePickerInput = page.getByRole("textbox", { name: "เลือกวันที่" });
    
    // 2. ดึง combobox ภายใน dialog (เดือน = ตัวแรก, ปี = ตัวที่สอง)
    this.monthCombobox = this.datePickerDialog.getByRole("combobox").nth(0);
    this.yearCombobox = this.datePickerDialog.getByRole("combobox").nth(1);
    this.searchButton = page.getByRole("button", { name: "ค้นหา" });
  }

  /**
   * ค้นหาข้อมูลตาม วัน/เดือน/ปี ที่ระบุ
   * @param {string|number} day - วันที่ (เช่น '20')
   * @param {string} monthName - ชื่อเดือนภาษาไทย (เช่น 'สิงหาคม')
   * @param {string|number} yearValue - ปี ค.ศ. (เช่น '2026')
   */
  async searchByDate(day, monthName, yearValue, basePath, caseNo) {
    await this.datePickerInput.click();

    // 3. ใช้ { label: monthName } เพื่อเลือกตามชื่อเดือนภาษาไทย
    await this.monthCombobox.selectOption(`${monthName}`);
    await this.yearCombobox.selectOption(`${yearValue}`);

    // 4. คลิกเลือกวันที่ภายใน dialog
    await this.datePickerDialog
      .getByRole("button", { name: String(day), exact: true })
      .click();

    await this.searchButton.click();
    await takeScreenshotFull(
      this.page,
      basePath,
      caseNo,
      "date",
    );
  }
}

module.exports = { MainTRCloud };