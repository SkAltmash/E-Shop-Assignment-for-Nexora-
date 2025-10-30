import User from '../modles/user.modle.js';
import bcrypt from 'bcryptjs';
import  jwt  from 'jsonwebtoken';

const COOKIE_OPTIONS = {
    maxAge: 1 * 24 * 60 * 60 * 1000, 
    httpOnly: true, 
    sameSite: 'lax',
    secure: false   
};

const registerUser = async (req, res) => {
   try {
     const { name, email, password } = req.body;
     const existingUser = await User.findOne({ email });
     
     if (existingUser) {
       return res.status(400).json({ message: 'User already exists', sucess: "false" });
     }
     
     const hashedPassword = await bcrypt.hash(password, 10); 
     
     const newUser = await User.create({ name, email, password: hashedPassword });
     
     const tokenData ={
        userId : newUser._id, 
     }
     const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

     return res.status(201)
        .cookie("token", token, COOKIE_OPTIONS) // <-- Use FIXED options
        .json({ 
            message: 'User registered successfully', 
            user: newUser, 
            success: true,
            token: token // Needed for frontend state update
        });
     
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal server error' });
   }
};

const loginUser = async (req, res) => {
   try {
     const { email, password } = req.body;
     
     const user = await User.findOne({ email }); 
     
     if (!user) {
        return res.status(401).json({ message: 'Invalid email or password', sucess: "false" });
     }
     
     const isPasswordMatch = await bcrypt.compare(password, user.password);
     
     if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password', sucess: "false" });
     }
     
     const tokenData ={
        userId : user._id,
     }
     const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
     
     return res.status(200)
        .cookie("token", token, COOKIE_OPTIONS) // <-- Use FIXED options
        .json({
            message: `Welcome back ${user.name}`,
            user,
            success: true,
            token: token // Needed for frontend state update
        });
        
    } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal server error' });
   }
};

const logoutUser = async (req, res) => {
   try {
    
    return res.status(200)
        .cookie("token", "", { maxAge: 0 }) 
        .json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal server error' });
   }
}

export { registerUser, loginUser ,logoutUser };