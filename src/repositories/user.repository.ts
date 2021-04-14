import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(User, dataSource);
  }
  async isUserExist(user: User) {
    let alreadyExistingUser = await this.find({
      where: {
        email: user.email
      }
    });
    // if (alreadyExistingUser.length > 0) {
    return alreadyExistingUser;
    // }
  }
}
