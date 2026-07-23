import { create } from 'mutative'
import React, { useMemo, useState } from 'react'
import { useFela } from 'react-fela'
import {
  addToBuilderHistory,
  generateHistoryData,
  getLatestState,
} from '../../../Utils/FormBuilderHelper'
import { ucFirst } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import CssPropertyList from '../../style-new/CssPropertyList'
import FilterColorPicker from '../../style-new/FilterColorPicker'
import elementCssPropertiesConfig from '../../style-new/NewStyleEditorConfig'
import { addableCssPropsByField, assignNestedObj, getActualElementKey, getExistingCssPropsWithCompounds } from '../../style-new/styleHelpers'
import {
  EditorConfigState,
  ElementTitleMap,
  IndividualCustomStyleProps,
  StateOption,
} from '../Types/styleCustomization.types'
import TabsView from '../Utilities/TabsView'
import { getPropertyControl, PropertyFactoryContext } from './PropertyControlFactory'
import {
  usePropertyPath,
  usePseudoPath,
  useStyleHandlers,
  useStyleState
} from './styleCustomizationHooks'

// Element title mapping
const ELEMENT_TITLE_MAP: ElementTitleMap = {
  'fld-wrp': 'Field Container',
  'lbl-wrp': 'Label & Subtitle Container',
  lbl: 'Label Container',
  'lbl-pre-i': 'Label Leading Icon',
  'lbl-suf-i': 'Label Trailing Icon',
  'sub-titl': 'Subtitle Container',
  'sub-titl-pre-i': 'Subtitle Leading Icon',
  'sub-titl-suf-i': 'Subtitle Trailing Icon',
  fld: 'Field Container',
  'pre-i': 'Field Leading Icon',
  'suf-i': 'Field Trailing Icon',
  'hlp-txt': 'Helper Text Container',
  'hlp-txt-pre-i': 'Helper Text Leading Icon',
  'hlp-txt-suf-i': 'Helper Text Trailing Icon',
  'err-msg': 'Error Messages Container',
  'currency-fld-wrp': 'Currency Field Wrapper',
  btn: 'Button',
  'btn-pre-i': 'Button Leading Icon',
  'btn-suf-i': 'Button Trailing Icon',
  'other-inp': 'Other Option Input',
  'inp-wrp .filepond--panel-root': 'Item Panel Wrapper',
  'inp-wrp .filepond--item-panel': 'Item Panel',
  'inp-wrp .filepond--file-action-button': 'File Action Button',
  'inp-wrp .filepond--file': 'File',
  'inp-wrp .filepond--drop-label': 'Drop Label',
  'inp-wrp .filepond--label-action': 'Label Action',
  'option-list .option': 'Option',
  'option-list .opt-lbl-wrp': 'Option Label Container',
  'option-list .opt-icn': 'Option Icon',
  'option-list .opt-lbl': 'Option Label',
  'option-list .opt-suffix': 'Option Suffix',
  'option-list .opt-prefix': 'Option Prefix',
  divider: 'Divider',
  bx: 'Box',
  'stripe-btn': 'Stripe Button',
  'stripe-icn': 'Stripe Icon',
  'stripe-pay-btn': 'Stripe Pay Button',
  'rating-img': 'Rating Image',
  'rating-msg': 'Rating Message',
  'otp-boxes-wrp': 'OTP Boxes Wrapper',
  'otp-box': 'OTP Box Input',
  'otp-actions-wrp': 'Actions Row',
  'send-otp-btn': 'Send OTP Button',
  'resend-wrp': 'Resend Wrapper',
  'wait-txt': 'Wait Text',

  'verify-btn': 'Verify Button',
  'otp-success-msg': 'Success Message',
  'otp-error-msg': 'Error Message',
}

const IndividualCustomStyle: React.FC<IndividualCustomStyleProps> = ({
  elementKey: elmKey,
  fldKey
}) => {
  const { css } = useFela()
  const [stateController, setStateController] = useState('')

  // Get all state and data
  const {
    styles,
    setStyles,
    themeVars,
    themeColors,
    fieldObj,
    fldStyleObj,
    fontweightVariants,
    fontStyleVariants,
  } = useStyleState(fldKey)

  // Get utility functions
  const elementKey = getActualElementKey(elmKey, fieldObj?.typ)
  const { getPseudoPath } = usePseudoPath(fldKey)
  const { getPropertyPath } = usePropertyPath(fldKey, elementKey)

  // Get handlers
  const {
    spacingHandler,
    preDefinedValueHandler,
    fontPropertyUpdateHandler,
    setAlign,
    delPropertyHandler,
    delMultiPropertyHandler,
    clearHandler,
    getStyleValueAndUnit,
  } = useStyleHandlers(fldKey, elementKey, styles, setStyles, themeVars)

  // Validation
  if (!fldStyleObj) {
    console.error('😅 no style object found according to this field')
    return <></>
  }

  const { classes, fieldType } = fldStyleObj
  const currentState = stateController ? getPseudoPath(elementKey, stateController).toLowerCase() : ''
  const currentSelector = `.${fldKey}-${elementKey}${currentState}`
  const existCssPropsObj = classes?.[currentSelector] || {}

  const tabChangeAction = (tabId: string) => {
    setStateController(tabId === 'normal' ? '' : tabId)
  }

  // Get existing CSS properties with compound properties added
  const existCssProps = useMemo(() => 
    getExistingCssPropsWithCompounds(existCssPropsObj, fieldType, elementKey),
    [existCssPropsObj, fieldType, elementKey]
  )

  // Get available CSS properties
  const availableCssProp = addableCssPropsByField(fieldType, elementKey)?.filter(
    x => !existCssProps.includes(x)
  )

  const txtAlignValue = existCssPropsObj?.['text-align']
  const fldTitle = ELEMENT_TITLE_MAP[elementKey] || elementKey

  // Get z-index value
  const fldZIndex = getStyleValueAndUnit('z-index', classes, elementKey)[0]

  const fldZIndexHandler = (value: number) => {
    spacingHandler({ value, unit: '' }, 'z-index', '', currentState)
  }

  // Add dynamic CSS properties
  const addDynamicCssProps = (property: string, state = '') => {
    const configProperty = elementCssPropertiesConfig?.[fieldType]?.[elementKey]?.properties[property]

    if (typeof configProperty === 'object') {
      setStyles((prvStyle: any) =>
        create(prvStyle, (drft: any) => {
          Object.keys(configProperty).forEach(prop => {
            if (configProperty[prop]) {
              const propPath = getPropertyPath(prop, state)
              const defaultPropPath = getPropertyPath(prop)
              const defaultValue = classes[`.${fldKey}-${elementKey}`]?.[prop]
              assignNestedObj(drft, propPath, defaultValue)
            }
          })
        })
      )
    } else {
      const propPath = getPropertyPath(property, state)
      const defaultPropValue = elementCssPropertiesConfig?.[fieldType]?.[elementKey]?.properties[property]
      const getValFromState = classes[`.${fldKey}-${elementKey}`]?.[property]

      setStyles((prvStyle: any) =>
        create(prvStyle, (drft: any) => {
          assignNestedObj(drft, propPath, getValFromState || defaultPropValue)
        })
      )
    }

    addToBuilderHistory(
      generateHistoryData(elementKey, fldKey, `${property} Property Added`, '', {
        styles: getLatestState('styles'),
      })
    )
  }

  // Set new CSS property
  const setNewCssProp = (property: string, state = '') => {
    const pseudoState = getPseudoPath(elementKey, state)

    setStyles((prvStyle: any) =>
      create(prvStyle, (drft: any) => {
        assignNestedObj(drft, getPropertyPath(property, pseudoState), '')
      })
    )

    addDynamicCssProps(property, pseudoState)
  }

  // Build state options
  const editorConfigState: EditorConfigState = elementCssPropertiesConfig[fieldType]?.[elementKey] || {}
  const { states = [] } = editorConfigState

  const options: StateOption[] = [
    { label: 'Normal', icn: 'Normal', show: ['icn'], tip: 'Normal Style' },
  ]

  states.forEach(state => {
    const stateLabel = state ? ucFirst(state) : 'Normal'
    options.push({
      label: stateLabel,
      icn: stateLabel,
      show: ['icn'],
      tip: `${stateLabel} Style`
    })
  })

  const setController = (lblName: string) => {
    setStateController(lblName === 'Normal' ? '' : lblName)
  }

  // Build context for property controls
  const propertyContext: PropertyFactoryContext = {
    fldTitle,
    fldKey,
    existCssPropsObj,
    objectPaths: {
      object: 'styles',
      paths: {},
    },
    themeColors,
    themeVars,
    styles,
    state: currentState,
    delPropertyHandler,
    delMultiPropertyHandler,
    clearHandler,
    spacingHandler,
    fontPropertyUpdateHandler,
    preDefinedValueHandler,
    setAlign,
    fldZIndexHandler,
    getStyleValueAndUnit: (prop: string) => getStyleValueAndUnit(prop, classes, elementKey),
    txtAlignValue,
    fldZIndex,
    fontweightVariants,
    fontStyleVariants,
  }

  // Render property control
  const renderPropertyControl = (propName: string, state = '') => {
    const pseudoState = state ? getPseudoPath(elementKey, state) : ''

    // Build object paths for this property
    const configProperty = elementCssPropertiesConfig?.[fieldType]?.[elementKey]?.properties?.[propName]
    const objectPaths = {
      object: 'styles',
      paths: {} as Record<string, string>,
    }

    if (typeof configProperty === 'object') {
      Object.keys(configProperty).forEach(prop => {
        objectPaths.paths[prop] = getPropertyPath(prop, pseudoState)
      })
    } else {
      objectPaths.paths[propName] = getPropertyPath(propName, pseudoState)
    }

    const contextWithPaths = {
      ...propertyContext,
      objectPaths,
      state: pseudoState,
    }

    return getPropertyControl(propName, contextWithPaths)
  }

  // Render icon color controls for special cases
  const renderIconColorControls = (state: string) => {
    if (elementKey !== 'fld' || (state !== 'hover' && state !== 'focus')) {
      return null
    }

    const pseudoState = getPseudoPath(elementKey, state).toLowerCase()

    return (
      <>
        {fieldObj.prefixIcn && (
          <FilterColorPicker
            title="Leading Icon Color"
            subtitle="Icon Fill Color(Filter)"
            value={classes?.[`${currentSelector} ~ .${fldKey}-pre-i`]?.color}
            stateObjName="styles"
            propertyPath={[
              getPropertyPath('color', pseudoState, ` ~ .${fldKey}-pre-i`),
              getPropertyPath('filter', pseudoState, ` ~ .${fldKey}-pre-i`),
            ]}
            objectPaths={{
              object: 'styles',
              paths: {
                'icon-color': getPropertyPath('color', pseudoState, ` ~ .${fldKey}-pre-i`),
                filter: getPropertyPath('filter', pseudoState, ` ~ .${fldKey}-pre-i`),
              },
            }}
            modalId={`${elementKey}-${state}-pre-i`}
          />
        )}

        {fieldObj.suffixIcn && (
          <FilterColorPicker
            title="Trailing Icon Color"
            subtitle="Icon Fill Color(Filter)"
            value={classes?.[`${currentSelector} ~ .${fldKey}-suf-i`]?.color}
            stateObjName="styles"
            propertyPath={[
              getPropertyPath('color', pseudoState, ` ~ .${fldKey}-suf-i`),
              getPropertyPath('filter', pseudoState, ` ~ .${fldKey}-suf-i`),
            ]}
            objectPaths={{
              object: 'styles',
              paths: {
                'icon-color': getPropertyPath('color', pseudoState, ` ~ .${fldKey}-suf-i`),
                filter: getPropertyPath('filter', pseudoState, ` ~ .${fldKey}-suf-i`),
              },
            }}
            modalId={`${elementKey}-${state}-suf-i`}
          />
        )}
      </>
    )
  }
  const cssStateTabs = useMemo(() => ([
    {
      id: 'normal', label: __('Normal'), content: (<div className={css(cls.space)}>
        {existCssProps.map((propName, indx) => (
          <div key={`propName-${indx * 20}`}>
            {renderPropertyControl(propName)}
          </div>
        ))}
      </div>)
    },
    ...states.map(state => ({
      id: state.toLowerCase(), label: __(ucFirst(state)), content: (<div className={css(cls.space)}>
        {renderIconColorControls(state)}

        {existCssProps.map((propName, indx) => (
          <div key={`propName-${indx * 20}`}>
            {renderPropertyControl(propName, state)}
          </div>
        ))}


      </div>)
    })),
  ]), [existCssProps, availableCssProp, states])


  return (
    <div className={css({ pn: 'relative' })}>
      <TabsView
        tabs={cssStateTabs}
        defaultTab='normal'
        onChange={tabChangeAction}
        // variant="clean-bottom-line"
        variant='tertiary-segment'
        classNames={css(cls.tabViewStyles)}
      />
      {availableCssProp.length > 0 && (
        <CssPropertyList
          id={`individual-style-${stateController}`}
          properties={availableCssProp}
          setProperty={(prop) => setNewCssProp(prop, stateController)}
        />
      )}
      {/* Spacer for scrolling */}
      {Array.from({ length: 40 }).map((_, i) => (
        <br key={`spacer-${i}`} />
      ))}
    </div>
  )
}

const cls = {
  space: { p: 5 },
  tabViewStyles: {
    '& .tab-content': { owx: 'clip', owy: 'visible' },
    '& .tab-content-wrapper': { ml: 10 },
  }
}

export default IndividualCustomStyle