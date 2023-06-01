import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: "messages"})
export class MessageEntity{
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string
  
  @Column()
  description!: string

  @Column()
  date_message!: string
  
  @Column({
    default: "false"
  })
  archived!: boolean

  @Column({
    default: ()=>"now()"
  })
  date_insertion!: Date


  @Column({
    nullable: true
  })
  date_modification!: Date

  @ManyToOne(() => UserEntity, (user) => user.id)
  user!: UserEntity

}
