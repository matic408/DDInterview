const ProductValidator = require('./validators');
const MockDatabase = require('./mock-database');

class ProductProcessor {
  constructor() {
    this.validator = new ProductValidator();
    this.database = new MockDatabase();
    this.processedCount = 0;
  }

  async processSubmission(productData) {
    console.log(`Processing submission for: ${productData?.name || 'Unknown'}`);
    
    const validation = this.validator.validateProduct(productData);
    
    if (!validation.valid) {
      console.error('Validation failed:', validation.errors);
      return {
        success: false,
        errors: validation.errors,
        productId: null
      };
    }

    await new Promise(resolve => setTimeout(resolve, 50));

    const productId = await this.database.saveProduct({
      ...productData,
      processedAt: new Date(),
      processedBy: 'system'
    });

    this.processedCount++;
    
    return {
      success: true,
      errors: [],
      productId: productId
    };
  }

  async processBatch(products) {
    console.log(`Starting batch processing of ${products.length} products...`);
    const startTime = Date.now();
    
    const results = await this.processBatchParallel(products);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`Batch processing completed in ${duration.toFixed(2)} seconds`);
    
    return {
      results: results,
      stats: {
        total: products.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        duration: duration,
        cacheHits: this.validator.cacheHits
      }
    };
  }

  async processBatchParallel(products, concurrency = 5) {
    console.log(`Starting parallel batch processing (concurrency: ${concurrency})...`);
    const results = [];
    
    for (let i = 0; i < products.length; i += concurrency) {
      const chunk = products.slice(i, i + concurrency);
      const chunkResults = await Promise.all(
        chunk.map(product => this.processSubmission(product))
      );
      results.push(...chunkResults);
    }
    
    return results;
  }

  getStats() {
    return {
      processedCount: this.processedCount,
      cacheSize: this.validator.validationCache.size,
      cacheHits: this.validator.cacheHits,
      databaseSize: this.database.getSize()
    };
  }
}

module.exports = ProductProcessor;