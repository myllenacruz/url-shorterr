import { IUserRequest } from '@src/authentication/interfaces/user-request.interface';
import { userEntity } from '@modules/user/tests/mocks/user.mock';

export const userRequest: IUserRequest = {
    id: userEntity.id,
    name: userEntity.name,
    email: userEntity.email
};
