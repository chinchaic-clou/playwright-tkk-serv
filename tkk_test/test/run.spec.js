import { test, expect } from '@playwright/test';
const { LoginPage } = require('../page/login.page');
const { getTestData } = require('../helpers/googleSheet');
const { DATA_GLOBAL } = require('../helpers/dataGlobal');
const { updateUserRow } = require('../helpers/writeGoogleSheet');

test('test', async ({ page }) => {
  const sheetID = DATA_GLOBAL.SHEET_ID;
  const sheetNameLogin = DATA_GLOBAL.SHEET_NAME_LOGIN;
  const sheetNameAddUser = DATA_GLOBAL.SHEET_NAME_ADD_USER;
  const rowsSheetLogin = await getTestData(sheetNameLogin);
  const writeSheetUser = await updateUserRow(sheetID,sheetNameAddUser,'Test001',{Password: '4321eiei'});
  const loginPage = new LoginPage(page);
  await loginPage.goto(rowsSheetLogin[0].Link);
  await loginPage.login(rowsSheetLogin[0].User,rowsSheetLogin[0].Password);
});