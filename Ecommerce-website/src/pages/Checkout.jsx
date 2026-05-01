import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, MapPin, ChevronLeft, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { clearCart } from '../redux/slices/cartSlice';
import { placeOrder } from '../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    country: '',
    paymentMethod: 'card',
  });

  const shipping = totalAmount > 500 ? 0 : 50;
  const tax = totalAmount * 0.1;
  const total = totalAmount + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      items,
      totalAmount: total,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`,
      paymentMethod: formData.paymentMethod,
    };

    const result = await dispatch(placeOrder(orderData));
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/order-confirmation', { state: { orderId: result.payload.order?._id || 'ORD-' + Math.floor(Math.random() * 1000000) } });
    } else {
      toast.error(result.payload || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/cart" className="p-2 bg-white rounded-full text-gray-600 hover:text-orange-600 shadow-sm transition-all">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
          {/* Main Info */}
          <div className="flex-1 space-y-8">
            {/* Shipping Address */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Shipping Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="123 Main St, Apt 4"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ZIP / Postal Code</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                  <select
                    required
                    className="input-field"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="IND">India</option>
                    <option value="CAN">Canada</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <span className="block font-bold text-gray-900">Credit / Debit Card</span>
                    <span className="text-xs text-gray-500 font-medium">Safe and secure transaction</span>
                  </div>
                  <div className="flex gap-1 text-gray-400">
                    <CreditCard size={24} />
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <span className="block font-bold text-gray-900">Cash on Delivery</span>
                    <span className="text-xs text-gray-500 font-medium">Pay when you receive</span>
                  </div>
                  <Truck size={24} className="text-gray-400" />
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 animate-in fade-in duration-500">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                    <input type="text" className="input-field" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                    <input type="text" className="input-field" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                    <input type="text" className="input-field" placeholder="123" />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-28 space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-gray-900 font-bold'}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Tax (10%)</span>
                  <span className="text-gray-900 font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg shadow-xl shadow-orange-100 group"
              >
                Place Order <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <Lock size={14} /> Encrypted & Secure
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
