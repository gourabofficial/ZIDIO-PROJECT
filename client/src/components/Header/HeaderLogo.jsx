import { Link } from 'react-router-dom';

const HeaderLogo = () => {
  return (
    <div className="flex justify-center flex-grow md:flex-grow-0 md:justify-start">
      <Link to="/" className="flex-shrink-0 md:mr-8 flex items-center">
        <div className="logo-container relative">
          <span className="text-xl md:text-2xl font-bold tracking-wider cosmic-gradient">COSMIC</span>
          <span className="text-xl md:text-2xl font-bold tracking-wider ml-2 heroes-gradient">HEROS</span>
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a95a] to-transparent"></div>
        </div>
      </Link>
    </div>
  );
};

export default HeaderLogo;