import { test, expect } from '@playwright/test';
const { LoginPage } = require('../page/login.page');
const { getTestData } = require('../helpers/googleSheet');
const { DATA_GLOBAL } = require('../helpers/dataGlobal');
const { updateUserRow } = require('../helpers/writeGoogleSheet');
const { getDateTimeString } = require('../helpers/getDateTimeString');
const { clearDirectory } = require('../helpers/clearDirectory');


test('test', async ({ page }) => {
  const sheetID = DATA_GLOBAL.SHEET_ID;
  const sheetNameLogin = DATA_GLOBAL.SHEET_NAME_LOGIN;
  const sheetNameAddUser = DATA_GLOBAL.SHEET_NAME_ADD_USER;
  const rowsSheetLogin = await getTestData(sheetNameLogin);
  const rowsSheetAddUser = await getTestData(sheetNameAddUser);
  const loginPage = new LoginPage(page);
  const timeString = await getDateTimeString();
  const pathCap = DATA_GLOBAL.PATH_CAP_ADD_USER;
  clearDirectory(pathCap);


  await loginPage.goto(rowsSheetLogin[0].Link);
  await loginPage.login(rowsSheetLogin[0].User,rowsSheetLogin[0].Password);
  await updateUserRow(sheetID,sheetNameAddUser,'Chin2001',{Password: '56556'});
});