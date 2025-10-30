import Product from '../modles/product.modle.js';

const addProduct = async (req, res) => {
    try {
        const { name, productId, price, gender, category , stock , imageUrl , moreImages } = req.body;

        const newProduct = await Product.create({
            name,
            productId,
            price,
            gender,
            category,
            stock,
            imageUrl,
            moreImages
        });

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { addProduct, getAllProducts, getProductById };