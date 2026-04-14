import Razorpay from 'razorpay';

let razorpayInstance = null;

export const getRazorpayInstance = () => {
    if (razorpayInstance) {
        return razorpayInstance;
    }

    if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
        throw new Error('Razorpay credentials are missing');
    }

    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
    });

    return razorpayInstance;
};

export default getRazorpayInstance;
