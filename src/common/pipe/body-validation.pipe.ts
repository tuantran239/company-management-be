import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';

@Injectable()
export class BodyValidationPipe implements PipeTransform<any> {
  constructor(private i18n: I18nCustomService) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);

    const errors = await validate(object);

    let validation_error = '';

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      validation_error += Object.keys(error.constraints ?? {})
        .map((key) =>
          this.i18n.getMessage(error.constraints[key].split('|')[0] as any),
        )
        .join(',');

        if(i !== errors.length - 1) {
          validation_error += ','
        }
    }

    if (errors.length > 0) {
      throw new BadRequestException(
        validation_error.length > 0 ? validation_error : 'Validation failed',
      );
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
