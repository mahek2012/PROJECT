import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, LayoutGrid, List, Search as SearchIcon, X, Star, Heart, Tag } from 'lucide-react';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Skeleton from 'react-loading-skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading, pagination } = useSelector((state) => state.products);
  
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(false);
  
  const currentSort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || 0;
  const maxPrice = searchParams.get('maxPrice') || 500000;
  const rating = searchParams.get('rating') || 0;

  // Format category name for display
  const decodedCategory = decodeURIComponent(categoryName);
  const displayCategory = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);

  useEffect(() => {
    const params = {
      category: displayCategory,
      sort: currentSort,
      page: pagination.currentPage,
      limit: 12,
    };
    dispatch(fetchProducts(params));
  }, [dispatch, displayCategory, currentSort, pagination.currentPage]);

  const handleSortChange = (sort) => {
    setSearchParams({ ...Object.fromEntries(searchParams), sort });
  };

  const handleFilterChange = (key, value) => {
    setSearchParams({ ...Object.fromEntries(searchParams), [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setSearchParams({});
    setOnlyDeals(false);
  };

  // Local filtering for things not handled by API (assuming API doesn't support all advanced filters yet)
  let displayedProducts = products;

  // Filter by category
  const targetCategoryLower = decodedCategory.toLowerCase();
  displayedProducts = displayedProducts.filter(p => p.category?.toLowerCase() === targetCategoryLower);
  
  if (onlyDeals) {
    displayedProducts = displayedProducts.filter(p => p.discount > 0);
  }
  
  if (rating > 0) {
    displayedProducts = displayedProducts.filter(p => p.rating >= Number(rating));
  }

  // Filter by price
  if (maxPrice) {
    displayedProducts = displayedProducts.filter(p => {
      const actualPrice = p.discount ? p.price - (p.price * p.discount / 100) : p.price;
      return actualPrice <= Number(maxPrice);
    });
  }

  // Sort locally since backend doesn't handle it yet
  if (currentSort === 'price-low') {
    displayedProducts.sort((a, b) => {
      const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
      const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
      return priceA - priceB;
    });
  } else if (currentSort === 'price-high') {
    displayedProducts.sort((a, b) => {
      const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
      const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
      return priceB - priceA;
    });
  } else if (currentSort === 'rating') {
    displayedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // Newest
    displayedProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  // Dynamic Banner Image
  const bannerImage = {
    'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1600',
    'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600',
    'Mobile & Accessories': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1600',
  }[displayCategory] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 1. Top Section (Header / Banner) */}
      <section className="relative h-[300px] flex items-center overflow-hidden bg-gray-900 mb-10">
        <div className="absolute inset-0 z-0">
          <img src={bannerImage} alt={displayCategory} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>
        <div className="container-custom relative z-10 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <h1 className="text-5xl font-black mb-4">{displayCategory}</h1>
            <p className="text-lg text-gray-300 font-medium">Explore the latest and greatest in {displayCategory.toLowerCase()} with exclusive deals and top-rated items.</p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 2. Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-gray-900">Filters</h2>
              <button onClick={clearFilters} className="text-xs font-bold text-orange-500 hover:underline">Clear All</button>
            </div>

            {/* Extra Feature: Only Deals Toggle */}
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
              <span className="text-sm font-bold text-orange-600 flex items-center gap-2"><Tag size={16}/> Only Deals</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={onlyDeals} onChange={() => setOnlyDeals(!onlyDeals)} />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <input 
                  type="range" 
                  className="w-full accent-orange-600" 
                  min="0" 
                  max="500000" 
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                  <span>₹0</span>
                  <span>₹{maxPrice}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Customer Rating</h3>
              <div className="space-y-3">
                {[4, 3, 2, 1].map((r) => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="rating"
                      checked={Number(rating) === r}
                      onChange={() => handleFilterChange('rating', r)}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300" 
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < r ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="ml-1 font-bold">& Up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Availability</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300" />
                <span className="text-sm font-medium text-gray-700">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* 3. Sorting Options */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-4">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg font-bold text-gray-700"
              >
                <Filter size={18} /> Filters
              </button>

              <span className="text-sm font-bold text-gray-500 hidden md:block">
                Showing {displayedProducts.length} products
              </span>

              <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm font-bold text-gray-700">Sort By:</span>
                <div className="relative">
                  <select 
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 focus:ring-2 focus:ring-orange-500 font-bold text-gray-700 outline-none cursor-pointer text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Selling</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 4. Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton height={280} className="rounded-xl" />
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={24} />
                  </div>
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode="grid" />
                  ))}
                </div>
                
                {/* 6. Pagination / Load More */}
                {pagination.totalPages > 1 && (
                  <div className="mt-16 text-center">
                    <button className="bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-black px-10 py-4 rounded-xl transition-all shadow-sm">
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* 7. Empty State */
              <div className="text-center py-24 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <SearchIcon size={40} className="text-orange-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">No products found 😢</h3>
                <p className="text-gray-500 font-medium mb-8 text-lg">We couldn't find anything matching your filters. Try changing them up!</p>
                <button onClick={clearFilters} className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/30">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
