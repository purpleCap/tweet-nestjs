import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

// PartialType going to have all the properties UpdateUserDto also make them optional
export class UpdateUserDto extends PartialType(CreateUserDto) {
             
}