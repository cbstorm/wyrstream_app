/* eslint-disable import/no-anonymous-default-export */
import { ICreateAccountInput, ICreateAccountResponse, ILoginInput, ILoginReponse } from '../entities/auth.entity';
import { IUser } from '../entities/user.enity';
import { APIBuilder, BaseService } from './base.service';

class AuthService extends BaseService {
  async Login(inp: APIBuilder<ILoginInput>) {
    inp.setPath('/auth/user/login');
    return await this.Post<ILoginInput, ILoginReponse>(inp);
  }

  async CreateAccount(inp: APIBuilder<ICreateAccountInput>) {
    inp.setPath('/auth/user/create_account');
    return await this.Post<ICreateAccountInput, ICreateAccountResponse>(inp);
  }

  async GetMe() {
    const inp = new APIBuilder();
    inp.setPath('/auth/user/get_me');
    return await this.Get<IUser>(inp);
  }
}

export default new AuthService();
