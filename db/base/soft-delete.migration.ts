import { TableColumnOptions } from 'typeorm';
import { BaseColumn } from './base.migration';

export const SoftDeleteColumn: TableColumnOptions[] = [
  ...BaseColumn,
  {
    name: 'deleted_at',
    type: 'timestamptz',
    isNullable: true,
    default: null,
  },
];
