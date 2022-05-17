import { JwtPayload, verify } from 'jsonwebtoken';
import { Response, Request } from 'express';

const routeGuard = (req: Request, res: Response, next: any) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Необходима авторизация', error: 'No token value' });
    }

    try {
      const decoded = verify(
        token,
        process.env.AUTH_TOKEN_SECRET!
      ) as JwtPayload;
      req.userId = decoded.id;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Необходима авторизация', error });
    }
  } else {
    return res
      .status(401)
      .json({ message: 'Необходима авторизация', error: 'No auth header' });
  }
};
export default routeGuard;
