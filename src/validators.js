const { formatRegulatoryId } = require('./utils');

class ProductValidator {
  constructor() {
    this.supportedCountries = ['DE', 'FR', 'IT', 'ES', 'CH', 'AT', 'NL'];
    this.validationCache = new Map();
    this.cacheHits = 0;
  }

  validateRegulatoryId(regulatoryId, country) {
    const cacheKey = regulatoryId;
    
    if (this.validationCache.has(cacheKey)) {
      this.cacheHits++;
      return this.validationCache.get(cacheKey);
    }

    const patterns = {
      'DE': /^DE-?\d{5}-?[A-Z]{4}$/i,
      'FR': /^FR[A-Z]{2}\d{6}$/i,
      'IT': /^IT\d{8}[A-Z]{2}$/i,
      'ES': /^ES[A-Z]\d{7}[A-Z]$/i,
      'CH': /^CH\d{6}[A-Z]{3}$/i,
      'AT': /^AT[A-Z]{3}\d{5}$/i,
      'NL': /^NL\d{4}[A-Z]{4}\d{2}$/i
    };

    if (!patterns[country]) {
      const result = { valid: false, error: 'Unsupported country code' };
      this.validationCache.set(cacheKey, result);
      return result;
    }

    const cleanId = this.preprocessId(regulatoryId);
    const isValid = patterns[country].test(cleanId);
    
    const result = isValid ? 
      { valid: true, cleanId: cleanId } : 
      { valid: false, error: 'Invalid regulatory ID format' };

    this.validationCache.set(cacheKey, result);
    return result;
  }

  preprocessId(id) {
    return id.trim().toUpperCase().replace(/\s+/g, '');
  }

  validateProduct(productData) {
    const errors = [];
    
    if (!productData.name || productData.name.length < 2) {
      errors.push('Product name must be at least 2 characters');
    }

    if (!productData.country || !this.supportedCountries.includes(productData.country)) {
      errors.push('Invalid or unsupported country');
    }

    if (!productData.regulatoryId) {
      errors.push('Regulatory ID is required');
    } else {
      try {
        const idValidation = this.validateRegulatoryId(productData.regulatoryId, productData.country);
        if (!idValidation.valid) {
          errors.push(idValidation.error);
        }
      } catch (e) {
        errors.push('Regulatory ID validation error');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      cacheHits: this.cacheHits
    };
  }

  clearCache() {
    this.validationCache.clear();
    this.cacheHits = 0;
  }
}

module.exports = ProductValidator;