import { Tweet } from "src/tweet/entity/tweet.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Hashtag {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'text',
        nullable: false
    })
    name!: string;

    @DeleteDateColumn()
    deletedAt?: string;

    @ManyToMany(() => Tweet, (tweet) => tweet.hashtags, {
        onDelete: 'CASCADE'
    })
    tweets?: Tweet[]
}