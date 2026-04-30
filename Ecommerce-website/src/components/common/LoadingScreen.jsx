import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-orange-600 mb-4"
      >
        <ShoppingCart size={64} strokeWidth={2.5} />
      </motion.div>
      <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          animate={{
            x: [-192, 192],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-full h-full bg-orange-600"
        />
      </div>
      <p className="mt-4 text-gray-500 font-medium tracking-widest uppercase text-sm animate-pulse">
        Loading ShopVerse...
      </p>
    </div>
  );
};

export default LoadingScreen;
