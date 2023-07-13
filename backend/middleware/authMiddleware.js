import jwt  from "jsonwebtoken";
import User from "../model/userModel.js";
import customError from "../utils/customError.js";

const protect = async(req, res, next) => {
  let token;

  token = req.cookies.jwt;
  if (token) { 
    try { 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next()
    } catch (error) { 
      console.log(error);
      next(customError('Not authorized, token failed', 401));
    }
  } else { 
    next(customError('Not authorized, no token', 401));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else { 
    next(customError('Not authorized as admin', 401));
  }
}

export { protect, admin };