function formatRegulatoryId(id, country) {
  if (!id || typeof id !== 'string') {
    return '';
  }
  
  const clean = id.trim().toUpperCase();
  
  switch (country) {
    case 'DE':
      if (clean.match(/^DE\d{5}[A-Z]{4}$/)) {
        return clean.replace(/^(DE)(\d{5})([A-Z]{4})$/, '$1-$2-$3');
      }
      return clean;
    case 'FR':
    case 'IT':
    case 'ES':
    case 'CH':
    case 'AT':
    case 'NL':
    default:
      return clean;
  }
}

function logSubmission(productData, result) {
  const timestamp = new Date().toISOString();
  const country = productData?.country || 'UNKNOWN';
  const regId = productData?.regulatoryId || 'NO_ID';
  const status = result.success ? 'SUCCESS' : 'FAILED';
  
  console.log(`[${timestamp}] ${country} - ${regId}: ${status}`);
  
  if (!result.success && result.errors) {
    console.log(`  Errors: ${result.errors.join(', ')}`);
  }
}

function validateInput(data, requiredFields = []) {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    return ['Input must be a valid object'];
  }
  
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  return errors;
}

module.exports = {
  formatRegulatoryId,
  logSubmission,
  validateInput
};