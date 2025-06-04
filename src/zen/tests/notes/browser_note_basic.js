/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

add_task(async function test_ZenNotes_Open_Close() {
  const tab = await BrowserTestUtils.openNewForegroundTab(gBrowser, "https://example.com");

  const browser = tab.linkedBrowser;
  await SpecialPowers.spawn(browser, [], () => {
    content.window.dispatchEvent(new KeyboardEvent("keydown", {
      key: "w",
      ctrlKey: true,
    }));
  });

  await BrowserTestUtils.waitForCondition(() => {
    return content.document.getElementById("zen-note");
  }, "Esperando a nota abrir...");

  ok(content.document.getElementById("zen-note"), "A nota foi criada");

  await SpecialPowers.spawn(browser, [], () => {
    content.document.querySelector("#zen-note-close").click();
  });

  await BrowserTestUtils.waitForCondition(() => {
    return !content.document.getElementById("zen-note");
  }, "Esperando a nota fechar...");

  ok(!content.document.getElementById("zen-note"), "A nota foi removida");

  await BrowserTestUtils.removeTab(tab);
});
