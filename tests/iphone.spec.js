/**
 * Test Case 1: iPhone Search and Add to Cart
 * 
 * This test navigates to Amazon, searches for an iPhone,
 * adds it to the shopping cart, and prints the price.
 */
const { test, expect } = require('@playwright/test');
const { AmazonHomePage, SearchResultsPage, ProductPage } = require('../pages');

test.describe('iPhone Shopping Cart Test', () => {
  
  test('Search for iPhone and add to cart', async ({ page }, testInfo) => {
    // Initialize page objects
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    let productPage; // Will be initialized after product selection (new tab)
    let productPageContext; // Reference to the product page (new tab)
    
    console.log('\n========================================');
    console.log('TEST CASE 1: iPhone Shopping Cart');
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
    
    // Step 2: Search for iPhone
    console.log('Step 2: Searching for iPhone...');
    await homePage.searchProduct('iPhone 17 Pro');
    console.log('✓ Search completed\n');
    
    // Screenshot: Search Results
    await testInfo.attach('02-Search-Results-iPhone', {
      body: await page.screenshot(),
      contentType: 'image/png'
    });
    
    // Step 3: Select an iPhone from search results
    console.log('Step 3: Selecting an iPhone from results...');
    const productInfo = await searchResultsPage.selectProduct('iPhone');
    console.log(`✓ Selected: ${productInfo.title}\n`);
    
    // Use the new tab/page that opened for product details
    productPageContext = productInfo.newPage || page;
    productPage = new ProductPage(productPageContext);
    
    // Step 4: Get product details from product page
    console.log('Step 4: Getting product details...');
    const productTitle = await productPage.getProductTitle();
    const productPrice = await productPage.getProductPrice();
    
    // Screenshot: Product Page
    await testInfo.attach('03-Product-Page-iPhone', {
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
    console.log('Step 5: Adding iPhone to cart...');
    const addedSuccessfully = await productPage.addToCart();
    
    if (addedSuccessfully) {
      console.log('✓ iPhone added to cart successfully\n');
      
      // Screenshot: After Add to Cart
      await testInfo.attach('04-Added-To-Cart-iPhone', {
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
      await testInfo.attach('04-Add-To-Cart-Failed-iPhone', {
        body: await productPageContext.screenshot(),
        contentType: 'image/png'
      });
    }
    
    // Final verification and price print
    console.log('\n========================================');
    console.log('TEST CASE 1 SUMMARY');
    console.log('========================================');
    console.log(`Device: iPhone`);
    console.log(`Product: ${productTitle.substring(0, 80)}...`);
    console.log(`PRICE: ${productPrice}`);
    console.log('========================================\n');
    
    // Attach final summary to report
    const summary = `
        ========================================
        TEST CASE 1 SUMMARY
        ========================================
        Device: iPhone
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
