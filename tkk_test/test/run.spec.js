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
  test.setTimeout(300000);
  const sheetID = DATA_GLOBAL.SHEET_ID;
  const sheetNameLogin = DATA_GLOBAL.SHEET_NAME_LOGIN;
  const sheetNameAddUser = DATA_GLOBAL.SHEET_NAME_ADD_USER;
  const pathCapAddUser = DATA_GLOBAL.PATH_CAP_ADD_USER;
  const rowsSheetLogin = await getTestData(sheetNameLogin);
  const rowsSheetAddUser = await getTestData(sheetNameAddUser);
  const loginPage = new LoginPage(page);
  const navigationPage = new NavigationPage(page);
  const timeString = await getDateTimeString();
  const addUserPage = new AddUserPage(page);
  clearDirectory(`${pathCapAddUser}/TC001`);


  await loginPage.goto(rowsSheetLogin[0].Link);
  await loginPage.login(rowsSheetLogin[0].User,rowsSheetLogin[0].Password,pathCapAddUser,'TC001');
  await navigationPage.selectMenu(rowsSheetAddUser[0].Menu,rowsSheetAddUser[0].SubMenu,pathCapAddUser,'TC001');

  for (let i = 1; i < 2; i++) {
    await clearDirectory(`${pathCapAddUser}/TC001/User00${i+1}`);
    await addUserPage.addUser({
      empCode: rowsSheetAddUser[i].CustomerID,
      username: rowsSheetAddUser[i].User,
      firstName: rowsSheetAddUser[i].Name,
      lastName: rowsSheetAddUser[i].LastName,
      email: rowsSheetAddUser[i].Email,
      role: rowsSheetAddUser[i].RollDealer,
      dealer: rowsSheetAddUser[i].Dealer,
      branch: rowsSheetAddUser[i].Brach,
      basePath: `${pathCapAddUser}/TC001`,
      caseNo: `User00${i+1}`
    });
  }
});