import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  Unique,
  IsEmail,
  DataType,
} from 'sequelize-typescript';

enum Status {
  UNHANDLED = 'unhandled',
  PLANNING = 'planning',
  READY = 'ready',
}

@Table
class Report extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description!: string;

  @Column(DataType.BLOB)
  photo!: Buffer;

  @Column(DataType.GEOGRAPHY('POINT'))
  coordinates!: object;

  @Column(DataType.STRING)
  status!: Status;

  @IsEmail
  @Column(DataType.STRING)
  reporter_email!: string;
}

export default Report;
