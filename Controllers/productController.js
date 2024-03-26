import Product from "../Models/product.js";
import asyncHandler from "../utils/asyncHandler.js";
import userRoles from "../utils/userRole.js";
import Categoery from "../Models/categoery.js";


//add product
export const addProduct = asyncHandler(async (req, res) => {
  const role = req.user.role;
  if (!role || !(role == userRoles.ADMIN || role == userRoles.MODERATOR)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "forbidden access",
    });
  }
  const { name, price, stock, description,categoeryId } = req.body;
  if (!(name && price && stock,categoeryId)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "insufficent data",
    });
  }

  const isCategoeryExist= await Categoery.findById(categoeryId);
  if(!isCategoeryExist)
  {
    return res.status(400).json({
        success: false,
        data: null,
        message: "categoery doesn't exist",
      });
  }

  const isProductExist = await Product.findOne({
    name: name.toLowerCase().trim(),
    createdBy: req.user.email,
  });
  if (isProductExist) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "you already have same product added",
    });
  }
  const product = await Product.create({
    name,
    price,
    description,
    stock: stock ? stock : 0,
    createdBy:req.user.email,
    categoery:categoeryId
  });
  if (!product) {
    return res.status(500).json({
      success: false,
      data: null,
      message: "server error in adding the product",
    });
  }
  const productList = await Product.find({
    createdBy: req.user.email,
  });
  return res.status(201).json({
    success: true,
    data: productList,
    message: "product added successfuly",
  });
});

//edit product
export const editProduct = asyncHandler(async (req, res) => {
  const role = req.user.role;
  if (!role || !(role == userRoles.ADMIN || role == userRoles.MODERATOR)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "forbidden access",
    });
  }
  const { id, name, price, description } = req.body;

  if (!(id && name && price)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "insufficent data",
    });
  }
  const filter =
  role == userRoles.ADMIN
    ? {
        _id: id,
      }
    : {
        _id: id,
        createdBy: req.user.email,
      };
  const isProductExist = await Product.findOne({
    name: name.toLowerCase().trim(),
    createdBy: req.user.email,
    _id: { $ne: id },
  });
  if (isProductExist) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "you already have same product added",
    });
  }
  const updatedProduct = await Product.findOneAndUpdate(
    filter,
    {
      name: name,
      price: price,
      description: description,
    },
    {
      new: true,
    }
  );
  if (!updatedProduct) {
    return res.status(500).json({
      success: false,
      data: null,
      message: "error in updating the product",
    });
  }

  const productList = await Product.find({
    createdBy: req.user.email,
  });
  return res.status(200).json({
    success: true,
    data: productList,
    message: "product added successfuly",
  });
});

//add rating to product
export const addRating = asyncHandler(async (req, res) => {
  const { id, rating } = req.body;
  if (!(id && rating)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "insufficient data",
    });
  }
  let userRating={
    email:req.user.email,
    rated:rating
  }
const product= await Product.findById(id);
if(product && product.rating && product.rating.length>0)
{
    let productRatings=product.rating;
    if(productRatings.findIndex((x)=>x.email==req.user.email)==-1)
    {
        product.rating.push(userRating)
        await product.save() 
    }
    else{
        return res.status(200).json({
            success: false,
            data: product,
            message: "rating already there",
          });
    }
}
else
{
    product.rating.push(userRating)
    await product.save()

}
  if (!product) {
    return res.status(500).json({
      success: false,
      data: null,
      message: "error in updating the rating",
    });
  }
  return res.status(200).json({
    success: true,
    data: product,
    message: "rating updated",
  });
});

//add stock
export const addStock = asyncHandler(async (req, res) => {
  const role = req.user.role;
  if (!role || !(role == userRoles.ADMIN || role == userRoles.MODERATOR)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "forbidden access",
    });
  }
  const { id, stock } = req.body;

  const filter =
    role == userRoles.ADMIN
      ? {
          _id: id,
        }
      : {
          _id: id,
          createdBy: req.user.email,
        };

  const product = await Product.findOneAndUpdate(
    filter,
    {
      stock: stock,
    },
    {
      new: true,
    }
  );
  if (product) {
    return res.status(200).json({
      success: true,
      data: product,
      message: "stock added successfuly",
    });
  }
  return res.status(500).json({
    success: false,
    data: null,
    message: "error in adding stock",
  });
});

//get Product createdby

export const getmyProduct=asyncHandler(async(req,res)=>{
    const loggedInEmail= req.user.email
    const productList = await Product.find({
        createdBy:loggedInEmail
    })
    if(productList)
    {
        return res.status(200).json({
            success:true,
            data:productList,
            message:"fetched product list"
        })
    }
    return res.status(500).json({
        success:false,
        data:null,
        message:"error in fetching product list"
    })
})

//get all product
export const getAllProduct=asyncHandler(async(req,res)=>{
    const productList = await Product.find()
    if(productList)
    {
        return res.status(200).json({
            success:true,
            data:productList,
            message:"fetched product list"
        })
    }
    return res.status(500).json({
        success:false,
        data:null,
        message:"error in fetching product list"
    })
})

//delete product