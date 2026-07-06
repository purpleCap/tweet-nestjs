import { Hashtag } from "src/hashtag/entity/hashtag.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class Tweet {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'text',
        nullable: false
    })
    text!: string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    image?: string;

    @CreateDateColumn()
    createdAt!: string;

    @UpdateDateColumn()
    updatedAt!: string;

    @ManyToOne(() => User, (user) => user.tweets, {eager: true})
    user!: User

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.tweets, {eager: true})
    @JoinTable() // this decorator creates the junction table, here it is: tweet_hashtags_hashtag.
    hashtags?: Hashtag[];
}