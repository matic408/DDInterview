const ProductProcessor = require('./src/product-processor');

async function definitiveTest() {
  console.log('=== DEFINITIVE BUG TEST ===\n');
  
  const processor = new ProductProcessor();
  let bugCount = 0;
  
  // TEST 1: Cache Contamination Bug
  console.log('🔍 TEST 1: Cache Contamination Bug');
  console.log('Testing if cache mixes up countries...\n');
  
  // Step 1: Validate German ID for Germany (should succeed)
  const germanProduct = { name: 'Test', country: 'DE', regulatoryId: 'DE-12345-ABCD' };
  const germanResult = await processor.processSubmission(germanProduct);
  console.log(`1. German ID 'DE-12345-ABCD' for Germany: ${germanResult.success ? 'SUCCESS' : 'FAILED'}`);
  
  // Step 2: Validate SAME ID for France (should fail - German format not valid for France)
  const frenchProduct = { name: 'Test', country: 'FR', regulatoryId: 'DE-12345-ABCD' };
  const frenchResult = await processor.processSubmission(frenchProduct);
  console.log(`2. German ID 'DE-12345-ABCD' for France: ${frenchResult.success ? 'SUCCESS' : 'FAILED'}`);
  
  // Step 3: Check cache hits
  const cacheHits = processor.getStats().cacheHits;
  console.log(`3. Cache hits: ${cacheHits}`);
  
  // VERDICT: If French validation succeeded, cache is contaminated
  if (germanResult.success && frenchResult.success && cacheHits > 0) {
    console.log('❌ BUG DETECTED: Cache contamination! German result cached for French validation');
    console.log('   German ID format incorrectly validated as successful for France');
    bugCount++;
  } else if (germanResult.success && !frenchResult.success) {
    console.log('✅ WORKING: Cache properly separates countries');
  } else {
    console.log('❓ UNEXPECTED: German validation should succeed');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // TEST 2: Performance Bug  
  console.log('🔍 TEST 2: Performance Bug');
  console.log('Testing if bulk processing is slow...\n');
  
  // Create test data
  const testProducts = [];
  for (let i = 0; i < 8; i++) {
    testProducts.push({
      name: `Product ${i}`,
      country: 'DE',
      regulatoryId: `DE-${10000 + i}-ABCD`
    });
  }
  
  console.log(`Processing ${testProducts.length} products...`);
  const startTime = Date.now();
  
  const batchResult = await processor.processBatch(testProducts);
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  const timePerItem = duration / testProducts.length;
  
  console.log(`Total time: ${duration.toFixed(2)} seconds`);
  console.log(`Time per item: ${timePerItem.toFixed(2)} seconds`);
  console.log(`Success rate: ${batchResult.stats.successful}/${batchResult.stats.total}`);
  
  // VERDICT: Check if it's using sequential processing (look for the pattern)
  // Sequential processing will show "Processing 1/8", "Processing 2/8" etc.
  // Parallel processing will show "Starting parallel batch processing"
  
  // We can detect this by checking the total time vs theoretical parallel time
  // Sequential: ~8 items × (50ms processing + 100ms delay) = ~1.2+ seconds
  // Parallel: ~8 items in chunks of 5 = ~0.3 seconds
  
  if (duration > 1.0) {
    console.log('❌ BUG DETECTED: Performance issue! Sequential processing with delays');
    console.log('   Taking too long - likely processing one by one with delays');
    bugCount++;
  } else if (duration > 0.8) {
    console.log('⚠️  SUSPICIOUS: Slower than expected, might be sequential processing');
    console.log('   Consider using parallel processing for better performance');
    bugCount++;
  } else {
    console.log('✅ WORKING: Fast parallel processing');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // TEST 3: Input Validation Crash Bug
  console.log('🔍 TEST 3: Input Validation Crash Bug'); 
  console.log('Testing if null inputs crash the system...\n');
  
  let crashCount = 0;
  
  // Test null regulatory ID
  try {
    const nullIdResult = await processor.processSubmission({
      name: 'Test Product',
      country: 'DE',
      regulatoryId: null
    });
    console.log(`Null regulatory ID: ${nullIdResult.success ? 'SUCCESS' : 'FAILED'} (no crash)`);
  } catch (error) {
    console.log(`Null regulatory ID: CRASHED - ${error.message}`);
    crashCount++;
  }
  
  // Test whitespace regulatory ID (tests preprocessing order)
  try {
    const whitespaceResult = await processor.processSubmission({
      name: 'Test Product', 
      country: 'DE',
      regulatoryId: '   DE-12345-ABCD   '
    });
    console.log(`Whitespace ID: ${whitespaceResult.success ? 'SUCCESS' : 'FAILED'} (should succeed after trimming)`);
    
    // If this fails, preprocessing order is wrong
    if (!whitespaceResult.success) {
      console.log('❌ BUG DETECTED: Preprocessing order wrong - validation before cleanup');
      bugCount++;
    }
  } catch (error) {
    console.log(`Whitespace ID: CRASHED - ${error.message}`);
    crashCount++;
  }
  
  if (crashCount > 0) {
    console.log('❌ BUG DETECTED: System crashes on bad input instead of graceful handling');
    bugCount++;
  } else {
    console.log('✅ WORKING: Graceful input validation');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // FINAL VERDICT
  console.log('🏁 FINAL VERDICT:');
  console.log(`Total bugs detected: ${bugCount}`);
  
  if (bugCount === 0) {
    console.log('✅ CODE IS FIXED: All systems working correctly');
  } else if (bugCount >= 3) {
    console.log('❌ CODE IS BROKEN: Multiple critical bugs detected');
  } else {
    console.log('⚠️  CODE IS PARTIALLY FIXED: Some issues remain');
  }
  
  console.log('\nExpected bugs in BROKEN version:');
  console.log('1. Cache contamination (cross-country validation)');
  console.log('2. Performance issue (sequential processing)');  
  console.log('3. Input validation crashes or preprocessing order');
  
  return bugCount;
}

definitiveTest().catch(console.error);