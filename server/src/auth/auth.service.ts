import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger('AuthService');

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    try {
      await user.save();
      this.logger.log("new user created");
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      throw new InternalServerErrorException();
    }
  }

  async signin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await User.findOne({ where: { username } });
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!(user && isValidPassword)) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
