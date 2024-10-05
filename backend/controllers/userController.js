const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/jwToken");


exports.userRegister = async (req, res) => {

  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(401).json({
      success: false,
      message: "Please enter all fields"
    })
  }

  try {
    const user = await User.create({
      fullname,
      email,
      password
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User not registered"
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered",
      user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.userLogin = async (req, res, next) => {

  const submittedEmail = req.body.email;
  const submittedPassword = req.body.password;

  try {

    const user = await User.findOne({ email:submittedEmail });

    if (!user) {
      return res.json({
        success: false,
        message: "Please enter valid credentials!",
      });
    }

    const isPasswordValid = await bcrypt.compare(submittedPassword, user.password);

    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Please enter valid credentials!",
      });
    }
    const {fullname, email, role, status,_id} = user;
    const userInfo = {
      fullname,
      email,
      role,
      status,
      _id
    }

    req.user = userInfo;
    getToken(req, res, next)

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }


}

exports.userLogout = async (req, res, next) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly:true
  });

  res.status(200).json({
    success:true,
    message:"Logged out successfully!"
  })

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Please enter valid credentials!",
      });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Please enter valid credentials!",
      });
    }

    req.user = user;
    l(req, res, next)


  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }


}    

exports.getUserDetails = async (req, res, next) => {

  try {

    const user = await User.findById(req.user);

    if (!user) {
      return res.json({
        success: false,
        message: "Please enter valid credentials!",
      });
    }

    res.status(200).json({
      success:true,
      user
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }


}

exports.userProfileUpdate = async (req, res) => {

  const { fullname, email } = req.body;

  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Invalid user details"
      });
    }

    user.fullname = fullname;
    user.email = email;

    user.save();

    return res.status(200).json({
      success: true,
      message: "User Profile Updated",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get all Users - admin
exports.getAllUsers = async (req, res) => {

  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//Update user role and status - Admin
exports.userProfileUpdateAdmin = async (req, res) => {

  const {  role, status } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Invalid user details"
      });
    }

   if(role){
    user.role = role;
   }
    
    if(status === true){
      user.status = status;
    }else if(status === false){
      user.status = status;
    }

    user.save();

    return res.status(200).json({
      success: true,
      message: "User Profile Updated",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Single User details - Admin
exports.getUserDetailsAdmin = async (req, res, next) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.json({
        success: false,
        message: "Please enter valid credentials!",
      });
    }

    res.status(200).json({
      success:true,
      user
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }


}


// Delete User - Admin
exports.deleteUser= async (req, res, next) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.json({
        success: false,
        message: "Please enter valid credentials!",
      });
    }

    await user.remove();

    res.status(200).json({
      success:true,
      message:"User deleted successfully"
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }


}

// Validate User
exports.validateUser = async(req,res)=>{

  const userId = req.user;
  
  const user = await User.findById(userId);

  if(!user){
    return res.status(401).json({
      success:false,
      message:"Invalid user"
    });
  }

  const {fullname, email, role, status,_id} = user;

  res.status(200).json({
    success:true,
    user:{
      fullname,
      email,
      role,
      status,
      _id
    }
  });

}