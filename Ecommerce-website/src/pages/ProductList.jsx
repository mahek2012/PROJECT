import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, LayoutGrid, List, Search as SearchIcon, X } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Skeleton from 'react-loading-skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, isLoading, pagination } = useSelector((state) => state.products);
  
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      category: currentCategory !== 'All' ? currentCategory : undefined,
      sort: currentSort,
      search: searchQuery,
      page: pagination.currentPage,
      limit: 12,
    };
    dispatch(fetchProducts(params));
  }, [dispatch, currentCategory, currentSort, searchQuery, pagination.currentPage]);

  const handleCategoryChange = (category) => {
    setSearchParams({ ...Object.fromEntries(searchParams), category, page: 1 });
  };

  const handleSortChange = (sort) => {
    setSearchParams({ ...Object.fromEntries(searchParams), sort });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumbs & Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentCategory === 'All' ? 'All Products' : currentCategory}
            {searchQuery && <span className="text-gray-400 font-medium"> - Search results for "{searchQuery}"</span>}
          </h1>
          <p className="text-gray-500 mt-1">Showing {products.length} products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('All')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentCategory === 'All' ? 'bg-orange-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      currentCategory === cat ? 'bg-orange-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <input type="range" className="w-full accent-orange-600" min="0" max="5000" />
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                  <span>$0</span>
                  <span>$5,000+</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Customer Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{rating} Stars & Up</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-4">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg font-bold text-gray-700"
              >
                <Filter size={18} /> Filters
              </button>

              <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                  <select 
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 focus:ring-2 focus:ring-orange-500 font-medium text-gray-700 outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton height={280} className="rounded-xl" />
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={24} />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <SearchIcon size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-8">Try adjusting your filters or search query to find what you're looking for.</p>
                <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: i + 1 })}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      pagination.currentPage === i + 1 
                        ? 'bg-orange-600 text-white shadow-lg' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-80 bg-white z-[101] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...categories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { handleCategoryChange(cat); setIsFilterOpen(false); }}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          currentCategory === cat ? 'bg-orange-600 border-orange-600 text-white' : 'border-gray-200 text-gray-600 hover:border-orange-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Sort By</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['newest', 'price-low', 'price-high', 'rating'].map((sort) => (
                      <button
                        key={sort}
                        onClick={() => { handleSortChange(sort); setIsFilterOpen(false); }}
                        className={`text-left px-4 py-3 rounded-lg border text-sm font-medium capitalize ${
                          currentSort === sort ? 'bg-orange-50 border-orange-500 text-orange-600' : 'border-gray-100 text-gray-600'
                        }`}
                      >
                        {sort.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => { clearFilters(); setIsFilterOpen(false); }}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
