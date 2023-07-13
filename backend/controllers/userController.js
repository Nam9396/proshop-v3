import User from "../model/userModel.js";
import customError from "../utils/customError.js";
import generateToken from "../utils/generateToken.js";
import jwt from 'jsonwebtoken';


const authUser = async(req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user && await user.matchPassword(password)) { 
    generateToken(res, user._id);
    
    return res.json({
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin, 
    })
  } else { 
    next(customError('Invalid email or fucking', 401));
  };
};

const registerUser = async(req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email: email }); 
  if (userExists) { 
    next(customError('User already exists', 400));
  } 

  const user = await User.create({ 
    name, 
    email,  
    password
  })

  if (user) { 
    generateToken(res, user._id);

    res.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else { 
    next(customError('Invalid user data', 400)); 
  }

};

const logoutUser = async(req, res, next) => {
  res.cookie('jwt', '', { 
    httpOnly: true, 
    expires: new Date(0),
  })
  res.status(200).json({ message: 'Log out successfully' })
};

const getUserProfile = async(req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (user) { 
    res.status(200).json({
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin
    })
  } else { 
    next(customError('User not found', 404));
  }
};

const updateUserProfile = async(req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) { 
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) { 
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id, 
      name: updatedUser.name, 
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin, 
    })
  } else { 
    next(customError('User not found for updated', 404))
  }
  
};

const getUsers = async(req, res, next) => {
  const allUser = await User.find();
  if (allUser) { 
    res.json(allUser);
  } else { 
    next(customError('All user cannot found', 404))
  }
};

const getUserById = async(req, res, next) => {
  const userById = await User.findById(req.params.id);
  if (userById) { 
    res.json(userById);
  } else { 
    next(customError('Cannot find User', 404));
  }
};

const deleteUser = async(req, res, next) => {
  const userDeleted = await User.findByIdAndDelete(req.params.id);
  if (userDeleted) { 
    res.json(userDeleted);
  } else { 
    next(customError('Cannot delete user', 404));
  }
};

const updateUser = async (req, res, next) => {
  const { userId, name, email, isAdmin } = req.body;
  const user = await User.findById(userId);
  if (user) { 
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin || user.isAdmin; 
    const userUpdated = await user.save();
    res.json(userUpdated);
  } else { 
    next(customError('Cannot update user'))
  }
};

export { 
  getUsers, 
  getUserById, 
  getUserProfile, 
  registerUser, 
  logoutUser, 
  updateUser, 
  updateUserProfile,
  deleteUser, 
  authUser,
};