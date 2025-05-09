import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Product } from "../model/product.model.js";
import { v4 as uuidv4 } from "uuid";

export const addProduct = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",

        success: false,
      });
    }

    const { name, description, price, category, discount, size, offerStatus } =
      req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    const cloudinaryFolder = "products";

    // If there are files to upload
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path, cloudinaryFolder)
      );

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);

      // Extract image URLs and other details
      uploadResults.forEach((result) => {
        if (result) {
          imageUrls.push({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      });
    }

    // console.log("Image URLs:", imageUrls);

    // format properly images url and ids
    const formattedImages = imageUrls.map((image) => ({
      imageUrl: image.url,
      imageId: image.public_id,
    }));

    // id creation
    const id = uuidv4();

    // product creation
    const newPorduct = await Product.create({
      id,
      name,
      description,
      price,
      category,
      discount,
      size,
      offerStatus,
      images: formattedImages,
    });

    if (!newPorduct) {
      return res.status(500).json({
        message: "Failed to create product",
        success: false,
      });
    }

    console.log("New product created:", newPorduct);

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};
