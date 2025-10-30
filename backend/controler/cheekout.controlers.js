import Cart from '../modles/cart.modle.js';    
import Product from '../modles/product.modle.js'; 
import Checkout from '../modles/cheekout.modle.js'; 


const createCheckout = async (req, res) => {
   
    const userId = req.userId || req.id; 
    if (!userId) {
        return res.status(401).json({ message: "Authentication required to place an order.", success: false });
    }

    
    const { shippingAddress, paymentMethod = "COD" } = req.body;

    if (!shippingAddress || !shippingAddress.fullName) {
        return res.status(400).json({ message: "Shipping address details are required in the request body.", success: false });
    }

    try {
        const cart = await Cart.findOne({ sessionId: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty. Cannot place an order.", success: false });
        }
        
        let orderItems = [];
        let itemsTotal = 0;
        
        for (const cartItem of cart.items) {
            
           
            const productData = await Product.findOne({ productId: cartItem.productId })
                                              .select('name price imageUrl'); 

            if (!productData) {
                return res.status(404).json({ message: `Product "${cartItem.name}" (ID: ${cartItem.productId}) not found. Please review your cart.`, success: false });
            }
            
       
            const finalPrice = productData.price;
            const itemSubtotal = finalPrice * cartItem.qty;
            itemsTotal += itemSubtotal;

            orderItems.push({
                productId: cartItem.productId, 
                name: productData.name,
                price: finalPrice,
                qty: cartItem.qty,
                imageUrl: productData.imageUrl,
            });
        }
        
        const shippingCharge = 0; 
        const discount = 0;
        const totalAmount = itemsTotal + shippingCharge - discount;
        
        const priceSummary = {
            itemsTotal: itemsTotal,
            shippingCharge: shippingCharge,
            discount: discount,
            totalAmount: totalAmount,
        };

        const newOrder = new Checkout({
            user: userId, 
            items: orderItems,
            shippingAddress: shippingAddress,
            payment: {
                method: paymentMethod,
                status: (paymentMethod === "COD") ? "pending" : "pending", 
                transactionId: null,
            },
            priceSummary: priceSummary,
            orderStatus: "processing",
        });

        const savedOrder = await newOrder.save();

    
        await Cart.deleteOne({ sessionId: userId });

        // 8. Response
        res.status(201).json({ 
            message: "Order placed successfully!", 
            orderId: savedOrder._id,
            totalAmount: savedOrder.priceSummary.totalAmount,
            success: true 
        });

    } catch (error) {
        console.error("Error creating checkout:", error);
        res.status(500).json({ message: "Internal server error during checkout. Please check console for details.", error: error.message, success: false });
    }
};
const getAllOrders = async (req, res) => {
    try {
    const userId = req.userId || req.id; 
    if (!userId) {
        return res.status(401).json({ message: "Authentication required to place an order.", success: false });
    }
        const orders = await Checkout.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ orders: orders, success: true });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error while fetching orders.", error: error.message, success: false });
    } 
}

export {
    createCheckout,
    getAllOrders,
};
