const ProductProcessor = require('./src/product-processor');
const fs = require('fs');
const path = require('path');

async function testPerformance() {
  console.log('=== Performance Testing ===\n');
  
  const processor = new ProductProcessor();
  
  // Load test data
  const dataPath = path.join(__dirname, 'test-data', 'bulk-upload-sample.json');
  const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Test with different batch sizes
  const testSizes = [5, 10, 15];
  
  for (const size of testSizes) {
    console.log(`Testing batch size: ${size}`);
    
    const batch = testData.slice(0, size);
    const startTime = Date.now();
    
    const result = await processor.processBatch(batch);
    
    const endTime = Date.now();
    const actualTime = (endTime - startTime) / 1000;
    
    console.log(`  Actual time: ${actualTime.toFixed(2)} seconds`);
    console.log(`  Time per item: ${(actualTime / size).toFixed(2)} seconds`);
    console.log(`  Success rate: ${result.stats.successful}/${result.stats.total}`);
    console.log('');
  }
  
  console.log('Performance Issues to Fix:');
  console.log('1. Sequential processing with delays');
  console.log('2. Inefficient bulk operations');  
  console.log('3. Consider using the processBatchParallel method');
  console.log('\nGoal: Process 25 items in under 5 seconds');
}

testPerformance().catch(console.error);