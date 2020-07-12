const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const token = req.header('x-auth-header')

    //Check for token
    if(!token) res.status(401).json({ msg: 'No token, Authorization denied' })

    try {
        //Verify Token
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        //Add user from payload
        req.user = decoded
        next()
    } catch(e) {
        // const refreshToken = req.header('x-auth-refresh-token')
        // console.log('refreshToken - ', refreshToken)
        // if(!refreshToken) {
        //     res.status(401).json({ msg: 'No Refresh token, Authorization denied' })
        // } else {
        //     res.json({ msg: 'refresh token hai atleast' })
        //     const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        //     auth()
        //     console.log('refresh token elseeeeeeee - ', decodedRefreshToken)
        //     // req.user = decodedRefreshToken
        // } 

        res.status(400).json({ msg: 'Token is not valid' })
    }
    // next()
}

module.exports = auth