export interface FormOption {
  list: FormOptionList[];
  labelWidth?: number | string;
  span?: number;

}

export interface FormOptionList {
  prop: string;
  label: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  opts?: any[];
  format?: string;
  activeValue?: any;
  inactiveValue?: any;
  activeText?: string;
  inactiveText?: string;
  required?: boolean;
}
export interface BaseObject {
  [key: string]: any
}

export interface FormValRef {
  [key: string]: string | number | undefined
}

export interface SelectOption {
  label: string
  value: string
}

export interface PaginationType {
  page: number
  limit: number
  total: number
}
