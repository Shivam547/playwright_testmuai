/**
 * Amazon Search Results Page Object
 * Handles product search results and selection
 */
class SearchResultsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Locators - Generic selectors that work for any product search
    this.searchResults = '[data-component-type="s-search-result"]';
    this.sponsoredLabel = '.puis-label-popover-default';
  }

  /**
   * Get product title XPath for a specific product
   * @param {string} productName - Product name to search for (e.g., 'iPhone', 'Galaxy')
   * @returns {string} XPath selector
   */
  getProductTitleXPath(productName) {
    return `(//h2[contains(@aria-label, '${productName}')])[1]`;
  }

  /**
   * Get product price XPath for a specific product
   * @param {string} productName - Product name to search for (e.g., 'iPhone', 'Galaxy')
   * @returns {string} XPath selector
   */
  getProductPriceXPath(productName) {
    return `(//h2//span[contains(text(), '${productName}')]//ancestor::div[contains(@class, 'section')]//following-sibling::div//span[contains(text(), 'Price')]//following-sibling::a//span//span)[1]`;
  }

  /**
   * Wait for search results to load
   */
  async waitForResults() {
    await this.page.waitForSelector(this.searchResults, { timeout: 30000 });
  }

  /**
   * Select a product from search results (skips sponsored items)
   * @param {string} productName - Product name to search for (e.g., 'iPhone', 'Galaxy')
   * @param {number} index - Index of the product to select (0-based)
   * @returns {Object} Product info including title and price
   */
  async selectProduct(productName = 'iPhone', index = 0) {
    await this.waitForResults();
    
    // Get parameterized XPaths
    const productTitleXPath = this.getProductTitleXPath(productName);
    const productPriceXPath = this.getProductPriceXPath(productName);
    
    // Get all search result items
    const results = this.page.locator(this.searchResults);
    const count = await results.count();
    
    console.log(`Found ${count} search results`);
    
    // Find a valid product (skip sponsored items when possible)
    let selectedIndex = index;
    let productInfo = null;
    
    for (let i = selectedIndex; i < Math.min(count, 10); i++) {
      const result = results.nth(i);
      
      // Check if product has a price
      const priceElement = result.locator(productPriceXPath).first();
      const hasPriceVisible = await priceElement.isVisible().catch(() => false);
      
      if (hasPriceVisible) {
        // Get product title
        const titleElement = result.locator(productTitleXPath).first();
        const title = await titleElement.textContent();
        
        // Get product price
        const price = await priceElement.textContent();
        
        productInfo = {
          title: title?.trim() || 'Unknown Product',
          price: price?.trim() || 'Price not available',
          index: i
        };
        
        console.log(`Selected product: ${productInfo.title}`);
        console.log(`Price: ${productInfo.price}`);
        
        // Click on the product - handle new tab opening
        const [newPage] = await Promise.all([
          this.page.context().waitForEvent('page'),
          titleElement.click()
        ]);
        
        // Wait for the new page to load
        await newPage.waitForLoadState('domcontentloaded');
        
        // Return product info along with the new page reference
        productInfo.newPage = newPage;
        return productInfo;
      }
    }
    
    // If no product with price found, click the first result
    const firstResult = results.first().locator(productTitleXPath).first();
    
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      firstResult.click()
    ]);
    
    await newPage.waitForLoadState('domcontentloaded');
    
    const result = productInfo || { title: 'Unknown Product', price: 'Price not available', index: 0 };
    result.newPage = newPage;
    return result;
  }
}

module.exports = { SearchResultsPage };
