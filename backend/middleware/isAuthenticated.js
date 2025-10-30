import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token || '';
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid authentication token' });
        }
        
      
            req.id = decoded.userId; 
        next();
    }); 
};

export default isAuthenticated;