import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService, TokenPair } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterResponse, LoginResponse, TokenPairResponse, MessageResponse } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new tenant',
    description:
      'Create a new tenant account with a company name. ' +
      'This provisions an isolated database, generates an API key, and returns JWT tokens.',
  })
  @ApiResponse({ status: 201, description: 'Tenant registered successfully.', type: RegisterResponse })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login as tenant',
    description: 'Authenticate with email and password. Returns an access token and refresh token.',
  })
  @ApiResponse({ status: 200, description: 'Login successful.', type: LoginResponse })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Exchange a valid refresh token for a new access/refresh token pair.',
  })
  @ApiResponse({ status: 200, description: 'New token pair issued', type: TokenPairResponse })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshTokens(@Body() dto: RefreshTokenDto): Promise<TokenPair> {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Send a password reset email to the specified address. ' +
      'Always returns success to prevent email enumeration.',
  })
  @ApiResponse({ status: 200, description: 'Reset email sent if account exists', type: MessageResponse })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'If an account exists with this email, a reset link has been sent' };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password with token',
    description: 'Set a new password using the token received via email.',
  })
  @ApiResponse({ status: 200, description: 'Password reset successful', type: MessageResponse })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password has been reset successfully' };
  }
}
