import { test, expect } from '@playwright/test';


test.describe('Operações de Mercado', () => {
 
  test.beforeEach(async ({ page }) => {
   
    await page.route('**/users', async route => {
      await route.fulfill({ json: [{ id: "u1", name: "Thorin", role: "player", characterIds: ["1"] }] });
    });
    
   
    await page.route('**/characters', async route => {
      await route.fulfill({ json: [{
        id: "1",
        name: "Aldric o Bravo",
        class: "Guerreiro",
        level: 15,
        gold: 100,
        inventory: [{
          id: "shop3",
          name: "Espada Longa",
          type: "Arma",
          rarity: "Incomum",
          quantity: 1,
          description: "Espada padrão.",
          price: 50
        }],
        maps: [],
        events: []
      }]});
    });

   
    await page.route('**/items', async route => {
      await route.fulfill({ json: [{
        id: "shop1",
        name: "Poção de Cura",
        type: "Consumível",
        rarity: "Comum",
        quantity: 10,
        description: "Restaura 50 de HP.",
        price: 10
      }]});
    });

   
    await page.route('**/characters/1', async route => {
      await route.fulfill({ json: { success: true } });
    });

   
    await page.addInitScript(() => {
      window.localStorage.setItem('currentUser', JSON.stringify({
        id: "u1",
        name: "Thorin",
        role: "player",
        characterIds: ["1"]
      }));
    });

    await page.goto('http://localhost:5173/area-usuario');
  });

  test('Operação 1: Deve ser capaz de comprar um item no mercado', async ({ page }) => {
   
    await expect(page.locator('h2', { hasText: 'Personagens' })).toBeVisible();
    
   
    await page.getByRole('tab', { name: /Mercado/i }).click();

   
    const buyButton = page.locator('[data-testid="buy-shop1"]');
    await expect(buyButton).toBeVisible();

   
    const updatePromise = page.waitForRequest(req => req.url().includes('/characters/1') && req.method() === 'PATCH');

   
    page.on('dialog', dialog => dialog.accept());

   
    await buyButton.click();

   
    const request = await updatePromise;
    expect(request.method()).toBe('PATCH');
    
   
   
   
    const postData = JSON.parse(request.postData() || '{}');
    expect(postData.gold).toBe(91);
  });

  test('Operação 2: Deve ser capaz de vender um item do inventário', async ({ page }) => {
   
    await expect(page.locator('h2', { hasText: 'Personagens' })).toBeVisible();
    
   
    await page.getByRole('tab', { name: /Mercado/i }).click();

   
    const sellButton = page.locator('[data-testid="sell-shop3"]');
    await expect(sellButton).toBeVisible();

   
    const updatePromise = page.waitForRequest(req => req.url().includes('/characters/1') && req.method() === 'PATCH');

   
    page.on('dialog', dialog => dialog.accept());

   
    await sellButton.click();

   
    const request = await updatePromise;
    expect(request.method()).toBe('PATCH');

   
   
   
    const postData = JSON.parse(request.postData() || '{}');
    expect(postData.gold).toBe(125);
  });
});
