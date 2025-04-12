const ProductInfo = ({ title, price }) => {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{title}</h1>
      <p className="text-xl mb-4 text-[#c4b5fd] font-medium">Rs. {price.toFixed(2)}</p>
    </>
  );
};

export default ProductInfo;