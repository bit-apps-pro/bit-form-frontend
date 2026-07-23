// FieldSettingsRegistry.ts

export type SettingConfig = {
  componentName: string
  order: number
  condition?: (fieldData: any) => boolean
  props?: Record<string, any>
}

export type FieldTypeConfig = {
  basic: SettingConfig[] | 'component'
  advanced: SettingConfig[] | 'component'
  legacyComponent?: string // ✅ Component NAME as string
  conditional?: boolean
}

const commonBasicFieldSettingsForFieldWithChild: SettingConfig[] = [
  { componentName: 'ChildFieldsSettings', order: 1 },

]

const commonAdvanceFieldSettingsForFieldWithChild: SettingConfig[] = [
  { componentName: 'AdminLabelSettings', order: 3 },
  { componentName: 'FieldNameSettings', order: 4 },
  { componentName: 'ContainerClassSettings', order: 5 },
]

const commonBasicFieldSettings: SettingConfig[] = [
  { componentName: 'FieldLabelSettings', order: 1 },
  { componentName: 'SubTitleSettings', order: 2 },
  { componentName: 'RequiredSettings', order: 1, condition: (fieldData) => fieldData?.typ !== 'address' },
]

const commonAdvancedFieldSettings: SettingConfig[] = [
  { componentName: 'HelperTxtSettings', order: 3 },
  { componentName: 'FieldHideSettings', order: 17 },
  { componentName: 'FieldDisabledSettings', order: 18 },
  { componentName: 'AdminLabelSettings', order: 19 },
  { componentName: 'FieldNameSettings', order: 20 },
  { componentName: 'ContainerClassSettings', order: 21 },
]

// ✅ Use explicit array types (not FieldTypeConfig which has union type)
const textInputCommonBasicSettings: SettingConfig[] = [
  ...commonBasicFieldSettings,
  { componentName: 'PlaceholderSettings', order: 4, condition: (fieldData) => !['date', 'datetime-local', 'time', 'month', 'week'].includes(fieldData?.typ) },
]

const textInputCommonAdvancedSettings: SettingConfig[] = [
  ...commonAdvancedFieldSettings,
  { componentName: 'DefaultValueSettings', order: 1, condition: (fieldData) => fieldData?.typ !== 'password' },
  { componentName: 'InputIconsSettings', order: 2 },
  { componentName: 'ValueRangeSettings', order: 5, condition: (fieldData) => ['number', 'date', 'datetime-local', 'time', 'month', 'week'].includes(fieldData?.typ) },
  { componentName: 'TextLengthSettings', order: 6, condition: (fieldData) => ['text', 'textarea'].includes(fieldData?.typ) },
  { componentName: 'SuggestionSettings', order: 8, condition: (fieldData) => ['text', 'email', 'username', 'url', 'number'].includes(fieldData?.typ) },
  { componentName: 'AutoCompleteSettings', order: 8, condition: (fieldData) => ['text', 'email', 'username', 'url', 'number'].includes(fieldData?.typ) },
  { componentName: 'InputMaskSettings', order: 10, condition: (fieldData) => ['text', 'username', 'url', 'textarea'].includes(fieldData?.typ) },
  { componentName: 'RegexPatternSettings', order: 11, condition: (fieldData) => ['text', 'url', 'textarea', 'password', 'number', 'email', 'username'].includes(fieldData?.typ) },
  { componentName: 'InvalidErrorMessageSettings', order: 12, condition: (fieldData) => ['url', 'number', 'email'].includes(fieldData?.typ) },
  { componentName: 'FieldReadOnlySettings', order: 13 },
  { componentName: 'EntryUniqueSettings', order: 15, condition: (fieldData) => ['text', 'url', 'textarea', 'password', 'number', 'email', 'color', 'date', 'username'].includes(fieldData?.typ) },
  { componentName: 'UserUniqueSettings', order: 16, condition: (fieldData) => ['username', 'email'].includes(fieldData?.typ) },
  { componentName: 'SizeAndPosition', order: 17 },

]

export const fieldSettingsRegistry: Record<string, FieldTypeConfig> = {
  text: {
    basic: textInputCommonBasicSettings,
    advanced: [
      ...textInputCommonAdvancedSettings,
      { componentName: 'InputModeSettings', order: 9 },
    ],
  },
  name: {
    basic: [
      ...commonBasicFieldSettingsForFieldWithChild,
      { componentName: 'ChildFieldPositionSettings', order: 3 },
    ],
    advanced: commonAdvanceFieldSettingsForFieldWithChild,
  },
  email: {
    basic: [
      ...textInputCommonBasicSettings,
      { componentName: 'EnableConfirmFieldSettings', order: 5 }
    ],
    advanced: textInputCommonAdvancedSettings,
  },
  number: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  username: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  password: {
    basic: [
      ...textInputCommonBasicSettings,
      { componentName: 'EnablePasswordShowHideSettings', order: 5 },
      { componentName: 'EnableConfirmFieldSettings', order: 6 },
    ],
    advanced: [
      ...textInputCommonAdvancedSettings,
      { componentName: 'PasswordValidationSettings', order: 9 },
    ],
  },
  url: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  textarea: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  date: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  'datetime-local': {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  time: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  month: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  week: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  color: {
    basic: textInputCommonBasicSettings,
    advanced: textInputCommonAdvancedSettings,
  },
  check: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'OptionsListSettings', order: 3 },
      { componentName: 'OtherOptionSettings', order: 4 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'OptionsColumnSettings', order: 4 },
      { componentName: 'MinimumOptionsSettings', order: 5 },
      { componentName: 'MaximumOptionsSettings', order: 6 },
      { componentName: 'EntryUniqueSettings', order: 7 },
    ],
    legacyComponent: 'RadioCheckSettings',
  },
  radio: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'OptionsListSettings', order: 3 },
      { componentName: 'OtherOptionSettings', order: 4 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'OptionsColumnSettings', order: 4 },
      { componentName: 'EntryUniqueSettings', order: 7 },
    ],
    legacyComponent: 'RadioCheckSettings',
  },
  'html-select': {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'PlaceholderSettings', order: 3 },
      { componentName: 'OptionsListSettings', order: 4 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'EntryUniqueSettings', order: 7 },
      { componentName: 'FieldReadOnlySettings', order: 13 },
    ],
    legacyComponent: 'HtmlSelectSettings',
  },
  select: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'PlaceholderSettings', order: 3 },
      { componentName: 'ActiveOptionsListSettings', order: 4 },
      { componentName: 'AllowMultipleSelectSettings', order: 8 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'ShowSearchInputSettings', order: 5 },
      { componentName: 'SearchPlaceholderSettings', order: 6, condition: (fieldData) => fieldData?.config?.showSearch !== false },
      { componentName: 'ShowSelectedOptionsAsChipSettings', order: 7, condition: (fieldData) => fieldData?.config?.multipleSelect },
      { componentName: 'SearchClearableSettings', order: 8, condition: (fieldData) => fieldData?.config?.showSearch !== false },
      { componentName: 'SelectedOptionClearableSettings', order: 9 },
      { componentName: 'OptionIconShowHideSettings', order: 10 },
      { componentName: 'SelectedOptionImageShowHideSettings', order: 11 },
      { componentName: 'AllowCustomOptionSettings', order: 12 },
      { componentName: 'CloseOnSelectSettings', order: 13 },
      { componentName: 'OptionsListHeightSettings', order: 14 },
      { componentName: 'EntryUniqueSettings', order: 15 },
      { componentName: 'FieldReadOnlySettings', order: 16 },
      { componentName: 'ListAndOptionsSettings', order: 21 },
    ],
  },
  range: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'ValueRangeSettings', order: 3 },
      { componentName: 'ValueStepSettings', order: 4 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'DefaultValueSettings', order: 1 },
      { componentName: 'SuggestionSettings', order: 8 },
      { componentName: 'AutoCompleteSettings', order: 8 },

    ],
    legacyComponent: 'SliderFieldSettings',
  },
  'file-up': {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'AllowMultipleFileSettings', order: 3 },
      { componentName: 'AllowedFileTypeSettings', order: 4 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'FileUploadButtonTextSettings', order: 1 },
      { componentName: 'InputIconsSettings', order: 2 },
      { componentName: 'FileSelectStatusSettings', order: 3 },
      { componentName: 'ShowMaxUploadSizeSettings', order: 4 },
      { componentName: 'AllowedMaxUploadSizeSettings', order: 5 },
      { componentName: 'ShowFileListSettings', order: 6 },
      { componentName: 'FileExistMessageSettings', order: 7 },
    ],
    legacyComponent: 'FileUploadSettings', // ✅ String reference
  },
  'advanced-file-up': {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'AdvancedFileUpBasicSettings', order: 3 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'AdvancedFileUpAdvancedSettings', order: 8 },
    ],
    legacyComponent: 'AdvanceFileUpSettings',
  },
  recaptcha: {
    basic: [
      { componentName: 'CaptchaThemeSettings', order: 1 },
      { componentName: 'CaptchaSizeSettings', order: 2 },
      { componentName: 'CaptchaPositionAlignmentSettings', order: 3 },
    ],
    advanced: [
      { componentName: 'FieldNameSettings', order: 20 },
    ],
    conditional: false,
  },
  turnstile: {
    basic: [
      { componentName: 'CaptchaThemeSettings', order: 1 },
      { componentName: 'CaptchaSizeSettings', order: 2 },
      { componentName: 'CaptchaPositionAlignmentSettings', order: 3 },
    ],
    advanced: [
      { componentName: 'CaptchaLanguageSettings', order: 1 },
      { componentName: 'CaptchaAppearanceSettings', order: 2 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
    conditional: false,
  },
  hcaptcha: {
    basic: [
      { componentName: 'CaptchaThemeSettings', order: 1 },
      { componentName: 'CaptchaSizeSettings', order: 2 },
      { componentName: 'CaptchaPositionAlignmentSettings', order: 3 },
    ],
    advanced: [
      { componentName: 'FieldNameSettings', order: 20 },
    ],
    conditional: false,
  },
  'decision-box': {
    basic: [

      { componentName: 'DecisionCheckLabelSettings', order: 1 },
      { componentName: 'RequiredSettings', order: 2, props: { asteriskIsAllow: false } },
      { componentName: 'DecisionCheckByDefaultSettings', order: 2 },

    ],
    advanced: [
      { componentName: 'DecisionValueSettings', order: 3, props: { type: 'checked' } },
      { componentName: 'DecisionValueSettings', order: 3, props: { type: 'unchecked' } },
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'FieldDisabledSettings', order: 18 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  gdpr: {
    basic: [

      { componentName: 'DecisionCheckLabelSettings', order: 1 },
      { componentName: 'RequiredSettings', order: 2, props: { asteriskIsAllow: false } },
    ],
    advanced: [
      { componentName: 'DecisionValueSettings', order: 3, props: { type: 'checked' } },
      { componentName: 'DecisionValueSettings', order: 3, props: { type: 'unchecked' } },
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'FieldDisabledSettings', order: 18 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  html: {
    basic: [
      { componentName: 'ContentSettings', order: 1 },
    ],
    advanced: [
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  shortcode: {
    basic: [
      { componentName: 'ShortcodeContentSettings', order: 1 },
    ],
    advanced: [
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  button: {
    basic: [
      { componentName: 'ButtonTextSettings', order: 3 },
      { componentName: 'ButtonTypeSettings', order: 4 },
      { componentName: 'ButtonFullWidthSettings', order: 5 },
      { componentName: 'ButtonAlignSettings', order: 6 },
    ],
    advanced: commonAdvancedFieldSettings,
  },
  hidden: {
    basic: [
      { componentName: 'FieldLabelSettings', order: 1, props: { hideIcons: true } },
      { componentName: 'DefaultValueSettings', order: 2 },
    ],
    advanced: [
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  paypal: {
    basic: [
      { componentName: 'PaymentAccountSelection', order: 1 },
      { componentName: 'PaypalBasicSettings', order: 2 },
    ],
    advanced: [
      { componentName: 'PaypalAdvancedSettings', order: 1 },
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  stripe: {
    basic: [
      { componentName: 'PaymentAccountSelection', order: 1 },
      { componentName: 'StripeBasicSettings', order: 2 },
    ],
    advanced: [
      { componentName: 'StripeAdvancedSettings', order: 1 },
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  mollie: {
    basic: [
      { componentName: 'PaymentAccountSelection', order: 1 },
      { componentName: 'MollieBasicSettings', order: 2 },
    ],
    advanced: [
      { componentName: 'MollieAdvancedSettings', order: 1 },
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  razorpay: {
    basic: [
      { componentName: 'PaymentAccountSelection', order: 1 },
      { componentName: 'RazorpayBasicSettings', order: 2 },
    ],
    advanced: [
      { componentName: 'RazorpayAdvancedSettings', order: 1 },
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  title: {
    basic: [
      { componentName: 'TitleBasicSettings', order: 1 },
    ],
    advanced: [
      { componentName: 'SizeAndPosition', order: 1 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  image: {
    basic: [
      { componentName: 'ImageBasicSettings', order: 1 },
    ],
    advanced: [
      { componentName: 'SizeAndPosition', order: 1 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  divider: {
    basic: [
      { componentName: 'SizeAndPosition', order: 1 },
    ],
    advanced: [
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  spacer: {
    basic: [
      { componentName: 'SizeAndPosition', order: 1 },
    ],
    advanced: [
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  currency: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'PlaceholderSettings', order: 3 },
      { componentName: 'InputAmountRangeSettings', order: 4 },
      { componentName: 'CurrencyInputFormatSettings', order: 5 },
      { componentName: 'CurrencyValueFormatSettings', order: 6 },
      { componentName: 'ConfigOptionsListSettings', order: 7 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'CurrencyDefaultAmountSettings', order: 1 },
      { componentName: 'ShowSelectedFlagImageSettings', order: 6 },
      { componentName: 'SelectedCurrencyClearableSettings', order: 7 },
      { componentName: 'SearchPlaceholderSettings', order: 8 },
      { componentName: 'SearchClearableSettings', order: 9 },
      { componentName: 'CurrencyNotFoundTextSettings', order: 10 },
      { componentName: 'ShowOptionFlagImageSettings', order: 11 },
      { componentName: 'OptionsListHeightSettings', order: 13 },
      { componentName: 'FieldReadOnlySettings', order: 15 },
    ],
  },
  country: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'PlaceholderSettings', order: 3 },
      { componentName: 'DetectCountryByIPSettings', order: 4 },
      { componentName: 'DetectCountryByGeoSettings', order: 5 },
      { componentName: 'ConfigOptionsListSettings', order: 6 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'SelectedCountryClearableSettings', order: 7 },
      { componentName: 'SearchPlaceholderSettings', order: 5 },
      { componentName: 'SearchClearableSettings', order: 8 },
      { componentName: 'CountryNotFoundTextSettings', order: 9 },
      { componentName: 'ShowSelectedFlagImageSettings', order: 10 },
      { componentName: 'ShowOptionFlagImageSettings', order: 10 },
      { componentName: 'OptionsListHeightSettings', order: 13 },
      { componentName: 'FieldReadOnlySettings', order: 15 },

    ],
  },
  address: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'ChildFieldsSettings', order: 4 },
      { componentName: 'AddressSchemeSettings', order: 6 },
      { componentName: 'ZipValidationSettings', order: 8 },
      { componentName: 'AddressAutocompleteSettings', order: 9 },
      { componentName: 'AddressAutoLocateSettings', order: 11 },
      { componentName: 'AddressShowMapSettings', order: 12, condition: (fieldData) => fieldData?.config?.autocomplete === 'google' },
    ],
    advanced: [
      ...commonAdvanceFieldSettingsForFieldWithChild,
      { componentName: 'HelperTxtSettings', order: 1 },
      { componentName: 'AddressSaveCoordinatesSettings', order: 2 },
    ],
  },
  'phone-number': {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'PlaceholderSettings', order: 3 },
      { componentName: 'PhoneInputFormatSettings', order: 4 },
      { componentName: 'PhoneValueFormatSettings', order: 5 },
      { componentName: 'DetectCountryByIPSettings', order: 6 },
      { componentName: 'DetectCountryByGeoSettings', order: 7 },
      { componentName: 'ConfigOptionsListSettings', order: 8 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'DefaultPhoneNumberSettings', order: 1 },
      { componentName: 'CustomRegexPatternValidationSettings', order: 5 },
      { componentName: 'InvalidErrorMessageSettings', order: 6 },
      { componentName: 'SelectedCountryClearableSettings', order: 7 },
      { componentName: 'SearchPlaceholderSettings', order: 8 },
      { componentName: 'SearchClearableSettings', order: 9 },
      { componentName: 'CountryNotFoundTextSettings', order: 10 },
      { componentName: 'ShowSelectedFlagImageSettings', order: 11 },
      { componentName: 'HideCountryListSettings', order: 12 },
      { componentName: 'ShowOptionFlagImageSettings', order: 13 },
      { componentName: 'OptionsListHeightSettings', order: 14 },
      { componentName: 'EntryUniqueSettings', order: 15 },
      { componentName: 'FieldReadOnlySettings', order: 16 },

    ],
  },
  section: {
    basic: [
      { componentName: 'FieldLabelSettings', order: 1 },
      { componentName: 'SubTitleSettings', order: 2 },
      { componentName: 'SizeAndPosition', order: 3 },
    ],
    advanced: [
      { componentName: 'HelperTxtSettings', order: 3 },
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  repeater: {
    basic: [
      { componentName: 'FieldLabelSettings', order: 1 },
      { componentName: 'SubTitleSettings', order: 2 },
      { componentName: 'RepeaterFieldBasicSettings', order: 3 },
    ],
    advanced: [
      { componentName: 'HelperTxtSettings', order: 3 },
      { componentName: 'FieldHideSettings', order: 17 },
      { componentName: 'AdminLabelSettings', order: 19 },
      { componentName: 'FieldNameSettings', order: 20 },
    ],
  },
  signature: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'SignaturePadSetting', order: 3 },
      { componentName: 'ControlBtnPosition', order: 4 },
      { componentName: 'ButtonReverse', order: 5 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'ClearBtnSetting', order: 6 },
      { componentName: 'UndoBtnSetting', order: 7 },
      { componentName: 'RedoBtnSetting', order: 8 },
    ],
  },
  rating: {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'RatingIconSettings', order: 3 },
      { componentName: 'OptionsListSettings', order: 4, props: { showUpload: true } },
      { componentName: 'RatingPositionSettings', order: 5 },
      { componentName: 'RatingLabelOnHoverSettings', order: 6 },
      { componentName: 'RatingLabelOnSelectedSettings', order: 7 },
    ],
    advanced: commonAdvancedFieldSettings,
  },
  'image-select': {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'OptionsListSettings', order: 3, props: { showUpload: true } },
      { componentName: 'AllowMultipleImage', order: 4 },
      { componentName: 'MinimumOptionsSettings', order: 5, condition: (fieldData) => fieldData?.inpType === 'checkbox' },
      { componentName: 'MaximumOptionsSettings', order: 6, condition: (fieldData) => fieldData?.inpType === 'checkbox' },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'ImageSelectItemSizeSettings', order: 7 },
      { componentName: 'ImageSelectCheckPositionSettings', order: 8 },
      { componentName: 'ImageSelectOptionLabelShowHideSettings', order: 9 },
      { componentName: 'EntryUniqueSettings', order: 10 },
    ],
    legacyComponent: 'ImageSelectFieldSettings',
  },
  'advanced-datetime': {
    basic: [
      ...commonBasicFieldSettings,
      { componentName: 'PlaceholderSettings', order: 3 },
      { componentName: 'AdvancedDateTimeFieldBasicSettings', order: 4 },
    ],
    advanced: [
      ...commonAdvancedFieldSettings,
      { componentName: 'AdvancedDateTimeFieldAdvancedSettings', order: 3 },
    ],
    legacyComponent: 'AdvancedDateTimeSettings',
  },
  'email-otp': {
    basic: [
      { componentName: 'FieldLabelSettings', order: 1 },
      { componentName: 'SubTitleSettings', order: 2 },
      { componentName: 'ReceiverEmailSettings', order: 3 },
      { componentName: 'OtpBasicSettings', order: 4 },
      { componentName: 'OtpEmailTemplateSettings', order: 5 },
    ],
    advanced: [
      { componentName: 'OtpAdvancedSettings', order: 1 },
      { componentName: 'HelperTxtSettings', order: 3 },
      { componentName: 'AdminLabelSettings', order: 5 },
      { componentName: 'FieldNameSettings', order: 6 },
    ],
    conditional: false,
  },
}
