export const baseUrl = 'https://ecomapi.ftdigitalsolutions.org';
// export const baseUrl = 'https://test-ecomapi.justvy.in';
// const baseUrl ='http://82.29.161.36'
// export const baseUrl = 'https://gubera-test-api.justvy.in';

const cartCreate = `${baseUrl}/api/carts/`;
const createUsers = `${baseUrl}/create_users/`;
const addresses = `${baseUrl}/addresses/`;
const cartItem = `${baseUrl}/api/cart_items/`;
const cartItems = `${baseUrl}/api/cart_items/carts`;
const cartItemsUpdate = `${baseUrl}/cart-item/update/`;
const product = `${baseUrl}/api/products/`;
const categories = `${baseUrl}/categories-with-subcategories/vendor`;
const signIn = `${baseUrl}/user_login/`;
const userCreate = `${baseUrl}/create_users/`;
const orderItem = `${baseUrl}/order-and-order-items/`;
const users = `${baseUrl}/users`;
const orderGet = `${baseUrl}/orders/user/`;
const applyCoupons = `${baseUrl}/apply_coupons`;
const variants = `${baseUrl}/variants`;
const sizes = `${baseUrl}/sizes`;
const productVariantCart = `${baseUrl}/product-variant-cart-item/update/`;
const paymentApi = `${baseUrl}/prepaid-pay-now`;
const updateSelectedAddress = `${baseUrl}/update-selected-address`;
const fetchProductWithVariantSize = `${baseUrl}/fetch-product-with-variant-size/`;
const AllProductWithVariantSize = `${baseUrl}/fetch-all-product-with-variant-size/`;
const checkEmail = `${baseUrl}/user/get-by-email-or-contact-and-vendor/`;
const sendOtp = `${baseUrl}/send-email-opt-user/`;
const verifyOtp = `${baseUrl}/verify-email-opt-return-user/`;
const vendorOtherDetails = `${baseUrl}/vendor-other-details/`;
const vendorSitePolicies = `${baseUrl}/vendor-site-policies/`;
const vendorDetailsDelivery = `${baseUrl}/vendor-with-site-details/`;
const checkCourierCharge = `${baseUrl}/Check-Courier-Serviceability-delivery-charge/`;
const ordersAndOrderItems = `${baseUrl}/fetch-order-and-order-items-by-user-vendor/`;
const appliedCouponData = `${baseUrl}/get-applied-coupon-data/`;
const coupons = `${baseUrl}/coupons/`;
const orderAndOrderId = `${baseUrl}/order-with-order-items-by-order-id/`;
const checkDtdcCharge = `${baseUrl}/Check-Dtdc-Courier-Serviceability-delivery-charge/`;
const codPay = `${baseUrl}/cod-pay-now/`;
const wishlist = `${baseUrl}/api/wishlist/`;
const sendSmsOtpUser = `${baseUrl}/send-sms-opt-user/`;
const otpVerify = `${baseUrl}/verify-sms-opt-return-user/`;
const reviews = `${baseUrl}/reviews/`;
const sendQuoteRequest = `${baseUrl}/send_quote_request_api/`;
const blog=`${baseUrl}/blog/`;
const paymentDeliveryPartner=`${baseUrl}/vendor-site-payment-delivery-partner-details/`;
const ourClient=`${baseUrl}/our-client/`;
const productWithOptions=`${baseUrl}/product-with-options-value-pricing/`;
const getSingleProductWithOptionsPrice=`${baseUrl}/get-single-product-with-options-price/`;
const CreateUpdateOptionProduct=`${baseUrl}/create-or-update-cartitem-product-with-options/`;
const DeleteCartItemWIthImage=`${baseUrl}/delete-cartitem-product-with-options-cartitem-images/`;
const cartItemOption=`${baseUrl}/fetch-cartitem-product-with-options/`;
const removeCoupon = `${baseUrl}/cart/`;
const cartCalculateTotal=`${baseUrl}/cart/calculate-total/`;
const videos = `${baseUrl}/videos/`;

const ApiUrls = {
  cartCreate,
  createUsers,
  addresses,
  cartItem,
  cartItems,
  product,
  categories,
  signIn,
  userCreate,
  cartItemsUpdate,
  orderItem,
  users,
  orderGet,
  applyCoupons,
  variants,
  sizes,
  productVariantCart,
  paymentApi,
  updateSelectedAddress,
  fetchProductWithVariantSize,
  AllProductWithVariantSize,
  checkEmail,
  sendOtp,
  verifyOtp,
  vendorOtherDetails,
  vendorSitePolicies,
  vendorDetailsDelivery,
  checkCourierCharge,
  ordersAndOrderItems,
  appliedCouponData,
  coupons,
  orderAndOrderId,
  checkDtdcCharge,
  codPay,
  baseUrl,
  wishlist,
  sendSmsOtpUser,
  otpVerify,
  reviews,
  sendQuoteRequest,
  blog,
  paymentDeliveryPartner,
  ourClient,
  productWithOptions,
  getSingleProductWithOptionsPrice,
  CreateUpdateOptionProduct,
  DeleteCartItemWIthImage,
  cartItemOption,
  removeCoupon,
  cartCalculateTotal,
  videos,
};

export default ApiUrls;
