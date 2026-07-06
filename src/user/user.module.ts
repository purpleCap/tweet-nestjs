import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "src/profile/entity/profile.entity";
import { PaginationModule } from "src/common/pagination/pagination.module";
import { AuthModule } from "src/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import authConfig from "src/auth/config/auth.config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        PaginationModule,
        forwardRef(() => AuthModule),
        ConfigModule.forFeature(authConfig),
        JwtModule.registerAsync(authConfig.asProvider())
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}

/**
    {
        provide: APP_GUARD,
        useClass: AuthorizeGuard
    }
    The above piece of code enables AuthGuard globally in all the modules.
    Just put it in any one of the modules' provider and it is applicable globally.
*/
