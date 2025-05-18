import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import DropdownMenu from "./DropDownMenu";
import { categoryItems, collectionItems } from "./Navdata";

const DesktopNav = () => {
  const [isShopCategoryOpen, setIsShopCategoryOpen] = useState(false);
  const [isShopCollectionOpen, setIsShopCollectionOpen] = useState(false);

  const categoryContainerRef = useRef(null);
  const collectionContainerRef = useRef(null);
  const categoryTimeoutRef = useRef(null);
  const collectionTimeoutRef = useRef(null);

  // Ensure category links follow the /category/:id pattern
  const formattedCategoryItems = categoryItems.map((item) => ({
    ...item,
    link: `/category/${item.id || item.slug || item.value}`,
  }));

  // Ensure collection links follow the /collection/:id pattern
  const formattedCollectionItems = collectionItems.map((item) => ({
    ...item,
    link: `/collection/${item.id || item.slug || item.value}`,
  }));

  useEffect(() => {
    return () => {
      if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
      if (collectionTimeoutRef.current)
        clearTimeout(collectionTimeoutRef.current);
    };
  }, []);

  const handleCategoryMouseEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
      categoryTimeoutRef.current = null;
    }
    setIsShopCategoryOpen(true);
    setIsShopCollectionOpen(false);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsShopCategoryOpen(false);
    }, 200);
  };

  const handleCollectionMouseEnter = () => {
    if (collectionTimeoutRef.current) {
      clearTimeout(collectionTimeoutRef.current);
      collectionTimeoutRef.current = null;
    }
    setIsShopCollectionOpen(true);
    setIsShopCategoryOpen(false);
  };

  const handleCollectionMouseLeave = () => {
    collectionTimeoutRef.current = setTimeout(() => {
      setIsShopCollectionOpen(false);
    }, 200);
  };

  const toggleCategoryDropdown = (e) => {
    e.preventDefault();
    setIsShopCategoryOpen(!isShopCategoryOpen);
    setIsShopCollectionOpen(false);
  };

  const toggleCollectionDropdown = (e) => {
    e.preventDefault();
    setIsShopCollectionOpen(!isShopCollectionOpen);
    setIsShopCategoryOpen(false);
  };

  return (
    <nav className="hidden md:flex items-center space-x-6 flex-grow">
      <Link
        to="/"
        className="nav-link relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a95a] hover:after:w-full after:transition-all after:duration-300"
      >
        SHOP
      </Link>

      <div
        ref={categoryContainerRef}
        className="relative dropdown-container"
        onMouseEnter={handleCategoryMouseEnter}
        onMouseLeave={handleCategoryMouseLeave}
      >
        <button
          onClick={toggleCategoryDropdown}
          className="nav-link flex items-center space-x-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a95a] hover:after:w-full after:transition-all after:duration-300"
        >
          <span>SHOP BY CATEGORY</span>
          <FiChevronDown
            className={`ml-1 opacity-70 transform transition-transform duration-300 ${
              isShopCategoryOpen ? "rotate-180" : ""
            }`}
            size={14}
          />
        </button>
        <DropdownMenu
          isOpen={isShopCategoryOpen}
          items={formattedCategoryItems}
        />
      </div>

      <div
        ref={collectionContainerRef}
        className="relative dropdown-container"
        onMouseEnter={handleCollectionMouseEnter}
        onMouseLeave={handleCollectionMouseLeave}
      >
        <button
          onClick={toggleCollectionDropdown}
          className="nav-link flex items-center space-x-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a95a] hover:after:w-full after:transition-all after:duration-300"
        >
          <span>SHOP BY COLLECTION</span>
          <FiChevronDown
            className={`ml-1 opacity-70 transform transition-transform duration-300 ${
              isShopCollectionOpen ? "rotate-180" : ""
            }`}
            size={14}
          />
        </button>
        <DropdownMenu
          isOpen={isShopCollectionOpen}
          items={formattedCollectionItems}
        />
      </div>

      <Link
        to="/track-order"
        className="nav-link relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a95a] hover:after:w-full after:transition-all after:duration-300"
      >
        TRACK ORDER
      </Link>
    </nav>
  );
};

export default DesktopNav;
