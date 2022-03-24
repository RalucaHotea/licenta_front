import { EnumTableOption } from './enum-table-option.model';

export interface TableFilter {
  ColumnProp: string;
  EnumValue: number;
  Options: EnumTableOption[];
  Value: string;
}
