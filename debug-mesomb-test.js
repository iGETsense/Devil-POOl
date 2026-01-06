
const { PaymentOperation } = require('@hachther/mesomb');

// Keys from .env.local
const APPLICATION_KEY = 'f63d0ed63da6e4373ec7ac43ff89f7af60e0d773';
const ACCESS_KEY = 'fe3efd4c-cb89-45ef-a18b-d831cf25d1ea';
const SECRET_KEY = '1bb8c37c-1b92-4428-b060-8716cafcedca';

async function testPayment() {
    console.log("Testing MeSomb Payment...");

    const payment = new PaymentOperation({
        applicationKey: APPLICATION_KEY,
        accessKey: ACCESS_KEY,
        secretKey: SECRET_KEY,
    });

    try {
        const response = await payment.makeCollect({
            amount: 50,
            service: 'OCM',
            payer: '237690000000', // Test if 237 is doubled
            message: 'Test Transaction',
            reference: 'TEST-' + Date.now()
        });

        console.log("Response Success:", response.isOperationSuccess());
        console.log("Response Message:", response.message);
        console.log("Response Full:", JSON.stringify(response, null, 2));

    } catch (error) {
        console.error("Payment Failed:", error);
    }
}

testPayment();
