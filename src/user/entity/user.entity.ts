import { Profile } from "src/profile/entity/profile.entity";
import { Tweet } from "src/tweet/entity/tweet.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 24,
        nullable: false,
        unique: true
    })
    username!: string;

    @Column({
        type: "varchar",
        length: 50,
        nullable: false,
        unique: true
    })
    email!: string;

    @Column({
        type: "varchar",
        length: 150,
        nullable: false
    })
    password!: string;

    @OneToOne(() => Profile, (profile) => profile.user, {
        cascade: ["insert"],
        // eager: true // whenever we re going to query the user data its going to respond with profile details
    })
    profile?: Profile;

    @OneToMany(() => Tweet, (tweet) => tweet.user)
    tweets?: Tweet[]

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}