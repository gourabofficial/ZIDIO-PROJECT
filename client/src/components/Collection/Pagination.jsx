const Pagination = () => {
  return (
    <div className="flex justify-center mt-12">
      <div className="inline-flex rounded-md">
        <button className="px-4 py-2 rounded-l-md bg-[#c4b5fd] text-[#0f172a] font-medium">1</button>
        <button className="px-4 py-2 bg-[#1e293b] text-white hover:bg-[#334155] transition-colors">2</button>
        <button className="px-4 py-2 bg-[#1e293b] text-white hover:bg-[#334155] transition-colors">3</button>
        <button className="px-4 py-2 bg-[#1e293b] text-white hover:bg-[#334155] transition-colors">...</button>
        <button className="px-4 py-2 rounded-r-md bg-[#1e293b] text-white hover:bg-[#334155] transition-colors">5</button>
      </div>
    </div>
  );
};

export default Pagination;