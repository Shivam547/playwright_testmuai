/**
 * Amazon Product Page Object
 * Handles individual product pages and add to cart functionality
 */
class ProductPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Locators
    this.addToCartButton = "(//input[@title='Add to Shopping Cart'])[last()]";
    this.buyNowButton = "(//input[@title='Buy Now'])[last()]";
    this.productTitle = "//span[@id='productTitle']";
    this.productPrice = "//span[contains(@id,'pricetopay')]";
    // this.priceFraction = '.a-price-fraction';
    // this.priceSymbol = '.a-price-symbol';
    // this.priceContainer = '#corePrice_feature_div .a-offscreen, #corePriceDisplay_desktop_feature_div .a-offscreen, .a-price .a-offscreen';
    // this.addToCartConfirmation = '#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation, #attachDisplayAddBase498';
    this.cartCount = '#nav-cart-count';
    // this.seeAllBuyingOptions = '.a-button-text';
    // this.addToCartFromOffers = '[name="submit.addToCart"]';
    // this.noThanksButton = '#attachSiNoCov498, #siNoCov498-announce, [data-a-autofocus="true"]';
    // this.proceedToCheckout = '#sc-buy-box-ptc-button, [name="proceedToRetailCheckout"]';
  }

  /**
   * Get product title from the product page
   * @returns {string} Product title
   */
  async getProductTitle() {
    try {
      await this.page.waitForSelector(this.productTitle, { timeout: 10000 });
      const title = await this.page.locator(this.productTitle).textContent();
      return title?.trim() || 'Product title not found';
    } catch (e) {
      return 'Product title not found';
    }
  }

  /**
   * Get product price from the product page
   * @returns {string} Product price
   */
  async getProductPrice() {
    try {
      // Try multiple price selectors
    //   const priceSelectors = [
    //     '#corePrice_feature_div .a-offscreen',
    //     '#corePriceDisplay_desktop_feature_div .a-offscreen',
    //     '.a-price .a-offscreen',
    //     '#priceblock_ourprice',
    //     '#priceblock_dealprice',
    //     '.a-price-whole'
    //   ];
      
    //   for (const selector of priceSelectors) {
        const priceElement = this.page.locator(this.productPrice);
        if (await priceElement.isVisible({ timeout: 2000 }).catch(() => false)) {
          const price = await priceElement.textContent();
          if (price && price.includes('₹')) {
            return price.trim();
          }
        }
    //   }
      
    //   // Try to construct price from parts
    //   const whole = await this.page.locator(this.priceWhole).first().textContent().catch(() => null);
    //   const fraction = await this.page.locator(this.priceFraction).first().textContent().catch(() => '00');
      
    //   if (whole) {
    //     return `$${whole.replace(',', '')}${fraction}`;
    //   }
      
    //   return 'Price not available';
    } catch (e) {
      return 'Price not available';
    }
  }

  /**
   * Add the current product to the shopping cart
   * @returns {boolean} True if successful, false otherwise
   */
  async addToCart() {
    try {
      // Wait a bit for page to fully load
      await this.page.waitForTimeout(2000);
      
      // Check if Add to Cart button exists
      const addToCartBtn = this.page.locator(this.addToCartButton);
      
      if (await addToCartBtn.isVisible({ timeout: 5000 })) {
        await addToCartBtn.click();
        
        // Handle any popups or protection plan offers
        await this.handlePostAddToCartPopups();
        
        // Wait for cart confirmation
        await this.page.waitForTimeout(2000);
        
        return true;
      }
      
      // Try "See All Buying Options" if Add to Cart not available
      const seeAllOptions = this.page.locator('#buybox-see-all-buying-choices, .a-button-text:has-text("See All Buying Options")');
      if (await seeAllOptions.isVisible({ timeout: 3000 }).catch(() => false)) {
        await seeAllOptions.click();
        await this.page.waitForTimeout(2000);
        
        // Click Add to Cart from the offers panel
        const addFromOffers = this.page.locator('[name="submit.addToCart"], #a]AODAddToCart').first();
        if (await addFromOffers.isVisible({ timeout: 5000 }).catch(() => false)) {
          await addFromOffers.click();
          await this.handlePostAddToCartPopups();
          return true;
        }
      }
      
      console.log('Add to Cart button not found');
      return false;
      
    } catch (e) {
      console.log(`Error adding to cart: ${e.message}`);
      return false;
    }
  }

  /**
   * Handle popups that appear after adding to cart (protection plans, warranties, etc.)
   */
  async handlePostAddToCartPopups() {
    try {
      // Wait a moment for any popups to appear
      await this.page.waitForTimeout(1500);
      
      // Try to close "No Thanks" for protection plans
      const noThanksSelectors = [
        '#attachSiNoCov498',
        '#siNoCoverage-announce',
        'button:has-text("No Thanks")',
        'button:has-text("No thanks")',
        '[data-a-autofocus="true"]:has-text("No")',
        '.a-button-close'
      ];
      
      for (const selector of noThanksSelectors) {
        const noThanksBtn = this.page.locator(selector).first();
        if (await noThanksBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await noThanksBtn.click().catch(() => {});
          await this.page.waitForTimeout(500);
          break;
        }
      }
    } catch (e) {
      // Popup handling failed, continue anyway
    }
  }

  /**
   * Get the current cart count
   * @returns {string} Number of items in cart
   */
  async getCartCount() {
    try {
      const count = await this.page.locator(this.cartCount).textContent();
      return count?.trim() || '0';
    } catch (e) {
      return '0';
    }
  }

  /**
   * Verify item was added to cart
   * @returns {boolean} True if item appears to be in cart
   */
  async verifyItemInCart() {
    try {
      // Check for success message
      const successSelectors = [
        '#NATC_SMART_WAGON_CONF_MSG_SUCCESS',
        '#sw-atc-confirmation',
        'text=Added to Cart',
        'text=added to cart',
        '#hlb-view-cart-announce'
      ];
      
      for (const selector of successSelectors) {
        if (await this.page.locator(selector).isVisible({ timeout: 3000 }).catch(() => false)) {
          return true;
        }
      }
      
      // Check if cart count increased
      const cartCount = await this.getCartCount();
      return parseInt(cartCount) > 0;
    } catch (e) {
      return false;
    }
  }
}

module.exports = { ProductPage };
