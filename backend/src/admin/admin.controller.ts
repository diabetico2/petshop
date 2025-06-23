import { Controller, Post } from '@nestjs/common';
import { fixOldImageUrls } from '../utils/fix-urls';

@Controller('admin')
export class AdminController {
  @Post('fix-urls')
  async fixImageUrls() {
    try {
      const result = await fixOldImageUrls();
      return {
        success: true,
        message: `URLs corrigidas com sucesso!`,
        ...result
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao corrigir URLs: ${error.message}`
      };
    }
  }
}
