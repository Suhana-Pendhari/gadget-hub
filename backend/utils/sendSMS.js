import twilio from 'twilio';

const canSendSMS = () => {
    return Boolean(
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
    );
};

export const sendSMS = async ({ to, body }) => {
    if (!canSendSMS()) {
        throw new Error('Twilio credentials are not configured.');
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    return client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
        body
    });
};

export default sendSMS;
