import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductByIdForAdmin } from "../../Api/admin";
import AdminUpdateProductFrom from "./AdminUpdateProductFrom";

const AdminUpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState({});

  const fetchProductDataByid = async (id) => {
    try {
      const res = await getProductByIdForAdmin(id);

      setProduct(res.product);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDataByid(id);
    }
  }, [id]);

  return (
    <>
      <AdminUpdateProductFrom product={product} />
    </>
  );
};

export default AdminUpdateProduct;
