import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { BcryptProvider } from './provider/bcrypt.provider';
import { HashingProvider } from './provider/hashing.provider';
import authConfig from './config/auth.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [AuthService, {
    provide: HashingProvider,
    useClass: BcryptProvider
  }],
  exports: [AuthService, HashingProvider]
})
export class AuthModule {}

// HashingProvider is an abstract class 
// that defines the interface for hashing and comparing passwords. 
// BcryptProvider is a concrete implementation of HashingProvider 
// that uses the bcrypt library to hash and compare passwords. 
// We cannot directly instantiate an abstract class, 
// so we provide the BcryptProvider as the implementation 
// for HashingProvider in the providers array of the AuthModule like the way it's shown above.
// The AuthModule imports the UserModule, registers the AuthController and AuthService, 
// and provides the BcryptProvider as the implementation for HashingProvider.
