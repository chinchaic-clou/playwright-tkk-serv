import { test, expect } from '@playwright/test';
const { LoginPage } = require('../page/login.page');
const { NavigationPage } = require('../page/selectMenu.page');
const { getTestData} = require('../helpers/googleSheet');
const { DATA_GLOBAL } = require('../helpers/dataGlobal');
const { updateUserRow } = require('../helpers/writeGoogleSheet');
const { getDateTimeString } = require('../helpers/getDateTimeString');
const { clearDirectory } = require('../helpers/clearDirectory');
const { AddUserPage } = require('../page/addUser.page');

test('TC001', async ({ page }) => {
  const sheetID = DATA_GLOBAL.SHEET_ID;
  const sheetNameLogin = DATA_GLOBAL.SHEET_NAME_LOGIN;
  const sheetNameAddUser = DATA_GLOBAL.SHEET_NAME_ADD_USER;
  const pathCapAddUser = DATA_GLOBAL.PATH_CAP_ADD_USER;
  const rowsSheetLogin = await getTestData(sheetNameLogin);
  const rowsSheetAddUser = await getTestData(sheetNameAddUser);
  const loginPage = new LoginPage(page);
  const navigationPage = new NavigationPage(page);
  const timeString = await getDateTimeString();
  const pathCap = DATA_GLOBAL.PATH_CAP_ADD_USER;
  const addUserPage = new AddUserPage(page);
  clearDirectory(`${pathCap}/TC001`);


  await loginPage.goto(rowsSheetLogin[0].Link);
  await loginPage.login(rowsSheetLogin[0].User,rowsSheetLogin[0].Password,pathCapAddUser,'TC001');
  await updateUserRow(sheetID,sheetNameAddUser,'Chin2018',{SystemPassword: '56556'});
  await navigationPage.selectMenu(rowsSheetAddUser[0].Menu,rowsSheetAddUser[0].SubMenu,pathCapAddUser,'TC001');

  // await addUserPage.addUser({
  //   empCode: 'ch',
  //   username: 'chin_user',
  //   firstName: 'ชินไชย',
  //   lastName: 'ไชยโซล',
  //   email: 'chin@example.com',
  //   role: 'ผจก.งานข้อมูล / IT ส่วนกลาง',
  //   dealer: 'โตโยต้าขอนแก่น',
  //   branch: 'กระนวน'
  // });
  // const validLength = getValidRowsLength(rowsSheetAddUser);

  // console.log(`📊 จำนวน Row ทั้งหมด (รวมแถวว่าง): ${rows.length}`);
  // console.log(`✅ จำนวน Row ที่มีข้อมูลจริง: ${validLength}`);



  // await page.goto('https://toyotakhonkaen.trcloud.co/application/login/');
  // await page.getByRole('textbox', { name: 'Username or email' }).click();
  // await page.getByRole('textbox', { name: 'Username or email' }).fill('test');
  // await page.getByRole('textbox', { name: 'Password' }).click();
  // await page.getByRole('textbox', { name: 'Password' }).pressSequentially('1234', { delay: 200 });
  // await page.getByRole('button', { name: 'เข้าใช้งาน' }).click({ force: true });
  // await page.getByRole('link', { name: ' โปรแกรมบัญชี Accounting' }).click({ force: true })
  // await page.getByRole('link', { name: ' การขาย & รายได้ ' }).click({ force: true })
  // await page.getByRole('link', { name: 'ใบกำกับภาษี [IV]' }).click({ force: true })
  // const noDataText = page.getByText('No Data');
  // for (let i = 0; i < 64; i++) {
  //   await page.getByRole('textbox', { name: 'คำค้นหา' }).fill(rowsSheetDelete[i].invoice_number)
  //   await page.getByRole('button', { name: '  RUN' }).click({ force: true })     // ถ้าไม่เจอ No Data
  //   if (await noDataText.isVisible()) {
  //     console.log(`noData >> ${rowsSheetDelete[i].invoice_number}`); // ถ้าเจอ No Data
  //     page.getByRole('textbox', { name: 'คำค้นหา' }).clear()
  //   } else {
  //     await page.locator('#output').getByRole('link').filter({ hasText: /^$/ }).click({ force: true })
  //     await page.getByRole('link', { name: '  ลบ' }).click({ force: true })
  //     page.getByRole('textbox', { name: 'คำค้นหา' }).clear()
  //      // ถ้าเจอ No Data
  //   }
  // }
});