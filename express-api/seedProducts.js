const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productModel = require('./models/product.model');

dotenv.config();

const products = [
  // ── Electronics ──────────────────────────────────────
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with crystal-clear hands-free calling and Alexa voice control. Up to 30 hours battery life.',
    price: 29999,
    stock: 45,
    discount: 15,
    sku: 'SONY-WH1000XM5-BLK',
    brand: 'Sony',
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    isNewproduct: true,
  },
  {
    name: 'LG 55" 4K OLED Smart TV',
    description: 'Perfect black levels and infinite contrast ratio with Dolby Vision IQ and Dolby Atmos support. WebOS smart platform included.',
    price: 89999,
    stock: 12,
    discount: 10,
    sku: 'LG-OLED55-2024',
    brand: 'LG',
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500'],
    isNewproduct: true,
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera',
    description: '24.2MP APS-C sensor, 4K video, dual pixel CMOS AF II with subject tracking. Perfect for vloggers and content creators.',
    price: 64999,
    stock: 20,
    discount: 5,
    sku: 'CANON-EOSR50-BDL',
    brand: 'Canon',
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500'],
    isNewproduct: false,
  },

  // ── Mobile & Accessories ─────────────────────────────
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Latest Samsung flagship with 200MP camera, built-in S Pen, Snapdragon 8 Gen 3, and 5000mAh battery with 45W fast charging.',
    price: 124999,
    stock: 35,
    discount: 8,
    sku: 'SAM-S24ULTRA-BLK',
    brand: 'Samsung',
    category: 'Mobile & Accessories',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'],
    isNewproduct: true,
  },
  {
    name: 'Apple iPhone 15 Pro',
    description: 'Titanium design with A17 Pro chip, 48MP main camera with 5x optical zoom, Action Button, and USB-C connectivity.',
    price: 134900,
    stock: 28,
    discount: 0,
    sku: 'APPLE-IP15PRO-128',
    brand: 'Apple',
    category: 'Mobile & Accessories',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'],
    isNewproduct: true,
  },
  {
    name: 'Anker 65W GaN Fast Charger',
    description: 'Compact 3-port USB-C charger with GaN technology. Compatible with iPhone, Samsung, MacBook and all USB-C devices.',
    price: 2499,
    stock: 200,
    discount: 20,
    sku: 'ANKER-65W-GAN-3PORT',
    brand: 'Anker',
    category: 'Mobile & Accessories',
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'],
    isNewproduct: false,
  },

  // ── Fashion ──────────────────────────────────────────
  {
    name: "Men's Premium Slim Fit Shirt",
    description: 'Made from 100% premium cotton with a slim-fit cut. Available in multiple colors. Machine washable and wrinkle-resistant.',
    price: 1299,
    stock: 150,
    discount: 30,
    sku: 'FASHION-SHIRT-MSLIM-L',
    brand: 'Raymond',
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500'],
    isNewproduct: false,
  },
  {
    name: "Women's Floral Kurta Set",
    description: 'Elegant floral print kurta with palazzo pants. Made from breathable rayon fabric. Perfect for festive occasions.',
    price: 1899,
    stock: 80,
    discount: 25,
    sku: 'FASHION-KURTA-W-FLRL',
    brand: 'Biba',
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500'],
    isNewproduct: true,
  },
  {
    name: 'Nike Air Max 270 Sneakers',
    description: 'Lightweight running shoes with Max Air heel unit for all-day comfort. Breathable mesh upper and rubber outsole.',
    price: 8995,
    stock: 60,
    discount: 12,
    sku: 'NIKE-AIRMAX270-WHT-10',
    brand: 'Nike',
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    isNewproduct: true,
  },

  // ── Gaming ───────────────────────────────────────────
  {
    name: 'Sony PlayStation 5 Console',
    description: 'Next-gen gaming with ultra-high speed SSD, haptic feedback DualSense controller, 4K gaming at 120fps, and ray tracing.',
    price: 54990,
    stock: 8,
    discount: 0,
    sku: 'SONY-PS5-STD-2024',
    brand: 'Sony',
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1607853202273-232359e857cc?w=500'],
    isNewproduct: false,
  },
  {
    name: 'Razer DeathAdder V3 Gaming Mouse',
    description: '59g ultra-lightweight gaming mouse with Focus Pro 30K optical sensor, 90 hours battery life, and HyperSpeed wireless.',
    price: 8499,
    stock: 40,
    discount: 10,
    sku: 'RAZER-DAV3-WHT',
    brand: 'Razer',
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
    isNewproduct: true,
  },
  {
    name: 'MSI 27" 165Hz Gaming Monitor',
    description: '1440p QHD IPS panel with 165Hz refresh rate, 1ms response time, G-Sync compatible, and wide color gamut coverage.',
    price: 24999,
    stock: 15,
    discount: 18,
    sku: 'MSI-27QHD-165HZ',
    brand: 'MSI',
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a573d5f6e4?w=500'],
    isNewproduct: true,
  },

  // ── Groceries ────────────────────────────────────────
  {
    name: 'Tata Organic Green Tea (100 bags)',
    description: 'Premium organic green tea sourced from the gardens of Darjeeling. Rich in antioxidants, zero calories, zero sugar.',
    price: 299,
    stock: 500,
    discount: 10,
    sku: 'TATA-GREENTEA-ORG-100',
    brand: 'Tata Tea',
    category: 'Groceries',
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'],
    isNewproduct: false,
  },
  {
    name: 'Patanjali Desi Ghee 1kg',
    description: '100% pure cow ghee prepared using the traditional Vedic method. Rich in essential fatty acids and fat-soluble vitamins.',
    price: 599,
    stock: 300,
    discount: 5,
    sku: 'PATANJALI-GHEE-1KG',
    brand: 'Patanjali',
    category: 'Groceries',
    images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500'],
    isNewproduct: false,
  },
  {
    name: 'Aashirvaad Multi Grain Atta 5kg',
    description: 'Whole wheat flour blended with 6 grains including oats, ragi, and soya. No preservatives, no artificial colours.',
    price: 349,
    stock: 450,
    discount: 8,
    sku: 'AASHIRVAAD-MGATTA-5KG',
    brand: 'Aashirvaad',
    category: 'Groceries',
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500'],
    isNewproduct: false,
  },

  // ── Books ────────────────────────────────────────────
  {
    name: 'Atomic Habits by James Clear',
    description: 'The #1 New York Times bestseller. Tiny changes, remarkable results. A proven framework for improving every day.',
    price: 499,
    stock: 200,
    discount: 30,
    sku: 'BOOK-ATOMICHABITS-ENG',
    brand: 'Avery',
    category: 'Books',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    isNewproduct: false,
  },
  {
    name: 'Rich Dad Poor Dad by Robert Kiyosaki',
    description: "What the rich teach their kids about money that the poor and middle class do not. A classic personal finance book.",
    price: 399,
    stock: 180,
    discount: 25,
    sku: 'BOOK-RICHDADPOORDAD-ENG',
    brand: 'Warner Books',
    category: 'Books',
    images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500'],
    isNewproduct: false,
  },
  {
    name: 'The Alchemist by Paulo Coelho',
    description: "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    price: 299,
    stock: 250,
    discount: 20,
    sku: 'BOOK-ALCHEMIST-ENG',
    brand: 'HarperCollins',
    category: 'Books',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'],
    isNewproduct: false,
  },

  // ── Home & Decor ─────────────────────────────────────
  {
    name: 'Philips Hue Smart LED Bulb (3 Pack)',
    description: 'Control with voice or app. 16 million colors, dimmable, compatible with Alexa, Google Home and Apple HomeKit.',
    price: 3999,
    stock: 75,
    discount: 15,
    sku: 'PHILIPS-HUE-3PACK-E27',
    brand: 'Philips',
    category: 'Home & Decor',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    isNewproduct: true,
  },
  {
    name: 'Prestige Svachh Pressure Cooker 5L',
    description: 'Aluminium pressure cooker with deep lid for spill-free cooking. ISI certified, suitable for all heat sources.',
    price: 1299,
    stock: 100,
    discount: 20,
    sku: 'PRESTIGE-SVACHH-5L',
    brand: 'Prestige',
    category: 'Home & Decor',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
    isNewproduct: false,
  },

  // ── Beauty ───────────────────────────────────────────
  {
    name: "L'Oreal Paris Revitalift Serum 30ml",
    description: '1.5% Pure Hyaluronic Acid + Vitamin C serum. Visibly plumps skin and reduces dark spots in 7 days. Fragrance free.',
    price: 899,
    stock: 120,
    discount: 22,
    sku: 'LOREAL-REVITALIFT-30ML',
    brand: "L'Oreal",
    category: 'Beauty',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
    isNewproduct: true,
  },
  {
    name: 'Lakme Absolute Matte Lipstick',
    description: 'Long-lasting matte finish lipstick enriched with argan oil. Transfer-proof formula, lasts up to 16 hours. 35 shades available.',
    price: 449,
    stock: 200,
    discount: 15,
    sku: 'LAKME-ABSMAT-RED01',
    brand: 'Lakme',
    category: 'Beauty',
    images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2b7b?w=500'],
    isNewproduct: false,
  },

  // ── Sports ───────────────────────────────────────────
  {
    name: 'Nivia Carbonite Power Basketball',
    description: 'Official size and weight basketball with carbon fibre texture for better grip. Suitable for indoor and outdoor play.',
    price: 1199,
    stock: 60,
    discount: 18,
    sku: 'NIVIA-BASKETBALL-CARBON',
    brand: 'Nivia',
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1546519638405-a9f1e56b5bde?w=500'],
    isNewproduct: false,
  },
  {
    name: 'Decathlon Fitness Yoga Mat 6mm',
    description: 'Non-slip PVC yoga mat with alignment lines. 6mm thickness for joint protection. Easy to clean and carry.',
    price: 799,
    stock: 150,
    discount: 10,
    sku: 'DECATHLON-YOGAMAT-6MM',
    brand: 'Decathlon',
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    isNewproduct: true,
  },

  // ── Accessories ──────────────────────────────────────
  {
    name: 'Fossil Gen 6 Smartwatch',
    description: 'Wear OS smartwatch with Snapdragon 4100+ chip, SpO2 sensor, GPS, NFC payments, and 24hr fitness tracking.',
    price: 19995,
    stock: 30,
    discount: 25,
    sku: 'FOSSIL-GEN6-BRN-44MM',
    brand: 'Fossil',
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    isNewproduct: true,
  },
  {
    name: 'Ray-Ban Wayfarer Classic Sunglasses',
    description: 'Iconic Wayfarer design with 100% UV protection. G-15 green lenses reduce glare while maintaining true colour perception.',
    price: 7490,
    stock: 50,
    discount: 0,
    sku: 'RAYBAN-WAYFARER-BLK-52',
    brand: 'Ray-Ban',
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    isNewproduct: false,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB se connect ho gaya');

    // Pehle sab delete karo (fresh seed ke liye)
    const existing = await productModel.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  ${existing} products pehle se exist karte hain.`);
      console.log('   Force re-seed ke liye: node seedProducts.js --force');
      if (!process.argv.includes('--force')) {
        await mongoose.disconnect();
        return;
      }
      await productModel.deleteMany({});
      console.log('🗑️  Purane products delete ho gaye');
    }

    const inserted = await productModel.insertMany(products);
    console.log(`\n🎉 ${inserted.length} products successfully MongoDB mein add ho gaye!\n`);

    // Category-wise summary
    const categorySummary = {};
    products.forEach(p => {
      categorySummary[p.category] = (categorySummary[p.category] || 0) + 1;
    });
    console.log('📊 Category-wise breakdown:');
    Object.entries(categorySummary).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done! Admin panel refresh karein.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedProducts();
