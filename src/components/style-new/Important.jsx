/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import StarIcn from '../../Icons/StarIcn'
import Tip from '../Utilities/Tip'
import { assignNestedObj, getValueByObjPath } from './styleHelpers'

export default function Important({ paths = {}, propertyPath, className, id, stateObjName = 'styles', stylesPropertyPath }) {
  const [styles, setStyles] = useAtom($styles)
  const [themeColors, setThemeColors] = useAtom($themeColors)
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const { css } = useFela()

  // When stylesPropertyPath is provided (CSS variable case), use it for !important
  // This ensures !important is added to: color: var(--bf-fld-hover-color) !important
  // Instead of the variable value: --bf-fld-hover-color: red !important
  const targetPath = stylesPropertyPath || propertyPath
  const targetStateObj = stylesPropertyPath ? 'styles' : stateObjName

  // Get the current value based on targetStateObj
  const getStyleValue = () => {
    switch (targetStateObj) {
      case 'themeColors':
        return themeColors?.[targetPath]
      case 'themeVars':
        return themeVars?.[targetPath]
      case 'styles':
      default:
        return getValueByObjPath(styles, targetPath)
    }
  }

  const styleValue = getStyleValue()

  const isAlreadyImportant = () => {
    if (typeof styleValue === 'number') return false
    if (styleValue?.match?.(/(!important)/gi)?.[0]) return true
    return false
  }

  const isStyleValueEmptyOrCssVar = () => {
    if (typeof styleValue === 'number') return true
    // When using stylesPropertyPath, the value contains var(...) which is valid
    if (stylesPropertyPath && styleValue?.match?.(/(var)/gi)?.[0]) return false
    if (styleValue === '' || styleValue === null || styleValue === undefined || styleValue?.match?.(/(var)/gi)?.[0]) return true
    return false
  }

  const props = Object.keys(paths)

  const addOrRemoveImportant = () => {
    let newStyleValue

    if (isAlreadyImportant()) {
      newStyleValue = styleValue?.replace?.(/\s*!important/gi, '') || styleValue
    } else {
      newStyleValue = styleValue ? `${styleValue} !important` : styleValue
    }

    // Always update styles when stylesPropertyPath is provided
    if (stylesPropertyPath) {
      setStyles(prvStyle => create(prvStyle, drft => {
        assignNestedObj(drft, stylesPropertyPath, newStyleValue)
      }))
      return
    }

    switch (stateObjName) {
      case 'themeColors':
        setThemeColors(prvState => create(prvState, drft => {
          drft[propertyPath] = newStyleValue
        }))
        break
      case 'themeVars':
        setThemeVars(prvState => create(prvState, drft => {
          drft[propertyPath] = newStyleValue
        }))
        break
      case 'styles':
      default:
        setStyles(prvStyle => create(prvStyle, drft => {
          assignNestedObj(drft, propertyPath, newStyleValue)
          props.forEach(propName => {
            const propValue = getValueByObjPath(styles, paths[propName])
            if (isAlreadyImportant()) {
              assignNestedObj(drft, paths[propName], propValue?.replace?.(/\s*!important/gi, '') || propValue)
            } else {
              assignNestedObj(drft, paths[propName], propValue ? `${propValue} !important` : propValue)
            }
          })
        }))
        break
    }
  }

  return (
    <Tip msg="Set style as !important">
      <button
        style={{ visibility: isStyleValueEmptyOrCssVar() ? 'visible' : 'visible' }}
        className={`${css(cls.btn, isAlreadyImportant() && cls.active)} ${className}`}
        type="button"
        onClick={addOrRemoveImportant}
        data-testid={`${id}-important`}
      >
        <StarIcn size="12" />
      </button>
    </Tip>
  )
}

const cls = {
  btn: {
    se: 20,
    flx: 'center',
    p: 2,
    oe: 'none',
    brs: '50%',
    b: 'none',
    curp: 1,
    bd: 'none',
    cr: 'var(--white-0-0-29)',
    ':hover': { bd: 'var(--white-0-95)', cr: 'var(--white-0-29)' },
  },
  active: { cr: 'var(--b-50) !important' },
}
