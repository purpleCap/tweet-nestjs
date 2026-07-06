import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile { 
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 50,
        nullable: false,
        default: ""
    })
    firstName!: string;

    @Column({
        type: "varchar",
        length: 50,
        nullable: false,
        default: ""
    })
    lastName!: string;

    @Column({
        type: "varchar",
        length: 50,
        nullable: true,
    })
    gender?: string;

    @Column({
        type: "datetime",
        nullable: true
    })
    dateOfBirth?: string;

    @Column({
        type: 'text',
        nullable: true
    })
    bio?: string;

    @Column({
        type: 'text',
        nullable: true
    })
    profileImage?: string;

    @OneToOne(() => User, (user) => user.profile, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    user?: User
}