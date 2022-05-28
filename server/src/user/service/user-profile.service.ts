import { S3Service } from '@/provider/s3/s3.service';
import { Injectable } from '@nestjs/common';
import { UserProfileRepository } from '../repository';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userRepository: UserProfileRepository,
    private readonly s3Service: S3Service,
  ) {}

  async profileUp(userId: number, file: Express.Multer.File) {
    console.log('~~~~~~');
    const fileName = `${Date.now()}-${file.originalname}`;
    await this.s3Service.putObject(fileName, file, 'profile'); //지금 대문자 처리 없음
    await this.userRepository.createProfile(userId, fileName);
    return;
  }
}
