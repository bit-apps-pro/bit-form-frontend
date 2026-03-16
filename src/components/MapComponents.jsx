import { useAtomValue } from 'jotai'
import { memo } from 'react'
import { $styles } from '../GlobalStates/StylesState'
import { isObjectEmpty } from '../Utils/Helpers'
import '../resource/sass/components.scss'
import AdvanceFileUp from './Fields/AdvanceFileUp'
import Button from './Fields/Button'
import CheckBox from './Fields/CheckBox'
import CountryField from './Fields/CountryField'
import CurrencyField from './Fields/CurrencyField'
import DecisionBox from './Fields/DecisionBox'
import Divider from './Fields/Divider'
import DropDown from './Fields/DropDown'
import FileUpload from './Fields/FileUpload'
import HiddenField from './Fields/HiddenField'
import Html from './Fields/Html'
import HtmlSelect from './Fields/HtmlSelect'
import Image from './Fields/Image'
import ImageSelectField from './Fields/ImageSelectField'
import MollieField from './Fields/MollieField'
import PaypalField from './Fields/PaypalField'
import PhoneNumberField from './Fields/PhoneNumberField'
import RadioBox from './Fields/RadioBox'
import RatingField from './Fields/RatingField'
import RazorpayField from './Fields/RazorpayField'
import ReCaptchaV2 from './Fields/ReCaptchaV2'
import RepeaterField from './Fields/RepeaterField'
import SectionField from './Fields/SectionField'
import ShortcodeField from './Fields/Shortcode'
import SignatureField from './Fields/SignatureField'
import SliderField from './Fields/SliderField'
import StripeField from './Fields/StripeField'
import SubmitBtn from './Fields/SubmitBtn'
import TextArea from './Fields/TextArea'
import TextField from './Fields/TextField'
import TitleField from './Fields/TitleField'
import TurnstileField from './Fields/TurnstileField'
import GDPRAgreement from './Fields/GDPRAgreement'
import HCaptchaField from './Fields/HCaptchaField'
import AdvancedDateTimeField from './Fields/AdvancedDateTimeField'
import Spacer from './Fields/SpacerField'

// import NewDropDown from './Fields/NewDropDown'
/*
typ: input type
lbl: label
cls: class
ph: placeholder
mn: min
mx: mix
val: default value
ac: autocomplete on/off
req: required
mul: multiple
*/

function MapComponents({
  atts, fieldKey, formID, onBlurHandler, resetFieldValue, handleReset, fieldData, buttonDisabled, contentID, isBuilder, entryID, handleFormValidationErrorMessages,
}) {
  const styles = useAtomValue($styles)

  if (isObjectEmpty(styles) || !atts?.typ) return

  switch (atts?.typ) {
    case 'text':
    case 'number':
    case 'password':
    case 'username':
    case 'email':
    case 'url':
    case 'date':
    case 'datetime-local':
    case 'time':
    case 'month':
    case 'week':
    case 'color':
      return <TextField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'textarea':
      return <TextArea fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'check':
      return <CheckBox fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'radio':
      return <RadioBox fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'html-select':
      return <HtmlSelect fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} isBuilder={isBuilder} formID={formID} attr={atts} />
    case 'select':
      return <DropDown fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} isBuilder={isBuilder} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    // case 'dropdown':
    //   return <NewDropDown isBuilder={isBuilder} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'file-up':
      return <FileUpload fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} entryID={entryID} resetFieldValue={resetFieldValue} />
    case 'advanced-file-up':
      return <AdvanceFileUp fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} entryID={entryID} resetFieldValue={resetFieldValue} />
    case 'submit':
      return <SubmitBtn fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} buttonDisabled={buttonDisabled} handleReset={handleReset} />
    case 'hidden':
      return <HiddenField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} />
    case 'recaptcha':
      return <ReCaptchaV2 fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} />
    case 'decision-box':
      return <DecisionBox fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} fieldData={fieldData} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'gdpr':
      return <GDPRAgreement fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} fieldData={fieldData} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'html':
      return <Html fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} fieldData={fieldData} resetFieldValue={resetFieldValue} />
    case 'shortcode':
      return <ShortcodeField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} fieldData={fieldData} resetFieldValue={resetFieldValue} />
    case 'button':
      return <Button fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} fieldData={fieldData} buttonDisabled={buttonDisabled} handleReset={handleReset} />
    case 'paypal':
      return <PaypalField isBuilder={isBuilder} styleClasses={styles.fields[fieldKey]?.classes} fieldKey={fieldKey} formID={formID} attr={atts} contentID={contentID} fieldData={fieldData} resetFieldValue={resetFieldValue} handleFormValidationErrorMessages={handleFormValidationErrorMessages} />
    case 'stripe':
      return <StripeField isBuilder={isBuilder} styleClasses={styles.fields[fieldKey]?.classes} fieldKey={fieldKey} formID={formID} attr={atts} contentID={contentID} fieldData={fieldData} resetFieldValue={resetFieldValue} handleFormValidationErrorMessages={handleFormValidationErrorMessages} />
    case 'mollie':
      return <MollieField isBuilder={isBuilder} styleClasses={styles.fields[fieldKey]?.classes} fieldKey={fieldKey} formID={formID} attr={atts} contentID={contentID} fieldData={fieldData} resetFieldValue={resetFieldValue} handleFormValidationErrorMessages={handleFormValidationErrorMessages} />
    case 'razorpay':
      // return <RazorPay fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} contentID={contentID} formID={formID} attr={atts} buttonDisabled={buttonDisabled} resetFieldValue={resetFieldValue} handleFormValidationErrorMessages={handleFormValidationErrorMessages} />
      return <RazorpayField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} contentID={contentID} formID={formID} attr={atts} buttonDisabled={buttonDisabled} resetFieldValue={resetFieldValue} handleFormValidationErrorMessages={handleFormValidationErrorMessages} />
    case 'title':
      return <TitleField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} />
    case 'image':
      return <Image fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} />
    case 'divider':
      return <Divider fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} />
    case 'spacer':
      return <Spacer fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} />
    case 'currency':
      return <CurrencyField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} contentID={contentID} />
    case 'country':
      return <CountryField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} contentID={contentID} />
    case 'phone-number':
      return <PhoneNumberField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} contentID={contentID} />
    case 'section':
      return <SectionField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} />
    case 'repeater':
      return <RepeaterField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} />
    case 'rating':
      return <RatingField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'signature':
      return <SignatureField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'image-select':
      return <ImageSelectField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'turnstile':
      return <TurnstileField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'hcaptcha':
      return <HCaptchaField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'range':
      return <SliderField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'advanced-datetime':
      return <AdvancedDateTimeField fieldKey={fieldKey} styleClasses={styles.fields[fieldKey]?.classes} formID={formID} attr={atts} onBlurHandler={onBlurHandler} resetFieldValue={resetFieldValue} />
    case 'blank':
      return <div className="blnk-blk drag" />
    default:
      break
  }
  return <div>Loading...</div>
}

export default memo(MapComponents)
