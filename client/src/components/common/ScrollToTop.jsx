import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/") {
     
      window.scrollTo(0, 50);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
