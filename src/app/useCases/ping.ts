import { UseCase } from '@shared/types/http';

import { CreateResponse } from '../../shared/utils/create-reponse';

export class PingUseCase implements UseCase {
  async execute() {
    return CreateResponse.ok(undefined, 'Everything is ok here');
  }
}
