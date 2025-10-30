import mongoose from 'mongoose';
const CartItemSchema = new mongoose.Schema({
   
    productId: {
        type: String, 
        required: true,
    },
    name: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    imageUrl: {
        type: String,
        required: true,
    }
  
});

const CartSchema = new mongoose.Schema({
    sessionId: { 
        type: String,
        required: true,
        unique: true 
    },
    items: {
        type: [CartItemSchema], 
        default: []
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;