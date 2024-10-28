exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token;
    console.log("Extracted token:", token); // Kiểm tra token

    if (!token) {
        console.log("No token, redirecting to login");
        return res.redirect('/login');
    }
    
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err);
            return res.redirect('/login');
        }
        req.user = decoded; // Lưu thông tin người dùng
        console.log("Token verified, user:", decoded); // Kiểm tra thông tin người dùng
        next();
    });
};
