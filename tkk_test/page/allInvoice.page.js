// page/allInvoice.page.js
const { expect } = require("@playwright/test");
const {
  takeScreenshotFull,
  takeScreenshotCommon,
  takeScreenshotFocus,
} = require("../helpers/takeScreenshot");
const { updateUserRow } = require("../helpers/writeGoogleSheet");
const { DATA_GLOBAL } = require("../helpers/dataGlobal");
const { log } = require("node:console");
class AllInvoicePage {
  constructor(page) {
    this.page = page;
    this.buttonNextPage = page.getByRole("button", { name: "Next page" });
    this.buttonHead = page.getByRole("button", { name: "ส่วนหัว" });
    this.buttonDetail = page.getByRole("button", { name: "ส่วนรายละเอียด" });
  }

  /**
   * Custom select option สำหรับ combobox
   * @param {string} optionValue - ค่าหรือข้อความของ option ที่ต้องการเลือก (เช่น '100')
   * @param {import('@playwright/test').Locator} [customLocator] - locator ของ combobox (ถ้าไม่ส่งจะหา combobox ตัวแรก)
   */
  async selectOptionCustom(optionValue, basePath, caseNo) {
    const cleanOptionValue = optionValue?.trim() || "";
    await this.page.getByRole("combobox").selectOption(cleanOptionValue);
    await takeScreenshotFull(this.page, basePath, caseNo, "per_page");
  }

  async verifyHeadAllInvoice(datas = {}, per_page) {
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
    const perPage = perPageMatch ? parseInt(perPageMatch[1]) : per_page;

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
        await this.clickNextPage(datas.basePath, datas.caseNo);
      }
    }
  }

  async clickButtonHead(basePath, caseNo) {
    this.buttonHead.click();
    await takeScreenshotFull(this.page, basePath, caseNo, "head");
  }

  async clickButtonDetail(basePath, caseNo) {
    this.buttonDetail.click();
    await takeScreenshotFull(this.page, basePath, caseNo, "deatail");
  }

  async verifyDetailAllInvoice(datas = {}, per_page) {
    // ทำความสะอาด String ใน Object
    const cleanDatas = Object.fromEntries(
      Object.entries(datas).map(([key, value]) => [key, value?.trim() || ""]),
    );
    const rowLocator = this.page.locator(
      `//td[normalize-space()='${cleanDatas.invoice_number}']/..//td`,
    );
    const whereNextPage = this.page.locator(
      `//td[normalize-space()='${cleanDatas.invoice_number}']/..`,
    );
    const lengthRowLocator = await rowLocator.count();
    const lengthWhereNextPage = await whereNextPage.count();
    // console.log(`issue_date: ${cleanDatas.issue_date}`);
    // console.log(`rowLocator: ${rowLocator}`);
    const columnOPRKeys = [
      "OPR_company_format",
      "invoice_number",
      "OPR_product_id",
      "OPR_description",
      "OPR_quantity",
      "OPR_amount",
      "OPR_customer_extra_discount",
      "OPR_amount_before_vat",
      "OPR_vat",
      "OPR_vat_percentage",
      "OPR_total",
      "OPR_lot",
      "OPR_anchor",
    ];
    const columnPRTPKeys = [
      "PRT_P_company_format",
      "invoice_number",
      "PRT_P_product_id",
      "PRT_P_description",
      "PRT_P_quantity",
      "PRT_P_amount",
      "PRT_P_customer_extra_discount",
      "PRT_P_amount_before_vat",
      "PRT_P_vat",
      "PRT_P_vat_percentage",
      "PRT_P_total",
      "PRT_P_lot",
      "PRT_P_anchor",
    ];
    const columnPRTOKeys = [
      "PRT_O_company_format",
      "invoice_number",
      "PRT_O_product_id",
      "PRT_O_description",
      "PRT_O_quantity",
      "PRT_O_amount",
      "PRT_O_customer_extra_discount",
      "PRT_O_amount_before_vat",
      "PRT_O_vat",
      "PRT_O_vat_percentage",
      "PRT_O_total",
      "PRT_O_lot",
      "PRT_O_anchor",
    ];
    const columnOUTKeys = [
      "OUT_company_format",
      "invoice_number",
      "OUT_product_id",
      "OUT_description",
      "OUT_quantity",
      "OUT_amount",
      "OUT_customer_extra_discount",
      "OUT_amount_before_vat",
      "OUT_vat",
      "OUT_vat_percentage",
      "OUT_total",
      "OUT_lot",
      "OUT_anchor",
    ];
    // 1. ดึงข้อความสรุปจำนวนรายการ เช่น "Showing 1 to 20 of 250 entries"
    const statusText = await this.page
      .locator("text=/Showing .* of .*/")
      .innerText();

    // 2. ใช้ Regex ดึงตัวเลข "รายการทั้งหมด" (250) และ "จำนวนรายการต่อหน้า" (20)
    const totalEntriesMatch = statusText.match(/of\s+(\d+)/);
    const perPageMatch = statusText.match(/Showing\s+\d+\s+to\s+(\d+)/);

    const totalEntries = totalEntriesMatch ? parseInt(totalEntriesMatch[1]) : 0;
    const perPage = perPageMatch ? parseInt(perPageMatch[1]) : per_page;

    // 3. คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(totalEntries / perPage);

    // console.log(`จำนวนรายการทั้งหมด: ${totalEntries}`);
    // console.log(`จำนวนหน้าทั้งหมด: ${totalPages} หน้า`);
    // 1. กำหนด List รายชื่อ Keys ที่ต้องการตรวจสอบ
    // 1. รวมคีย์ที่ต้องการเช็กไว้ใน Array
    const keys = [
      "OPR_product_id",
      "PRT_P_product_id",
      "PRT_O_product_id",
      "OUT_product_id",
    ];
    let countData = 0;
    // 2. วนลูปเช็กว่าคีย์ไหนมีค่าบ้าง (ไม่เป็นค่าว่าง, null, undefined)
    for (const key of keys) {
      const value = datas[key];
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        countData++;
      }
    }
    // console.log(`เจอทั้งหมด: ${count} ตัว`);

    for (let i = 0; i < totalPages; i++) {
      const count = await whereNextPage.count();
      if (count > 0) {
        if (count === countData) {
          // const count = await whereNextPage.count();
          // console.log(`เท่ากันจ้าาาา`);
          // console.log(`count_invoice: ${count}`);
          let j = 0;
          for (let i = 0; i < countData; i++) {
            const isFound = await this.checkDetail(
              datas[keys[j]],
              datas,
              columnOPRKeys,
              columnPRTPKeys,
              columnPRTOKeys,
              columnOUTKeys,
            );
            j++;
            if (!isFound) {
              // กรณีคืนค่า false (ตกเงื่อนไข else)
              await this.checkDetail(
                datas[keys[j]],
                datas,
                columnOPRKeys,
                columnPRTPKeys,
                columnPRTOKeys,
                columnOUTKeys,
              );
              j++;
            }
            // Logic เพิ่มเติมกรณีพบข้อมูล (isFound === true)
          }
          break;
        } else {
          // console.log(`ไม่เท่ากันจ้าาาา`);
          let j = 0;
          for (let i = 0; i < await whereNextPage.count(); i++) {
            const isFound = await this.checkDetail(
              datas[keys[j]],
              datas,
              columnOPRKeys,
              columnPRTPKeys,
              columnPRTOKeys,
              columnOUTKeys,
            );
            j++;
            if (!isFound) {
              // กรณีคืนค่า false (ตกเงื่อนไข else)
              await this.checkDetail(
                datas[keys[j]],
                datas,
                columnOPRKeys,
                columnPRTPKeys,
                columnPRTOKeys,
                columnOUTKeys,
              );
              j++;
            }
            // Logic เพิ่มเติมกรณีพบข้อมูล (isFound === true)
          }
          await this.clickNextPage(datas.basePath, datas.caseNo);
          for (let i = 0; i < await whereNextPage.count(); i++) {
            const isFound = await this.checkDetail(
              datas[keys[j]],
              datas,
              columnOPRKeys,
              columnPRTPKeys,
              columnPRTOKeys,
              columnOUTKeys,
            );
            j++;
            if (!isFound) {
              // กรณีคืนค่า false (ตกเงื่อนไข else)
              await this.checkDetail(
                datas[keys[j]],
                datas,
                columnOPRKeys,
                columnPRTPKeys,
                columnPRTOKeys,
                columnOUTKeys,
              );
              j++;
            }
            // Logic เพิ่มเติมกรณีพบข้อมูล (isFound === true)
          }
          break;
        }
      } else {
        await this.clickNextPage(datas.basePath, datas.caseNo);
      }
    }
  }

  async clickNextPage(basePath, caseNo) {
    await this.buttonNextPage.click();
    await takeScreenshotFull(this.page, basePath, caseNo, "next_page");
  }

  async checkDetail(
    checkData,
    datas,
    columnOPRKeys,
    columnPRTPKeys,
    columnPRTOKeys,
    columnOUTKeys,
  ) {
    const code = checkData ? String(checkData).trim() : "";

    switch (code) {
      case "4201301-00":
        // console.log("***พบข้อมูลใน ค่าแรง***:");
        await this.loopCheckDetail(columnOPRKeys, datas);
        return true;

      case "4201101-00":
        // console.log("***พบข้อมูลใน อะไหล่***:");
        await this.loopCheckDetail(columnPRTPKeys, datas);
        return true;

      case "4201102-00":
        // console.log("***พบข้อมูลใน น้ำมัน***:");
        await this.loopCheckDetail(columnPRTOKeys, datas);
        return true;

      case "4201201-00":
        // console.log("***พบข้อมูลใน งานนอก***:");
        await this.loopCheckDetail(columnOUTKeys, datas);
        return true;

      case "4101155-00":
        // console.log("***รายได้จากการขาย-อะไหล่หน้าร้าน (Parts)***:");
        await this.loopCheckDetail(columnOPRKeys, datas);
        return true;

      default:
        // console.log(`ไม่พบข้อมูลใน product_id: ${code}`);
        return false; // คืนค่า false เพื่อบอกว่าตกเงื่อนไข else
    }
  }

  async loopCheckDetail(columnKeys, datas) {
    // 1. ระบุตำแหน่ง <tr> แถวที่มีทั้ง เลขที่ใบแจ้งหนี้ และ รหัสสินค้า
    const targetRow = this.page
      .getByRole("row")
      .filter({
        has: this.page.getByRole("cell", {
          name: datas.invoice_number,
          exact: true,
        }),
      })
      .filter({
        has: this.page.getByRole("cell", {
          name: datas[columnKeys[2]],
          exact: true,
        }),
      });
    for (let i = 0; i < columnKeys.length; i++) {
      const key = columnKeys[i];
      // ข้ามการตรวจเมื่อเจอ invoice_number
      const cells = targetRow.getByRole("cell");
      const expectedValue = datas[key] ?? "";
      const cellText = await cells.nth(i + 1).innerText();
      const actualValue = cellText.trim();
      // console.log(`${columnKeys[i]}: ${actualValue}`);
      // Assert ตรวจสอบความถูกต้อง
      if (i === 0) {
        await takeScreenshotFocus(
          this.page,
          datas.basePath,
          `${datas.caseNo}/invoice_number_detail`,
          "no",
          cells.nth(i),
        );
      }
      // console.log(`${columnKeys[i]}: ${actualValue} == ${expectedValue}`);
      expect(actualValue).toBe(expectedValue);
      await takeScreenshotFocus(
        this.page,
        datas.basePath,
        `${datas.caseNo}/invoice_number_detail`,
        key,
        cells.nth(i + 1),
      );
    }
  }
}

module.exports = { AllInvoicePage };
