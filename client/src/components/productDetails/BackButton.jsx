import { FiArrowLeft } from 'react-icons/fi';

const BackButton = () => {
  return (
    <div className="mb-6">
      <button
        onClick={() => window.history.back()} 
        className="inline-flex items-center text-[#cbd5e1] hover:text-[#c4b5fd] transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        <span>Back to Collection</span>
      </button>
    </div>
  );
};

export default BackButton;