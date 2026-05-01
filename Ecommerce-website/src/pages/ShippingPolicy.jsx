const ShippingPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container-custom max-w-4xl">
        <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-8">Shipping Policy</h1>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Delivery Time</h2>
              <p>We strive to deliver your orders as quickly as possible. Standard delivery times are:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2 font-medium">
                <li>Metropolitan Areas: 3-5 business days</li>
                <li>Regional Areas: 5-7 business days</li>
                <li>Remote Areas: 7-10 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Shipping Charges</h2>
              <p>Shipping charges are calculated based on the weight of the items and the delivery destination.</p>
              <ul className="list-disc pl-6 mt-2 space-y-2 font-medium">
                <li>Orders over $500: <span className="font-bold text-green-500">FREE SHIPPING</span></li>
                <li>Standard Shipping: $10 flat rate for orders under $500.</li>
                <li>Express Shipping: $25 flat rate for 1-2 day delivery.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Areas Covered</h2>
              <p>Currently, we ship to all states and territories across the country. We do not support international shipping at this moment, but we are working on expanding our reach globally soon.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Order Tracking</h2>
              <p>Once your order has been dispatched, you will receive an email containing a tracking link. You can also use our Track Orders page to monitor the live status of your delivery.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
