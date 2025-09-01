import { test, expect } from '@playwright/test';

test('home loads without client errors and no horizontal scroll', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('/');

  // Basic sanity
  await expect(page).toHaveTitle(/Кодология|Codologia/i);

  // No client-side console errors
  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);

  // No horizontal scroll on key sections
  const checkNoOverflow = async (selector: string) => {
    const hasOverflowX = await page.$eval(selector, (el) => {
      const e = el as HTMLElement;
      return e.scrollWidth > e.clientWidth + 2; // tolerance
    });
    expect(hasOverflowX, `overflow-x on ${selector}`).toBeFalsy();
  };

  await checkNoOverflow('html');
  await checkNoOverflow('body');
  await checkNoOverflow('#root');
  await checkNoOverflow('#quiz');
});

