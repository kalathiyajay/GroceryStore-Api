const express = require('express');
const { createAdminUser, createUser, getAllUsers, getUserById, updateUserById, deleteUserById, dashBoard, loginWithMobileNo, verifyOtp } = require('../controller/userController');
const upload = require('../helper/imageUplode');
const { createCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controller/categoryController');
const { createSubCategory, getAllSubCategory, getSubCategoryById, updateSubCategoryById, deleteSubCategoryById } = require('../controller/subCategoryController');
const { createProduct, getAllProduct, getProductById, updateProductById, deleteProductById, getProductByCategory } = require('../controller/productContoller');
const { createWishList, getAllWishList, getWishListById, deleteWishListById } = require('../controller/wishListController');
const { createAddress, getAllAddress, getAddressById, deleteAddressById, updateAddressById } = require('../controller/addressController');
const { createCartData, getAllCartData, getCartDataById, updateCartDataById, updateCartQuantityById, deleteCartDataById } = require('../controller/cartController');
const { createRating, getAllRatings, getRatingDataById, updateRatingDataById, deleteRatingDataById } = require('../controller/ratingController');
const { createCoupen, getAllCoupens, getCoupenById, updateCoupenById, updateCoupenStatusById, deleteCoupenById } = require('../controller/coupenContoller');
const { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, getMyOrders, changeOrderStatusById, cancelOrder } = require('../controller/orderController');
const { userLogin } = require('../auth/login');
const { auth } = require('../helper/authToken');
const { createSpecialDeals, getAllSpecialDeals, getSpecialDealById, updateSpecialDealById, deleteSpecialDealById } = require('../controller/specialDealsController');

const indexRoutes = express.Router();

// login

indexRoutes.post('/login', userLogin)

// User Routes

indexRoutes.post('/createAdminUser', upload.single('image'), createAdminUser)
indexRoutes.post('/createUser', upload.single('image'), createUser)
indexRoutes.get('/allUsers', getAllUsers)
indexRoutes.get('/getUser/:id', getUserById);
indexRoutes.put('/updateUser/:id', upload.single('image'), updateUserById)
indexRoutes.delete('/deleteUser/:id', deleteUserById);
indexRoutes.get('/dashBoard', dashBoard);

// category routes 

indexRoutes.post('/createCategory', upload.single('categoryImage'), createCategory);
indexRoutes.get('/AllCategory', getAllCategories);
indexRoutes.get('/getCategory/:id', getCategoryById);
indexRoutes.put('/updateCategory/:id', upload.single('categoryImage'), updateCategoryById);
indexRoutes.delete('/deleteCategory/:id', deleteCategoryById);

// Sub Category Routes

indexRoutes.post('/createSubCategory', upload.single('subCategoryImage'), createSubCategory);
indexRoutes.get('/AllSubCategory', getAllSubCategory);
indexRoutes.get('/getSubCategory/:id', getSubCategoryById)
indexRoutes.put('/updateSubCategory/:id', upload.single('subCategoryImage'), updateSubCategoryById);
indexRoutes.delete('/deleteSubCategory/:id', deleteSubCategoryById)

// Product Routes

indexRoutes.post('/createProducts', upload.fields([{ name: 'productImage' }]), createProduct);
indexRoutes.get('/allProduct', getAllProduct);
indexRoutes.get('/getProduct/:id', getProductById);
indexRoutes.put('/updateProduct/:id', upload.fields([{ name: 'productImage' }]), updateProductById);
indexRoutes.delete('/deleteProduct/:id', deleteProductById);
indexRoutes.get('/getProductByCategory/:id', getProductByCategory)

// wishList Routes

indexRoutes.post('/createWishList', createWishList)
indexRoutes.get('/allWishList', getAllWishList)
indexRoutes.get('/getWishList/:id', getWishListById)
indexRoutes.delete('/deleteWishList/:id', deleteWishListById);

// Delivery address Routes

indexRoutes.post('/createDeliveryAddress', createAddress);
indexRoutes.get('/allAddress', getAllAddress);
indexRoutes.get('/getAddress/:id', getAddressById);
indexRoutes.put('/updateAddress/:id', updateAddressById)
indexRoutes.delete('/deleteAddress/:id', deleteAddressById);


// Cart Routes

indexRoutes.post('/addToCart', createCartData);
indexRoutes.get('/allCarts', getAllCartData);
indexRoutes.get('/getCart/:id', getCartDataById);
indexRoutes.put('/updateCart/:id', updateCartDataById);
indexRoutes.put('/updateCartQuantity/:id', updateCartQuantityById);
indexRoutes.delete('/deleteCart/:id', deleteCartDataById);

// Rating Routes

indexRoutes.post('/createRating', createRating);
indexRoutes.get('/allRating', getAllRatings);
indexRoutes.get('/getRating/:id', getRatingDataById)
indexRoutes.put('/updateRating/:id', updateRatingDataById);
indexRoutes.delete('/deleteRating/:id', deleteRatingDataById);

// coupen Routes 

indexRoutes.post('/createCoupen', createCoupen);
indexRoutes.get('/allCoupens', getAllCoupens);
indexRoutes.get('/getCoupen/:id', getCoupenById);
indexRoutes.put('/updateCoupen/:id', updateCoupenById);
indexRoutes.put('/updateCoupenStatus/:id', updateCoupenStatusById);
indexRoutes.delete('/deleteCoupen/:id', deleteCoupenById)

// Order Routes 

indexRoutes.post('/createOrder', createOrder)
indexRoutes.get('/allOrders', getAllOrders)
indexRoutes.get('/getOrder/:id', getOrderById)
indexRoutes.put('/updateOrder/:id', updateOrderById);
indexRoutes.delete('/deleteOrder/:id', deleteOrderById);
indexRoutes.get('/getMyOrder/:id', getMyOrders)
indexRoutes.put('/changeOrderStatus/:id', changeOrderStatusById);
indexRoutes.put('/cancelOrder/:id', cancelOrder);

// Special Deals Routes

indexRoutes.post('/createSpecialDeal', upload.single('dealsImage'), createSpecialDeals);
indexRoutes.get('/allSpecialDeal', getAllSpecialDeals);
indexRoutes.get('/getSpecialDeal/:id', getSpecialDealById)
indexRoutes.put('/updateSpecialDeal/:id', upload.single('dealsImage'), updateSpecialDealById);
indexRoutes.delete('/deleteSpecialDeal/:id', deleteSpecialDealById);

// Login With Mobile No

indexRoutes.post('/mobileNoLogin', loginWithMobileNo);
indexRoutes.post('/verifyOtp', verifyOtp);

module.exports = indexRoutes;   