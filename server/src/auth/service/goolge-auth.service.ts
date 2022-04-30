import { UserRepository } from '@/user/repository';
import { ConfigService } from '@nestjs/config';
import { HttpException, Injectable, Res } from '@nestjs/common';
import { google } from 'googleapis';
import { AuthService } from '@/auth/service';
import { Response } from 'express';

@Injectable()
export class GoogleService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async googleCallback(code: string, @Res() res: Response) {
    try {
      const GOOGLE_ID = this.configService.get('auth.google.id');
      const GOOGLE_SECRET = this.configService.get('auth.google.secret');
      const REDIRECT_URI = this.configService.get('auth.google.redirect');
      const accessToken = await this.getGoogleAccessToken(
        code,
        GOOGLE_ID,
        GOOGLE_SECRET,
        REDIRECT_URI,
      );
      if (!accessToken) throw new HttpException('access_token 받기 실패', 400);
      const userInfo = await this.getGoogleUserInfo(accessToken);
      const userId = await this.getGoogleUserId(userInfo);
      if (!userId) throw new HttpException('로그인 실패', 400);
      const tokens = await this.authService.getTokens(userId, userInfo.email);
      this.authService.setTokenCookie(res, tokens);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async getGoogleAccessToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string,
  ) {
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
    const { tokens } = await oAuth2Client.getToken(code);
    if (!tokens.access_token) {
      throw new HttpException('Failed to retrieve google access token', 400);
    }
    return tokens.access_token;
  }

  async getGoogleUserInfo(access_token: string) {
    const people = google.people('v1');
    const userInfo = await people.people.get({
      access_token: access_token,
      resourceName: 'people/me',
      personFields: 'names,emailAddresses, photos',
    });
    const { data } = userInfo;
    const user = {
      email: data.emailAddresses[0]?.value || null,
      username: data.names[0]?.displayName || 'emptyname',
    };
    return user;
  }

  async getGoogleUserId({ email, username }) {
    const exUser = await this.userRepository.findByEmail(email);
    if (exUser) return exUser.id;

    const user = { email, username };
    this.userRepository.create(user);
    return (await this.userRepository.findByEmail(email)).id;
  }
}
