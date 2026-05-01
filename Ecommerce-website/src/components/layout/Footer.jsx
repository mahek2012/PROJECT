import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Globe, 
  Share2, 
  MessageSquare, 
  Link2, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff6b01] rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                SHOP<span className="text-[#ff6b01]">VERSE</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your one-stop destination for premium electronics, fashion, and lifestyle products. Quality guaranteed since 2024.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#ff6b01] rounded-full flex items-center justify-center transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#ff6b01] rounded-full flex items-center justify-center transition-all">
                <Share2 size={18} />
              </a>
              <a href="mailto:support@shopverse.com" className="w-10 h-10 bg-white/5 hover:bg-[#ff6b01] rounded-full flex items-center justify-center transition-all">
                <MessageSquare size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#ff6b01] rounded-full flex items-center justify-center transition-all">
                <Link2 size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-[#ff6b01]">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">All Products</Link></li>
              <li><Link to="/category/Electronics" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Electronics</Link></li>
              <li><Link to="/category/Fashion" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Fashion</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">View Cart</Link></li>
              <li><Link to="/wishlist" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-[#ff6b01]">Customer Service</h4>
            <ul className="space-y-4">
              <li><Link to="/profile" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">My Account</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Track Orders</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Shipping Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} ShopVerse E-Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
