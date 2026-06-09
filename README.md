# Amazon Shopping Cart Automation Tests

Automated test suite for Amazon shopping cart functionality using **Playwright** framework with **parallel execution** support.

Live Report - https://shivam547.github.io/playwright_testmuai/

## Overview

This project implements two automated test cases that run in parallel:

| Test Case | Description |
|-----------|-------------|
| **Test Case 1** | Search for iPhone on Amazon, add to cart, and retrieve price |
| **Test Case 2** | Search for Galaxy device on Amazon, add to cart, and retrieve price |

## Features

- **Parallel Execution**: Both test cases run simultaneously for efficiency
- **Page Object Model**: Clean, modular design with reusable page objects
- **Cloud Integration**: Ready for LambdaTest cloud testing platform
- **Detailed Logging**: Console output with step-by-step progress
- **HTML Reports**: Built-in Playwright HTML reporter

## Project Structure

```
playwright/
├── tests/
│   ├── iphone.spec.js       # Test Case 1: iPhone search & cart
│   └── galaxy.spec.js       # Test Case 2: Galaxy device search & cart
├── pages/
│   ├── AmazonHomePage.js    # Home page interactions
│   ├── SearchResultsPage.js # Search results handling
│   ├── ProductPage.js       # Product page & cart actions
│   └── index.js             # Page objects export
├── playwright.config.js     # Local execution config
├── playwright.lambdatest.config.js  # Cloud execution config
├── package.json             # Dependencies & scripts
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## Running Tests

### Local Execution (Parallel)

Run both tests in parallel with headless browser:
```bash
npm test
```

Run tests with visible browser (headed mode):
```bash
npm run test:headed
```

Run tests in debug mode:
```bash
npm run test:debug
```

Run tests with Playwright UI:
```bash
npm run test:ui
```

### View Test Report

After running tests, view the HTML report:
```bash
npm run report
```

## LambdaTest Cloud Integration (Bonus)

### Setup

1. **Sign up** for a free account at [LambdaTest](https://www.lambdatest.com)

2. **Get credentials** from LambdaTest Dashboard:
   - Navigate to **Automation** > **Key**
   - Copy your **Username** and **Access Key**

3. **Configure environment variables**:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your credentials
   LT_USERNAME=your_username
   LT_ACCESS_KEY=your_access_key
   ```

### Run on LambdaTest Cloud

```bash
npm run test:lambdatest
```

## Test Execution Flow

### Test Case 1: iPhone
1. Navigate to Amazon.com
2. Search for "iPhone"
3. Select an iPhone from search results
4. Retrieve and print the product price
5. Add the iPhone to shopping cart
6. Verify cart addition

### Test Case 2: Galaxy Device
1. Navigate to Amazon.com
2. Search for "Samsung Galaxy phone"
3. Select a Galaxy device from search results
4. Retrieve and print the product price
5. Add the Galaxy device to shopping cart
6. Verify cart addition

## Configuration

### Parallel Workers

The number of parallel workers is configured in `playwright.config.js`:
```javascript
workers: 2,  // Runs both tests simultaneously
```

### Timeouts

| Setting | Value |
|---------|-------|
| Test Timeout | 120 seconds |
| Action Timeout | 30 seconds |
| Navigation Timeout | 60 seconds |

### Browser Configuration

Default browser: **Chromium** (Chrome)
Viewport: **1920x1080**

## Sample Output

```
========================================
TEST CASE 1: iPhone Shopping Cart
========================================

Step 1: Navigating to Amazon.com...
✓ Successfully navigated to Amazon

Step 2: Searching for iPhone...
✓ Search completed

Step 3: Selecting an iPhone from results...
✓ Selected: Apple iPhone 15 Pro Max...

Step 4: Getting product details...

----------------------------------------
PRODUCT DETAILS:
----------------------------------------
Title: Apple iPhone 15 Pro Max, 256GB, Natural Titanium
Price: $1,199.00
----------------------------------------

Step 5: Adding iPhone to cart...
✓ iPhone added to cart successfully

========================================
TEST CASE 1 SUMMARY
========================================
Device: iPhone
Product: Apple iPhone 15 Pro Max, 256GB, Natural Titanium...
PRICE: $1,199.00
========================================
```

## Troubleshooting

### Common Issues

1. **Element not found**: Amazon's page structure may change. Update locators in page objects.

2. **Timeout errors**: Increase timeout values in configuration or wait for slower network.

3. **Add to cart fails**: Some products require seller selection or are out of stock.

4. **CAPTCHA**: Amazon may show CAPTCHA for automated requests. Try running in headed mode.

### Debug Mode

For detailed debugging:
```bash
npx playwright test --debug
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @playwright/test | ^1.40.0 | Test framework |
| dotenv | ^16.3.1 | Environment variables |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Author

Shivam Anand (Email - anand.shivam547@gmail.com)
