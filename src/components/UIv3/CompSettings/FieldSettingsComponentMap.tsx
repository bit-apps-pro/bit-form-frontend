import loadable from '@loadable/component'
import { ComponentType } from "react"

// Common components (always loaded, used frequently)
import AdminLabelSettings from "../../CompSettings/CompSettingsUtils/AdminLabelSettings"
import ChildFieldPositionSettings from '../../CompSettings/CompSettingsUtils/ChildFieldPositionSettings'
import ChildFieldsSettings from '../../CompSettings/CompSettingsUtils/ChildFieldsSettings'
import EnableConfirmFieldSettings from '../../CompSettings/CompSettingsUtils/EnableConfirmFieldSettings'
import EnablePasswordShowHideSettings from '../../CompSettings/CompSettingsUtils/EnablePasswordShowHideSettings'
import FieldDisabledSettings from "../../CompSettings/CompSettingsUtils/FieldDisabledSettings"
import FieldHideSettings from "../../CompSettings/CompSettingsUtils/FieldHideSettings"
import FieldLabelSettings from "../../CompSettings/CompSettingsUtils/FieldLabelSettings"
import FieldNameSettings from '../../CompSettings/CompSettingsUtils/FieldNameSettings'
import FieldReadOnlySettings from "../../CompSettings/CompSettingsUtils/FieldReadOnlySettings"
import HelperTxtSettings from "../../CompSettings/CompSettingsUtils/HelperTxtSettings"
import PlaceholderSettings from "../../CompSettings/CompSettingsUtils/PlaceholderSettings"
import RequiredSettings from "../../CompSettings/CompSettingsUtils/RequiredSettings"
import SubTitleSettings from "../../CompSettings/CompSettingsUtils/SubTitleSettings"
import FieldSettingsLoader from "../../Loaders/FieldSettingsLoader"

// Define where each component lives
const componentModules: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  // Legacy field settings
  // 'TextFieldSettings': () => import('../../CompSettings/TextFieldSettings'),
  // 'FileUploadSettings': () => import('../../CompSettings/FileUploadSettings'),
  // 'AdvanceFileUpSettings': () => import('../../CompSettings/AdvanceFileUpSettings'),
  // 'ButtonSettings': () => import('../../CompSettings/ButtonSettings'),
  // 'CountryFieldSettings': () => import('../../CompSettings/CountryFieldSettings'),
  // 'CurrencyFieldSettings': () => import('../../CompSettings/CurrencyFieldSettings'),
  // 'DecisionBoxSettings': () => import('../../CompSettings/DecisionBoxSettings'),
  // 'GDPRAgreementSettings': () => import('../../CompSettings/GDPRAgreementSettings'),
  // 'DividerSettings': () => import('../../CompSettings/DividerSettings'),
  // 'DropdownFieldSettings': () => import('../../CompSettings/DropdownFieldSettings'),
  // 'HtmlFieldSettings': () => import('../../CompSettings/HtmlFieldSettings'),
  // 'HtmlSelectSettings': () => import('../../CompSettings/HtmlSelectSettings'),
  // 'ImageSettings': () => import('../../CompSettings/ImageSettings'),
  // 'PaypalFieldSettings': () => import('../../CompSettings/PaypalFieldSettings'),
  // 'StripeFieldSettings': () => import('../../CompSettings/StripeFieldSettings'),
  // 'MollieFieldSettings': () => import('../../CompSettings/MollieFieldSettings'),
  // 'PhoneNumberFieldSettings': () => import('../../CompSettings/PhoneNumberFieldSettings'),
  // 'RadioCheckSettings': () => import('../../CompSettings/RadioCheckSettings'),
  // 'RazorpayFieldSettings': () => import('../../CompSettings/RazorpayFieldSettings'),
  // 'ReCaptchaSettings': () => import('../../CompSettings/ReCaptchaSettings'),
  // 'TurnstileSettings': () => import('../../CompSettings/TurnstileSettings'),
  // 'SliderFieldSettings': () => import('../../CompSettings/SliderFieldSettings'),
  // 'TitleSettings': () => import('../../CompSettings/TitleSettings'),
  // 'RepeaterFieldSettings': () => import('../../CompSettings/RepeaterFieldSettings'),
  // 'SignatureFieldSettings': () => import('../../CompSettings/SignatureField/SignatureFieldSettings'),
  // 'RatingFieldSettings': () => import('../../CompSettings/RatingField/RatingFieldSettings'),
  // 'ImageSelectFieldSettings': () => import('../../CompSettings/ImageSelectField/ImageSelectFieldSettings'),
  // 'AdvancedDateTimeSettings': () => import('../../CompSettings/FieldSettings/AdvancedDateTime/AdvancedDateTimeFieldSettings'),

  // Previous settings components
  'InputIconsSettings': () => import('../../CompSettings/CompSettingsUtils/InputIconsSettings'),
  'OtherOptionSettings': () => import('../../CompSettings/CompSettingsUtils/OtherOptionSettings'),
  'OptionsListHeightSettings': () => import('../../CompSettings/CompSettingsUtils/OptionsListHeightSettings'),
  'SizeAndPosition': () => import('../../CompSettings/StyleCustomize/StyleComponents/SizeAndPosition'),
  'AllowMultipleImage': () => import('../../CompSettings/ImageSelectField/AllowMultipleImage'),

  // New extracted setting components in UIv3/CompSettings/CompSettingsUtils
  'DefaultValueSettings': () => import('./CompSettingsUtils/DefaultValueSettings'),
  'ValueRangeSettings': () => import('./CompSettingsUtils/ValueRangeSettings'),
  'TextLengthSettings': () => import('./CompSettingsUtils/TextLengthSettings'),
  'SuggestionSettings': () => import('./CompSettingsUtils/SuggestionSettings'),
  'AutoCompleteSettings': () => import('./CompSettingsUtils/AutoCompleteSettings'),
  'InputMaskSettings': () => import('./CompSettingsUtils/InputMaskSettings'),
  'InputModeSettings': () => import('./CompSettingsUtils/InputModeSettings'),
  'RegexPatternSettings': () => import('./CompSettingsUtils/RegexPatternSettings'),
  'InvalidErrorMessageSettings': () => import('./CompSettingsUtils/InvalidErrorMessageSettings'),
  'PasswordValidationSettings': () => import('./CompSettingsUtils/PasswordValidationSettings'),
  'EntryUniqueSettings': () => import('./CompSettingsUtils/EntryUniqueSettings'),
  'UserUniqueSettings': () => import('./CompSettingsUtils/UserUniqueSettings'),
  'ContainerClassSettings': () => import('./CompSettingsUtils/ContainerClassSettings'),

  'OptionsListSettings': () => import('./CompSettingsUtils/OptionsListSettings'),
  'OptionsColumnSettings': () => import('./CompSettingsUtils/OptionsColumnSettings'),
  'MinimumOptionsSettings': () => import('./CompSettingsUtils/MinimumOptionsSettings'),
  'MaximumOptionsSettings': () => import('./CompSettingsUtils/MaximumOptionsSettings'),

  'ImageSelectItemSizeSettings': () => import('./CompSettingsUtils/ImageSelectItemSizeSettings'),
  'ImageSelectCheckPositionSettings': () => import('./CompSettingsUtils/ImageSelectCheckPositionSettings'),
  'ImageSelectOptionLabelShowHideSettings': () => import('./CompSettingsUtils/ImageSelectOptionLabelShowHideSettings'),
  'ActiveOptionsListSettings': () => import('./CompSettingsUtils/Dropdown/ActiveOptionsListSettings'),
  'AllowCustomOptionSettings': () => import('./CompSettingsUtils/Dropdown/AllowCustomOptionSettings'),
  'AllowMultipleSelectSettings': () => import('./CompSettingsUtils/Dropdown/AllowMultipleSelectSettings'),
  'ListAndOptionsSettings': () => import('./CompSettingsUtils/Dropdown/ListAndOptionsSettings'),
  'CloseOnSelectSettings': () => import('./CompSettingsUtils/Dropdown/CloseOnSelectSettings'),
  'ShowSelectedOptionsAsChipSettings': () => import('./CompSettingsUtils/Dropdown/ShowSelectedOptionsAsChipSettings'),
  'ShowSearchInputSettings': () => import('./CompSettingsUtils/Dropdown/ShowSearchInputSettings'),
  'SelectedOptionImageShowHideSettings': () => import('./CompSettingsUtils/SelectedOptionImageShowHideSettings'),
  'OptionIconShowHideSettings': () => import('./CompSettingsUtils/OptionIconShowHideSettings'),
  'SearchClearableSettings': () => import('./CompSettingsUtils/SearchClearableSettings'),
  'SearchPlaceholderSettings': () => import('./CompSettingsUtils/SearchPlaceholderSettings'),
  'SelectedOptionClearableSettings': () => import('./CompSettingsUtils/SelectedOptionClearableSettings'),
  'ValueStepSettings': () => import('./CompSettingsUtils/ValueStepSettings'),

  'AllowedFileTypeSettings': () => import('./CompSettingsUtils/FileUpload/AllowedFileTypeSettings'),
  'AllowedMaxUploadSizeSettings': () => import('./CompSettingsUtils/FileUpload/AllowedMaxUploadSizeSettings'),
  'AllowMultipleFileSettings': () => import('./CompSettingsUtils/FileUpload/AllowMultipleFileSettings'),
  'FileExistMessageSettings': () => import('./CompSettingsUtils/FileUpload/FileExistMessageSettings'),
  'FileSelectStatusSettings': () => import('./CompSettingsUtils/FileUpload/FileSelectStatusSettings'),
  'FileUploadButtonTextSettings': () => import('./CompSettingsUtils/FileUpload/FileUploadButtonTextSettings'),
  'ShowFileListSettings': () => import('./CompSettingsUtils/FileUpload/ShowFileListSettings'),
  'ShowMaxUploadSizeSettings': () => import('./CompSettingsUtils/FileUpload/ShowMaxUploadSizeSettings'),

  'RepeaterFieldBasicSettings': () => import('./CompSettingsUtils/RepeaterFieldBasicSettings'),

  'AdvancedFileUpBasicSettings': () => import('./CompSettingsUtils/AdvancedFileUp/AdvancedFileUpBasicSettings'),
  'AdvancedFileUpAdvancedSettings': () => import('./CompSettingsUtils/AdvancedFileUp/AdvancedFileUpAdvancedSettings'),

  'CaptchaSizeSettings': () => import('./CompSettingsUtils/Captcha/CaptchaSizeSettings'),
  'CaptchaThemeSettings': () => import('./CompSettingsUtils/Captcha/CaptchaThemeSettings'),
  'CaptchaPositionAlignmentSettings': () => import('./CompSettingsUtils/Captcha/CaptchaPositionAlignmentSettings'),
  'CaptchaLanguageSettings': () => import('./CompSettingsUtils/Captcha/CaptchaLanguageSettings'),
  'CaptchaAppearanceSettings': () => import('./CompSettingsUtils/Captcha/CaptchaAppearanceSettings'),

  'DecisionCheckLabelSettings': () => import('./CompSettingsUtils/DecisionCheck/DecisionCheckLabelSettings'),
  'DecisionCheckByDefaultSettings': () => import('./CompSettingsUtils/DecisionCheck/DecisionCheckByDefaultSettings'),
  'DecisionValueSettings': () => import('./CompSettingsUtils/DecisionCheck/DecisionValueSettings'),

  'ContentSettings': () => import('./CompSettingsUtils/ContentSettings'),
  'ShortcodeContentSettings': () => import('./CompSettingsUtils/ShortcodeContentSettings'),

  'ButtonTextSettings': () => import('./CompSettingsUtils/Button/ButtonTextSettings'),
  'ButtonTypeSettings': () => import('./CompSettingsUtils/Button/ButtonTypeSettings'),
  'ButtonFullWidthSettings': () => import('./CompSettingsUtils/Button/ButtonFullWidthSettings'),
  'ButtonAlignSettings': () => import('./CompSettingsUtils/Button/ButtonAlignSettings'),

  'PaymentAccountSelection': () => import('./CompSettingsUtils/Payment/PaymentAccountSelection'),
  'RazorpayBasicSettings': () => import('./CompSettingsUtils/Payment/RazorpayBasicSettings'),
  'RazorpayAdvancedSettings': () => import('./CompSettingsUtils/Payment/RazorpayAdvancedSettings'),
  'PaypalBasicSettings': () => import('./CompSettingsUtils/Payment/PaypalBasicSettings'),
  'PaypalAdvancedSettings': () => import('./CompSettingsUtils/Payment/PaypalAdvancedSettings'),
  'StripeBasicSettings': () => import('./CompSettingsUtils/Payment/StripeBasicSettings'),
  'StripeAdvancedSettings': () => import('./CompSettingsUtils/Payment/StripeAdvancedSettings'),
  'MollieBasicSettings': () => import('./CompSettingsUtils/Payment/MollieBasicSettings'),
  'MollieAdvancedSettings': () => import('./CompSettingsUtils/Payment/MollieAdvancedSettings'),

  'TitleBasicSettings': () => import('./CompSettingsUtils/TitleBasicSettings'),
  'ImageBasicSettings': () => import('./CompSettingsUtils/ImageBasicSettings'),

  'DetectCountryByIPSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/DetectCountryByIPSettings'),
  'AddressSchemeSettings': () => import('./CompSettingsUtils/Address/AddressSchemeSettings'),
  'ZipValidationSettings': () => import('./CompSettingsUtils/Address/ZipValidationSettings'),
  'AddressAutocompleteSettings': () => import('./CompSettingsUtils/Address/AddressAutocompleteSettings'),
  'AddressAutoLocateSettings': () => import('./CompSettingsUtils/Address/AddressAutoLocateSettings'),
  'AddressShowMapSettings': () => import('./CompSettingsUtils/Address/AddressShowMapSettings'),
  'AddressSaveCoordinatesSettings': () => import('./CompSettingsUtils/Address/AddressSaveCoordinatesSettings'),
  'DetectCountryByGeoSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/DetectCountryByGeoSettings'),
  'SelectedCountryClearableSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/SelectedCountryClearableSettings'),
  'ShowOptionFlagImageSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/ShowOptionFlagImageSettings'),
  'ConfigOptionsListSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/ConfigOptionsListSettings'),
  'ShowSelectedFlagImageSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/ShowSelectedFlagImageSettings'),
  'CountryNotFoundTextSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/CountryNotFoundTextSettings'),
  'DefaultPhoneNumberSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/DefaultPhoneNumberSettings'),
  'PhoneInputFormatSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/PhoneInputFormatSettings'),
  'PhoneValueFormatSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/PhoneValueFormatSettings'),
  'CustomRegexPatternValidationSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/CustomRegexPatternValidationSettings'),
  'HideCountryListSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/HideCountryListSettings'),
  'InputAmountRangeSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/InputAmountRangeSettings'),
  'CurrencyInputFormatSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/CurrencyInputFormatSettings'),
  'CurrencyValueFormatSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/CurrencyValueFormatSettings'),
  'CurrencyDefaultAmountSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/CurrencyDefaultAmountSettings'),
  'SelectedCurrencyClearableSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/SelectedCurrencyClearableSettings'),
  'CurrencyNotFoundTextSettings': () => import('./CompSettingsUtils/CustomFieldsSettings/CurrencyNotFoundTextSettings'),

  'SignaturePadSetting': () => import('../../CompSettings/SignatureField/SignaturePadSetting'),
  'ControlBtnPosition': () => import('../../CompSettings/SignatureField/ControlBtnPosition'),
  'ButtonReverse': () => import('../../CompSettings/SignatureField/ButtonReverse'),
  'ClearBtnSetting': () => import('../../CompSettings/SignatureField/ClearBtnSetting'),
  'UndoBtnSetting': () => import('../../CompSettings/SignatureField/UndoBtnSetting'),
  'RedoBtnSetting': () => import('../../CompSettings/SignatureField/RedoBtnSetting'),

  'RatingIconSettings': () => import('./CompSettingsUtils/Rating/RatingIconSettings'),
  'RatingPositionSettings': () => import('./CompSettingsUtils/Rating/RatingPositionSettings'),
  'RatingLabelOnHoverSettings': () => import('./CompSettingsUtils/Rating/RatingLabelOnHoverSettings'),
  'RatingLabelOnSelectedSettings': () => import('./CompSettingsUtils/Rating/RatingLabelOnSelectedSettings'),

  'AdvancedDateTimeFieldBasicSettings': () => import('./CompSettingsUtils/AdvancedDateTime/AdvancedDateTimeFieldBasicSettings'),
  'AdvancedDateTimeFieldAdvancedSettings': () => import('./CompSettingsUtils/AdvancedDateTime/AdvancedDateTimeFieldAdvancedSettings'),

  'ReceiverEmailSettings': () => import('./CompSettingsUtils/EmailOtp/ReceiverEmailSettings'),
  'OtpBasicSettings': () => import('./CompSettingsUtils/EmailOtp/OtpBasicSettings'),
  'OtpEmailTemplateSettings': () => import('./CompSettingsUtils/EmailOtp/OtpEmailTemplateSettings'),
  'OtpAdvancedSettings': () => import('./CompSettingsUtils/EmailOtp/OtpAdvancedSettings'),
}

const componentCache: Record<string, ComponentType<any>> = {}

const commonComponents: Record<string, ComponentType<any>> = {
  FieldLabelSettings,
  SubTitleSettings,
  AdminLabelSettings,
  FieldNameSettings,
  PlaceholderSettings,
  HelperTxtSettings,
  RequiredSettings,
  FieldHideSettings,
  FieldReadOnlySettings,
  FieldDisabledSettings,
  EnableConfirmFieldSettings,
  EnablePasswordShowHideSettings,
  ChildFieldsSettings,
  ChildFieldPositionSettings
}
export const getComponent = (componentName: string): ComponentType<any> | null => {
  // 1. Check common components (instant load)
  if (commonComponents[componentName]) {
    return commonComponents[componentName]
  }

  // 2. Check cache (already loaded)
  if (componentCache[componentName]) {
    return componentCache[componentName]
  }

  // 3. Get import function
  const importFn = componentModules[componentName]
  if (!importFn) {
    console.error(`Component ${componentName} not found in registry`)
    return null
  }

  // 4. Create lazy component with loadable
  try {
    const LazyComponent = loadable(importFn, {
      fallback: <FieldSettingsLoader />
    })

    // 5. Cache it for future use
    componentCache[componentName] = LazyComponent
    return LazyComponent
  } catch (error) {
    console.error(`Error loading component ${componentName}:`, error)
    return null
  }
}
