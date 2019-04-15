// import { ADMIN_ROLE } from '../resources/user/user.model';

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 1) {
    return res.json({ err: 'unauthorized, not an admin' });
  }
  next();
};