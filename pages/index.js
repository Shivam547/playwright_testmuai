/**
 * Page Objects Index
 * Central export for all page objects
 */
const { AmazonHomePage } = require('./AmazonHomePage');
const { SearchResultsPage } = require('./SearchResultsPage');
const { ProductPage } = require('./ProductPage');

module.exports = {
  AmazonHomePage,
  SearchResultsPage,
  ProductPage
};
