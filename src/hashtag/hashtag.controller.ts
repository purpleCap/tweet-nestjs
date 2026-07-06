import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  createHashtag(@Body() hashtagPayload: CreateHashtagDto) {
    return this.hashtagService.createHashtag(hashtagPayload);
  }

  @Delete('soft-delete/:id')
  deleteHashtag(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.softDeleteHashtag(id);
  }
}
