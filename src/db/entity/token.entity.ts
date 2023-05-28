import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: "token"})
export class TokenEntity{
  @PrimaryGeneratedColumn()
  id!: number
  
  @Column()
  token!: string

  @Column({
    default: "true"
  })
  valid!: boolean

  @ManyToOne(() => UserEntity, (user) => user.id)
  user!: UserEntity

}