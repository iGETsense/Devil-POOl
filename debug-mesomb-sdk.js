const MeSomb = require('@hachther/mesomb');
console.log("Exports from @hachther/mesomb:");
console.log(Object.keys(MeSomb));

if (MeSomb.PaymentOperation) {
    console.log("PaymentOperation prototype methods:");
    console.log(Object.getOwnPropertyNames(MeSomb.PaymentOperation.prototype));
}
