import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lister les utilisateurs' })
  public async listUsers() {
    const users = await this.listUsersUseCase.execute();
    return users.map((u) => u.toJSON());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son id' })
  public async getUserById(@Param('id') id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return user?.toJSON();
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Les données pour créer un utilisateur',
  })
  public async createUser(@Body() input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Les données optionnelles pour mettre à jour un utilisateur',
  })
  public async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, input);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  public async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
