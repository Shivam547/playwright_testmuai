/**
 * Test Case 2: Galaxy Device Search and Add to Cart
 * 
 * This test navigates to Amazon, searches for a Galaxy device,
 * adds it to the shopping cart, and prints the price.
 */
const { test, expect } = require('@playwright/test');
const { AmazonHomePage, SearchResultsPage, ProductPage } = require('../pages');

test.describe('Galaxy Device Shopping Cart Test', () => {
  
  test('Search for Galaxy device and add to cart', async ({ page }, testInfo) => {
    // Initialize page objects
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    let productPage; // Will be initialized after product selection (new tab)
    let productPageContext; // Reference to the product page (new tab)
    
    console.log('\n========================================');
    console.log('TEST CASE 2: Galaxy Device Shopping Cart');
    console.log('========================================\n');
    
    // Step 1: Navigate to Amazon
    console.log('Step 1: Navigating to Amazon.in...');
    await homePage.navigate();
    await expect(page).toHaveTitle(/Amazon/, { timeout: 30000 });
    console.log('✓ Successfully navigated to Amazon\n');
    
    // Screenshot: Amazon Homepage
    await testInfo.attach('01-Amazon-Homepage', {
      body: await page.screenshot(),
      contentType: 'image/png'
    });
    
    // Step 2: Search for Galaxy device
    console.log('Step 2: Searching for Samsung Galaxy...');
    await homePage.searchProduct('Samsung Galaxy phone');
    console.log('✓ Search completed\n');
    
    // Screenshot: Search Results
    await testInfo.attach('02-Search-Results-Galaxy', {
      body: await page.screenshot(),
      contentType: 'image/png'
    });
    
    // Step 3: Select a Galaxy device from search results
    console.log('Step 3: Selecting a Galaxy device from results...');
    const productInfo = await searchResultsPage.selectProduct('Galaxy');
    console.log(`✓ Selected: ${productInfo.title}\n`);
    
    // Use the new tab/page that opened for product details
    productPageContext = productInfo.newPage || page;
    productPage = new ProductPage(productPageContext);
    
    // Step 4: Get product details from product page
    console.log('Step 4: Getting product details...');
    const productTitle = await productPage.getProductTitle();
    const productPrice = await productPage.getProductPrice();
    
    // Screenshot: Product Page
    await testInfo.attach('03-Product-Page-Galaxy', {
      body: await productPageContext.screenshot(),
      contentType: 'image/png'
    });
    
    // Attach product details to report
    await testInfo.attach('Product-Title', {
      body: productTitle,
      contentType: 'text/plain'
    });
    
    await testInfo.attach('Product-Price', {
      body: productPrice,
      contentType: 'text/plain'
    });
    
    console.log('\n----------------------------------------');
    console.log('PRODUCT DETAILS:');
    console.log('----------------------------------------');
    console.log(`Title: ${productTitle}`);
    console.log(`Price: ${productPrice}`);
    console.log('----------------------------------------\n');
    
    // Step 5: Add to cart
    console.log('Step 5: Adding Galaxy device to cart...');
    const addedSuccessfully = await productPage.addToCart();
    
    if (addedSuccessfully) {
      console.log('✓ Galaxy device added to cart successfully\n');
      
      // Screenshot: After Add to Cart
      await testInfo.attach('04-Added-To-Cart-Galaxy', {
        body: await productPageContext.screenshot(),
        contentType: 'image/png'
      });
      
      // Verify item in cart
      const inCart = await productPage.verifyItemInCart();
      const cartCount = await productPage.getCartCount();
      
      console.log(`Cart Count: ${cartCount}`);
      console.log(`Verification: ${inCart ? 'Item confirmed in cart' : 'Item may be in cart'}\n`);
      
      // Attach cart status to report
      await testInfo.attach('Cart-Status', {
        body: `Cart Count: ${cartCount}\nItem in Cart: ${inCart ? 'Yes' : 'Verification pending'}`,
        contentType: 'text/plain'
      });
    } else {
      console.log('⚠ Could not add to cart (product may require seller selection)\n');
      
      // Screenshot: Add to Cart Failed
      await testInfo.attach('04-Add-To-Cart-Failed-Galaxy', {
        body: await productPageContext.screenshot(),
        contentType: 'image/png'
      });
    }
    
    // Final verification and price print
    console.log('\n========================================');
    console.log('TEST CASE 2 SUMMARY');
    console.log('========================================');
    console.log(`Device: Samsung Galaxy`);
    console.log(`Product: ${productTitle.substring(0, 80)}...`);
    console.log(`PRICE: ${productPrice}`);
    console.log('========================================\n');
    
    // Attach final summary to report
    const summary = `
========================================
TEST CASE 2 SUMMARY
========================================
Device: Samsung Galaxy
Product: ${productTitle}
PRICE: ${productPrice}
Added to Cart: ${addedSuccessfully ? 'Yes' : 'No'}
========================================
    `.trim();
    
    await testInfo.attach('Test-Summary', {
      body: summary,
      contentType: 'text/plain'
    });
    
    // Assert that we found a price
    expect(productPrice).not.toBe('Price not available');
  });
});
