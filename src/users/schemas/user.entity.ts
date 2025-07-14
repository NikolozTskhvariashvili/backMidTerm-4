import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  fullName: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: Number,
    required: true,
  })
  age: number;

  @Prop({
    type: String,
    required: true,
  })
  gender: string;
}

export const userSchema = SchemaFactory.createForClass(User);
