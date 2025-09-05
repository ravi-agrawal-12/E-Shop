import React from "react";

export default function ProductCard({ product, onQuickView }) {
  return (
    <div className="border rounded-lg shadow-sm bg-white hover:shadow-md transition overflow-hidden">
      <button
        className="relative block w-full h-48"
        onClick={() => onQuickView?.(product)}
        aria-label={`Quick view ${product.title}`}
      >
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </button>
      <div className="p-4">
        <h2 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2">
          {product.title}
        </h2>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-blue-600 font-bold">{product.price}</p>
          <button
            onClick={() => onQuickView?.(product)}
            className="text-xs rounded-md bg-gray-900 text-white px-2.5 py-1.5 hover:bg-black"
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
}
