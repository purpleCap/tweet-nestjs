import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { GetTweetQueryDto } from './dto/get-tweet-query.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';

@Controller('tweet')
export class TweetController {
    constructor(private readonly tweetService: TweetService){}

    @Post()
    public createTweet(@Body() tweet: CreateTweetDto, @ActiveUser() user) {
        return this.tweetService.createTweet(tweet, user);
    }

    @Get()
    public getTweets(
        @ActiveUser('sub') userId: number,
        @Query() getTweetQueryDto: GetTweetQueryDto,
    ) {
        // console.log("getTweetQueryDto: ", getTweetQueryDto);
        return this.tweetService.getTweets(userId, getTweetQueryDto);
    }

    @Patch()
    public updateTweet(@Body() updateTweetDto: UpdateTweetDto) {
        return this.tweetService.updateTweet(updateTweetDto);
    }

    @Delete(':id')
    public deleteTweet(@Param('id', ParseIntPipe) id: number) {
        return this.tweetService.deleteTweet(id);
    }
}
