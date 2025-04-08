const { lifecycle, page, utils } = DDAutomator;
const { loaded, step } = lifecycle;

loaded(async (params, done) => {
  const { currentDateTime, userLogin } = params;

  await step('1. 点击日期选择器', async () => {
    // 点击日期选择器触发弹出
    await page.locator('#dateField_luj8eid2 input').click();
    await utils.waitForMilliseconds(500); // 等待日历弹出
    
    // 解析日期
    const [date, time] = currentDateTime.split(' ');
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    
    // 选择年月日
    await page.locator(`div[title="${year}年"]`).click();
    await page.locator(`div[title="${parseInt(month)}月"]`).click();
    await page.locator(`div[title="${parseInt(day)}日"]`).click();
    
    // 选择时间
    await page.locator(`div[title="${hour}"]`).click();
    await page.locator(`div[title="${minute}"]`).click();
    
    // 点击确认
    await page.locator('button:has-text("确定")').click();
  });

  // 继续其他步骤...
});
