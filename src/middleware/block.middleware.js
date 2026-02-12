export const checkBlocked = (req, res, next) => {
    const user = req.user;
  
    if (user.blockedUntil && user.blockedUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message: `Account blocked until ${user.blockedUntil.toISOString()}`,
      });
    }
  
    next();
  };
  