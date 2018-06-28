import {BaseHttpController, controller, httpGet} from 'inversify-express-utils';

@controller('/')
export class HomeController extends BaseHttpController {
  @httpGet('/')
  public async get(): Promise<string> {
    return 'Home sweet home';
  }
}
