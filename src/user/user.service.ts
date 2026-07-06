import { forwardRef, Inject, Injectable, NotFoundException, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "src/profile/entity/profile.entity";
import { UserAlreadyExistException } from "src/custom-exceptions/user-alreadt-exist.exception";
import { PaginationProvider } from "src/common/pagination/pagination.provider";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { HashingProvider } from "src/auth/provider/hashing.provider";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
        private readonly paginationProvider: PaginationProvider,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider,
    ) { }

    public async getAllUsers(paginationQueryDto: PaginationQueryDto) {
        return this.paginationProvider.paginateQuery<User>(paginationQueryDto, this.userRepository, null, {
            profile: true
        });
        // return await this.userRepository.find({
        //     relations: {
        //         profile: true
        //     }
        // });
    }

    public async getUsersById(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user;
    }

    public async getUsersByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user;
    }

    public async getUsersByUsername(username: string) {
        let user: User | null = null;
        try {
            user = await this.userRepository.findOne({
                where: {
                    username: username
                }
            });
        } catch(err) {
            throw new RequestTimeoutException(err, {
                description: "Request timeout while fetching user by username"
            });
        }

        if (!user) {
            throw new UnauthorizedException("User not found")
        }
        return user;
    }

    public async createUser(userPayload: CreateUserDto) {
        // check if email already present in DB
        const existingUserWithEmail = await this.userRepository.findOneBy([
            { email: userPayload.email },
        ]);
        if(existingUserWithEmail)
            throw new UserAlreadyExistException("email", userPayload.email);
        const existingUserWithUsername = await this.userRepository.findOneBy([
            { username: userPayload.username }
        ]);
        if(existingUserWithUsername)
            throw new UserAlreadyExistException("username", userPayload.username);

        // create a profile
        // let profile = this.profileRepository.create(userPayload.profile ?? {});
        // // ave profile to DB
        // await this.profileRepository.save(profile);

        // create user
        userPayload.profile = userPayload.profile ?? {};
        let user = this.userRepository.create({
            ...userPayload,
            password: await this.hashingProvider.hashPassword(userPayload.password)
        });
        // user.profile = profile;

        // save user to DB
        return await this.userRepository.save(user);  
    }

    updateUser(id: number, user: UpdateUserDto) {
        return "User updated successfully";

    }

    public async deleteUser(id: number) {
        const savedUser = await this.userRepository.findOne({
            where: {
                id
            },
            relations: {
                profile: true
            }
        });
        if(!savedUser) throw new NotFoundException("User not found")
        await this.userRepository.delete(id);
        // await this.profileRepository.delete(id);
        
        return "User deleted!"
    }
}