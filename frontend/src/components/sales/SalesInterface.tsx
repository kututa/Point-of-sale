import React, { useState } from 'react';
import { Search, ShoppingCart, X, Plus, Minus, Printer, ArrowRight, AlertTriangle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  imageUrl: string;
}

interface SaleItem extends InventoryItem {
  saleQuantity: number;
  profit: number;
  profitMargin: number;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Vintage Clock',
    category: 'Timepieces',
    buyingPrice: 150,
    sellingPrice: 299,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1584208124218-0e1d8a5c1726?auto=format&fit=crop&w=200',
  },
  {
    id: '2',
    name: 'Antique Vase',
    category: 'Decor',
    buyingPrice: 100,
    sellingPrice: 199,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1584208124218-0e1d8a5c1726?auto=format&fit=crop&w=200',
  },
];

const categories = ['All', 'Timepieces', 'Decor', 'Furniture', 'Art', 'Jewelry'];

// Profit margin thresholds
const PROFIT_MARGIN_THRESHOLDS = {
  LOW: 20,
  MEDIUM: 50,
  HIGH: 100,
};

// Function to get profit margin color
const getProfitMarginColor = (margin: number): string => {
  if (margin < PROFIT_MARGIN_THRESHOLDS.LOW) return '#D9534F'; // Low margin
  if (margin < PROFIT_MARGIN_THRESHOLDS.MEDIUM) return '#D6A75B'; // Medium margin
  return '#5CB85C'; // High margin
};

export function SalesInterface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const filteredItems = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateProfit = (item: InventoryItem, quantity: number) => {
    const profit = (item.sellingPrice - item.buyingPrice) * quantity;
    const profitMargin = ((item.sellingPrice - item.buyingPrice) / item.buyingPrice) * 100;
    return { profit, profitMargin };
  };

  const addToCart = (item: InventoryItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      if (existingItem.saleQuantity >= item.quantity) {
        toast.error('Maximum available quantity reached');
        return;
      }
      const newQuantity = existingItem.saleQuantity + 1;
      const { profit, profitMargin } = calculateProfit(item, newQuantity);
      
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, saleQuantity: newQuantity, profit, profitMargin }
          : cartItem
      ));
    } else {
      const { profit, profitMargin } = calculateProfit(item, 1);
      if (profitMargin < 0) {
        toast.error('Warning: Item is being sold below cost!');
      }
      setCartItems([...cartItems, { ...item, saleQuantity: 1, profit, profitMargin }]);
    }
    toast.success('Item added to cart');
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.saleQuantity + change;
        if (newQuantity > item.quantity) {
          toast.error('Maximum available quantity reached');
          return item;
        }
        if (newQuantity < 1) {
          toast.error('Minimum quantity is 1');
          return item;
        }
        const { profit, profitMargin } = calculateProfit(item, newQuantity);
        return { ...item, saleQuantity: newQuantity, profit, profitMargin };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.sellingPrice * item.saleQuantity), 0);
  };

  const getTotalProfit = () => {
    return cartItems.reduce((total, item) => total + item.profit, 0);
  };

  const getAverageProfitMargin = () => {
    if (cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + item.profitMargin, 0) / cartItems.length;
  };

  const handleCheckout = () => {
    // Validate profit margins
    const lowMarginItems = cartItems.filter(item => item.profitMargin < PROFIT_MARGIN_THRESHOLDS.LOW);
    if (lowMarginItems.length > 0) {
      const confirm = window.confirm(
        `Warning: ${lowMarginItems.length} items have low profit margins. Proceed with sale?`
      );
      if (!confirm) return;
    }

    // Handle checkout logic here
    toast.success('Sale completed successfully');
    setCartItems([]);
    setShowCheckout(false);
  };

  const handlePrintReceipt = () => {
    // Handle receipt printing logic here
    toast.success('Receipt sent to printer');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Product Selection */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
            New Sale
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-text-dark/60">
              {cartItems.length} items
            </span>
            <button
              onClick={() => setShowCheckout(true)}
              disabled={cartItems.length === 0}
              className="btn-primary flex items-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Checkout</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="pl-10 input-field"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const { profitMargin } = calculateProfit(item, 1);
            const isLowMargin = profitMargin < PROFIT_MARGIN_THRESHOLDS.LOW;

            return (
              <div
                key={item.id}
                className="bg-surface rounded-lg shadow-soft p-4 flex space-x-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-primary">{item.name}</h3>
                  <p className="text-sm text-text-dark/60">{item.category}</p>
                  <p className="text-lg font-semibold text-primary mt-2">
                    ${item.sellingPrice}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-sm ${
                      item.quantity <= 5 ? 'text-error' : 'text-text-dark/60'
                    }`}>
                      {item.quantity} available
                    </span>
                    {isLowMargin && (
                      <span className="text-error flex items-center text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Low margin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className="text-sm"
                      style={{ color: getProfitMarginColor(profitMargin) }}
                    >
                      {profitMargin.toFixed(1)}% margin
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.quantity === 0}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Add to Sale
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Panel */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-surface shadow-xl transform transition-transform ${
        showCheckout ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary">
              Current Sale
            </h2>
            <button
              onClick={() => setShowCheckout(false)}
              className="p-2 hover:bg-primary/10 rounded-full"
            >
              <X className="h-6 w-6 text-primary" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 border-b border-border dark:border-primary/20"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-primary">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-dark/60">
                      ${item.sellingPrice} each
                    </p>
                    <span
                      className="text-sm font-medium"
                      style={{ color: getProfitMarginColor(item.profitMargin) }}
                    >
                      ${item.profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-primary/10 rounded-full"
                    >
                      <Minus className="h-4 w-4 text-primary" />
                    </button>
                    <span className="text-text-dark dark:text-text-light">
                      {item.saleQuantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-primary/10 rounded-full"
                    >
                      <Plus className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-error/10 rounded-full ml-auto"
                    >
                      <X className="h-4 w-4 text-error" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border dark:border-primary/20 pt-4 mt-4">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-text-dark/60">Subtotal</span>
                <span className="font-medium text-primary">
                  ${getTotalAmount().toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-dark/60">Total Profit</span>
                <span
                  className="font-medium"
                  style={{ color: getProfitMarginColor(getAverageProfitMargin()) }}
                >
                  ${getTotalProfit().toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-dark/60">Avg. Margin</span>
                <span
                  className="font-medium"
                  style={{ color: getProfitMarginColor(getAverageProfitMargin()) }}
                >
                  {getAverageProfitMargin().toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handlePrintReceipt}
                disabled={cartItems.length === 0}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Printer className="h-5 w-5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <ArrowRight className="h-5 w-5" />
                <span>Complete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}