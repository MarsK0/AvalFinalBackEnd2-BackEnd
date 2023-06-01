import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "user"})
export class UserEntity{
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  username!: string

  @Column({
    type: "varchar"
  })
  password!: string

  @Column({
    default: ()=>"now()"
  })
  date_insertion!: Date

  @Column({
    nullable: true
  })
  date_modification!: Date

}
