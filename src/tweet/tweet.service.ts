import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Tweet } from './entity/tweet.entity';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Hashtag } from 'src/hashtag/entity/hashtag.entity';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
    private readonly paginationProvider: PaginationProvider,
    @InjectRepository(Tweet) private readonly tweetRepository: Repository<Tweet>,
  ) { }

  public async createTweet(tweet: CreateTweetDto, activeUser: ActiveUserType) {
    let user: User | undefined = undefined;
    let hashtags: Hashtag[] | undefined = undefined;
    try {
      user = await this.userService.getUsersById(activeUser.sub);
      if(tweet.hashtags)
        hashtags = await this.hashtagService.findHashtags(tweet.hashtags ?? []);
    } catch(err) {
      throw new RequestTimeoutException();
    }
    return await this.tweetRepository.save({ ...tweet, user, hashtags });
  }

  public async getTweets(userId: number, pageQueryDto: PaginationQueryDto) {
    // console.log(userId)
    return await this.paginationProvider.paginateQuery<Tweet>(pageQueryDto, this.tweetRepository, {
      user: {
        id: userId
      }
    });
    // page 1: skip: 0, take: 10
    // page 2: skip: 10, take: 10
    // page 3: skip: 20, take: 10
    // page 4: skip: 30, take: 10
    // page n: skip: (n-1)*10, take: 10
  }

  public async getTweetById(id: number) {
    return await this.tweetRepository.findOneBy({ id });
  }

  public async updateTweet(updateTweetDto: UpdateTweetDto) {
    let hashtags: Hashtag[] = await this.hashtagService.findHashtags(updateTweetDto.hashtags ?? []);
    const tweet = await this.getTweetById(updateTweetDto.id);
    if (!tweet) throw new NotFoundException("Tweet not found");

    tweet.text = updateTweetDto.text ?? tweet.text;
    if (updateTweetDto.hashtags)
      tweet.hashtags = hashtags;
    tweet.image = updateTweetDto.image ?? tweet.image;

    return await this.tweetRepository.save(tweet);
  }

  public async deleteTweet(id: number) {
    // on deleting a tweet from the Tweet table 
    // it will also delete the corrosponding row(s) 
    // from the junction table. 
    // Tweet --> Hashtag (Many-to-Many uni-directional)
    // This holds true for the owning side of the relation.
    // Here the owning side is 'Tweet' entity.
    const tweet = await this.tweetRepository.findOneBy({ id });
    if (!tweet) throw new NotFoundException("Tweet not found");
    return await this.tweetRepository.delete({ id });
  }
}
