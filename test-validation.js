const ProductProcessor = require('./src/product-processor');

async function testValidationConsistency() {
  console.log('=== Testing Validation Consistency ===\n');
  
  const processor = new ProductProcessor();
  
  // Test the cache contamination bug
  const scenarios = [
    { name: 'German Medicine', country: 'DE', regulatoryId: 'DE-12345-ABCD' },
    { name: 'French Medicine', country: 'FR', regulatoryId: 'DE-12345-ABCD' }, // Same ID, different country
    { name: 'German Medicine 2', country: 'DE', regulatoryId: 'DE-12345-ABCD' }, // Same as first
  ];
  
  console.log('Testing same regulatory ID across different countries:');
  console.log('(DE-12345-ABCD should be valid for Germany, invalid for France)\n');
  
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`${i + 1}. Testing: ${scenario.country} - ${scenario.regulatoryId}`);
    
    const result = await processor.processSubmission(scenario);
    console.log(`   Result: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    
    if (!result.success) {
      console.log(`   Errors: ${result.errors.join(', ')}`);
    }
    
    console.log(`   Cache hits so far: ${processor.getStats().cacheHits}`);
    console.log('');
  }
  
  console.log('Expected behavior:');
  console.log('1. SUCCESS (valid German ID)');
  console.log('2. FAILED (German ID format not valid for France)');
  console.log('3. SUCCESS (valid German ID)');
  console.log('\nIf test 2 shows SUCCESS, you found the cache bug!');
}

testValidationConsistency().catch(console.error);