import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import sendSMS from '../utils/sendSMS.js';

const DEFAULT_DELIVERY_DAYS = 7;

const getEstimatedDeliveryDate = (days = DEFAULT_DELIVERY_DAYS) => {
    const eta = new Date();
    eta.setDate(eta.getDate() + days);
    return eta;
};

const normalizeIndianPhone = (phoneNo) => {
    const digits = String(phoneNo || '').replace(/\D/g, '');
    if (!digits) return null;
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    return digits.startsWith('+') ? digits : `+${digits}`;
};

// Create New Order (User, admin)
export const createNewOrder = handleAsyncError(async(req, res, next) => {
    const {shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice} = req.body;
    const estimatedDeliveryDate = getEstimatedDeliveryDate();

    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemPrice,
        paymentInfo,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
        estimatedDeliveryDate,
        trackingTimeline: [
            {
                status: 'Processing',
                note: 'Order placed successfully'
            }
        ]
    })

    const to = normalizeIndianPhone(shippingInfo?.phoneNo);
    if (to) {
        try {
            await sendSMS({
                to,
                body: `Order successful! Order ID: ${order._id}. Estimated delivery by ${new Date(estimatedDeliveryDate).toDateString()}.`
            });
        } catch (smsError) {
            console.log('SMS send failed:', smsError.message);
        }
    }

    res.status(201).json({
        success: true,
        order
    })
})

// Getting single Order (admin)
export const getSingleOrder = handleAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if(!order){
        return next(new HandleError("No order found", 404));
    }
    res.status(200).json({
        success: true,
        order
    })
})

// All my orders (user, admin)
export const allMyOrders = handleAsyncError(async(req, res, next)=>{
    const orders = await Order.find({user:req.user._id});
    if(!orders){
        return next(new HandleError("No order found", 404));
    }
    res.status(200).json({
        success: true,
        orders
    })
})

// Getting all Orders (admin)
export const getAllOrders = handleAsyncError(async(req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })
    if(!orders){
        return next(new HandleError("No order found", 404));
    }
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
})

// Update order status (admin)
export const uppdateOrderStatus = handleAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if(!order){
        return next(new HandleError("No order found", 404));
    }
    if(order.orderStatus === 'Delivered'){
        return next(new HandleError("This order is already been delivered", 404));
    }
    const previousStatus = order.orderStatus;
    const nextStatus = req.body.status;

    if (previousStatus === 'Processing' && nextStatus !== 'Processing') {
        await Promise.all(order.orderItems.map(item=>updateQuantity(item.product, item.quantity)));
    }

    order.orderStatus = nextStatus;
    order.trackingTimeline.push({
        status: nextStatus,
        note: `Order status changed from ${previousStatus} to ${nextStatus}`
    });

    if(order.orderStatus === 'Delivered'){
        order.deliveredAt = Date.now();
        
        // Send SMS notification when delivered
        const phoneNo = order.shippingInfo?.phoneNo;
        console.log('Order delivered - attempting to send SMS. Phone:', phoneNo);
        
        const to = normalizeIndianPhone(phoneNo);
        console.log('Normalized phone number:', to);
        
        if (to) {
            try {
                console.log('Sending SMS to:', to);
                const result = await sendSMS({
                    to,
                    body: `Your order has been delivered successfully! Order ID: ${order._id}. Thank you for your purchase!`
                });
                console.log('SMS sent successfully:', result.sid);
            } catch (smsError) {
                console.error('SMS send failed - Error:', smsError.message || smsError);
                console.error('SMS Error details:', smsError);
            }
        } else {
            console.log('Invalid phone number, SMS not sent');
        }
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success: true,
        order
    })
})

async function updateQuantity(id, quantity){
    const product = await Product.findById(id);
    if(!product){
        throw new Error(new HandleError("Product not found"));
    }
    product.stock -= quantity;
    await product.save({validateBeforeSave: false});
}

// Deleting order
export const deleteOrder = handleAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("No order found", 404));
    }
    if(order.orderStatus !== 'Delivered'){
        return next(new HandleError("This order is under processing and cannot be deleted", 404));
    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success:true,
        message: "Order deleted successfuly!"
    })
})