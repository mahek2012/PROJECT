const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container-custom max-w-4xl">
        <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <p className="text-sm text-gray-400">Last Updated: May 2024</p>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p>We collect information to provide better services to our users. This includes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2 font-medium">
                <li>Personal identifiers (Name, Email, Phone number)</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely via third-party gateways)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Data</h2>
              <p>Your data is strictly used for fulfilling your orders, improving the website experience, and providing customer support. We do not sell your data to third-party marketing companies.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Security</h2>
              <p>We implement a variety of security measures to maintain the safety of your personal information. All sensitive payment information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our payment gateway providers' database.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cookies</h2>
              <p>We use cookies to enhance your experience, remember your cart items, and understand how you interact with our website. You can choose to have your computer warn you each time a cookie is being sent, or you can turn off all cookies via your browser settings.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
