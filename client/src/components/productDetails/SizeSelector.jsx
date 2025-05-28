// import { useState } from 'react';

// const SizeSelector = ({ sizes, selectedSize, onSizeSelect }) => {
//   return (
//     <div className="mb-6">
//       <div className="flex justify-between items-center mb-2">
//         <p className="font-medium text-[#cbd5e1]">Size</p>
//         {selectedSize && <p className="text-sm text-[#c4b5fd]">Selected: {selectedSize}</p>}
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {Array.isArray(sizes) && sizes.map((size) => (
//           <button
//             key={size}
//             onClick={() => {
//               console.log("Size button clicked:", size);
//               onSizeSelect(size);
//             }}
//             className={`px-4 py-2 border ${
//               selectedSize === size 
//                 ? "border-purple-500 bg-purple-900/20" 
//                 : "border-gray-700 hover:border-gray-500"
//             } rounded-md text-sm transition-colors`}
//           >
//             {size}
//           </button>
//         ))}
//       </div>
//       {!selectedSize && <p className="text-xs text-[#c4b5fd] mt-2">Please select a size</p>}
//     </div>
//   );
// };

// export default SizeSelector;