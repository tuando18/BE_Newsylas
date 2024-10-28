const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password }); // Debug log

        // Find user with matching username and password
        const user = await User.findOne({ username, password }); 

        if (!user) {
            console.log('Invalid login credentials');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: '1h' });
        console.log('Token generated successfully:', token);

        // Send the token back as a JSON response or set it as a cookie
        res.status(200).json({ message: 'Login successful', token, user });

    } catch (error) {
        console.error('Error in login process:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
