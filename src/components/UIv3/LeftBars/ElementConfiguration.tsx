import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../../GlobalStates/GlobalStates'
import { $styles } from '../../../GlobalStates/StylesState'
import { FieldObject } from '../Types/ElementConfiguration.types'
import {
  AccordionElement,
  ElementGroup,
  SimpleElement
} from './ElementConfigHelpers'
import {
  ADVANCED_FILE_UPLOAD_ELEMENTS,
  BUTTON_ELEMENTS,
  CHECKBOX_RADIO_ELEMENTS,
  CONTAINER_ELEMENTS,
  COUNTRY_ELEMENTS,
  CURRENCY_ELEMENTS,
  EMAIL_OTP_ELEMENTS,
  ERROR_MESSAGE_ELEMENT,
  HELPER_TEXT_ELEMENTS,
  HTML_SELECT_ELEMENTS,
  IMAGE_SELECT_ELEMENTS,
  INPUT_ELEMENTS,
  LABEL_ELEMENTS,
  PHONE_NUMBER_ELEMENTS,
  QUICK_TWEAK_ELEMENT,
  RATING_ELEMENTS,
  REPEATER_CONTAINER_ELEMENTS,
  REPEATER_ELEMENTS,
  SELECT_ELEMENTS,
  SIGNATURE_ELEMENTS,
  SUBTITLE_ELEMENTS,
  TITLE_ELEMENTS
} from './ElementConfigPatterns'
import NavBtn from './NavBtn'
import styleLayersStyles from './StyleLayers.styles'



interface ElementConfigurationProps {
  fldKey: string
}

interface RouteParams {
  formType: string
  formID: string
}

export default function ElementConfiguration({ fldKey }: ElementConfigurationProps) {
  const styles = useAtomValue($styles)
  const { formType, formID } = useParams<RouteParams>()
  const navigate = useNavigate()
  const fields = useAtomValue($fields)
  const fieldObj = fields[fldKey] as FieldObject
  const selectedFieldKey = useAtomValue($selectedFieldId) || ''
  const { css } = useFela()


  const styleHandler = (route: string) => {
    navigate(`/form/builder/${formType}/${formID}/field-theme-customize/${route}/${fldKey}`)
  }

  if (!fieldObj) return null

  const elementProps = {
    fldKey,
    fieldObj,
    styles,
    selectedFieldKey,
    styleHandler,
  }

  return (
    <>
      {/* Field Container */}
      {QUICK_TWEAK_ELEMENT.condition(fieldObj) && (
        <SimpleElement
          {...elementProps}
          route={QUICK_TWEAK_ELEMENT.route}
          label={QUICK_TWEAK_ELEMENT.label}
        />
      )}

      {CONTAINER_ELEMENTS.fieldContainer.condition(fieldObj) && (
        <SimpleElement
          {...elementProps}
          route={CONTAINER_ELEMENTS.fieldContainer.route}
          label={CONTAINER_ELEMENTS.fieldContainer.label}
        />
      )}

      {/* Logo */}
      {fieldObj.logo && (
        <SimpleElement
          {...elementProps}
          route="logo"
          label="Logo"
        />
      )}

      {/* Title Container (for title field type) */}
      {CONTAINER_ELEMENTS.titleContainer.condition(fieldObj) && (
        <SimpleElement
          {...elementProps}
          route={CONTAINER_ELEMENTS.titleContainer.route}
          label={CONTAINER_ELEMENTS.titleContainer.label}
        />
      )}

      {/* Title */}
      <ElementGroup
        {...elementProps}
        elements={TITLE_ELEMENTS}
      />

      {/* Label Container (for non-title fields) */}
      {CONTAINER_ELEMENTS.labelContainer.condition(fieldObj) && (
        <SimpleElement
          {...elementProps}
          route={CONTAINER_ELEMENTS.labelContainer.route}
          label={CONTAINER_ELEMENTS.labelContainer.label}
        />
      )}

      {/* Label with required asterisk */}
      {LABEL_ELEMENTS[0].condition(fieldObj) && (
        <AccordionElement
          {...elementProps}
          {...LABEL_ELEMENTS[0]}
          additionalChild={
            fieldObj.valid?.req && fieldObj.valid?.reqShow ? (
              <NavBtn
                cssSelector={`.${fldKey}-req-smbl`}
                subRoute={fldKey}
                route="req-smbl"
                label="Asterisk"
                offset="1"
                highlightSelector={`[data-dev-req-smbl="${fldKey}"]`}
                styleOverride={styles?.[fldKey]?.['req-smbl'] !== undefined}
                classNames={css(styleLayersStyles.simpleNavBtn)}
              />
            ) : undefined
          }
        />
      )}

      {/* Subtitle */}
      <ElementGroup
        {...elementProps}
        elements={SUBTITLE_ELEMENTS}
      />


      {/* Input Container
      {CONTAINER_ELEMENTS.inputContainer.condition(fieldObj) && (
        <SimpleElement
          {...elementProps}
          route={CONTAINER_ELEMENTS.inputContainer.route}
          label={CONTAINER_ELEMENTS.inputContainer.label}
        />
      )} */}

      {/* File Input Container */}
      {CONTAINER_ELEMENTS.fileInputContainer.condition(fieldObj) && (
        <SimpleElement
          {...elementProps}
          route={CONTAINER_ELEMENTS.fileInputContainer.route}
          label={CONTAINER_ELEMENTS.fileInputContainer.label}
        />
      )}

      {/* Input Field with Icons */}
      <ElementGroup
        {...elementProps}
        elements={INPUT_ELEMENTS}
        additionalChild={
          <SimpleElement
            {...elementProps}
            route="fld::placeholder"
            label="Placeholder"
          />
        }
      />

      {/* Button */}
      {fieldObj.typ.match(/^(button)$/gi) && (
        <ElementGroup
          {...elementProps}
          elements={BUTTON_ELEMENTS}
        />
      )}

      {/* Repeater Specific Elements */}
      {fieldObj.typ === 'repeater' && (
        <>
          <ElementGroup
            {...elementProps}
            elements={REPEATER_CONTAINER_ELEMENTS}
          />
          {/* Add Button */}
          <AccordionElement
            {...elementProps}
            {...REPEATER_ELEMENTS.addButton}
          />

          {/* Remove Button */}
          <AccordionElement
            {...elementProps}
            {...REPEATER_ELEMENTS.removeButton}
          />

          {/* Add to End Button */}
          {fieldObj.addToEndBtn?.show && (
            <>
              <SimpleElement
                {...elementProps}
                route="add-to-end-btn-wrp"
                label="End Button Container"
              />
              <AccordionElement
                {...elementProps}
                {...REPEATER_ELEMENTS.addToEndButton}
              />
            </>
          )}
        </>
      )}

      {/* Checkbox & Radio Elements */}
      <ElementGroup
        {...elementProps}
        elements={CHECKBOX_RADIO_ELEMENTS}
      />

      {/* Image Select Elements */}
      {fieldObj.typ === 'image-select' && (
        <ElementGroup
          {...elementProps}
          elements={IMAGE_SELECT_ELEMENTS}
        />
      )}

      {/* HTML Select Elements */}
      {fieldObj.typ === 'html-select' && (
        <ElementGroup
          {...elementProps}
          elements={HTML_SELECT_ELEMENTS}
        />
      )}

      {/* Signature Elements */}
      {fieldObj.typ === 'signature' && (
        <ElementGroup
          {...elementProps}
          elements={SIGNATURE_ELEMENTS}
        />
      )}

      {/* Email OTP Elements */}
      {fieldObj.typ === 'email-otp' && (
        <ElementGroup
          {...elementProps}
          elements={EMAIL_OTP_ELEMENTS}
        />
      )}

      {/* Rating Elements */}
      {fieldObj.typ === 'rating' && (
        <ElementGroup
          {...elementProps}
          elements={RATING_ELEMENTS}
        />
      )}

      {/* Advanced File Upload Elements */}
      {fieldObj.typ === 'advanced-file-up' && (
        <AccordionElement
          {...elementProps}
          route="filepond--drop-label"
          label="File Upload Field"
          // offset="3.5"
          additionalChild={
            <ElementGroup
              {...elementProps}
              elements={ADVANCED_FILE_UPLOAD_ELEMENTS}
            />
          }
        />
      )}

      {/* Currency Elements */}
      {fieldObj.typ === 'currency' && (
        <ElementGroup
          {...elementProps}
          elements={CURRENCY_ELEMENTS}
        />
      )}

      {/* Phone Number Elements */}
      {fieldObj.typ === 'phone-number' && (
        <ElementGroup
          {...elementProps}
          elements={PHONE_NUMBER_ELEMENTS}
        />
      )}

      {/* Country Elements */}
      {fieldObj.typ === 'country' && (
        <ElementGroup
          {...elementProps}
          elements={COUNTRY_ELEMENTS}
        />
      )}

      {/* Select (Dropdown) Elements */}
      {fieldObj.typ === 'select' && (
        <ElementGroup
          {...elementProps}
          elements={SELECT_ELEMENTS}
        />
      )}

      {/* Helper Text */}
      <ElementGroup
        {...elementProps}
        elements={HELPER_TEXT_ELEMENTS}
      />

      {ERROR_MESSAGE_ELEMENT.condition(fieldObj) && (
        <SimpleElement
          {...elementProps}
          route={ERROR_MESSAGE_ELEMENT.route}
          label={ERROR_MESSAGE_ELEMENT.label}
        />
      )}
    </>
  )
}