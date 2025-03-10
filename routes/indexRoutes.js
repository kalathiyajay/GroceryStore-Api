const express = require('express');
const { createAdminUser, createUser, getAllUsers, getUserById, updateUserById, deleteUserById, dashBoard, loginWithMobileNo, verifyOtp, generateOtp, verifyGenerateOtp, resentOtp, staticResentOtp, deleteAllUsers, globalSearch } = require('../controller/userController');
const upload = require('../helper/imageUplode');
const { createCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById, deleteAllCatrgory } = require('../controller/categoryController');
const { createSubCategory, getAllSubCategory, getSubCategoryById, updateSubCategoryById, deleteSubCategoryById, deleteAllSubCatrgory } = require('../controller/subCategoryController');
const { createProduct, getAllProduct, getProductById, updateProductById, deleteProductById, getProductByCategory, deleteAllProducts } = require('../controller/productContoller');
const { createWishList, getAllWishList, getWishListById, deleteWishListById, getAllMyWishList } = require('../controller/wishListController');
const { createAddress, getAllAddress, getAddressById, deleteAddressById, updateAddressById, getMyAddress } = require('../controller/addressController');
const { createCartData, getAllCartData, getCartDataById, updateCartDataById, updateCartQuantityById, deleteCartDataById, getAllMyCarts } = require('../controller/cartController');
const { createRating, getAllRatings, getRatingDataById, updateRatingDataById, deleteRatingDataById, deleteAllRatings } = require('../controller/ratingController');
const { createCoupen, getAllCoupens, getCoupenById, updateCoupenById, updateCoupenStatusById, deleteCoupenById, deleteAllCoupens } = require('../controller/coupenContoller');
const { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, getMyOrders, changeOrderStatusById, cancelOrder, deleteAllOrders } = require('../controller/orderController');
const { userLogin, adminLogin, adminDashboard, changePassword, resetPassword } = require('../auth/login');
const { auth } = require('../helper/authToken');
const { createSpecialDeals, getAllSpecialDeals, getSpecialDealById, updateSpecialDealById, deleteSpecialDealById, deleteAllSpecialDeal } = require('../controller/specialDealsController');
const { createMoreToExplore, getAllMoreToExplores, getMoreToExploreById, updateMoretoExploreById, deleteMoreToExploreById } = require('../controller/moreToExpolre.contoller');
const { createProductAditional, getAllProductAditional, getProductAditionalById, updateProductAditionalById, deleteProductAdtionalById } = require('../controller/productAditional.Controller');

const indexRoutes = express.Router();

// login 

indexRoutes.post('/login', userLogin)
indexRoutes.post('/adminLogin', adminLogin);

// User Routes

indexRoutes.post('/createAdminUser', upload.single('image'), createAdminUser)
indexRoutes.post('/createUser', auth(['admin', 'user']), upload.single('image'), createUser)
indexRoutes.get('/allUsers', auth(["admin"]), getAllUsers)
indexRoutes.get('/getUser/:id', auth(['admin', 'user']), getUserById);
indexRoutes.put('/updateUser/:id', auth(['admin', 'user']), upload.single('image'), updateUserById)
indexRoutes.delete('/deleteUser/:id', auth(['admin', 'user']), deleteUserById);
indexRoutes.get('/dashBoard', dashBoard);
indexRoutes.delete('/deleteAllUsers', auth(['admin']), deleteAllUsers)
indexRoutes.get('/adminDashboard', auth(['admin']), adminDashboard);
indexRoutes.put('/changePassword/:id', auth(['admin']), changePassword);
indexRoutes.put('/resetPassword/:id', resetPassword);
indexRoutes.get('/globalSearch', globalSearch);

// category routes 

indexRoutes.post('/createCategory', auth(['admin']), upload.fields([{ name: 'categoryImage' }, { name: 'vectorImage' }]), createCategory);
indexRoutes.get('/AllCategory', auth(['admin', 'user']), getAllCategories);
indexRoutes.get('/getUserCategory', getAllCategories);
indexRoutes.get('/getCategory/:id', auth(['admin', 'user']), getCategoryById);
indexRoutes.get('/userGetCategory/:id', getCategoryById);
indexRoutes.put('/updateCategory/:id', auth(['admin']), upload.fields([{ name: 'categoryImage' }, { name: 'vectorImage' }]), updateCategoryById);
indexRoutes.delete('/deleteCategory/:id', auth(['admin']), deleteCategoryById);
indexRoutes.delete('/deleteAllCategory', auth(['admin']), deleteAllCatrgory);

// Sub Category Routes

indexRoutes.post('/createSubCategory', auth(['admin']), upload.single('subCategoryImage'), createSubCategory);
indexRoutes.get('/AllSubCategory', auth(['admin', 'user']), getAllSubCategory);
indexRoutes.get('/getUserSubCategory', getAllSubCategory);
indexRoutes.get('/getSubCategory/:id', auth(['admin', 'user']), getSubCategoryById)
indexRoutes.get('/userGetSubCategory/:id', getSubCategoryById)
indexRoutes.put('/updateSubCategory/:id', auth(['admin']), upload.single('subCategoryImage'), updateSubCategoryById);
indexRoutes.delete('/deleteSubCategory/:id', auth(['admin']), deleteSubCategoryById)
indexRoutes.delete('/deleteAllSubCategory', auth(['admin']), deleteAllSubCatrgory);

// Product Routes

indexRoutes.post('/createProducts', auth(['admin']), upload.fields([{ name: 'productImage' }]), createProduct);
indexRoutes.get('/allProduct', auth(['admin', 'user']), getAllProduct);
indexRoutes.get('/getUserProduct', getAllProduct);
indexRoutes.get('/getProduct/:id', auth(['admin', 'user']), getProductById);
indexRoutes.get('/userGetProduct/:id', getProductById);
indexRoutes.put('/updateProduct/:id', auth(['admin']), upload.fields([{ name: 'productImage' }]), updateProductById);
indexRoutes.delete('/deleteProduct/:id', auth(['admin']), deleteProductById);
indexRoutes.get('/getProductByCategory/:id', auth(['admin', 'user']), getProductByCategory)
indexRoutes.delete('/deleteAllProducts', auth(['admin']), deleteAllProducts);

// wishList Routes

indexRoutes.post('/createWishList', auth(['admin', 'user']), createWishList)
indexRoutes.get('/allWishList', auth(['admin', 'user']), getAllWishList)
indexRoutes.get('/getWishList/:id', auth(['admin', 'user']), getWishListById)
indexRoutes.delete('/deleteWishList/:id', auth(['admin', 'user']), deleteWishListById);
indexRoutes.get('/allMyWishList/:id', auth(['admin', 'user']), getAllMyWishList);

// Delivery address Routes

indexRoutes.post('/createDeliveryAddress', auth(['admin', 'user']), createAddress);
indexRoutes.get('/allAddress', auth(['admin', 'user']), getAllAddress);
indexRoutes.get('/getAddress/:id', auth(['admin', 'user']), getAddressById);
indexRoutes.put('/updateAddress/:id', auth(['admin', 'user']), updateAddressById)
indexRoutes.delete('/deleteAddress/:id', auth(['admin', 'user']), deleteAddressById);
indexRoutes.get('/getAllMyAddress/:id', auth(['admin', 'user']), getMyAddress)

// Cart Routes

indexRoutes.post('/addToCart', auth(['admin', 'user']), createCartData);
indexRoutes.get('/allCarts', auth(['admin', 'user']), getAllCartData);
indexRoutes.get('/getCart/:id', auth(['admin', 'user']), getCartDataById);
indexRoutes.put('/updateCart/:id', auth(['admin', 'user']), updateCartDataById);
indexRoutes.put('/updateCartQuantity/:id', auth(['admin', 'user']), updateCartQuantityById);
indexRoutes.delete('/deleteCart/:id', auth(['admin', 'user']), deleteCartDataById);
indexRoutes.get('/allMyCarts/:id', auth(['admin', 'user']), getAllMyCarts);

// Rating Routes

indexRoutes.post('/createRating', auth(['admin', 'user']), createRating);
indexRoutes.get('/allRating', auth(['admin', 'user']), getAllRatings);
indexRoutes.get('/getRating/:id', auth(['admin', 'user']), getRatingDataById)
indexRoutes.put('/updateRating/:id', auth(['admin', 'user']), updateRatingDataById);
indexRoutes.delete('/deleteRating/:id', auth(['admin', 'user']), deleteRatingDataById);
indexRoutes.delete('/deleteAllRating', auth(['admin']), deleteAllRatings);

// coupen Routes 

indexRoutes.post('/createCoupen', auth(['admin']), upload.single('coupenImage'), createCoupen);
indexRoutes.get('/allCoupens', auth(['admin', 'user']), getAllCoupens);
indexRoutes.get('/getCoupen/:id', auth(['admin', 'user']), getCoupenById);
indexRoutes.put('/updateCoupen/:id', auth(['admin', 'user']), upload.single('coupenImage'), updateCoupenById);
indexRoutes.put('/updateCoupenStatus/:id', auth(['admin', 'user']), updateCoupenStatusById);
indexRoutes.delete('/deleteCoupen/:id', auth(['admin', 'user']), deleteCoupenById)
indexRoutes.delete('/deleteAllCoupens', auth(['admin']), deleteAllCoupens)

// Order Routes 

indexRoutes.post('/createOrder', auth(['admin', 'user']), createOrder)
indexRoutes.get('/allOrders', auth(['admin', 'user']), getAllOrders)
indexRoutes.get('/getOrder/:id', auth(['admin', 'user']), getOrderById)
indexRoutes.put('/updateOrder/:id', auth(['admin', 'user']), updateOrderById);
indexRoutes.delete('/deleteOrder/:id', auth(['admin', 'user']), deleteOrderById);
indexRoutes.get('/getMyOrder/:id', auth(['admin', 'user']), getMyOrders)
indexRoutes.put('/changeOrderStatus/:id', auth(['admin']), changeOrderStatusById);
indexRoutes.put('/cancelOrder/:id', auth(['admin', 'user']), cancelOrder);
indexRoutes.delete('/deleteAllOrders', auth(['admin']), deleteAllOrders);

// Special Deals Routes

indexRoutes.post('/createSpecialDeal', auth(['admin']), createSpecialDeals);
indexRoutes.get('/allSpecialDeal', auth(['admin', 'user']), getAllSpecialDeals);
indexRoutes.get('/getSpecialDeal/:id', auth(['admin', 'user']), getSpecialDealById)
indexRoutes.put('/updateSpecialDeal/:id', auth(['admin']), updateSpecialDealById);
indexRoutes.delete('/deleteSpecialDeal/:id', auth(['admin']), deleteSpecialDealById);
indexRoutes.delete('/deleteAllSpecialDeal', auth(['admin']), deleteAllSpecialDeal);

// moreToExlpre Routes

indexRoutes.post('/createMoreToExplore', auth(['admin']), upload.single('moreToExploreImage'), createMoreToExplore);
indexRoutes.get('/getAllMoreToExplore', auth(['admin', 'user']), getAllMoreToExplores);
indexRoutes.get('/getMoreToExplore/:id', auth(['admin', 'user']), getMoreToExploreById);
indexRoutes.put('/updateMoreToExplore/:id', auth(['admin']), upload.single('moreToExploreImage'), updateMoretoExploreById);
indexRoutes.delete('/deleteMoreToExplore/:id', auth(['admin']), deleteMoreToExploreById);

// productAditional routes

indexRoutes.post('/createProductAditional', auth(['admin']), upload.array('image'), createProductAditional);
indexRoutes.get('/allProductAditional', auth(['admin', 'user']), getAllProductAditional);
indexRoutes.get('/getProductAditional/:id', auth(['admin', 'user']), getProductAditionalById);
indexRoutes.put('/updateProductAditional/:id', auth(['admin']), upload.array('image'), updateProductAditionalById);
indexRoutes.delete('/deleteProductAditional/:id', auth(['admin']), deleteProductAdtionalById);

// Login With Mobile No

indexRoutes.post('/mobileNoLogin', loginWithMobileNo);
indexRoutes.post('/verifyOtp', verifyOtp);
indexRoutes.post('/staticResendotp', staticResentOtp);


indexRoutes.post('/generateOtp', generateOtp);
indexRoutes.post('/verifyGenereOtp', verifyGenerateOtp);
indexRoutes.post('/resentOtp', resentOtp);

module.exports = indexRoutes;   