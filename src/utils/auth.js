
import jwt from "jsonwebtoken";
const secret = "sou@123$";
function setToken(user){
    const playload = {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password
    }
return jwt.sign(playload, secret, { expiresIn: '1h' });
}

function verifyUser(token){
return jwt.verify(token, secret);
}

export{
    setToken,
    verifyUser
}