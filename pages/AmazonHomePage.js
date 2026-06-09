/**
 * Amazon Home Page Object
 * Handles navigation and search functionality
 */
class AmazonHomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Locators
    this.searchBox = '#twotabsearchtextbox';
    this.searchButton = '#nav-search-submit-button';
    this.locationModal = '#nav-global-location-popover-link';
    this.dismissModalButton = 'input[data-action-type="DISMISS"]';
  }

  /**
   * Navigate to Amazon homepage
   */
  async navigate() {
    await this.page.goto('/', { waitUntil: 'load' });
    
    // Wait for search box to be visible (ensures page is ready)
    await this.page.waitForSelector(this.searchBox, { state: 'visible', timeout: 30000 });
    
    // Handle any location popups that might appear
    try {
      const dismissButton = this.page.locator(this.dismissModalButton);
      if (await dismissButton.isVisible({ timeout: 3000 })) {
        await dismissButton.click();
      }
    } catch (e) {
      // Modal didn't appear, continue
    }
  }

  /**
   * Search for a product
   * @param {string} searchTerm - The product to search for
   */
  async searchProduct(searchTerm) {
    await this.page.fill(this.searchBox, searchTerm);
    await this.page.click(this.searchButton);
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { AmazonHomePage };
