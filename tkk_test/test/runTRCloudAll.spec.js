import { test, expect } from "@playwright/test";
const { CommonFunction } = require("../page/commonFunction.page");

test.describe("TRCloud All Invoice", () => {
  let commonFunction;

  // ทำงานก่อนเริ่มแต่ละ Test Case (ลดการประกาศ new CommonFunction ซ้ำๆ)
  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonFunction(page);
  });

  test("TC001 - Run TRCloud Group 0 Index 0", async () => {
    await commonFunction.groupFunctionTRCloud(0, 0);
  });

  test("TC002 - Run TRCloud Group 0 Index 1", async () => {
    await commonFunction.groupFunctionTRCloud(0, 1);
  });

  test("TC003 - Run TRCloud Group 0 Index 2", async () => {
    await commonFunction.groupFunctionTRCloud(0, 2);
  });
  
  test("TC004 - Run TRCloud Group 0 Index 3", async () => {
    await commonFunction.groupFunctionTRCloud(0, 3);
  });

  test("TC005 - Run TRCloud Group 0 Index 4", async () => {
    await commonFunction.groupFunctionTRCloud(0, 4);
  });

  test("TC006 - Run TRCloud Group 0 Index 5", async () => {
    await commonFunction.groupFunctionTRCloud(0, 5);
  });

  test("TC007 - Run TRCloud Group 0 Index 6", async () => {
    await commonFunction.groupFunctionTRCloud(0, 6);
  });

  test("TC008 - Run TRCloud Group 0 Index 7", async () => {
    await commonFunction.groupFunctionTRCloud(0, 7);
  });

  test("TC009 - Run TRCloud Group 0 Index 8", async () => {
    await commonFunction.groupFunctionTRCloud(0, 8);
  });

  test("TC010 - Run TRCloud Group 0 Index 9", async () => {
    await commonFunction.groupFunctionTRCloud(0, 9);
  });
});
