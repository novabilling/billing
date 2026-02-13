import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrencyService } from '../../services/currency.service';
import { Public } from '../../common/decorators/public.decorator';

class CurrencyResponse {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'List supported currencies',
    description: 'Retrieve all supported currencies with their symbols and metadata.',
  })
  @ApiResponse({ status: 200, description: 'List of currencies', type: [CurrencyResponse] })
  getSupportedCurrencies() {
    const codes = this.currencyService.getSupportedCurrencies();
    return codes.map((code) => {
      const info = this.currencyService.getCurrencyInfo(code);
      return {
        code,
        ...info,
      };
    });
  }
}
