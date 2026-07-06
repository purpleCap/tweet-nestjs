import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import authConfig from "../config/auth.config";
import type { ConfigType } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { REQUEST_USER_KEY } from "../constants/constants";

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly reflector: Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // READ 'isPublic' metadata
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(), // method level
            context.getClass() // class level
        ]);

        if(isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if(!token) return false;

        try {
            const payload = await this.jwtService.verifyAsync(token, this.authConfiguration);
            request[REQUEST_USER_KEY] = payload;
            return true;
        } catch(err) {
            throw new UnauthorizedException();
        }
    }
}









/**
Why are not exporting AuthGuard from AuthModule still able to use it in UserModule ?

Because exports in a Nest module only controls dependency injection, not plain TypeScript imports — and AuthorizeGuard never goes through Nest's DI for this use case.

Two separate things are at play here:

TypeScript import is just a file import. In user.controller.ts:6:


import { AuthorizeGuard } from "src/auth/guards/authorize.guards";
This is standard ES module resolution based on the file path — it has nothing to do with AuthModule's exports array. 
Nest's module exports/imports system governs what's available in the DI container 
(i.e., what can be injected into a constructor), not what classes you're allowed to import from a file. 
Since authorize.guards.ts exports the class at the language level, any file in the project can import it directly, regardless of NestJS module boundaries.

@UseGuards(AuthorizeGuard) doesn't require DI resolution. 
At user.controller.ts:19, you're passing the guard's class reference, not an instance. 
When Nest executes the request, it tries to resolve AuthorizeGuard from the DI container of the enclosing module context. 
Since AuthorizeGuard has no constructor dependencies and was never registered as a provider anywhere, 
Nest just falls back to instantiating it directly (new AuthorizeGuard()) rather than pulling a DI-managed singleton. 
So it works even though it's not a provider of any module, let alone exported.

Why this matters: if AuthorizeGuard ever needs an injected dependency (e.g. a JwtService or ConfigService), this would break — since a plain new AuthorizeGuard() bypasses DI, 
those dependencies would be undefined. 
At that point, you'd need to either register AuthorizeGuard as a provider in the module where it's used and inject it via @UseGuards(AuthorizeGuard) 
(Nest supports resolving providers by class token too, as long as it's provided/exported into that module's scope), or use app.useGlobalGuards() with proper provider registration.
*/