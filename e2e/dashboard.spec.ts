import { test, expect } from '@playwright/test';

test.describe('Quant & ML Dashboard', () => {

  test('Page loads correctly and shows empty state', async ({ page }) => {
    await page.goto('/');
    
    // Check titles and headers
    await expect(page).toHaveTitle(/Quant & ML/);
    await expect(page.getByText('Market Intelligence')).toBeVisible();
    
    // Check Empty State is present
    await expect(page.getByText('Awaiting Quant & ML Pipeline')).toBeVisible();
    await expect(page.getByText('Enter a ticker symbol')).toBeVisible();

    // Check defaults
    await expect(page.getByPlaceholder('Enter Ticker')).toBeVisible();
    await expect(page.getByRole('button', { name: '1 month' })).toHaveClass(/bg-brand-500/);
  });

  test('Pro/Fast toggle switches correctly', async ({ page }) => {
    await page.goto('/');
    
    const toggleBtn = page.getByRole('button', { name: /PRO MODEL|FAST MODEL/i });
    
    await expect(toggleBtn).toHaveText('⚡ PRO MODEL');
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText('🚀 FAST MODEL');
    
    // Check persistence
    await page.reload();
    await expect(toggleBtn).toHaveText('🚀 FAST MODEL');
  });

  test('Input validation blocks empty ticker', async ({ page }) => {
    await page.goto('/');
    
    const analyzeBtn = page.getByRole('button', { name: 'Analyze & Predict' });
    await expect(analyzeBtn).toBeDisabled();
    
    await page.getByPlaceholder('Enter Ticker').fill('AAPL');
    await expect(analyzeBtn).toBeEnabled();
  });

});
