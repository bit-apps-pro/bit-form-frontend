export type colorPickerProps = {
  id: string,
  value: string | valueObject,
  onChangeHandler: (value: valueObject | object) => void,
  allowImportant?: boolean,
  allowSolid?: boolean,
  allowGradient?: boolean,
  allowImage?: boolean,
  allowVariable?: boolean,
  colorProp: ColorProp,
}

type BackgroundObject = {
  'background-position'?: string;
  'background-size'?: string;
  'background-image'?: string;
  'background-repeat'?: string;
}

type ColorProp = 'background-color' | 'border-color' | 'color';

export type valueObject = {
  [K in ColorProp]?: string;
} & BackgroundObject;

export type colorObj = {
  h: number,
  s: number,
  v: number,
  a: number,
} | {}
