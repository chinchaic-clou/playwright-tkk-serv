import { test, expect } from '@playwright/test';
const { LoginPage } = require('../page/login.page');
const { NavigationPage } = require('../page/selectMenu.page');
const { getTestData,getValidRowsLength} = require('../helpers/googleSheet');
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

  const validLength = await getValidRowsLength(rowsSheetAddUser);
  console.log(`📊 จำนวน Row ทั้งหมด (รวมแถวว่าง): ${rowsSheetAddUser.length}`);
  console.log(`✅ จำนวน Row ที่มีข้อมูลจริง: ${validLength}`);

  for (let i = 0; i < 1; i++) {
    await addUserPage.addUser({
      empCode: rowsSheetAddUser[i].CustomerID,
      username: rowsSheetAddUser[i].User
      // firstName: 'ชินไชย',
      // lastName: 'ไชยโซล',
      // email: 'chin@example.com',
      // role: 'ผจก.งานข้อมูล / IT ส่วนกลาง',
      // dealer: 'โตโยต้าขอนแก่น',
      // branch: 'กระนวน'
    });
  }
});