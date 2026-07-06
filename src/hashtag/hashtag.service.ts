import { Injectable } from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Hashtag } from './entity/hashtag.entity';

@Injectable()
export class HashtagService {
    constructor(@InjectRepository(Hashtag) private readonly hashtagRepository: Repository<Hashtag>) {}

    public async createHashtag(hashtagPayload: CreateHashtagDto) {
        return await this.hashtagRepository.save(hashtagPayload);
    }

    public async findHashtags(hashtags: number[]) {
        return await this.hashtagRepository.find({
            where: {
                id: In(hashtags)
            }
        });
    }

    public async deleteHashtag(id: number) {
        return await this.hashtagRepository.delete({
            id
        });
    }

    public async softDeleteHashtag(id: number) {
        // softeDelete method will update a column with DeleteDateColumn annotation
        return await this.hashtagRepository.softDelete({
            id
        });
    }
}
