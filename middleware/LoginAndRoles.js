const jwt = require('jsonwebtoken');
const User = require('../api/Members/member-model');
const RoleControll=require('../api/Rolemanagement/roleController');
const RoleModel=require('../api/Rolemanagement/roleManagementModel');
// const AdminModel=require('../api/userProfile/user-model');

const AdminModel=require('../api/userProfile/roleModel');
const { Op } = require('sequelize');


const authenticate = async (req, res, next) => {
  try {
    const cookietoken = req.cookies.token;
    const headerToken = req.header('Authorization')?.replace('Bearer ', '');
    const token = cookietoken || headerToken;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'krishan');
    console.log('User ID from token:', decoded.id);

 
    const admin = await AdminModel.findOne({
      where: { mobile_no: decoded.id  },
    });
    
    var  user = await User.findByPk(decoded.id);
    if(!user){
      user = await User.findOne({where:{mobile_no:decoded.id}});
    }
    

    if (admin) {
      req.userRole = 'admin';
      req.user = admin;
      req.token = token;
      console.log('Authenticated as admin');
      return next();
    }

    if (user) {
      req.userRole = await RoleControll.getDataReturn(req, res, RoleModel, user.id);
      req.user = user;
      req.token = token;
      console.log('Authenticated as user with role:');
      return next();
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Please authenticate' });
  }
};




const checkPermission = (action, role) => async (req, res, next) => {
  try {

    console.log("check role")
    console.log(action,role,req.userRole);
    if (req.userRole === 'admin') {
      let userRole;

      const cookietoken = req.cookies.token;
      const headerToken = req.header('Authorization')?.replace('Bearer ', '');
      const token = cookietoken || headerToken;
      const decoded = jwt.verify(token, 'krishan');

      const admin = await AdminModel.findAll({
        where: { mobile_no: decoded.id  },
      });

      console.log(admin[0].name);

      await Promise.all(admin.map(async (element) => {
        try {
          if (typeof element.role === 'string') {
            element.role = JSON.parse(element.role);
          }
        } catch (err) {
          console.error("Error parsing role:", err);
        }
      }));

      req.userRole = admin[0].role;

      userRole = admin[0].role;
      
      
      if (userRole[role][action]==true) {
        
        console.log(userRole[role][action]);
        console.log(role,action)
        console.log(userRole[role][action])
        return next();
      }

      else
      {
        console.log("admin roles ")
        return res.status(403).json({ message: 'Forbidden' });
      }
   
    }
    const userRole = req.userRole;
    console.log(userRole);
    if (!userRole || !userRole[role] || userRole[role][action] === undefined) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (userRole[role][action]) {
      console.log("TTT")
      console.log(userRole[role][action])
      return next();
    }
    console.log('error')
    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    console.log("EEEE",error)
    console.error('Permission error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  authenticate,
  checkPermission
};
