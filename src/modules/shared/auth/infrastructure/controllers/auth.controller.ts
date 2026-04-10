import { Body, Post, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { LoggingService } from '../../../../shared/logging/domain/services/logging.service';
import { LoginDto } from '../../application/dtos/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly loggingService: LoggingService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter pour obtenir un token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie, retourne le token.',
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  async login(@Body() loginDto: LoginDto) {
    this.loggingService.log('AuthController.login');
    return this.loginUseCase.execute(loginDto);
  }
}
