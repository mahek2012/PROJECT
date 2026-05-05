import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus, Search, Filter, Edit, Trash2, ChevronLeft,
  Image as ImageIcon, X, Package, Tag, ChevronDown, 
  Upload, Download, FileText, Palette, Maximize
} from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/slices/productSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import axiosInstance from '../../services/api/axiosInstance';
import { Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Mobile & Accessories',
  'Groceries',
  'Gaming',
  'Books',
  'Home & Decor',
  'Beauty',
  'Accessories',
  'Sports',
];

const CATEGORY_COLORS = {
  Electronics:           { bg: 'bg-blue-50',   text: 'text-blue-600' },
  Fashion:               { bg: 'bg-pink-50',   text: 'text-pink-600' },
  'Mobile & Accessories':{ bg: 'bg-purple-50', text: 'text-purple-600' },
  Groceries:             { bg: 'bg-green-50',  text: 'text-green-600' },
  Gaming:                { bg: 'bg-red-50',    text: 'text-red-600' },
  Books:                 { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  'Home & Decor':        { bg: 'bg-teal-50',   text: 'text-teal-600' },
  Beauty:                { bg: 'bg-rose-50',   text: 'text-rose-600' },
  Accessories:           { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  Sports:                { bg: 'bg-orange-50', text: 'text-orange-600' },
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const fileInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCatMenuOpen, setIsCatMenuOpen]   = useState(false);
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [isGenerating, setIsGenerating]     = useState(false);

  // Advanced Fields State
  const [images, setImages] = useState(['']);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  // ─── Actions ────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingProduct(null);
    setImages(['']);
    setSizes([]);
    setColors([]);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setImages(product.images?.length > 0 ? [...product.images] : ['']);
    setSizes(product.sizes || []);
    setColors(product.colors || []);
    setIsModalOpen(true);
  };

  const handleAddImage = () => setImages([...images, '']);
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages.length > 0 ? newImages : ['']);
  };
  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };
  const handleRemoveSize = (size) => setSizes(sizes.filter(s => s !== size));

  const handleAddColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };
  const handleRemoveColor = (color) => setColors(colors.filter(c => c !== color));

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        let successCount = 0;
        let failCount = 0;

        toast.info(`Uploading ${data.length} products...`);

        for (const row of data) {
          try {
            const productData = {
              name: row.name,
              sku: row.sku,
              brand: row.brand,
              category: row.category,
              price: Number(row.price),
              stock: Number(row.stock),
              discount: Number(row.discount || 0),
              description: row.description,
              images: row.images ? row.images.split(',') : [],
              sizes: row.sizes ? row.sizes.split(',') : [],
              colors: row.colors ? row.colors.split(',') : [],
              isNewProduct: true
            };
            await dispatch(createProduct(productData)).unwrap();
            successCount++;
          } catch (err) {
            failCount++;
          }
        }
        toast.success(`${successCount} products uploaded! ✅`);
        if (failCount > 0) toast.error(`${failCount} products failed.`);
      }
    });
  };

  const downloadSampleCSV = () => {
    const csvContent = "name,sku,brand,category,price,stock,discount,description,images,sizes,colors\nSample Phone,SKU-123,BrandX,Electronics,19999,50,10,Great phone,https://image1.jpg,Large,Black";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_products.csv';
    a.click();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.target);

    const validImages = images.filter(img => img.trim() !== '');

    const productData = {
      name:        fd.get('name'),
      sku:         fd.get('sku'),
      brand:       fd.get('brand'),
      category:    fd.get('category'),
      price:       Number(fd.get('price')),
      stock:       Number(fd.get('stock')),
      discount:    Number(fd.get('discount') || 0),
      description: fd.get('description'),
      images:      validImages.length > 0 ? validImages : ['https://placehold.co/400x400?text=No+Image'],
      sizes:       sizes,
      colors:      colors,
      isNewProduct: fd.get('isNewProduct') === 'on',
    };

    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct._id || editingProduct.id, data: productData })).unwrap();
        toast.success('Product updated! ✅');
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success('Product added! ✅');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateDescription = async () => {
    const form = document.querySelector('form');
    const name = form.name.value;
    const category = form.category.value;
    const brand = form.brand.value;

    if (!name || !category) {
      toast.warning('Please enter product name and category first! ⚠️');
      return;
    }

    try {
      setIsGenerating(true);
      const res = await axiosInstance.post('/products/generate-description', { name, category, brand });
      if (res.data?.success) {
        const textarea = document.querySelector('textarea[name="description"]');
        if (textarea) {
          textarea.value = res.data.description;
          toast.success('Description generated! 🤖✨');
        }
      }
    } catch (err) {
      toast.error('AI Generation failed. ❌');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted! ✅');
    } catch (error) {
      toast.error(error || 'Failed to delete product');
    }
  };

  // ─── Filters ────────────────────────────────────────────────────
  const filteredProducts = products.filter((p) => {
    const matchCat  = activeCategory === 'All' || p.category === activeCategory;
    const q         = searchQuery.toLowerCase();
    const matchSearch = !q ||
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)  ||
      p.brand?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const catColor = (cat) => CATEGORY_COLORS[cat] || { bg: 'bg-gray-50', text: 'text-gray-600' };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-custom">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-2 bg-white rounded-full text-gray-500 hover:text-orange-600 shadow-sm transition-all"><ChevronLeft /></button>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Products</h1>
              <p className="text-gray-500 font-medium">{filteredProducts.length} items available in inventory</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <input type="file" ref={fileInputRef} onChange={handleCSVUpload} accept=".csv" className="hidden" />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="px-5 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Upload size={18} /> Bulk Upload
            </button>
            <button 
              onClick={downloadSampleCSV}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-orange-600 transition-all shadow-sm"
              title="Download Sample CSV"
            >
              <Download size={20} />
            </button>
            <button
              onClick={openAdd}
              className="btn-primary py-3 px-8 flex items-center justify-center gap-2 shadow-xl shadow-orange-200"
            >
              <Plus size={20} /> Add Product
            </button>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, or brand..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-gray-700 placeholder:text-gray-300"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsCatMenuOpen((o) => !o)}
              className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl font-black text-gray-700 hover:bg-gray-100 transition-all"
            >
              <Filter size={18} />
              {activeCategory === 'All' ? 'Filter: Category' : activeCategory}
              <ChevronDown size={16} className={`transition-transform ${isCatMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isCatMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-16 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 min-w-[240px] overflow-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setIsCatMenuOpen(false); }}
                      className={`w-full text-left px-6 py-3 text-sm font-bold transition-all ${
                        activeCategory === cat ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-400 font-bold">Synchronizing Inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 text-center px-10">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200"><Package size={40} /></div>
              <p className="text-gray-400 font-black text-xl">No products matched your search</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="text-orange-600 font-black hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Variants</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((p) => (
                    <tr key={p._id || p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform shrink-0">
                            <img src={p.images?.[0] || 'https://placehold.co/400x400?text=No+Image'} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-base">{p.name}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{p.brand} · {p.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${catColor(p.category).bg} ${catColor(p.category).text}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-black text-gray-900 text-lg">₹{p.price}</p>
                          {p.discount > 0 && <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Save {p.discount}%</p>}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className={`text-sm font-black ${p.stock > 10 ? 'text-gray-900' : 'text-red-500'}`}>{p.stock} units</span>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${p.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(p.stock, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {p.sizes?.map(s => <span key={s} className="px-2 py-0.5 bg-gray-100 text-[10px] font-black rounded-lg text-gray-500">{s}</span>)}
                          {p.colors?.map(c => <span key={c} className="px-2 py-0.5 bg-gray-100 text-[10px] font-black rounded-lg text-gray-500">{c}</span>)}
                          {(!p.sizes?.length && !p.colors?.length) && <span className="text-[10px] text-gray-300 font-bold uppercase">Standard</span>}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)} className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all shadow-sm hover:shadow-blue-100"><Edit size={18}/></button>
                          <button onClick={() => handleDelete(p._id || p.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm hover:shadow-red-100"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Product Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-10 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{editingProduct ? 'Update Product' : 'Add New Product'}</h2>
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">Inventory Management System</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900"><X size={28} /></button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-10 overflow-y-auto space-y-10">
                {/* Basic Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-orange-600 mb-6">
                    <FileText size={20} />
                    <h3 className="font-black uppercase tracking-widest text-xs">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                      <input name="name" type="text" defaultValue={editingProduct?.name} required className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 font-bold text-gray-700" placeholder="e.g. UltraFit Wireless Headphones" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                      <select name="category" defaultValue={editingProduct?.category || 'Electronics'} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 font-bold text-gray-700">
                        {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">SKU Number</label>
                      <input name="sku" type="text" defaultValue={editingProduct?.sku} required className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 font-bold text-gray-700" placeholder="SKU-123-ABC" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Brand</label>
                      <input name="brand" type="text" defaultValue={editingProduct?.brand} required className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 font-bold text-gray-700" placeholder="e.g. Sony" />
                    </div>
                    <div className="flex items-end pb-4 gap-3">
                      <input type="checkbox" name="isNewProduct" id="isNew" defaultChecked={editingProduct?.isNewproduct !== false} className="w-6 h-6 accent-orange-500 rounded-lg" />
                      <label htmlFor="isNew" className="text-sm font-black text-gray-700 uppercase tracking-widest">Show 'New' Badge</label>
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-orange-600 mb-6">
                    <Tag size={20} />
                    <h3 className="font-black uppercase tracking-widest text-xs">Pricing & Inventory</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Base Price (₹)</label>
                      <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 font-bold text-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Stock Level</label>
                      <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 font-bold text-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Discount (%)</label>
                      <input name="discount" type="number" defaultValue={editingProduct?.discount || 0} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 font-bold text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Variants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-orange-600 mb-2">
                      <Maximize size={18} />
                      <h3 className="font-black uppercase tracking-widest text-xs">Sizes</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {sizes.map(s => (
                        <span key={s} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-black text-gray-600 flex items-center gap-2">
                          {s} <button type="button" onClick={() => handleRemoveSize(s)}><X size={14}/></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newSize} onChange={e => setNewSize(e.target.value)} className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold" placeholder="e.g. XL, 10, 42..." />
                      <button type="button" onClick={handleAddSize} className="px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-black text-xs hover:bg-orange-100 transition-all">Add</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-orange-600 mb-2">
                      <Palette size={18} />
                      <h3 className="font-black uppercase tracking-widest text-xs">Colors</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {colors.map(c => (
                        <span key={c} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-black text-gray-600 flex items-center gap-2">
                          {c} <button type="button" onClick={() => handleRemoveColor(c)}><X size={14}/></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newColor} onChange={e => setNewColor(e.target.value)} className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold" placeholder="e.g. Blue, Red..." />
                      <button type="button" onClick={handleAddColor} className="px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-black text-xs hover:bg-orange-100 transition-all">Add</button>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-orange-600">
                      <ImageIcon size={20} />
                      <h3 className="font-black uppercase tracking-widest text-xs">Product Visuals</h3>
                    </div>
                    <button type="button" onClick={handleAddImage} className="text-xs font-black text-orange-600 flex items-center gap-2 hover:underline"><Plus size={14}/> Add Another Image</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {images.map((url, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 shadow-inner border border-gray-100">
                          {url ? <img src={url} alt="p" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={24}/></div>}
                        </div>
                        <input type="url" value={url} onChange={e => handleImageChange(idx, e.target.value)} className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-gray-700" placeholder="https://..." />
                        <button type="button" onClick={() => handleRemoveImage(idx)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X size={20}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Description</label>
                    <button 
                      type="button" 
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>Generating...</>
                      ) : (
                        <><Sparkles size={14} /> Generate with AI</>
                      )}
                    </button>
                  </div>
                  <textarea name="description" rows={5} defaultValue={editingProduct?.description} required className="w-full bg-gray-50 border-none rounded-[2rem] px-8 py-6 font-bold text-gray-700 focus:ring-2 focus:ring-orange-500 resize-none" placeholder="Elaborate on features, specifications, and what makes this product special..."></textarea>
                </div>

                <div className="flex gap-4 pt-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-10 py-5 bg-gray-50 text-gray-400 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-all">Discard</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] px-10 py-5 bg-orange-500 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-orange-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Processing Inventory...' : (editingProduct ? 'Commit Changes' : 'Initialize Product')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;

