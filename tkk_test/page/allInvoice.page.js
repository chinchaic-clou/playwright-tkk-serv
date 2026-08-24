// page/allInvoice.page.js
const { expect } = require("@playwright/test");
const {
  takeScreenshotFull,
  takeScreenshotCommon,
  takeScreenshotFocus,
} = require("../helpers/takeScreenshot");
const { updateUserRow } = require("../helpers/writeGoogleSheet");
const { DATA_GLOBAL } = require("../helpers/dataGlobal");
class AllInvoicePage {
  constructor(page) {
    this.page = page;
    this.buttonNextPage = page.getByRole("button", { name: "Next page" });
  }

  /**
   * Custom select option สำหรับ combobox
   * @param {string} optionValue - ค่าหรือข้อความของ option ที่ต้องการเลือก (เช่น '100')
   * @param {import('@playwright/test').Locator} [customLocator] - locator ของ combobox (ถ้าไม่ส่งจะหา combobox ตัวแรก)
   */
  async selectOptionCustom(optionValue, basePath, caseNo) {
    const cleanOptionValue = optionValue?.trim() || "";
    await this.page.getByRole("combobox").selectOption(cleanOptionValue);
    // await this.page.waitForTimeout(5000);
    await takeScreenshotFull(this.page, basePath, caseNo, "per_page");
  }

  async verifyHeadAllInvoice(datas = {}) {
    // ทำความสะอาด String ใน Object
    const cleanDatas = Object.fromEntries(
      Object.entries(datas).map(([key, value]) => [key, value?.trim() || ""]),
    );
    const rowLocator = this.page.locator(
      `//td[normalize-space()='${cleanDatas.reference}']/..//td`,
    );
    const whereNextPage = this.page.locator(
      `//td[normalize-space()='${cleanDatas.reference}']/..`,
    );
    const length = await rowLocator.count();
    // console.log(`issue_date: ${cleanDatas.issue_date}`);
    // console.log(`rowLocator: ${rowLocator}`);
    // console.log(`Cell count: ${length}`);
    const columnKeys = [
      "issue_date",
      "company_format",
      "invoice_number",
      "reference",
      "tax_option",
      "contact_id",
      "title",
      "name",
      "organization",
      "branch",
      "address",
      "email",
      "telephone",
      "tax_id",
      "salesman",
      "department",
      "project",
      "warehouse",
      "due_date",
      "type",
      "wht",
      "tax_report",
      "invoice_note",
      "c1",
    ];
    // 1. ดึงข้อความสรุปจำนวนรายการ เช่น "Showing 1 to 20 of 250 entries"
    const statusText = await this.page
      .locator("text=/Showing .* of .*/")
      .innerText();

    // 2. ใช้ Regex ดึงตัวเลข "รายการทั้งหมด" (250) และ "จำนวนรายการต่อหน้า" (20)
    const totalEntriesMatch = statusText.match(/of\s+(\d+)/);
    const perPageMatch = statusText.match(/Showing\s+\d+\s+to\s+(\d+)/);

    const totalEntries = totalEntriesMatch ? parseInt(totalEntriesMatch[1]) : 0;
    const perPage = perPageMatch ? parseInt(perPageMatch[1]) : 20;

    // 3. คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(totalEntries / perPage);

    // console.log(`จำนวนรายการทั้งหมด: ${totalEntries}`);
    // console.log(`จำนวนหน้าทั้งหมด: ${totalPages} หน้า`);
    for (let i = 0; i < totalPages; i++) {
      const count = await rowLocator.count();
      if (count > 0) {
        for (let i = 0; i < columnKeys.length; i++) {
          const key = columnKeys[i];
          // ข้ามการตรวจเมื่อเจอ invoice_number
          const expectedValue = cleanDatas[key] ?? "";
          const cellTextTest = await rowLocator.nth(1).innerText();
          // console.log(`reference: ${cleanDatas[columnKeys[3]]}`);
          // console.log(`reference TKK: ${cellTextTest.trim()}`);

          // ดึงค่าจาก Cell (ข้าม index 0 ไป 1 กรณี Cell แรกสุดคือคอลัมน์ลำดับที่ #)
          // หากคอลัมน์เริ่มที่ index 0 ให้เปลี่ยนเป็น rowLocator.nth(i)
          const cellText = await rowLocator.nth(i + 1).innerText();
          const actualValue = cellText.trim();

          // Assert ตรวจสอบความถูกต้อง
          if (i === 0) {
            await takeScreenshotFocus(
              this.page,
              datas.basePath,
              `${datas.caseNo}/${columnKeys[2]}_head`,
              "no",
              rowLocator.nth(i),
            );
          }
          if (key === "invoice_number") {
            await updateUserRow(
              DATA_GLOBAL.SHEET_ID,
              DATA_GLOBAL.SHEET_NAME_TRC_HEAD_ALL_INVOICE,
              "Case",
              cleanDatas.case,
              { invoice_number: actualValue },
            );
            continue;
          }
          expect(actualValue).toBe(expectedValue);
          await takeScreenshotFocus(
            this.page,
            datas.basePath,
            `${datas.caseNo}/${columnKeys[2]}_head`,
            key,
            rowLocator.nth(i + 1),
          );
        }
        break;
      } else {
        await this.buttonNextPage.click();
        await takeScreenshotFull(
          this.page,
          datas.basePath,
          datas.caseNo,
          "next_page",
        );
      }
    }
  }
}

module.exports = { AllInvoicePage };
