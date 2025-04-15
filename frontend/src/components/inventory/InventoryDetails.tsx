import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, DollarSign, TrendingUp, History, Tag } from 'lucide-react';
import { format } from 'date-fns';

const mockItem = {
  id: '1',
  name: 'Vintage Clock',
  category: 'Timepieces',
  description: 'Beautiful antique wall clock from the 1920s',
  buyingPrice: 150,
  sellingPrice: 299,
  quantity: 2,
  imageUrl: 'https://images.unsplash.com/photo-1584208124218-0e1d8a5c1726?auto=format&fit=crop&w=400',
  salesHistory: [
    { date: new Date(), quantity: 1, price: 299 },
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), quantity: 2, price: 299 },
  ],
  relatedItems: [
    { id: '2', name: 'Antique Watch', imageUrl: 'https://images.unsplash.com/photo-1584208124218-0e1d8a5c1726?auto=format&fit=crop&w=100' },
    { id: '3', name: 'Grandfather Clock', imageUrl: 'https://images.unsplash.com/photo-1584208124218-0e1d8a5c1726?auto=format&fit=crop&w=100' },
  ],
};

export function InventoryDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const totalSales = mockItem.salesHistory.reduce((acc, sale) => acc + (sale.quantity * sale.price), 0);
  const totalQuantitySold = mockItem.salesHistory.reduce((acc, sale) => acc + sale.quantity, 0);
  const profitMargin = ((mockItem.sellingPrice - mockItem.buyingPrice) / mockItem.buyingPrice) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/inventory')}
          className="p-2 hover:bg-primary/10 rounded-full"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </button>
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          Item Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-lg shadow-soft p-6">
            <div className="flex items-start space-x-6">
              <img
                src={mockItem.imageUrl}
                alt={mockItem.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-primary dark:text-accent-dark">
                      {mockItem.name}
                    </h2>
                    <span className="inline-block mt-1 px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
                      {mockItem.category}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/inventory/${id}/edit`)}
                    className="btn-primary"
                  >
                    Edit Item
                  </button>
                </div>
                <p className="mt-4 text-text-dark dark:text-text-light">
                  {mockItem.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-primary/5 rounded-lg">
                <Package className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm text-text-dark/60">Quantity</p>
                <p className="text-lg font-semibold text-primary">
                  {mockItem.quantity}
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <DollarSign className="h-5 w-5 text-success mb-2" />
                <p className="text-sm text-text-dark/60">Selling Price</p>
                <p className="text-lg font-semibold text-primary">
                  ${mockItem.sellingPrice}
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm text-text-dark/60">Profit Margin</p>
                <p className="text-lg font-semibold text-primary">
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <History className="h-5 w-5 text-secondary mb-2" />
                <p className="text-sm text-text-dark/60">Total Sales</p>
                <p className="text-lg font-semibold text-primary">
                  ${totalSales}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Analytics Card */}
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Sales Analytics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20">
              <span className="text-text-dark dark:text-text-light">Units Sold</span>
              <span className="font-semibold text-primary">{totalQuantitySold}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20">
              <span className="text-text-dark dark:text-text-light">Total Revenue</span>
              <span className="font-semibold text-primary">${totalSales}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-text-dark dark:text-text-light">Profit Margin</span>
              <span className="font-semibold text-success">{profitMargin.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Sales History */}
        <div className="lg:col-span-2 bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Sales History
          </h3>
          <div className="space-y-4">
            {mockItem.salesHistory.map((sale, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20 last:border-0"
              >
                <div>
                  <p className="text-text-dark dark:text-text-light">
                    {format(sale.date, 'PPp')}
                  </p>
                  <p className="text-sm text-text-dark/60">
                    Quantity: {sale.quantity}
                  </p>
                </div>
                <span className="text-primary font-semibold">
                  ${(sale.quantity * sale.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Items */}
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Related Items
          </h3>
          <div className="space-y-4">
            {mockItem.relatedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-2 hover:bg-primary/5 rounded-lg cursor-pointer"
                onClick={() => navigate(`/inventory/${item.id}`)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <span className="text-text-dark dark:text-text-light">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}