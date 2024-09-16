/* eslint-disable import/no-anonymous-default-export */
import { FetchStreamsResponse, ICreateStreamInput, IStream, IUpdateStreamInput } from '../entities/stream.entity';
import { APIBuilder, BaseService } from './base.service';

class StreamService extends BaseService {
  async FetchStreams(inp: APIBuilder) {
    inp.setPath('/streams');
    return await this.Fetch<FetchStreamsResponse>(inp);
  }
  async GetOneStream(inp: APIBuilder) {
    inp.setPath('/streams');
    return await this.Get<IStream>(inp);
  }
  async CreateStream(inp: APIBuilder<ICreateStreamInput>) {
    inp.setPath('/streams');
    return this.Post<ICreateStreamInput, IStream>(inp);
  }
  async UpdateOneStream(inp: APIBuilder<IUpdateStreamInput>) {
    inp.setPath('/streams');
    return await this.Put<IUpdateStreamInput, IStream>(inp);
  }
  async DeleteOneStream(inp: APIBuilder) {
    inp.setPath('/streams');
    return await this.Delete<IStream>(inp);
  }
}

export default new StreamService();
