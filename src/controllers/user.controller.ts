import {Context, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get, getModelSchemaRef,


  post,






  requestBody,
  response
} from '@loopback/rest';
import * as bcrtypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {GlobalData} from '../application';
import {User} from '../models';
import {UserRepository} from '../repositories';


export class UserController {
  constructor(
    @inject.context()
    private ctx: Context,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}
  @get('/hits')
  getHits() {
    const c1: GlobalData = this.ctx.getSync('counter');
    return c1.count;
  }
  @post('/signup')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User | string> {
    let result = await this.userRepository.isUserExist(user);
    console.log(result);
    if (result.length > 0)
      return "User is Existing";
    else {
      user.password = bcrtypt.hashSync(user.password, 8);
      return this.userRepository.create(user);
    }

  }
  @post('/login')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async login(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {
          title: 'NewUser',
          exclude: ['id'],
        }),
      },
    },
  })
  user: Omit<User, 'id'>,
  ): Promise<string> {
    let result = await this.userRepository.isUserExist(user);
    if (result.length > 0) {
      let isPasswordValid = bcrtypt.compareSync(user.password, result[0].password);
      console.log(isPasswordValid);
      if (isPasswordValid) {
        const c1: GlobalData = this.ctx.getSync('counter')
        c1.count++;

        let token = jwt.sign({id: result[0].id}, "101703503", {expiresIn: 84600});
        return token
      }
      return "Password is invalid"
    }
    else {
      return "User does not exist"
    }
  }



}
