import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AppService } from 'src/app.service';
import { EventDataInput } from 'src/common/dto/event.dto';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  getData(): string {
    return this.appService.getData();
  }

  @Mutation(() => Boolean)
  async sendEvent(@Args('data') data: EventDataInput): Promise<boolean> {
    await this.appService.sendEvent(data);
    return true;
  }
}
