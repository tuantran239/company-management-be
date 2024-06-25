import { API_URL, BaseRouter } from 'src/common/constant/router';
import { BaseRouterUrl } from 'src/common/constant/router';

export const RoleRouter: BaseRouter = {
  ...BaseRouterUrl,
  ROOT: `${API_URL}/role`,

};
