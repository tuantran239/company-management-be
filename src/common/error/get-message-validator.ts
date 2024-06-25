import { PathImpl2 } from '@nestjs/config';
import { I18nTranslations } from '../generated/i18n.generated';
import { TranslateOptions, i18nValidationMessage } from 'nestjs-i18n';

export const getMessageValidator = (
  key: PathImpl2<I18nTranslations>,
  options?: TranslateOptions,
) => {
  const translateOptions = options ?? {};
  return i18nValidationMessage<I18nTranslations>(key, { ...translateOptions });
};
