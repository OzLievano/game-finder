import { test } from "@playwright/test";

test("Download", async ({ page }) => {
  await page.goto(
    "https://lambdatest.com/selenium-playground/generate-file-to-download-demo"
  );

  await page.fill("#textbox", "Like, Share, comment & subs");
  await page.click("id=create");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click("id=link-to-download"),
  ]);

  const filename = await download.suggestedFilename();
  await download.saveAs(filename);
  // const path = await download.path();
  console.log(path);
});

test("upload", async ({ page }) => {
  await page.goto("https://blueimp.github.io/jQUery-File-Upload/");

  const [uploadFiles] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.click("input[type='file']"),
  ]);

  const isMultiple = await uploadFiles.isMultiple();
  uploadFiles.setFiles(["uploadItems/apple.png", "uploadItems/mango.png"]);
});
