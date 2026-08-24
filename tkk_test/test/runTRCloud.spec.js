import { test, expect } from "@playwright/test";
const { LoginPage } = require("../page/login.page");
const { NavigationPage } = require("../page/selectMenu.page");
const { getTestData, getValidRowsLength } = require("../helpers/googleSheet");
const { DATA_GLOBAL } = require("../helpers/dataGlobal");
const { updateUserRow } = require("../helpers/writeGoogleSheet");
const { getDateTimeString } = require("../helpers/getDateTimeString");
const { clearDirectory } = require("../helpers/clearDirectory");
const { AddUserPage } = require("../page/addUser.page");
const { AllInvoicePage } = require("../page/allInvoice.page");
const { MainTRCloud } = require("../page/mainTRCloud.page");

test("TC001", async ({ page }) => {
  test.setTimeout(150000);
  const sheetID = DATA_GLOBAL.SHEET_ID;
  const sheetNameLogin = DATA_GLOBAL.SHEET_NAME_LOGIN;
  const sheetNameAddUser = DATA_GLOBAL.SHEET_NAME_ADD_USER;
  const pathCap = DATA_GLOBAL.PATH_CAP_TRCLOUD;
  const sheetNameHeadAllInvoice = DATA_GLOBAL.SHEET_NAME_TRC_HEAD_ALL_INVOICE;
  const rowsSheetLogin = await getTestData(sheetNameLogin);
  const rowsSheetAddUser = await getTestData(sheetNameAddUser);
  const rowsSheetTrcHeadAllInvoice = await getTestData(sheetNameHeadAllInvoice);
  const sheetTrcHeadAllInvoiceRow = await rowsSheetTrcHeadAllInvoice[0];
  const loginPage = new LoginPage(page);
  const navigationPage = new NavigationPage(page);
  const mainTRCloud = new MainTRCloud(page);
  const timeString = await getDateTimeString();
  const addUserPage = new AddUserPage(page);
  const allInvoicePage = new AllInvoicePage(page);
  await clearDirectory(`${pathCap}/${sheetTrcHeadAllInvoiceRow.Case}`);
  await clearDirectory(
    `${pathCap}/${sheetTrcHeadAllInvoiceRow.Case}/invoice_number_head`,
  );

  await loginPage.goto(rowsSheetLogin[0].Link);
  await loginPage.login(
    rowsSheetLogin[0].User,
    rowsSheetLogin[0].Password,
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
  console.log(`Day: ${sheetTrcHeadAllInvoiceRow.Day}`);
  console.log(`Month: ${sheetTrcHeadAllInvoiceRow.Month}`);
  console.log(`Year: ${sheetTrcHeadAllInvoiceRow.Year}`);
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
    "20",
    pathCap,
    sheetTrcHeadAllInvoiceRow.Case,
  );
  await allInvoicePage.verifyHeadAllInvoice({
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
  });
});
