const { LoginPage } = require("./login.page");
const { NavigationPage } = require("./selectMenu.page");
const { getTestData } = require("../helpers/googleSheet");
const { DATA_GLOBAL } = require("../helpers/dataGlobal");
const { updateUserRow } = require("../helpers/writeGoogleSheet");
const { getDateTimeString } = require("../helpers/getDateTimeString");
const { clearDirectory } = require("../helpers/clearDirectory");
const { AddUserPage } = require("./addUser.page");
const { AllInvoicePage } = require("./allInvoice.page");
const { MainTRCloud } = require("./mainTRCloud.page");
class CommonFunction {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * จัดกลุ่มฟังก์ชันสำหรับการนำเข้าและตรวจสอบข้อมูลบนระบบ TRCloud
   * @param {Object} datas - ข้อมูล test data ที่ใช้ในการรัน
   */
  async groupFunctionTRCloud(rowUserLink, rowCase) {
    const sheetID = DATA_GLOBAL.SHEET_ID;
    const sheetNameLogin = DATA_GLOBAL.SHEET_NAME_LOGIN;
    const sheetNameAddUser = DATA_GLOBAL.SHEET_NAME_ADD_USER;
    const pathCap = DATA_GLOBAL.PATH_CAP_TRCLOUD;
    const sheetNameHeadAllInvoice = DATA_GLOBAL.SHEET_NAME_TRC_HEAD_ALL_INVOICE;
    const rowsSheetLogin = await getTestData(sheetNameLogin);
    const rowsSheetAddUser = await getTestData(sheetNameAddUser);
    const rowsSheetTrcHeadAllInvoice = await getTestData(
      sheetNameHeadAllInvoice,
    );
    const sheetTrcHeadAllInvoiceRow = await rowsSheetTrcHeadAllInvoice[rowCase];
    const loginPage = new LoginPage(this.page);
    const navigationPage = new NavigationPage(this.page);
    const mainTRCloud = new MainTRCloud(this.page);
    const timeString = await getDateTimeString();
    const addUserPage = new AddUserPage(this.page);
    const allInvoicePage = new AllInvoicePage(this.page);
    await clearDirectory(`${pathCap}/${sheetTrcHeadAllInvoiceRow.Case}`);
    await clearDirectory(
      `${pathCap}/${sheetTrcHeadAllInvoiceRow.Case}/invoice_number_head`,
    );
    await clearDirectory(
      `${pathCap}/${sheetTrcHeadAllInvoiceRow.Case}/invoice_number_detail`,
    );
    await loginPage.goto(rowsSheetLogin[rowUserLink].Link);
    await loginPage.login(
      rowsSheetLogin[rowUserLink].User,
      rowsSheetLogin[rowUserLink].Password,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await navigationPage.selectMenu(
      sheetTrcHeadAllInvoiceRow.Menu,
      sheetTrcHeadAllInvoiceRow.SubMenu,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await navigationPage.selectTransmissionStatusTRCloud(
      sheetTrcHeadAllInvoiceRow.TransmissionStatus,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await mainTRCloud.searchByDate(
      sheetTrcHeadAllInvoiceRow.Day,
      sheetTrcHeadAllInvoiceRow.Month,
      sheetTrcHeadAllInvoiceRow.Year,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await navigationPage.clickDetailButtonAllInvoice(
      sheetTrcHeadAllInvoiceRow.Dealer,
      sheetTrcHeadAllInvoiceRow.Department,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await allInvoicePage.selectOptionCustom(
      `${DATA_GLOBAL.PER_PAGE}`,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await allInvoicePage.verifyHeadAllInvoice(
      {
        basePath: pathCap,
        caseNo: sheetTrcHeadAllInvoiceRow.Case,
        case: sheetTrcHeadAllInvoiceRow.Case,
        issue_date: sheetTrcHeadAllInvoiceRow.issue_date,
        company_format: sheetTrcHeadAllInvoiceRow.company_format,
        invoice_number: sheetTrcHeadAllInvoiceRow.invoice_number,
        reference: sheetTrcHeadAllInvoiceRow.reference,
        tax_option: sheetTrcHeadAllInvoiceRow.tax_option,
        contact_id: sheetTrcHeadAllInvoiceRow.contact_id,
        title: sheetTrcHeadAllInvoiceRow.title,
        name: sheetTrcHeadAllInvoiceRow.name,
        organization: sheetTrcHeadAllInvoiceRow.organization,
        branch: sheetTrcHeadAllInvoiceRow.branch,
        address: sheetTrcHeadAllInvoiceRow.address,
        email: sheetTrcHeadAllInvoiceRow.email,
        telephone: sheetTrcHeadAllInvoiceRow.telephone,
        tax_id: sheetTrcHeadAllInvoiceRow.tax_id,
        salesman: sheetTrcHeadAllInvoiceRow.salesman,
        department: sheetTrcHeadAllInvoiceRow.department,
        project: sheetTrcHeadAllInvoiceRow.project,
        warehouse: sheetTrcHeadAllInvoiceRow.warehouse,
        due_date: sheetTrcHeadAllInvoiceRow.due_date,
        type: sheetTrcHeadAllInvoiceRow.type,
        wht: sheetTrcHeadAllInvoiceRow.wht,
        tax_report: sheetTrcHeadAllInvoiceRow.tax_report,
        invoice_note: sheetTrcHeadAllInvoiceRow.invoice_note,
        c1: sheetTrcHeadAllInvoiceRow.c1,
      },
      DATA_GLOBAL.PER_PAGE,
    );
    await allInvoicePage.clickButtonDetail(
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await allInvoicePage.selectOptionCustom(
      `${DATA_GLOBAL.PER_PAGE}`,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await allInvoicePage.verifyDetailAllInvoice(
      {
        basePath: pathCap,
        caseNo: sheetTrcHeadAllInvoiceRow.Case,
        invoice_number: sheetTrcHeadAllInvoiceRow.invoice_number,
        OPR_company_format: sheetTrcHeadAllInvoiceRow.OPR_company_format,
        OPR_product_id: sheetTrcHeadAllInvoiceRow.OPR_product_id,
        OPR_description: sheetTrcHeadAllInvoiceRow.OPR_description,
        OPR_quantity: sheetTrcHeadAllInvoiceRow.OPR_quantity,
        OPR_amount: sheetTrcHeadAllInvoiceRow.OPR_amount,
        OPR_customer_extra_discount:
          sheetTrcHeadAllInvoiceRow.OPR_customer_extra_discount,
        OPR_amount_before_vat: sheetTrcHeadAllInvoiceRow.OPR_amount_before_vat,
        OPR_vat: sheetTrcHeadAllInvoiceRow.OPR_vat,
        OPR_vat_percentage: sheetTrcHeadAllInvoiceRow.OPR_vat_percentage,
        OPR_total: sheetTrcHeadAllInvoiceRow.OPR_total,
        OPR_lot: sheetTrcHeadAllInvoiceRow.OPR_lot,
        OPR_anchor: sheetTrcHeadAllInvoiceRow.OPR_anchor,
        PRT_P_company_format: sheetTrcHeadAllInvoiceRow.PRT_P_company_format,
        PRT_P_product_id: sheetTrcHeadAllInvoiceRow.PRT_P_product_id,
        PRT_P_description: sheetTrcHeadAllInvoiceRow.PRT_P_description,
        PRT_P_quantity: sheetTrcHeadAllInvoiceRow.PRT_P_quantity,
        PRT_P_amount: sheetTrcHeadAllInvoiceRow.PRT_P_amount,
        PRT_P_customer_extra_discount:
          sheetTrcHeadAllInvoiceRow.PRT_P_customer_extra_discount,
        PRT_P_amount_before_vat:
          sheetTrcHeadAllInvoiceRow.PRT_P_amount_before_vat,
        PRT_P_vat: sheetTrcHeadAllInvoiceRow.PRT_P_vat,
        PRT_P_vat_percentage: sheetTrcHeadAllInvoiceRow.PRT_P_vat_percentage,
        PRT_P_total: sheetTrcHeadAllInvoiceRow.PRT_P_total,
        PRT_P_lot: sheetTrcHeadAllInvoiceRow.PRT_P_lot,
        PRT_P_anchor: sheetTrcHeadAllInvoiceRow.PRT_P_anchor,
        PRT_O_company_format: sheetTrcHeadAllInvoiceRow.PRT_O_company_format,
        PRT_O_product_id: sheetTrcHeadAllInvoiceRow.PRT_O_product_id,
        PRT_O_description: sheetTrcHeadAllInvoiceRow.PRT_O_description,
        PRT_O_quantity: sheetTrcHeadAllInvoiceRow.PRT_O_quantity,
        PRT_O_amount: sheetTrcHeadAllInvoiceRow.PRT_O_amount,
        PRT_O_customer_extra_discount:
          sheetTrcHeadAllInvoiceRow.PRT_O_customer_extra_discount,
        PRT_O_amount_before_vat:
          sheetTrcHeadAllInvoiceRow.PRT_O_amount_before_vat,
        PRT_O_vat: sheetTrcHeadAllInvoiceRow.PRT_O_vat,
        PRT_O_vat_percentage: sheetTrcHeadAllInvoiceRow.PRT_O_vat_percentage,
        PRT_O_total: sheetTrcHeadAllInvoiceRow.PRT_O_total,
        PRT_O_lot: sheetTrcHeadAllInvoiceRow.PRT_O_lot,
        PRT_O_anchor: sheetTrcHeadAllInvoiceRow.PRT_O_anchor,
        OUT_company_format: sheetTrcHeadAllInvoiceRow.OUT_company_format,
        OUT_product_id: sheetTrcHeadAllInvoiceRow.OUT_product_id,
        OUT_description: sheetTrcHeadAllInvoiceRow.OUT_description,
        OUT_quantity: sheetTrcHeadAllInvoiceRow.OUT_quantity,
        OUT_amount: sheetTrcHeadAllInvoiceRow.OUT_amount,
        OUT_customer_extra_discount:
          sheetTrcHeadAllInvoiceRow.OUT_customer_extra_discount,
        OUT_amount_before_vat: sheetTrcHeadAllInvoiceRow.OUT_amount_before_vat,
        OUT_vat: sheetTrcHeadAllInvoiceRow.OUT_vat,
        OUT_vat_percentage: sheetTrcHeadAllInvoiceRow.OUT_vat_percentage,
        OUT_total: sheetTrcHeadAllInvoiceRow.OUT_total,
        OUT_lot: sheetTrcHeadAllInvoiceRow.OUT_lot,
        OUT_anchor: sheetTrcHeadAllInvoiceRow.OUT_anchor,
      },
      DATA_GLOBAL.PER_PAGE,
    );
  }

  async groupFunctionTRCloudOneInvoice(rowUserLink, rowCase) {
    const sheetID = DATA_GLOBAL.SHEET_ID;
    const sheetNameLogin = DATA_GLOBAL.SHEET_NAME_LOGIN;
    const sheetNameAddUser = DATA_GLOBAL.SHEET_NAME_ADD_USER;
    const pathCap = DATA_GLOBAL.PATH_CAP_TRCLOUD_ONE_INVOICE;
    const sheetNameHeadAllInvoice = DATA_GLOBAL.SHEET_NAME_TRC_HEAD_ALL_INVOICE;
    const rowsSheetLogin = await getTestData(sheetNameLogin);
    const rowsSheetAddUser = await getTestData(sheetNameAddUser);
    const rowsSheetTrcHeadAllInvoice = await getTestData(
      sheetNameHeadAllInvoice,
    );
    const sheetTrcHeadAllInvoiceRow = await rowsSheetTrcHeadAllInvoice[rowCase];
    const loginPage = new LoginPage(this.page);
    const navigationPage = new NavigationPage(this.page);
    const mainTRCloud = new MainTRCloud(this.page);
    const timeString = await getDateTimeString();
    const addUserPage = new AddUserPage(this.page);
    const allInvoicePage = new AllInvoicePage(this.page);
    await clearDirectory(`${pathCap}/${sheetTrcHeadAllInvoiceRow.Case}`);
    await clearDirectory(
      `${pathCap}/${sheetTrcHeadAllInvoiceRow.Case}/invoice_number_head`,
    );
    await clearDirectory(
      `${pathCap}/${sheetTrcHeadAllInvoiceRow.Case}/invoice_number_detail`,
    );
    await loginPage.goto(rowsSheetLogin[rowUserLink].Link);
    await loginPage.login(
      rowsSheetLogin[rowUserLink].User,
      rowsSheetLogin[rowUserLink].Password,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await navigationPage.selectMenu(
      sheetTrcHeadAllInvoiceRow.Menu,
      sheetTrcHeadAllInvoiceRow.SubMenu,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await navigationPage.selectTransmissionStatusTRCloud(
      sheetTrcHeadAllInvoiceRow.TransmissionStatus,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await mainTRCloud.searchByDate(
      sheetTrcHeadAllInvoiceRow.Day,
      sheetTrcHeadAllInvoiceRow.Month,
      sheetTrcHeadAllInvoiceRow.Year,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    await navigationPage.clickButtonViewDetail(
      sheetTrcHeadAllInvoiceRow.Dealer,
      sheetTrcHeadAllInvoiceRow.Department,
      pathCap,
      sheetTrcHeadAllInvoiceRow.Case,
    );
    // await allInvoicePage.selectOptionCustom(
    //   `${DATA_GLOBAL.PER_PAGE}`,
    //   pathCap,
    //   sheetTrcHeadAllInvoiceRow.Case,
    // );
    // await allInvoicePage.verifyHeadAllInvoice(
    //   {
    //     basePath: pathCap,
    //     caseNo: sheetTrcHeadAllInvoiceRow.Case,
    //     case: sheetTrcHeadAllInvoiceRow.Case,
    //     issue_date: sheetTrcHeadAllInvoiceRow.issue_date,
    //     company_format: sheetTrcHeadAllInvoiceRow.company_format,
    //     invoice_number: sheetTrcHeadAllInvoiceRow.invoice_number,
    //     reference: sheetTrcHeadAllInvoiceRow.reference,
    //     tax_option: sheetTrcHeadAllInvoiceRow.tax_option,
    //     contact_id: sheetTrcHeadAllInvoiceRow.contact_id,
    //     title: sheetTrcHeadAllInvoiceRow.title,
    //     name: sheetTrcHeadAllInvoiceRow.name,
    //     organization: sheetTrcHeadAllInvoiceRow.organization,
    //     branch: sheetTrcHeadAllInvoiceRow.branch,
    //     address: sheetTrcHeadAllInvoiceRow.address,
    //     email: sheetTrcHeadAllInvoiceRow.email,
    //     telephone: sheetTrcHeadAllInvoiceRow.telephone,
    //     tax_id: sheetTrcHeadAllInvoiceRow.tax_id,
    //     salesman: sheetTrcHeadAllInvoiceRow.salesman,
    //     department: sheetTrcHeadAllInvoiceRow.department,
    //     project: sheetTrcHeadAllInvoiceRow.project,
    //     warehouse: sheetTrcHeadAllInvoiceRow.warehouse,
    //     due_date: sheetTrcHeadAllInvoiceRow.due_date,
    //     type: sheetTrcHeadAllInvoiceRow.type,
    //     wht: sheetTrcHeadAllInvoiceRow.wht,
    //     tax_report: sheetTrcHeadAllInvoiceRow.tax_report,
    //     invoice_note: sheetTrcHeadAllInvoiceRow.invoice_note,
    //     c1: sheetTrcHeadAllInvoiceRow.c1,
    //   },
    //   DATA_GLOBAL.PER_PAGE,
    // );
    // await allInvoicePage.clickButtonDetail(
    //   pathCap,
    //   sheetTrcHeadAllInvoiceRow.Case,
    // );
    // await allInvoicePage.selectOptionCustom(
    //   `${DATA_GLOBAL.PER_PAGE}`,
    //   pathCap,
    //   sheetTrcHeadAllInvoiceRow.Case,
    // );
    // await allInvoicePage.verifyDetailAllInvoice(
    //   {
    //     basePath: pathCap,
    //     caseNo: sheetTrcHeadAllInvoiceRow.Case,
    //     invoice_number: sheetTrcHeadAllInvoiceRow.invoice_number,
    //     OPR_company_format: sheetTrcHeadAllInvoiceRow.OPR_company_format,
    //     OPR_product_id: sheetTrcHeadAllInvoiceRow.OPR_product_id,
    //     OPR_description: sheetTrcHeadAllInvoiceRow.OPR_description,
    //     OPR_quantity: sheetTrcHeadAllInvoiceRow.OPR_quantity,
    //     OPR_amount: sheetTrcHeadAllInvoiceRow.OPR_amount,
    //     OPR_customer_extra_discount:
    //       sheetTrcHeadAllInvoiceRow.OPR_customer_extra_discount,
    //     OPR_amount_before_vat: sheetTrcHeadAllInvoiceRow.OPR_amount_before_vat,
    //     OPR_vat: sheetTrcHeadAllInvoiceRow.OPR_vat,
    //     OPR_vat_percentage: sheetTrcHeadAllInvoiceRow.OPR_vat_percentage,
    //     OPR_total: sheetTrcHeadAllInvoiceRow.OPR_total,
    //     OPR_lot: sheetTrcHeadAllInvoiceRow.OPR_lot,
    //     OPR_anchor: sheetTrcHeadAllInvoiceRow.OPR_anchor,
    //     PRT_P_company_format: sheetTrcHeadAllInvoiceRow.PRT_P_company_format,
    //     PRT_P_product_id: sheetTrcHeadAllInvoiceRow.PRT_P_product_id,
    //     PRT_P_description: sheetTrcHeadAllInvoiceRow.PRT_P_description,
    //     PRT_P_quantity: sheetTrcHeadAllInvoiceRow.PRT_P_quantity,
    //     PRT_P_amount: sheetTrcHeadAllInvoiceRow.PRT_P_amount,
    //     PRT_P_customer_extra_discount:
    //       sheetTrcHeadAllInvoiceRow.PRT_P_customer_extra_discount,
    //     PRT_P_amount_before_vat:
    //       sheetTrcHeadAllInvoiceRow.PRT_P_amount_before_vat,
    //     PRT_P_vat: sheetTrcHeadAllInvoiceRow.PRT_P_vat,
    //     PRT_P_vat_percentage: sheetTrcHeadAllInvoiceRow.PRT_P_vat_percentage,
    //     PRT_P_total: sheetTrcHeadAllInvoiceRow.PRT_P_total,
    //     PRT_P_lot: sheetTrcHeadAllInvoiceRow.PRT_P_lot,
    //     PRT_P_anchor: sheetTrcHeadAllInvoiceRow.PRT_P_anchor,
    //     PRT_O_company_format: sheetTrcHeadAllInvoiceRow.PRT_O_company_format,
    //     PRT_O_product_id: sheetTrcHeadAllInvoiceRow.PRT_O_product_id,
    //     PRT_O_description: sheetTrcHeadAllInvoiceRow.PRT_O_description,
    //     PRT_O_quantity: sheetTrcHeadAllInvoiceRow.PRT_O_quantity,
    //     PRT_O_amount: sheetTrcHeadAllInvoiceRow.PRT_O_amount,
    //     PRT_O_customer_extra_discount:
    //       sheetTrcHeadAllInvoiceRow.PRT_O_customer_extra_discount,
    //     PRT_O_amount_before_vat:
    //       sheetTrcHeadAllInvoiceRow.PRT_O_amount_before_vat,
    //     PRT_O_vat: sheetTrcHeadAllInvoiceRow.PRT_O_vat,
    //     PRT_O_vat_percentage: sheetTrcHeadAllInvoiceRow.PRT_O_vat_percentage,
    //     PRT_O_total: sheetTrcHeadAllInvoiceRow.PRT_O_total,
    //     PRT_O_lot: sheetTrcHeadAllInvoiceRow.PRT_O_lot,
    //     PRT_O_anchor: sheetTrcHeadAllInvoiceRow.PRT_O_anchor,
    //     OUT_company_format: sheetTrcHeadAllInvoiceRow.OUT_company_format,
    //     OUT_product_id: sheetTrcHeadAllInvoiceRow.OUT_product_id,
    //     OUT_description: sheetTrcHeadAllInvoiceRow.OUT_description,
    //     OUT_quantity: sheetTrcHeadAllInvoiceRow.OUT_quantity,
    //     OUT_amount: sheetTrcHeadAllInvoiceRow.OUT_amount,
    //     OUT_customer_extra_discount:
    //       sheetTrcHeadAllInvoiceRow.OUT_customer_extra_discount,
    //     OUT_amount_before_vat: sheetTrcHeadAllInvoiceRow.OUT_amount_before_vat,
    //     OUT_vat: sheetTrcHeadAllInvoiceRow.OUT_vat,
    //     OUT_vat_percentage: sheetTrcHeadAllInvoiceRow.OUT_vat_percentage,
    //     OUT_total: sheetTrcHeadAllInvoiceRow.OUT_total,
    //     OUT_lot: sheetTrcHeadAllInvoiceRow.OUT_lot,
    //     OUT_anchor: sheetTrcHeadAllInvoiceRow.OUT_anchor,
    //   },
    //   DATA_GLOBAL.PER_PAGE,
    // );
  }
}

module.exports = { CommonFunction };
