import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EventDataInput {
  @Field()
  event: string;

  @Field()
  payload: string;
}
