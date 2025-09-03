import mongoose  from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    products : {
        type: [
            { 
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                quantity: {type: Number}
            }
        ]
    },
    created_at : {type: Date, default: Date.now}

});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;