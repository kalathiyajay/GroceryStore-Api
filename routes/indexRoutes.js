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
indexRoutes.put('/updateUser/:id', auth(['admin', 'user']), upload.single('image'), updateUserById)
indexRoutes.delete('/deleteUser/:id', auth(['admin', 'user']), deleteUserById);
indexRoutes.get('/dashBoard', dashBoard);

// category routes 

indexRoutes.post('/createCategory', auth(['admin']), upload.single('categoryImage'), createCategory);
indexRoutes.get('/AllCategory', getAllCategories);
indexRoutes.get('/getCategory/:id', getCategoryById);
indexRoutes.put('/updateCategory/:id', auth(['admin']), upload.single('categoryImage'), updateCategoryById);
indexRoutes.delete('/deleteCategory/:id', auth(['admin']), deleteCategoryById);

// Sub Category Routes

indexRoutes.post('/createSubCategory', auth(['admin']), upload.single('subCategoryImage'), createSubCategory);
indexRoutes.get('/AllSubCategory', getAllSubCategory);
indexRoutes.get('/getSubCategory/:id', getSubCategoryById)
indexRoutes.put('/updateSubCategory/:id', auth(['admin']), upload.single('subCategoryImage'), updateSubCategoryById);
indexRoutes.delete('/deleteSubCategory/:id', auth(['admin']), deleteSubCategoryById)

// Product Routes

indexRoutes.post('/createProducts', auth(['admin']), upload.fields([{ name: 'productImage' }]), createProduct);
indexRoutes.get('/allProduct', getAllProduct);
indexRoutes.get('/getProduct/:id', getProductById);
indexRoutes.put('/updateProduct/:id', auth(['admin']), upload.fields([{ name: 'productImage' }]), updateProductById);
indexRoutes.delete('/deleteProduct/:id', auth(['admin']), deleteProductById);
indexRoutes.get('/getProductByCategory/:id', auth(['admin', 'user']), getProductByCategory)

// wishList Routes

indexRoutes.post('/createWishList', auth(['user']), createWishList)
indexRoutes.get('/allWishList', auth(['user']), getAllWishList)
indexRoutes.get('/getWishList/:id', auth(['user']), getWishListById)
indexRoutes.delete('/deleteWishList/:id', auth(['user']), deleteWishListById);

// Delivery address Routes

indexRoutes.post('/createDeliveryAddress', auth(['user']), createAddress);
indexRoutes.get('/allAddress', auth(['admin']), getAllAddress);
indexRoutes.get('/getAddress/:id', auth(['admin']), getAddressById);
indexRoutes.put('/updateAddress/:id', auth(['admin']), updateAddressById)
indexRoutes.delete('/deleteAddress/:id', auth(['admin']), deleteAddressById);


// Cart Routes

indexRoutes.post('/addToCart', auth(["user"]), createCartData);
indexRoutes.get('/allCarts', auth(['user']), getAllCartData);
indexRoutes.get('/getCart/:id', auth(['user']), getCartDataById);
indexRoutes.put('/updateCart/:id', auth(['user']), updateCartDataById);
indexRoutes.put('/updateCartQuantity/:id', auth(['user']), updateCartQuantityById);
indexRoutes.delete('/deleteCart/:id', auth(['user']), deleteCartDataById);

// Rating Routes

indexRoutes.post('/createRating', createRating);
indexRoutes.get('/allRating', getAllRatings);
indexRoutes.get('/getRating/:id', getRatingDataById)
indexRoutes.put('/updateRating/:id', updateRatingDataById);
indexRoutes.delete('/deleteRating/:id', deleteRatingDataById);

// coupen Routes 

indexRoutes.post('/createCoupen', auth(['admin']), createCoupen);
indexRoutes.get('/allCoupens', auth(['admin', 'user']), getAllCoupens);
indexRoutes.get('/getCoupen/:id', auth(['admin', 'user']), getCoupenById);
indexRoutes.put('/updateCoupen/:id', auth(['admin']), updateCoupenById);
indexRoutes.put('/updateCoupenStatus/:id', auth(['admin']), updateCoupenStatusById);
indexRoutes.delete('/deleteCoupen/:id', auth(['admin']), deleteCoupenById)

// Order Routes 

indexRoutes.post('/createOrder', auth(['user']), createOrder)
indexRoutes.get('/allOrders', getAllOrders)
indexRoutes.get('/getOrder/:id', auth(['user']), getOrderById)
indexRoutes.put('/updateOrder/:id', auth(['user']), updateOrderById);
indexRoutes.delete('/deleteOrder/:id', auth(['admin']), deleteOrderById);
indexRoutes.get('/getMyOrder/:id', auth(['user']), getMyOrders)
indexRoutes.put('/changeOrderStatus/:id', auth(['admin']), changeOrderStatusById);
indexRoutes.put('/cancelOrder/:id', auth(['admin', 'user']), cancelOrder);

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