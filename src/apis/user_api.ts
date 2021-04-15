import { ThreeCommasConfiguration, ThreeCommasService } from './base';

export class UserAPI extends ThreeCommasService {
  constructor(protected configuration: ThreeCommasConfiguration) {
    super(configuration, '/public/api/ver1/users');
  }

  /**
   * Change User Mode(Paper or Real) (Permission: ACCOUNTS_WRITE, Security: SIGNED)
   */
  async changeMode(data: {
    /**
     * 3commas app mode
     * @default real
     */
    mode: 'paper' | 'real';
  }): Promise<void> {
    return await this.request('POST', '/changemode', {}, data);
  }
}
