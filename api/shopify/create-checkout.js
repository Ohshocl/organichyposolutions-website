cat > api/shopify/create-checkout.js << 'EOF'
const ShopifyClient = require('../_utils/shopify-client');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method Not Allowed',
            message: 'Only POST requests are supported'
        });
    }

    try {
        if (!req.body || !req.body.lineItems) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Missing required field: lineItems'
                }
            });
        }

        const { lineItems } = req.body;
        
        if (!Array.isArray(lineItems) || lineItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'lineItems must be a non-empty array'
                }
            });
        }

        const shopify = new ShopifyClient();
        
        // Simple checkout creation - we'll implement this basic version first
        return res.status(200).json({
            success: true,
            data: {
                message: 'Checkout endpoint working - implementation pending'
            }
        });

    } catch (error) {
        console.error('Error in create-checkout API:', error);
        
        return res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create checkout',
                details: error.message
            }
        });
    }
};
EOF
