import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { AuthorizeGuard } from "src/auth/guards/authorize.guards";

@Controller('user')
// @UseGuards(AuthorizeGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    
    @Get()
    getUsers(
        @Query() paginationQueryDto: PaginationQueryDto
    ) {
        return this.userService.getAllUsers(paginationQueryDto);
    }

    // @UseGuards(AuthorizeGuard)
    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) param: number) {
        return this.userService.getUsersById(param);
    }


    @Post()
    createUser(@Body() userPayload: CreateUserDto) {
        return this.userService.createUser(userPayload);
    }


    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.userService.updateUser(id, user);
    }


    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }
}