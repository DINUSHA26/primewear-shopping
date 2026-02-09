const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sync cart from local storage to database
// @route   POST /api/v1/cart/sync
// @access  Private
exports.syncCart = async (req, res) => {
    try {
        const { items } = req.body; // Expecting array of { id, quantity, name, price, images, ... }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: []
            });
        }

        // Merge logic: 
        // We will process the incoming items.
        // If an item exists in DB, update quantity? Or overwrite? 
        // User request: "past cart item that not place order should be displayed their cart also"
        // This suggests merging. But simple merge is complex with quantities.
        // Simplified strategy: 
        // 1. Create a map of existing DB items.
        // 2. Iterate through incoming local items.
        // 3. If exists, take the local quantity (latest interaction). If not, add it.
        // 4. BUT, what about items ONLY in DB? They should probably stay unless explicitly removed.

        // Let's adopt a "Merge Max" or "Add" strategy. 
        // Let's just Add quantities if exists, or append if new.
        // Wait, normally "Sync" on login means: grab DB cart, merge with Local cart.
        // If the user *just* logged in, the frontend sends its local cart.
        // We should update the DB with these items.

        // Better Strategy for this specific request:
        // The user implies that if they had items in a previous session (DB), and now they log in, they want to see them.
        // Also if they added items as guest (Local), those should be added too.

        const dbItemsMap = new Map();
        cart.items.forEach(item => {
            dbItemsMap.set(item.product.toString(), item);
        });

        for (const localItem of items) {
            // localItem.id is the product ID
            if (dbItemsMap.has(localItem.id)) {
                // Item exists in DB. Update quantity?
                // Let's assume user wants the sum or the local one overrides? 
                // Usually local overrides if it's "sync on login", or we sum them.
                // Let's sum them to be safe and ensure nothing is lost.
                const dbItem = dbItemsMap.get(localItem.id);
                dbItem.quantity = localItem.quantity; // Local is usually fresher
            } else {
                // Add new item
                cart.items.push({
                    product: localItem.id,
                    quantity: localItem.quantity,
                    price: localItem.price,
                    name: localItem.name,
                    images: localItem.images,
                    category: localItem.category,
                    vendorName: localItem.vendorName,
                    vendorId: localItem.vendorId
                });
            }
        }

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item (add/remove/update quantity)
// @route   POST /api/v1/cart/update
// @access  Private
exports.updateCart = async (req, res) => {
    try {
        const { item, quantity } = req.body; // item is the full product object, quantity is new quantity. 
        // If quantity is 0, remove.

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(i => i.product.toString() === item.id);

        if (quantity <= 0) {
            if (existingItemIndex > -1) {
                cart.items.splice(existingItemIndex, 1);
            }
        } else {
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity = quantity;
            } else {
                cart.items.push({
                    product: item.id,
                    quantity: quantity,
                    price: item.price,
                    name: item.name,
                    images: item.images,
                    category: item.category,
                    vendorName: item.vendorName,
                    vendorId: item.vendorId
                });
            }
        }

        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Clear cart
exports.clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.status(200).json({ success: true, data: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
