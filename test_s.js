const { lifecycle, page, utils } = DDAutomator;
const { loaded, step } = lifecycle;

loaded(async (params, done) => {
  const { currentDateTime, userLogin } = params;
  
  console.log('收到参数:', {currentDateTime, userLogin});

  try {
    await step('1. 等待页面加载', async () => {
      await page.waitForSelector('#dateField_luj8eid2');
    });

    await step('2. 填写所有字段', async () => {
      // 设置日期时间
      const timestamp = new Date(currentDateTime).getTime();
      await page.evaluateHandle((dateTime) => {
        const dateField = document.getElementById('dateField_luj8eid2');
        const input = dateField.querySelector('input');
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        input.value = dateTime;
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
      }, timestamp);
      
      await utils.waitForMilliseconds(500);

      // 设置下拉选择框
      await page.evaluateHandle(() => {
        const selectField = document.getElementById('selectField_lxiolxr4');
        const input = selectField.querySelector('input');
        input.value = "国内华南";
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await utils.waitForMilliseconds(300);

      // 设置序列号
      await page.evaluateHandle(() => {
        const field = document.getElementById('serialNumberField_lto5bkpo');
        const input = field.querySelector('input');
        input.value = "RDLPC202504081274";
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await utils.waitForMilliseconds(300);

      // 设置复选框值
      await page.evaluateHandle(() => {
        const checkboxField = document.getElementById('checkboxField_lxlit0ak_id');
        const input = checkboxField.querySelector('input');
        input.value = ["安全评价报告"];
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await utils.waitForMilliseconds(300);

      // 设置员工字段（使用ID）
      const employeeFields = {
        'employeeField_m2pzivbh_id': ['042744604021489857'],
        'employeeField_m2pzivbf_id': ['186604522'],
        'employeeField_m7itpyri_id': ['063738621021042954'],
        'employeeField_m2ylu0j5_id': ['186604522'],
        'employeeField_lxmwur5y_id': ['01156649684437924223'],
        'employeeField_luqehgnj_id': ['2069592136560241'],
        'employeeField_lto17udb_id': ['216222451820762072'],
        'employeeField_m78hmw6x_id': ['01063647582625925099'],
        'employeeField_m2pzivbg_id': ['426247702']
      };

      // 遍历设置所有员工字段
      for (const [fieldId, values] of Object.entries(employeeFields)) {
        await page.evaluateHandle(({fieldId, values}) => {
          const field = document.getElementById(fieldId);
          if (field) {
            const input = field.querySelector('input');
            if (input) {
              input.value = values;
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }, {fieldId, values});
        await utils.waitForMilliseconds(300);
      }

      // 设置项目选择
      await page.evaluateHandle(() => {
        const field = document.getElementById('selectfield_Zr47f3rw_id');
        const input = field.querySelector('input');
        input.value = "指定客户（需明确于【需求描述】）";
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await utils.waitForMilliseconds(300);

      // 设置文本区域
      await page.evaluateHandle(() => {
        const field = document.getElementById('textareaField_lto17udh');
        const textarea = field.querySelector('textarea');
        textarea.value = "客户：美奕\n需求：NAD +和乙酰基四肽-3的安评";
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await utils.waitForMilliseconds(300);
    });

    await step('3. 提交表单', async () => {
      await page.locator('button[type="submit"]').click();
      await utils.waitForMilliseconds(2000);
    });

    done({
      title: '表单提交成功',
      message: `已完成表单提交，包含以下信息：
      - 日期时间：${currentDateTime}
      - 区域：国内华南
      - 序列号：RDLPC202504081274
      - 文档类型：安全评价报告
      - 所有员工字段已通过ID设置
      - 指定客户
      - 需求描述已填写`,
    });

  } catch (error) {
    console.error('执行出错:', error);
    done({
      title: '表单提交失败',
      message: `出现错误: ${error.message}\n请检查输入参数是否正确。`,
    });
  }
});
