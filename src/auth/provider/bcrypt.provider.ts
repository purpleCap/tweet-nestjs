import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
    async hashPassword(data: string | Buffer): Promise<string> {
        // Implementation for hashing password with bcrypt

        // GENERATE SALT
        const salt = await bcrypt.genSalt();

        // HASH PASSWORD
        return bcrypt.hash(data, salt);
    }

    async comparePassword(plainPassword: string | Buffer, hashedPassword: string): Promise<boolean> {
        // Implementation for comparing password with bcrypt
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}
