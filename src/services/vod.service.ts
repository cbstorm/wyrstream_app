/* eslint-disable import/no-anonymous-default-export */
import { FetchVodsResponse, IUpdateVodInput, IVod } from '../entities/vod.entity';
import { APIBuilder, BaseService } from './base.service';

class VodService extends BaseService {
  async FetchVods(inp: APIBuilder) {
    inp.setPath('/vods');
    return await this.Fetch<FetchVodsResponse>(inp);
  }
  async FetchMyVods(inp: APIBuilder) {
    inp.setPath('/vods/my_vods');
    return await this.Fetch<FetchVodsResponse>(inp);
  }
  async GetOneVod(inp: APIBuilder) {
    inp.setPath('/vods');
    return await this.Get<IVod>(inp);
  }
  async UpdateOneVod(inp: APIBuilder<IUpdateVodInput>) {
    inp.setPath('/vods');
    return await this.Put<IUpdateVodInput, IVod>(inp);
  }
  async deleteOneVod(inp: APIBuilder) {
    inp.setPath('/vods');
    return await this.Delete<IVod>(inp);
  }
}

export default new VodService();
