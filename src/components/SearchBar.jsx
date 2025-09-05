import React from "react";

export default function SearchBar() {
  return (
    <div id="sticky-searchbar" className="sticky top-14 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition">
          🔍
        </button>
        <button
          className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500 transition"
          onClick={() => {
            // window.dispatchEvent(new CustomEvent("voice:open"));
          }}
        >
          🤖 Agent
        </button>
      </div>
    </div>
  );
}
