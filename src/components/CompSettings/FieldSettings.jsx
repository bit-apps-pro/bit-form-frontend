/* eslint-disable react-hooks/exhaustive-deps */
import loadable from '@loadable/component'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { $fields } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import FieldSettingsLoader from '../Loaders/FieldSettingsLoader'
import HiddenFieldSettings from './HiddenFieldSettings'
import SectionFieldSettings from './SectionFieldSettings'
import ShortcodeFieldSettings from './ShortcodeFieldSettings'
import HCaptchaSettings from './hCaptchaSettings'

const AdvanceFileUpSettings = loadable(() => import('./AdvanceFileUpSettings'), { fallback: <FieldSettingsLoader /> })
const ButtonSettings = loadable(() => import('./ButtonSettings'), { fallback: <FieldSettingsLoader /> })
const CountryFieldSettings = loadable(() => import('./CountryFieldSettings'), { fallback: <FieldSettingsLoader /> })
const CurrencyFieldSettings = loadable(() => import('./CurrencyFieldSettings'), { fallback: <FieldSettingsLoader /> })
const DecisionBoxSettings = loadable(() => import('./DecisionBoxSettings'), { fallback: <FieldSettingsLoader /> })
const GDPRAgreementSettings = loadable(() => import('./GDPRAgreementSettings'), { fallback: <FieldSettingsLoader /> })
const DividerSettings = loadable(() => import('./DividerSettings'), { fallback: <FieldSettingsLoader /> })
const SpacerSettings = loadable(() => import('./SpacerFieldSettings'), { fallback: <FieldSettingsLoader /> })
const DropdownFieldSettings = loadable(() => import('./DropdownFieldSettings'), { fallback: <FieldSettingsLoader /> })
const FileUploadSettings = loadable(() => import('./FileUploadSettings'), { fallback: <FieldSettingsLoader /> })
const HtmlFieldSettings = loadable(() => import('./HtmlFieldSettings'), { fallback: <FieldSettingsLoader /> })
const HtmlSelectSettings = loadable(() => import('./HtmlSelectSettings'), { fallback: <FieldSettingsLoader /> })
const ImageSettings = loadable(() => import('./ImageSettings'), { fallback: <FieldSettingsLoader /> })
const PaypalFieldSettings = loadable(() => import('./PaypalFieldSettings'), { fallback: <FieldSettingsLoader /> })
const StripeFieldSettings = loadable(() => import('./StripeFieldSettings'), { fallback: <FieldSettingsLoader /> })
const MollieFieldSettings = loadable(() => import('./MollieFieldSettings'), { fallback: <FieldSettingsLoader /> })
const PhoneNumberFieldSettings = loadable(() => import('./PhoneNumberFieldSettings'), { fallback: <FieldSettingsLoader /> })
const RadioCheckSettings = loadable(() => import('./RadioCheckSettings'), { fallback: <FieldSettingsLoader /> })
const RazorpayFieldSettings = loadable(() => import('./RazorpayFieldSettings'), { fallback: <FieldSettingsLoader /> })
const ReCaptchaSettings = loadable(() => import('./ReCaptchaSettings'), { fallback: <FieldSettingsLoader /> })
const TurnstileSettings = loadable(() => import('./TurnstileSettings'), { fallback: <FieldSettingsLoader /> })
const TextFieldSettings = loadable(() => import('./TextFieldSettings'), { fallback: <FieldSettingsLoader /> })
const SliderFieldSettings = loadable(() => import('./SliderFieldSettings'), { fallback: <FieldSettingsLoader /> })
const TitleSettings = loadable(() => import('./TitleSettings'), { fallback: <FieldSettingsLoader /> })
const RepeaterFieldSettings = loadable(() => import('./RepeaterFieldSettings'), { fallback: <FieldSettingsLoader /> })
const SignatureFieldSettings = loadable(() => import('./SignatureField/SignatureFieldSettings'), { fallback: <FieldSettingsLoader /> })
const RatingFieldSettings = loadable(() => import('./RatingField/RatingFieldSettings'), { fallback: <FieldSettingsLoader /> })
const ImageSelectFieldSettings = loadable(() => import('./ImageSelectField/ImageSelectFieldSettings'), { fallback: <FieldSettingsLoader /> })
const AdvancedDateTimeSettings = loadable(() => import('./FieldSettings/AdvancedDateTime/AdvancedDateTimeFieldSettings'), { fallback: <FieldSettingsLoader /> })

export default function FieldSettings() {
  const { fieldKey, formType, formID } = useParams()
  const fields = useAtomValue($fields)
  const styles = useAtomValue($styles)
  const selectedFieldType = fields?.[fieldKey]?.typ
  // const navigate = useNavigate()
  useEffect(() => {
    if (!fieldKey || !selectedFieldType || !styles?.fields?.[fieldKey]?.classes) {
      // return navigate(`/form/builder/${formType}/${formID}/fields-list`, { replace: true })
    }
  }, [!fieldKey || !selectedFieldType || !styles?.fields?.[fieldKey]?.classes])

  switch (selectedFieldType) {
    case 'text':
    case 'username':
    case 'number':
    case 'password':
    case 'email':
    case 'url':
    case 'textarea':
    case 'date':
    case 'datetime-local':
    case 'time':
    case 'month':
    case 'week':
    case 'color':
      return <TextFieldSettings />
    case 'check':
    case 'radio':
      return <RadioCheckSettings />
    case 'html-select':
      return <HtmlSelectSettings />
    case 'select':
    case 'dropdown':
      return <DropdownFieldSettings />
    case 'range': return <SliderFieldSettings />
    case 'file-up': return <FileUploadSettings />
    case 'advanced-file-up': return <AdvanceFileUpSettings />
    case 'recaptcha': return <ReCaptchaSettings />
    case 'turnstile': return <TurnstileSettings />
    case 'hcaptcha': return <HCaptchaSettings />
    case 'decision-box': return <DecisionBoxSettings />
    case 'gdpr': return <GDPRAgreementSettings />
    case 'html': return <HtmlFieldSettings />
    case 'shortcode': return <ShortcodeFieldSettings />
    case 'button': return <ButtonSettings />
    case 'hidden': return <HiddenFieldSettings />
    case 'paypal': return <PaypalFieldSettings />
    case 'stripe': return <StripeFieldSettings />
    case 'mollie': return <MollieFieldSettings />
    case 'razorpay': return <RazorpayFieldSettings />
    case 'title': return <TitleSettings />
    case 'image': return <ImageSettings />
    case 'divider': return <DividerSettings />
    case 'spacer': return <SpacerSettings />
    case 'currency': return <CurrencyFieldSettings />
    case 'country': return <CountryFieldSettings />
    case 'phone-number': return <PhoneNumberFieldSettings />
    case 'section': return <SectionFieldSettings />
    case 'repeater': return <RepeaterFieldSettings />
    case 'signature': return <SignatureFieldSettings />
    case 'rating': return <RatingFieldSettings />
    case 'image-select': return <ImageSelectFieldSettings />
    case 'advanced-datetime': return <AdvancedDateTimeSettings />

    default: return <>No field found with this key.</>
  }
}
