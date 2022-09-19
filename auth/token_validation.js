const { verify } = require('jsonwebtoken');
module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization');
        if (token) {
            token = token.slice(7);
            verify(token, 'qwe1234', (err, decoded) => {
                if (err) {
                    return res.json({
                        success: 0,
                        message: 'Invalid token'
                    });
                } else {
                    next();
                }
            });
        } else {
            return res.json({
                success: 0,
                message: 'Access denied! unauthorized user'
            });
        }
    }
}