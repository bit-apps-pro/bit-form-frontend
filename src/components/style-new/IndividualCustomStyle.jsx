/* eslint-disable no-console */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { $fields } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import TxtAlignCntrIcn from '../../Icons/TxtAlignCntrIcn'
import TxtAlignJustifyIcn from '../../Icons/TxtAlignJustifyIcn'
import TxtAlignLeftIcn from '../../Icons/TxtAlignLeftIcn'
import TxtAlignRightIcn from '../../Icons/TxtAlignRightIcn'
import { addToBuilderHistory, deleteNestedObj, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import { ucFirst } from '../../Utils/Helpers'
import { staticFontStyleVariants, staticFontweightVariants, staticWhiteSpaceVariants, staticWordWrapVariants } from '../../Utils/StaticData/fontvariant'
import ut from '../../styles/2.utilities'
import sizeControlStyle from '../../styles/sizeControl.style'
import CustomInputControl from '../CompSettings/StyleCustomize/ChildComp/CustomInputControl'
import Grow from '../CompSettings/StyleCustomize/ChildComp/Grow'
import SizeControl from '../CompSettings/StyleCustomize/ChildComp/SizeControl'
import SimpleDropdown from '../Utilities/SimpleDropdown'
import StyleSegmentControl from '../Utilities/StyleSegmentControl'
import BackgroundControl from './BackgroundControl'
import BorderControl from './BorderControl'
import BorderImageControl from './BorderImageControl'
import CssPropertyList from './CssPropertyList'
import FilterColorPicker from './FilterColorPicker'
import FilterController from './FilterController'
import Important from './Important'
import IndividualShadowControl from './IndividualShadowControl'
import editorConfig from './NewStyleEditorConfig'
import ResetStyle from './ResetStyle'
import SimpleColorPicker from './SimpleColorPicker'
import SizeControler from './SizeControler'
import SpacingControl from './SpacingControl'
import StylePropertyBlock from './StylePropertyBlock'
import TextDecorationControl from './TextDecorationControl'
import TransformControl from './TransformControl'
import TransitionControl from './TransitionControl'
import {
  addableCssPropsByField, addableCssPropsObj, arrayToObject, assignNestedObj, getActualElementKey, getNumFromStr, getStrFromStr, getValueByObjPath, getValueFromStateVar, unitConverter,
} from './styleHelpers'

export default function IndividualCustomStyle({ elementKey: elmKey, fldKey }) {
  const [styles, setStyles] = useAtom($styles)
  const themeVars = useAtomValue($themeVars)
  const themeColors = useAtomValue($themeColors)
  const fields = useAtomValue($fields)
  const fieldObj = fields[fldKey]
  const { css } = useFela()
  const [stateController, setStateController] = useState('')

  const elementKey = getActualElementKey(elmKey, fieldObj?.typ)
  const getPseudoPath = (state = '') => {
    state = state.toLowerCase()
    // don't remove this
    // const fldWrp = {
    //   'hover': `hover:not(.${fldKey}-menu-open,.${fldKey}-disabled)`,
    //   'focus': `focus-within:not(.${fldKey}-menu-open,.${fldKey}-disabled)`,
    // }
    // const pseudoPahtObj = {
    //   'currency-fld-wrp': { ...fldWrp },
    //   'phone-fld-wrp': { ...fldWrp },
    //   'search-clear-btn': { 'focus': `focus-visible` },
    //   'option': {
    //     'hover': `hover:not(.selected-opt)`,
    //     'focus': `focus-visible`,
    //   },
    //   'input-clear-btn': {
    //     'hover': 'hover',
    //     'focus': 'focus-visible',
    //   },
    //   'razorpay-btn': {
    //     'before': ':before',
    //   }
    // }
    // console.log('pseudoPahtObj', pseudoPahtObj?.[elementKey]?.[state] || '')

    switch (elementKey) {
      case 'dpd-fld-wrp':
      case 'currency-fld-wrp':
      case 'phone-fld-wrp':
      case 'country-fld-wrp':
        if (state === 'hover') {
          state = ':hover:not(.menu-open):not(.disabled)'
        } else if (state === 'focus') {
          state = ':focus-within:not(.menu-open):not(.disabled)'
        } else if (state === 'active') {
          state = '.menu-open'
        }
        break
      case 'dpd-wrp':
        if (state === 'focus') {
          state = ':focus-visible'
        }
        break
      case 'search-clear-btn':
        if (state === 'focus') {
          state = ':focus-visible'
        }
        break
      case 'option':
        if (state === 'hover') {
          state = ':hover:not(.selected-opt)'
        }
        if (state === 'focus') {
          state = ':focus-visible'
        }
        break
      case 'input-clear-btn':
        if (state === 'hover') {
          state = ':hover'
        }
        if (state === 'focus') {
          state = ':focus-visible'
        }
        break
      case 'razorpay-btn':
        if (state === 'before') {
          state = '::before'
        }
        break

      case 'stripe-btn':
      case 'stripe-wrp .stripe-pay-btn':
        if (state === 'active') {
          state = ':active'
        }
        if (state === 'hover') {
          state = ':hover'
        }
        if (state === 'focus') {
          state = ':focus-visible'
        }
        break
      case 'mollie-btn':
        if (state === 'active') {
          state = ':active'
        }
        if (state === 'hover') {
          state = ':hover'
        }
        if (state === 'focus') {
          state = ':focus-visible'
        }
        break
      case 'rating-img':
        if (state === 'hover') {
          state = `.${fldKey}-rating-hover`
        }
        if (state === 'selected') {
          state = `.${fldKey}-rating-selected`
        }
        break
      case 'image-select':
        if (state === 'hover') {
          state = `:hover~.${fldKey}-img-wrp .${fldKey}-img-card-wrp`
        }
        if (state === 'checked') {
          state = `:checked~.${fldKey}-img-wrp .${fldKey}-img-card-wrp`
        }
        if (state === 'focus') {
          state = `:focus~.${fldKey}-img-wrp .${fldKey}-img-card-wrp`
        }
        break

      default:
        if (state) { return `:${state}` }
    }
    return state
  }
  const fldStyleObj = styles?.fields?.[fldKey]
  if (!fldStyleObj) { console.error('😅 no style object found according to this field'); return <></> }
  const { classes, fieldType } = fldStyleObj
  const existCssProps = Object.keys(classes?.[`.${fldKey}-${elementKey}${stateController && getPseudoPath(stateController).toLowerCase()}`] || {})
  const existCssPropsObj = classes?.[`.${fldKey}-${elementKey}${stateController && getPseudoPath(stateController).toLowerCase()}`] || {}

  Object.entries(addableCssPropsObj(fieldType, elementKey) || {}).forEach(([prop, propObj]) => {
    if (typeof propObj === 'object' && !existCssProps?.includes(prop)) {
      if (Object.keys(propObj).find(propName => existCssProps.includes(propName))) existCssProps.push(prop)
    }
  })
  const availableCssProp = addableCssPropsByField(fieldType, elementKey)?.filter(x => !existCssProps?.includes(x))
  const fontweightVariants = styles.font?.fontWeightVariants.length !== 0 ? arrayToObject(styles.font?.fontWeightVariants) : staticFontweightVariants
  const fontStyleVariants = styles.font?.fontStyle.length !== 0 ? arrayToObject(styles.font?.fontStyle) : staticFontStyleVariants
  const txtAlignValue = classes?.[`.${fldKey}-${elementKey}`]?.['text-align']
  const getPropertyPath = (cssProperty, state = '', selector = '') => `fields->${fldKey}->classes->.${fldKey}-${elementKey}${state && `${state}`}${selector}->${cssProperty}`

  const existImportant = (path) => getValueByObjPath(styles, path).match(/(!important)/gi)?.[0]
  const getTitle = {
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
    bx: fieldType === 'radio' ? 'Radio Box' : 'Check Box',
    'stripe-btn': 'Stripe Button',
    'stripe-icn': 'Stripe Icon',
    'stripe-pay-btn': 'Stripe Pay Button',
    'rating-img': 'Rating Image',
    'rating-msg': 'Rating Message',
  }

  const fldTitle = getTitle[elementKey]

  const getStyleValueAndUnit = (prop) => {
    const getVlu = classes[`.${fldKey}-${elementKey}`]?.[prop]
    const themeVal = getValueFromStateVar(themeVars, getVlu?.replace('!important', ''))
    const value = getNumFromStr(themeVal) || 0
    const unit = getStrFromStr(themeVal)
    return [value, unit]
  }

  const updateHandler = (value, unit, styleUnit, property) => {
    if (styleUnit?.match(/(undefined)/gi)?.[0]) styleUnit = styleUnit?.replace(/(undefined)/gi, '')
    const convertvalue = unitConverter(unit, value, styleUnit)
    const propertyPath = getPropertyPath(property)

    setStyles(prvStyle => create(prvStyle, drft => {
      const preValue = getValueByObjPath(drft, propertyPath)
      const isAlreadyImportant = preValue?.match(/(!important)/gi)?.[0]
      let v = `${convertvalue}${unit}`
      if (isAlreadyImportant) v = `${v} !important`
      assignNestedObj(drft, propertyPath, v)
    }))
  }

  const [fldOpctyValue, fldOpctyUnit] = [getNumFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.opacity)), getStrFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.opacity))]
  const [widthValue, widthUnit] = [getNumFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.width)), getStrFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.width))]
  const [maxWidthValue, maxWidthUnit] = [getNumFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['max-width'])), getStrFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['max-width']))]
  const [minWidthValue, minWidthUnit] = [getNumFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['min-width'])), getStrFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['min-width']))]
  const [heightValue, heightUnit] = [getNumFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.height)), getStrFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.height))]
  const [maxHeightValue, maxHeightUnit] = [getNumFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['max-height'])), getStrFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['max-height']))]
  const [minHeightValue, minHeightUnit] = [getNumFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['min-height'])), getStrFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['min-height']))]
  const [fldZIndex] = [getNumFromStr(getValueFromStateVar(themeVars, existCssPropsObj?.['z-index']))]
  const actualFSVal = getValueFromStateVar(themeVars, existCssPropsObj?.['font-size'])
  const [fldFSValue, fldFSUnit] = [getNumFromStr(actualFSVal), getStrFromStr(actualFSVal)]
  const fldZIndexHandler = (value) => updateHandler(value, '', '', 'z-index')

  const addDynamicCssProps = (property, state = '') => {
    const configProperty = editorConfig?.[fieldType]?.[elementKey]?.properties[property]
    if (typeof configProperty === 'object') {
      setStyles(prvStyle => create(prvStyle, drft => {
        Object.keys(configProperty).map(prop => {
          if (configProperty[prop]) {
            const propPath = getPropertyPath(prop, state)
            const defaultPropPath = getPropertyPath(prop)
            assignNestedObj(drft, propPath, getValueByObjPath(styles, defaultPropPath))
          }
        })
      }))
      addToBuilderHistory(generateHistoryData(elementKey, fldKey, `${property} Properties Added`, '', { styles: getLatestState('styles') }))
    } else {
      const propPath = getPropertyPath(property, state)
      const defaultPropValue = editorConfig?.[fieldType]?.[elementKey]?.properties[property]
      const getValFromState = getValueByObjPath(styles, getPropertyPath(property))

      setStyles(prvStyle => create(prvStyle, drft => {
        assignNestedObj(drft, propPath, getValFromState || defaultPropValue)
      }))
      addToBuilderHistory(generateHistoryData(elementKey, fldKey, `${property} Property Added`, '', { styles: getLatestState('styles') }))
    }
  }

  const setNewCssProp = (property, state = '') => {
    state = getPseudoPath(state)
    setStyles(prvStyle => create(prvStyle, drft => {
      assignNestedObj(drft, getPropertyPath(property, state), '')
    }))
    addDynamicCssProps(property, state)
  }

  const setAlign = (alignValue) => {
    setStyles(prvStyle => create(prvStyle, drft => {
      drft.fields[fldKey].classes[`.${fldKey}-${elementKey}`]['text-align'] = alignValue
    }))
  }

  const delPropertyHandler = (property, state = '') => {
    setStyles(prvStyle => create(prvStyle, drft => {
      deleteNestedObj(drft, getPropertyPath(property, state))
    }))
    Object.keys(editorConfig[fieldType][elementKey].properties[property] || {})?.map(propName => {
      setStyles(prvStyle => create(prvStyle, drft => {
        deleteNestedObj(drft, getPropertyPath(propName, state))
      }))
    })
    addToBuilderHistory(generateHistoryData(elementKey, fldKey, `${property} Deleted`, '', { styles: getLatestState('styles') }))
  }
  const delMultiPropertyHandler = (propertyPaths, state = '') => {
    setStyles(prvStyle => create(prvStyle, drft => {
      propertyPaths.map(propertyPath => {
        deleteNestedObj(drft, propertyPath, state)
      })
    }))
    addToBuilderHistory(generateHistoryData(elementKey, fldKey, `${propertyPaths[0]} Deleted`, '', { styles: getLatestState('styles') }))
  }
  const clearHandler = (property, state = '') => {
    setStyles(prvStyle => create(prvStyle, drft => {
      assignNestedObj(drft, deleteNestedObj(property, state), '')
    }))
    addToBuilderHistory(generateHistoryData(elementKey, fldKey, `${property} Clear`, '', { styles: getLatestState('styles') }))
  }

  const [fldLineHeightVal, fldLineHeightUnit] = getStyleValueAndUnit('line-height')
  const [wordSpacingVal, wordSpacingUnit] = getStyleValueAndUnit('word-spacing')
  const [letterSpacingVal, letterSpacingUnit] = getStyleValueAndUnit('letter-spacing')

  const spacingHandler = ({ value, unit }, prop, prvUnit, state = '') => {
    // state = getPseudoPath(state)
    const convertvalue = unitConverter(unit, value, prvUnit)
    let v = `${convertvalue}${unit}`
    const checkExistImportant = existImportant(getPropertyPath(prop, state))
    if (checkExistImportant) v += ' !important'
    setStyles(prvStyle => create(prvStyle, drftStyle => {
      assignNestedObj(drftStyle, getPropertyPath(prop, state), v)
    }))
    addToBuilderHistory(generateHistoryData(elementKey, fldKey, prop, v, { styles: getLatestState('styles') }))
  }
  const preDefinedValueHandler = (value, property, state = '') => {
    setStyles(prvStyle => create(prvStyle, drftStyle => {
      const checkExistImportant = existImportant(getPropertyPath(property, state))
      if (checkExistImportant) value += ' !important'
      assignNestedObj(drftStyle, getPropertyPath(property, state), value)
    }))
    addToBuilderHistory(generateHistoryData(elementKey, fldKey, property, value, { styles: getLatestState('styles') }))
  }
  const fontPropertyUpdateHandler = (property, val, state = '') => {
    // state = getPseudoPath(state)
    setStyles(prvStyle => create(prvStyle, drft => {
      let v = val
      const checkExistImportant = existImportant(getPropertyPath(property, state))
      if (checkExistImportant) v += ' !important'
      assignNestedObj(drft, getPropertyPath(property, state), v)
    }))
    addToBuilderHistory(generateHistoryData(elementKey, fldKey, property, val, { styles: getLatestState('styles') }))
  }

  const options = [
    { label: 'Default', icn: 'Default', show: ['icn'], tip: 'Default Style' },
  ]
  const { states } = editorConfig[fieldType][elementKey] || {}
  states?.map(state => {
    const stateLabel = state ? ucFirst(state) : 'Default'
    options.push({ label: stateLabel, icn: stateLabel, show: ['icn'], tip: `${stateLabel} Style` })
  })

  const setController = lblName => {
    if (lblName === 'Default') setStateController('')
    else setStateController(lblName)
  }

  const getCssPropertyMenu = (propName, state = '') => {
    state = getPseudoPath(state)
    const objPaths = {
      object: 'styles',
      paths: {},
    }

    const configProperty = editorConfig?.[fieldType]?.[elementKey]?.properties?.[propName]
    let propertyKeys = [propName]
    if (typeof configProperty === 'object') {
      propertyKeys = Object.keys(configProperty)
      propertyKeys.map(prop => {
        objPaths.paths[prop] = getPropertyPath(prop, state)
      })
    } else {
      objPaths.paths[propName] = getPropertyPath(propName, state)
    }
    switch (propName) {
      case 'background':
        return (
          <BackgroundControl
            title="Background"
            subtitle={fldTitle}
            value={existCssPropsObj?.['background-image']?.replace(/\s?!important/g, '') || getValueFromStateVar(themeColors, existCssPropsObj?.background)}
            modalId="fld-cnr-bg-img"
            stateObjName="styles"
            propertyPath={objPaths.paths?.background}
            objectPaths={objPaths}
            deleteable
            delPropertyHandler={() => delPropertyHandler('background', state)}
            clearHandler={() => clearHandler('background', state)}
            allowImportant
          />
        )
      // case 'stroke':
      //   return (
      //     <BackgroundControl
      //       title="Stroke"
      //       subtitle={`${fldTitle}`}
      //       value={existCssPropsObj?.stroke}
      //       modalId="field-container-stroke"
      //       stateObjName="styles"
      //       objectPaths={objPaths}
      //       deleteable
      //       delPropertyHandler={() => delPropertyHandler('stroke', state)}
      //       clearHandler={() => clearHandler('stroke', state)}
      //       allowImportant
      //     />
      //   )
      case 'border-image':
        return (
          <BorderImageControl
            title="Border Image"
            subtitle={fldTitle}
            value={existCssPropsObj['border-image']}
            modalId="fld-bdr-img"
            stateObjName="styles"
            objectPaths={objPaths}
            deleteable
            delPropertyHandler={() => delPropertyHandler('border-image', state)}
            clearHandler={() => clearHandler('border-image', state)}
            allowImportant
          />
        )
      case 'background-color':
        return (
          <SimpleColorPicker
            title="Background Color"
            subtitle={fldTitle}
            value={getValueFromStateVar(themeColors, existCssPropsObj?.['background-color'])}
            modalId="fld-cnr-bg"
            stateObjName="styles"
            propertyPath={objPaths.paths?.['background-color']}
            deleteable
            delPropertyHandler={() => delPropertyHandler('background-color', state)}
            clearHandler={() => clearHandler('background-color', state)}
            allowImportant
            canSetVariable
          />
        )
      case 'color':
        return (
          <SimpleColorPicker
            title="Text Color"
            subtitle={fldTitle}
            value={existCssPropsObj?.color}
            modalId="fld-crn-color"
            stateObjName="styles"
            propertyPath={objPaths.paths?.color}
            deleteable
            delPropertyHandler={() => delPropertyHandler('color', state)}
            clearHandler={() => clearHandler('color', state)}
            allowImportant
            canSetVariable
          />
        )
      case 'accent-color':
        return (
          <SimpleColorPicker
            title="Accent Color"
            subtitle={fldTitle}
            value={existCssPropsObj?.['accent-color']}
            modalId="fld-accnt-color"
            stateObjName="styles"
            propertyPath={objPaths.paths?.['accent-color']}
            deleteable
            delPropertyHandler={() => delPropertyHandler('accent-color', state)}
            clearHandler={() => clearHandler('accent-color', state)}
            allowImportant
            canSetVariable
          />
        )
      case '--bfv-upper-track-clr':
        return (
          <SimpleColorPicker
            title="Track Color"
            subtitle={fldTitle}
            value={existCssPropsObj?.['--bfv-upper-track-clr']}
            modalId="fld-trk-clr"
            stateObjName="styles"
            propertyPath={objPaths.paths?.['--bfv-upper-track-clr']}
            deleteable
            delPropertyHandler={() => delPropertyHandler('--bfv-upper-track-clr', state)}
            clearHandler={() => clearHandler('--bfv-upper-track-clr', state)}
            allowImportant
            canSetVariable
          />
        )
      case '--bfv-lower-track-clr':
        return (
          <SimpleColorPicker
            title="Progress Fill Color"
            subtitle={fldTitle}
            value={existCssPropsObj?.['--bfv-lower-track-clr']}
            modalId="fld-trk-fill-color"
            stateObjName="styles"
            propertyPath={objPaths.paths?.['--bfv-lower-track-clr']}
            deleteable
            delPropertyHandler={() => delPropertyHandler('--bfv-lower-track-clr', state)}
            clearHandler={() => clearHandler('--bfv-lower-track-clr', state)}
            allowImportant
            canSetVariable
          />
        )
      case 'border':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('border', state)}
            title="Border"
          >
            <ResetStyle
              propertyPath={Object.values(objPaths.paths)}
              stateObjName="styles"
              id="fld-wrp-bdr"
            />
            <BorderControl
              allowImportant
              subtitle={fldTitle}
              objectPaths={objPaths}
              id="fld-wrp-bdr"
            />
          </StylePropertyBlock>
        )
      case 'line-height':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('line-height', state)}
            title="Line Height"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['line-height']}
              stateObjName="styles"
              id="fld-wrp-lh"
            />
            <div className={css(ut.flxc)}>
              {fldLineHeightVal !== null && (
                <Important
                  id="fld-wrp-lh"
                  className={css({ mr: 5 })}
                  propertyPath={objPaths.paths?.['line-height']}
                />
              )}
              <SizeControl
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'line-height', fldLineHeightUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'line-height', fldLineHeightUnit, state)}
                value={fldLineHeightVal || 0}
                unit={fldLineHeightUnit || ''}
                width="128px"
                options={['', 'px', 'em', 'rem']}
                step={fldLineHeightUnit !== 'px' ? '0.1' : 1}
                dataTestId="fld-wrp-lh"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'word-spacing':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('word-spacing', state)}
            title="Word Spacing"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['word-spacing']}
              stateObjName="styles"
              id="fld-wrp-ws"
            />
            <div className={css(ut.flxc)}>
              {wordSpacingVal !== null && (
                <Important
                  className={css(ut.mr1)}
                  propertyPath={objPaths.paths?.['word-spacing']}
                  id="fld-wrp-ws"
                />
              )}
              <SizeControl
                min={0.1}
                max={100}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'word-spacing', wordSpacingUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'word-spacing', wordSpacingUnit, state)}
                value={wordSpacingVal || 0}
                unit={wordSpacingUnit || 'px'}
                width="128px"
                options={['px', 'em', 'rem', '%']}
                step={wordSpacingUnit !== 'px' ? '0.1' : 1}
                dataTestId="fld-wrp-ws"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'letter-spacing':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('letter-spacing', state)}
            title="Letter-spacing"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['letter-spacing']}
              stateObjName="styles"
              id="fld-wrp-ls"
            />
            <div className={css(ut.flxc)}>
              {letterSpacingVal !== null && (
                <Important
                  className={css(ut.mr1)}
                  propertyPath={objPaths.paths?.['letter-spacing']}
                  id="fld-wrp-ls"
                />
              )}
              <SizeControl
                min={0.1}
                max={100}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'letter-spacing', letterSpacingUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'letter-spacing', letterSpacingUnit, state)}
                value={letterSpacingVal || 0}
                unit={letterSpacingUnit || 'px'}
                width="128px"
                options={['px', 'em', 'rem', '']}
                step={letterSpacingUnit !== 'px' ? '0.1' : 1}
                dataTestId="fld-wrp-ls"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'margin':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('margin', state)}
            title="Margin"
          >
            <SpacingControl
              mainTitle="Margin"
              allowImportant
              action={{ type: 'spacing-control' }}
              subtitle={fldTitle}
              objectPaths={objPaths}
              id="fld-mrgn-ctrl"
            />
          </StylePropertyBlock>
        )
      case 'padding':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('padding', state)}
            title="Padding"
          >
            <SpacingControl
              mainTitle="Padding"
              allowImportant
              action={{ type: 'spacing-control' }}
              subtitle={fldTitle}
              objectPaths={objPaths}
              id="fld-pddng-ctrl"
            />
          </StylePropertyBlock>
        )
      case 'size':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => {
              delPropertyHandler('width', state)
              delPropertyHandler('height', state)
              delPropertyHandler('size', state)
            }}
            title="Size"
          >
            <SizeControler
              action={{ type: 'size-control' }}
              subtitle={`${fldTitle} Size`}
              objectPaths={objPaths}
              id="size-control"
              width="128px"
            />
          </StylePropertyBlock>
        )
      case 'width':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('width', state)}
            title="Width"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.width}
              stateObjName="styles"
              id="fld-wrp-wdth"
            />
            <div className={css(ut.flxc, { cg: 3 })}>
              {widthValue && (
                <Important
                  className={css(cls.mr2)}
                  propertyPath={objPaths.paths?.width}
                  id="fld-wrp-wdth"
                />
              )}
              <SizeControl
                width="128px"
                value={Number(widthValue)}
                unit={widthUnit}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'width', widthUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'width', widthUnit, state)}
                options={['px', 'em', 'rem', '%']}
                dataTestId="fld-wrp-wdth"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'max-width':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('max-width', state)}
            title="Max width"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['max-width']}
              stateObjName="styles"
              id="fld-wrp-mx-wdth"
            />
            <div className={css(ut.flxc, { cg: 3 })}>
              {maxWidthValue && (
                <Important
                  className={css(cls.mr2)}
                  propertyPath={objPaths.paths?.['max-width']}
                  id="fld-wrp-mx-wdth"
                />
              )}
              <SizeControl
                width="128px"
                value={Number(maxWidthValue)}
                unit={maxWidthUnit}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'max-width', maxWidthUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'max-width', heightUnit, state)}
                options={['px', 'em', 'rem', '%']}
                dataTestId="fld-wrp-mx-wdth"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'min-width':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('min-width', state)}
            title="Min width"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['min-width']}
              stateObjName="styles"
              id="fld-wrp-mn-wdth"
            />
            <div className={css(ut.flxc, { cg: 3 })}>
              {minWidthValue && (
                <Important
                  className={css(cls.mr2)}
                  propertyPath={objPaths.paths?.['min-width']}
                  id="fld-wrp-mn-wdth"
                />
              )}
              <SizeControl
                width="128px"
                value={Number(minWidthValue)}
                unit={minWidthUnit}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'min-width', minWidthUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'min-width', heightUnit, state)}
                options={['px', 'em', 'rem', '%']}
                dataTestId="fld-wrp-mn-wdth"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'height':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('height', state)}
            title="Height"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.height}
              stateObjName="styles"
              id="fld-wrp-hght"
            />
            <div className={css(ut.flxc, { cg: 3 })}>
              {heightValue && <Important className={css(cls.mr2)} propertyPath={objPaths.paths?.height} />}
              <SizeControl
                width="128px"
                value={Number(heightValue)}
                unit={heightUnit}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'height', heightUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'height', heightUnit, state)}
                options={['px', 'em', 'rem', '%']}
                dataTestId="fld-wrp-hght"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'max-height':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('max-height', state)}
            title="Max Height"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['max-height']}
              stateObjName="styles"
              id="fld-wrp-max-hght"
            />
            <div className={css(ut.flxc, { cg: 3 })}>
              {maxHeightValue && (
                <Important
                  className={css(cls.mr2)}
                  propertyPath={objPaths.paths?.['max-height']}
                  id="fld-wrp-max-hght"
                />
              )}
              <SizeControl
                width="128px"
                value={Number(maxHeightValue)}
                unit={maxHeightUnit}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'max-height', maxHeightUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'max-height', heightUnit, state)}
                options={['px', 'em', 'rem', '%']}
                dataTestId="fld-wrp-max-hght"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'min-height':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('min-height', state)}
            title="Min Height"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['min-height']}
              stateObjName="styles"
              id="fld-wrp-min-hght"
            />
            <div className={css(ut.flxc, { cg: 3 })}>
              {minHeightValue && (
                <Important
                  className={css(cls.mr2)}
                  propertyPath={objPaths.paths?.['min-height']}
                  id="fld-wrp-min-hght"
                />
              )}
              <SizeControl
                width="128px"
                value={Number(minHeightValue)}
                unit={minHeightUnit}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'min-height', minHeightUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'min-height', heightUnit, state)}
                options={['px', 'em', 'rem', '%']}
                dataTestId="fld-wrp-min-hght"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'text-align':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('text-align', state)}
            title="Text Align"
          >
            <ResetStyle id="txt-align" propertyPath={objPaths.paths?.['text-align']} stateObjName="styles" />
            <div className={css(ut.flxc, { cg: 3 })}>
              <StyleSegmentControl
                className={css({ w: 130 })}
                show={['icn']}
                tipPlace="bottom"
                options={[
                  { icn: <TxtAlignLeftIcn size="17" />, label: 'left', tip: 'Left' },
                  { icn: <TxtAlignCntrIcn size="17" />, label: 'center', tip: 'Center' },
                  { icn: <TxtAlignJustifyIcn size="17" />, label: 'justify', tip: 'Justify' },
                  { icn: <TxtAlignRightIcn size="17" />, label: 'right', tip: 'Right' },
                ]}
                onChange={e => setAlign(e)}
                defaultActive={txtAlignValue}
              />
            </div>
          </StylePropertyBlock>
        )
      case 'text-decoration':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => {
              delPropertyHandler('text-decoration', state)
              delMultiPropertyHandler(Object.values(objPaths.paths))
            }}
            title="Text Decoration"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['text-decoration-line']}
              stateObjName="styles"
              id="txt-decor-line"
            />
            <TextDecorationControl
              subtitle={fldTitle}
              value={existCssPropsObj?.['text-decoration-line']}
              objectPaths={objPaths}
              id="fld-txt-dcrtn"
              allowImportant
            />
          </StylePropertyBlock>
        )
      case 'text-shadow':
        return (
          <IndividualShadowControl
            title="Text-shadow"
            subtitle={`${fldTitle} Text Shadow`}
            value={existCssPropsObj?.['text-shadow']}
            defaultValue="0px 1px 2px hsla(0, 0%, 0%, 35%)"
            modalId="fld-crn-txt-shad"
            stateObjName="styles"
            propertyPath={objPaths.paths?.['text-shadow']}
            propertyArray={['xOffset', 'yOffset', 'blur', 'color']}
            deleteable
            delPropertyHandler={() => delPropertyHandler('text-shadow', state)}
            clearHandler={() => clearHandler('text-shadow', state)}
            allowImportant
            fldKey={fldKey}
          />
        )
      case 'box-shadow':
        return (
          <IndividualShadowControl
            title="Box-shadow"
            subtitle={fldTitle}
            value={existCssPropsObj?.['box-shadow']}
            modalId="field-container-box-shadow"
            stateObjName="styles"
            propertyPath={objPaths.paths['box-shadow']}
            deleteable
            delPropertyHandler={() => delPropertyHandler('box-shadow', state)}
            clearHandler={() => clearHandler('box-shadow', state)}
            allowImportant
            fldKey={fldKey}
          />
        )
      case 'transition':
        return (
          <TransitionControl
            title="Transition"
            subtitle={fldTitle}
            value={existCssPropsObj?.transition}
            modalId="field-container-transition"
            stateObjName="styles"
            propertyPath={objPaths.paths.transition}
            deleteable
            delPropertyHandler={() => delPropertyHandler('transition', state)}
            clearHandler={() => clearHandler('transition', state)}
            allowImportant
          />
        )
      case 'filter':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('filter', state)}
            title="Filter"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.filter}
              stateObjName="styles"
              id="filter-control"
            />
            <div className={css(ut.flxc, { cg: 3 })}>
              <FilterController
                action={{ type: 'filter-control' }}
                subtitle={fldTitle}
                objectPaths={objPaths}
                id="filter-control"
                allowImportant
              />
            </div>
          </StylePropertyBlock>
        )
      case 'backdrop-filter':
        objPaths.paths.filter = objPaths.paths?.['backdrop-filter']
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('backdrop-filter', state)}
            title="Backdrop Filter"
          >
            <ResetStyle
              propertyPath={objPaths.paths?.['backdrop-filter']}
              stateObjName="styles"
              id="backdrop-filter-control"
            />
            <div className={css(ut.flxc, { cg: 3 })}>
              <FilterController
                action={{ type: 'filter-control' }}
                subtitle={fldTitle}
                objectPaths={objPaths}
                id="backdrop-filter-control"
                allowImportant
              />
            </div>
          </StylePropertyBlock>
        )
      case 'font-size':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('font-size', state)}
            title="Font Size"
          >
            <ResetStyle id="fld-font-size" propertyPath={objPaths.paths['font-size']} stateObjName="styles" />
            <div className={css(ut.flxc, { cg: 3 })}>
              {fldFSValue && (
                <Important
                  id="fld-font-size"
                  className={css({ mr: 2 })}
                  propertyPath={objPaths.paths['font-size']}
                />
              )}
              <SizeControl
                className={css({ w: 130 })}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'font-size', fldFSUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'font-size', fldFSUnit, state)}
                // preDefinedValues={['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'smaller', 'larger', 'inherit', 'initial', 'revert', 'revert-layer', 'unset']}
                definedValueHandler={value => preDefinedValueHandler(value, 'font-size', state)}
                value={fldFSValue || 12}
                unit={fldFSUnit || 'px'}
                actualValue={actualFSVal}
                width="128px"
                options={['px', 'em', 'rem']}
                step={fldFSUnit !== 'px' ? '0.1' : 1}
                dataTestId="fld-font-size"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'font-weight':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('font-weight', state)}
            title="Font Weight"
          >
            <ResetStyle id="fld-font-weight" propertyPath={objPaths.paths['font-weight']} stateObjName="styles" />
            <div className={css(ut.flxc, { cg: 3 })}>
              {existCssPropsObj?.['font-weight'] && <Important id="fld-font-weight" propertyPath={objPaths.paths['font-weight']} />}
              <div className={css(cls.comSection)}>
                <SimpleDropdown
                  options={fontweightVariants}
                  value={String(existCssPropsObj?.['font-weight'])}
                  onChange={val => fontPropertyUpdateHandler('font-weight', val)}
                  w={130}
                  h={30}
                  id="fld-font-weight"
                  cls={css((styles.font?.fontType === 'Google' && existCssPropsObj['font-weight'] && !styles.font?.fontWeightVariants.includes(Number(existCssPropsObj?.['font-weight']))) ? cls.warningBorder : '')}
                />
                {(styles.font?.fontType === 'Google' && existCssPropsObj['font-weight'] && !styles.font?.fontWeightVariants.includes(Number(existCssPropsObj?.['font-weight']))) && <span className={css(cls.clr)}>Font weight not found!</span>}
              </div>
            </div>
          </StylePropertyBlock>
        )
      case 'font-style':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('font-style', state)}
            title="Font Style"
          >
            <ResetStyle id="fld-font-style" propertyPath={objPaths.paths['font-style']} stateObjName="styles" />
            <div className={css(ut.flxc, { cg: 3 })}>
              {existCssPropsObj?.['font-style'] && (
                <Important
                  id="fld-font-style"
                  propertyPath={objPaths.paths['font-style']}
                />
              )}
              <div className={css(cls.comSection)}>
                <SimpleDropdown
                  options={fontStyleVariants}
                  value={String(existCssPropsObj?.['font-style'])}
                  onChange={val => fontPropertyUpdateHandler('font-style', val)}
                  w={130}
                  h={30}
                  id="fld-font-style"
                  cls={css((styles.font?.fontType === 'Google' && existCssPropsObj['font-style'] && !styles.font?.fontStyle.includes(existCssPropsObj?.['font-style'])) ? cls.warningBorder : '')}
                />
                {(styles.font?.fontType === 'Google' && existCssPropsObj['font-style'] && !styles.font?.fontStyle.includes(existCssPropsObj?.['font-style'])) && <span className={css(cls.clr)}>Font style not found!</span>}
              </div>
            </div>
          </StylePropertyBlock>
        )
      case 'white-space':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('white-space', state)}
            title="White Space"
          >
            <ResetStyle id="fld-white-space" propertyPath={objPaths.paths['white-space']} stateObjName="styles" />
            <div className={css(ut.flxc, { cg: 3 })}>
              {existCssPropsObj?.['white-space'] && (
                <Important
                  id="fld-white-space"
                  propertyPath={objPaths.paths['white-space']}
                />
              )}
              <SimpleDropdown
                options={staticWhiteSpaceVariants}
                value={String(existCssPropsObj?.['white-space'])}
                onChange={val => fontPropertyUpdateHandler('white-space', val)}
                w={130}
                h={30}
                id="fld-white-space"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'word-wrap':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('word-wrap', state)}
            title="Word Wrap"
          >
            <ResetStyle id="fld-word-wrap" propertyPath={objPaths.paths['word-wrap']} stateObjName="styles" />
            <div className={css(ut.flxc, { cg: 3 })}>
              {existCssPropsObj?.['word-wrap'] && <Important id="fld-word-wrap" propertyPath={objPaths.paths['word-wrap']} />}
              <SimpleDropdown
                options={staticWordWrapVariants}
                value={String(existCssPropsObj?.['word-wrap'])}
                onChange={val => fontPropertyUpdateHandler('word-wrap', val)}
                w={130}
                h={30}
                id="fld-word-wrap"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'opacity':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('opacity', state)}
            title="Opacity"
          >
            <ResetStyle id="fld-opacity" propertyPath={objPaths.paths.opacity} stateObjName="styles" />
            <div className={css(ut.flxc, { cg: 3 })}>
              {fldOpctyValue && (
                <Important
                  className={css(cls.mr2)}
                  propertyPath={objPaths.paths.opacity}
                  id="fld-opacity"
                />
              )}
              <SizeControl
                className={css({ w: 130 })}
                inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'opacity', fldOpctyUnit, state)}
                sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'opacity', fldOpctyUnit, state)}
                value={fldOpctyValue || 1}
                unit={fldOpctyUnit}
                min={0}
                max={fldOpctyUnit === '' ? 1 : 100}
                width="128px"
                options={['', '%']}
                step={fldOpctyUnit === '' ? 0.1 : 1}
                dataTestId="fld-opacity"
              />
            </div>
          </StylePropertyBlock>
        )
      case 'z-index':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => delPropertyHandler('z-index', state)}
            title="Z-Index"
          >
            <ResetStyle id="fld-z-index" propertyPath={objPaths.paths['z-index']} stateObjName="styles" />
            <div className={css(ut.flxc, { cg: 3 })}>
              {fldZIndex && (
                <Important
                  id="fld-z-index"
                  propertyPath={objPaths.paths['z-index']}
                  className={css({ mr: 2 })}
                />
              )}
              <div className={css(sizeControlStyle.container)}>
                <CustomInputControl
                  className={css(sizeControlStyle.input)}
                  label=""
                  value={fldZIndex || 0}
                  min={0}
                  max={100}
                  step={1}
                  width="120px"
                  onChange={value => fldZIndexHandler(value)}
                  dataTestId="fld-z-index"
                />
              </div>
            </div>
          </StylePropertyBlock>
        )
      case 'transform':
        return (
          <TransformControl
            title="Transform"
            subtitle={fldTitle}
            value={existCssPropsObj?.transform}
            modalId="fld-cnr-trsfm"
            stateObjName="styles"
            propertyPath={objPaths.paths.transform}
            deleteable
            delPropertyHandler={() => delPropertyHandler('transform', state)}
            clearHandler={() => clearHandler('transform', state)}
            allowImportant
          />
        )
      case 'color(filter)':
        return (
          <FilterColorPicker
            title="Color"
            subtitle={fldTitle}
            value={existCssPropsObj?.['icon-color']}
            modalId="fld-cnr-clr-fltr"
            stateObjName="styles"
            propertyPath={objPaths.paths?.['icon-color']}
            objectPaths={objPaths}
            deleteable
            delPropertyHandler={() => delMultiPropertyHandler([getPropertyPath('color(filter)', state), objPaths.paths['icon-color']], state)}
            clearHandler={() => clearHandler('icon-color', state)}
            allowImportant
          />
        )
      default:
        break
    }
  }
  return (
    <>
      <StyleSegmentControl
        square
        noShadow
        defaultActive="Default"
        options={options}
        size={60}
        component="button"
        onChange={lbl => setController(lbl)}
        show={['icn']}
        variant="lightgray"
        width="100%"
        wideTab
      />
      <Grow overflw="" open={stateController.toLowerCase() === ''}>
        <div className={css(cls.space)}>
          {
            existCssProps.map((propName, indx) => (
              <div key={`propName-${indx * 20}`}>
                {getCssPropertyMenu(propName)}
              </div>
            ))
          }
          {(availableCssProp.length > 0)
            && <CssPropertyList id="individual-style" properties={availableCssProp} setProperty={(prop) => setNewCssProp(prop)} />}
        </div>
      </Grow>
      {
        states?.map((state, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grow overflw="" key={`grow-${i}`} open={stateController.toLowerCase() === state}>
            <div className={css(cls.space)}>
              {elementKey === 'fld' && (state === 'hover' || state === 'focus') && fieldObj.prefixIcn && (
                <FilterColorPicker
                  title="Leading Icon Color"
                  subtitle="Icon Fill Color(Filter)"
                  value={classes?.[`.${fldKey}-${elementKey}${stateController && `${getPseudoPath(stateController).toLowerCase()} ~ .${fldKey}-pre-i`}`]?.color}
                  stateObjName="styles"
                  propertyPath={[getPropertyPath('color', state, ` ~ .${fldKey}-pre-i`), getPropertyPath('filter', state, ` ~ .${fldKey}-pre-i`)]}
                  objectPaths={{
                    object: 'styles',
                    paths: {
                      'icon-color': getPropertyPath('color', state, ` ~ .${fldKey}-pre-i`),
                      filter: getPropertyPath('filter', state, ` ~ .${fldKey}-pre-i`),
                    },
                  }}
                  modalId={`${elementKey}-${state}-pre-i`}
                />
              )}
              {elementKey === 'fld' && (state === 'hover' || state === 'focus') && fieldObj.suffixIcn && (
                <FilterColorPicker
                  title="Trailing Icon Color"
                  subtitle="Icon Fill Color(Filter)"
                  value={classes?.[`.${fldKey}-${elementKey}${stateController && `${getPseudoPath(stateController).toLowerCase()}`} ~ .${fldKey}-suf-i`]?.color}
                  stateObjName="styles"
                  propertyPath={[getPropertyPath('color', state, ` ~ .${fldKey}-suf-i`), getPropertyPath('filter', state, ` ~ .${fldKey}-suf-i`)]}
                  objectPaths={{
                    object: 'styles',
                    paths: {
                      'icon-color': getPropertyPath('color', state, ` ~ .${fldKey}-suf-i`),
                      filter: getPropertyPath('filter', state, ` ~ .${fldKey}-suf-i`),
                    },
                  }}
                  modalId={`${elementKey}-${state}-suf-i`}
                />
              )}
              {
                existCssProps.map((propName, indx) => (
                  <div key={`propName-${indx * 20}`}>
                    {getCssPropertyMenu(propName, state)}
                  </div>
                ))
              }
              {(availableCssProp.length > 0)
                && <CssPropertyList id={`individual-style-${state}`} properties={availableCssProp} setProperty={(prop) => setNewCssProp(prop, state)} />}
            </div>
          </Grow>
        ))
      }
      {[...Array(20).keys()].map((i) => <br key={`${i}-asd`} />)}
    </>
  )
}

const cls = {
  container: { ml: 12, mr: 15, pn: 'relative' },
  delBtn: {
    se: 20,
    flx: 'center',
    b: 'none',
    p: 0,
    mr: 1,
    tn: '.2s all',
    curp: 1,
    brs: '50%',
    tm: 'scale(0)',
    bd: 'none',
    cr: 'var(--red-100-61)',
    pn: 'absolute',
    lt: -15,
    ':hover': { bd: '#ffd0d0', cr: '#460000' },
  },
  containerHover: { '&:hover .delete-btn': { tm: 'scale(1)' } },
  space: { p: 5 },
  warningBorder: { b: '1px solid yellow' },
  mr2: { mr: 2 },
  comSection: {
    dy: 'flex',
    fd: 'column',
  },
  clr: { cr: 'red' },
}
