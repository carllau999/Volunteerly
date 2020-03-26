import {Table, Column, Model, DataType, AllowNull, ForeignKey, PrimaryKey, BelongsTo, Default} from 'sequelize-typescript';
 
// remove createdAt and updatedAt from all tables

@Table({ createdAt: false, updatedAt: false })
export class Volunteer extends Model<Volunteer>{
  @AllowNull(false)
  @Column
  first_name: string;
  @AllowNull(false)
  @Column
  last_name: string;
  @AllowNull(false)
  @Column
  email: string;
  @AllowNull(false)
  @Column(DataType.TEXT)
  password: string;
  @Column(DataType.TEXT)
  bio: string;
  // @Column
  // date_joined: Date;
  @Column(DataType.TEXT)
  profile_picture_UrL: string;
  @AllowNull(false)
  @Column
  level: number;
}

@Table({ createdAt: false, updatedAt: false })
export class VolunteerAvailability extends Model<VolunteerAvailability>{

  @ForeignKey(() => Volunteer)
  @Column
  volunteer_id:number;
  @AllowNull(false)
  @Column
  day_of_week: string;
  @AllowNull(false)
  @Column(DataType.TIME)
  start_hour: Date;
  @AllowNull(false)
  @Column(DataType.TIME)
  end_hour: Date;
}

@Table({ createdAt: false, updatedAt: false })
export class Organization extends Model<Organization>{
  @AllowNull(false)
  @Column
  organization_name: string;
  @Column(DataType.TEXT)
  bio: string;
  @Column
  organization_logo_url: string;
}

@Table({ createdAt: false, updatedAt: false })
export class EventType extends Model<EventType>{
  @Column(DataType.TEXT)
  photo_url: string;
  @AllowNull(false)
  @Column
  text: string;
}

@Table({ createdAt: false, updatedAt: false })
export class Stat extends Model<Stat>{
  @ForeignKey(()=>Volunteer)
  @Column
  volunteer_id:number;
  @ForeignKey(()=>StatCategory)
  @Column
  stat_category_id:number;
  @Default(0)
  @Column
  quantity:number;
}

@Table({ createdAt: false, updatedAt: false })
export class StatCategory extends Model<StatCategory>{
  @Column(DataType.TEXT)
  photo_url: string;
  @Column
  text: string;
}

@Table({ createdAt: false, updatedAt: false })
export class Event extends Model<Event>{
  @AllowNull(false)
  @Column
  name:string;
  @Column
  start_date:Date;
  @Column
  end_date: Date;
  @Column(DataType.TEXT)
  description: string;
  @Column(DataType.TEXT)
  location: string;
  @ForeignKey(() => EventType)
  @Column
  event_category_id:number;
  @Column(DataType.TEXT)
  photo_url: string;
  @ForeignKey(() => Organization)
  @Column
  organization_id: number;
  @Column
  duration:number;
}

@Table({ createdAt: false, updatedAt: false })
export class VolunteerEventPreference extends Model<VolunteerEventPreference>{
  @ForeignKey(() => Volunteer)
  @PrimaryKey
  @Column
  volunteer_id: number;
  @ForeignKey(() => Event)
  @PrimaryKey
  @Column
  event_type_id:number;
}
@Table({ createdAt: false, updatedAt: false })
export class Achievement extends Model<Achievement>{
  @Column(DataType.TEXT)
  photo_url: string;
  @Column
  text: string;
  @Default(0)
  @Column
  quantity: number
}
@Table({ createdAt: false, updatedAt: false })
export class AchievementEarned extends Model<AchievementEarned>{
  @ForeignKey(() => Volunteer)
  @PrimaryKey
  @Column
  volunteer_id: number;
  @ForeignKey(() => Achievement)
  @PrimaryKey
  @Column
  achievement_id: number;

}

@Table({ createdAt: false, updatedAt: false })
export class Enrollment extends Model<Enrollment>{
  //TODO implement the cascade option
  // @BelongsTo(()=>Volunteer,{
  //   onDelete: "CASCADE"
  // })
  @ForeignKey(() => Volunteer)
  @PrimaryKey
  @Column
  volunteer_id: number;


  @ForeignKey(() => Event)
  @PrimaryKey
  @Column
  event_id:number;

}
