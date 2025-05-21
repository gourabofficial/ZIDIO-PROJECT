// import { FiFilter, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';

// const CollectionControls = ({ viewMode, setViewMode, sortBy, handleSortChange, toggleFilter }) => {
//   return (
//     <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
//       <button
//         className="flex items-center space-x-2 px-4 py-2 bg-[#1e293b] rounded-md hover:bg-[#334155] transition-colors"
//         onClick={toggleFilter}
//       >
//         <FiFilter size={18} />
//         <span>Filter</span>
//       </button>

//       <div className="flex items-center space-x-4">
//         <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
//         <SortDropdown sortBy={sortBy} onChange={handleSortChange} />
//       </div>
//     </div>
//   );
// };

// const ViewModeToggle = ({ viewMode, setViewMode }) => (
//   <div className="flex items-center space-x-2 bg-[#1e293b] p-1 rounded-md">
//     <button
//       className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#0f172a] text-white' : 'text-[#cbd5e1] hover:text-white'}`}
//       onClick={() => setViewMode('grid')}
//       aria-label="Grid View"
//     >
//       <FiGrid size={18} />
//     </button>
//     <button
//       className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#0f172a] text-white' : 'text-[#cbd5e1] hover:text-white'}`}
//       onClick={() => setViewMode('list')}
//       aria-label="List View"
//     >
//       <FiList size={18} />
//     </button>
//   </div>
// );

// const SortDropdown = ({ sortBy, onChange }) => (
//   <div className="relative">
//     <select
//       className="appearance-none px-4 py-2 pr-8 bg-[#1e293b] text-white rounded-md border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#c4b5fd] focus:border-transparent"
//       value={sortBy}
//       onChange={onChange}
//     >
//       <option value="best-selling">Best selling</option>
//       <option value="price-low-high">Price, low to high</option>
//       <option value="price-high-low">Price, high to low</option>
//       <option value="title-a-z">Alphabetically, A-Z</option>
//       <option value="title-z-a">Alphabetically, Z-A</option>
//     </select>
//     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
//       <FiChevronDown className="text-white text-opacity-70" />
//     </div>
//   </div>
// );

// export default CollectionControls;