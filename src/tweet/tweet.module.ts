import { Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entity/tweet.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    UserModule, 
    HashtagModule,
    PaginationModule, 
    TypeOrmModule.forFeature([Tweet])],
  controllers: [TweetController],
  providers: [TweetService]
})
export class TweetModule {}
