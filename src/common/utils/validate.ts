import { BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";
import { I18nCustomService } from "src/i18n-custom/i18n-custom.service";

export const checkEnumTypeValid = (
  enumType: Record<string, string>,
  inputs: string[],
  errorMessage?: string,
  notThrowError?: boolean
) => {
  const enumValues = Object.values(enumType);

  const isValid =  inputs.length > 0 && inputs.every((input) => enumValues.includes(input))

  if(!isValid && !notThrowError) {
    throw new Error(errorMessage ?? 'Invalid enum type');
  }

  return isValid;
};

export const checkBodyValid = async (metadata: any,  payload: Record<string, any>, i18n: I18nCustomService) => {

  const keys = Object.keys(payload)

  for(let i = 0; i < keys.length; i++) {
    const key = keys[i];
    metadata[key] = payload[key]
  }

  const errors = await validate(metadata);

  let validation_error = '';

  for (let i = 0; i < errors.length; i++) {
    const error = errors[i];
    validation_error += Object.keys(error.constraints ?? {})
      .map((key) =>
        i18n.getMessage(error.constraints[key].split('|')[0] as any),
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
}
