class MockDatabase {
  constructor() {
    this.products = new Map();
    this.currentId = 1000;
  }

  async saveProduct(productData) {
    await new Promise(resolve => setTimeout(resolve, 25));
    
    const productId = `PROD-${this.currentId++}`;
    
    const productRecord = {
      id: productId,
      ...productData,
      createdAt: new Date()
    };
    
    this.products.set(productId, productRecord);
    return productId;
  }

  async findProduct(productId) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return this.products.get(productId);
  }

  async findByRegulatoryId(regulatoryId) {
    await new Promise(resolve => setTimeout(resolve, 15));
    
    for (const [id, product] of this.products.entries()) {
      if (product.regulatoryId === regulatoryId) {
        return product;
      }
    }
    return null;
  }

  getSize() {
    return this.products.size;
  }

  clear() {
    this.products.clear();
    this.currentId = 1000;
  }
}

module.exports = MockDatabase;