import { Request, Response } from 'express';
import { UserRecord } from '../records/user.record';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserEntity } from '../types';
import bcrypt from 'bcrypt';
import { encryptPESEL } from '../utils/encryptPESEL';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { username, password, email, peselNumber } = req.body as UserEntity;
    const hashedPwd = await bcrypt.hash(password, 10);
    const encryptedPESEL = JSON.stringify(
      await encryptPESEL(peselNumber, hashedPwd),
    );
    const user = new UserRecord({
      username,
      password: hashedPwd,
      email,
      peselNumber: encryptedPESEL,
    });
    res.json(await user.register());
  }
  static async login(req: Request, res: Response) {
    const { username, pwd } = req.body;

    const token = await UserRecord.login(username, pwd);

    if (!token) res.status(401).json({ message: 'Invalid credentials' });

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json({ token });
  }

  static verify(req: Request, res: Response) {
    const { token } = req.body;

    const decoded: JwtPayload | string = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    if (typeof decoded === 'string')
      return res.status(401).json({ message: 'Unauthorized' });

    res.json(true);
  }

  static async getUserPesel(req: Request, res: Response) {
    const user = new UserRecord(await UserRecord.getOne(req.params.id));

    const peselNumber = await user.getPesel();

    res.status(200).json(peselNumber);
  }
}
