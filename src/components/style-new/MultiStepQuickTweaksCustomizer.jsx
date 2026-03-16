/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { hideAll } from 'tippy.js'
import { $builderSettings, $fields, $formId } from '../../GlobalStates/GlobalStates'
import { $savedStyles, $savedThemeColors, $savedThemeVars } from '../../GlobalStates/SavedStylesAndVars'
import { $allStyles, $styles } from '../../GlobalStates/StylesState'
import { $allThemeColors, $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $allThemeVars, $themeVars } from '../../GlobalStates/ThemeVarsState'
import {
  addToBuilderHistory,
  generateHistoryData,
  getLatestState,
  reCalculateFldHeights,
} from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import ut from '../../styles/2.utilities'
import sc from '../../styles/commonStyleEditorStyle'
import BorderControl from './BorderControl'
import FontPicker from './FontPicker'
import FontSizeControl from './FontSizeControl'
import ResetStyle from './ResetStyle'
import SimpleColorPicker from './SimpleColorPicker'
import ThemeStylePropertyBlock from './ThemeStylePropertyBlock'
import ThemeStyleReset from './ThemeStyleReset'
import { changeFormStylesDir, changeFormThemeVarsDir } from './formDirectionHelpers'
import bitformDefaultTheme from './themes/1_bitformDefault'
import { updateFieldStyleByFieldSizing } from './themes/1_bitformDefault/fieldSizeControlStyle'
import atlassianTheme from './themes/2_atlassian'
import individual from './themes/individual/individual'
import themeProvider from './themes/themeProvider'

export default function MultiStepQuickTweaksCustomizer() {
  const { css } = useFela()
  const { fieldKey, element, formType } = useParams()
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const [themeColors, setThemeColors] = useAtom($themeColors)
  const [styles, setStyles] = useAtom($styles)
  const fields = useAtomValue($fields)
  const { '--dir': direction } = themeVars
  const tmpStyles = useAtomValue($savedStyles)
  const tmpThemeColors = useAtomValue($savedThemeColors)
  const tmpThemeVars = useAtomValue($savedThemeVars)
  const formId = useAtomValue($formId)
  const fieldsArray = Object.entries(fields)
  const setAllThemeColors = useSetAtom($allThemeColors)
  const setAllThemeVars = useSetAtom($allThemeVars)
  const setAllStyles = useSetAtom($allStyles)
  const [styleResetTo, setStyleResetTo] = useState('initial')
  const { '--global-accent-color': globalPrimaryColor,
    '--global-font-color': globalFontColor,
    '--global-bg-color': globalBgColor,
    '--global-fld-bg-color': globalFldBgClr } = themeColors
  const [{ addImportantRuleToStyles }, setBuilderSettings] = useAtom($builderSettings)

  const setSizes = ({ target: { value } }) => {
    const tmpThemeVar = deepCopy(themeVars)

    setStyles(prvStyles => create(prvStyles, draft => {
      draft.fieldsSize = value
      const flds = prvStyles.fields
      const fldKeyArr = Object.keys(flds)
      const fldKeyArrLen = fldKeyArr.length
      for (let i = 0; i < fldKeyArrLen; i += 1) {
        const fldKey = fldKeyArr[i]
        const updateStyle = updateFieldStyleByFieldSizing(flds[fldKey], fldKey, flds[fldKey].fieldType, prvStyles.theme, value, tmpThemeVar)
        draft.fields[fldKey] = updateStyle
      }
    }))

    setThemeVars(tmpThemeVar)
    reCalculateFldHeights()
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Field Size', value, {
      styles: getLatestState('styles'),
      themeVars: getLatestState('themeVars'),
    }))
  }

  const handleDir = ({ target: { checked } }) => {
    const dir = checked ? 'rtl' : 'ltr'
    setStyles(prv => changeFormStylesDir(prv, dir))
    setThemeVars(prv => changeFormThemeVarsDir(prv, dir))
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Direction', dir, { styles: getLatestState('styles'), themeVars: getLatestState('themeVars') }))
  }

  const getThemeWiseStyle = (theme, fk, type, dir) => {
    if (theme === 'bitformDefault') return bitformDefaultTheme({ fieldKey: fk, type, direction: dir })
    if (theme === 'atlassian') return atlassianTheme({ fieldKey: fk, type, direction: dir })
    return individual({ fieldKey: fk, type, direction: dir })
  }

  const resetStyle = () => {
    if (styleResetTo === 'initial') {
      const existingFields = Object.keys(styles.fields)
      const previousFields = Object.keys(tmpStyles.fields)

      setStyles(prv => create(prv, drft => {
        existingFields.forEach((fldKey) => {
          if (previousFields.includes(fldKey)) {
            drft.fields[fldKey] = tmpStyles.fields[fldKey]
          } else {
            drft.fields[fldKey] = getThemeWiseStyle(
              styles.fields[fldKey].theme,
              fldKey,
              fields[fldKey].typ,
              tmpThemeVars['--dir'],
            )
          }
        })

        drft.font = tmpStyles.font
        drft.theme = tmpStyles.theme
        drft.fieldSize = tmpStyles.fieldSize
        drft.form = tmpStyles.form
      }))
      setThemeVars(tmpThemeVars)
      setThemeColors(tmpThemeColors)
      reCalculateFldHeights()
      addToBuilderHistory(
        generateHistoryData(
          element,
          fieldKey,
          'Reset All Styles',
          '',
          {
            styles: getLatestState('styles'),
            themeVars: getLatestState('themeVars'),
            themeColors: getLatestState('themeColors'),
          },
        ),
      )
    } else if (styleResetTo === 'theme') {
      const { themeColors: newThemeColors, themeVars: newThemeVars, styles: newStyles } = themeProvider(styles.theme, fieldsArray, formId)
      if (styles.confirmations && newStyles.lgLightStyles) newStyles.lgLightStyles.confirmations = [...styles.confirmations]
      setAllThemeColors(newThemeColors)
      setAllThemeVars(newThemeVars)
      setAllStyles(newStyles)
      addToBuilderHistory(generateHistoryData('', '', 'Theme', styles.theme, { allThemeColors: newThemeColors, allThemeVars: newThemeVars, allStyles: newStyles }))
      reCalculateFldHeights()
    }
    hideAll()
  }

  const changeStyleResetTo = e => {
    setStyleResetTo(e.target.value)
  }

  const handleImportantStyles = e => {
    setBuilderSettings(prv => ({ ...prv, addImportantRuleToStyles: e.target.checked }))
  }

  return (
    <>
      <SimpleColorPicker
        title="Accent Color"
        subtitle="Theme Quick Tweaks Accent Color"
        value={globalPrimaryColor}
        stateObjName="themeColors"
        propertyPath="--global-accent-color"
        modalId="global-primary-clr"
        // eslint-disable-next-line no-sequences
        hslaPaths={{ h: '--gah', s: '--gas', l: '--gal', a: '--gaa' }}
      />

      <SimpleColorPicker
        title="Background color"
        subtitle="Theme Quick Tweaks Background Color"
        value={globalBgColor}
        stateObjName="themeColors"
        propertyPath="--global-bg-color"
        modalId="global-bg-clr"
        hslaPaths={{ h: '--gbg-h', s: '--gbg-s', l: '--gbg-l', a: '--gbg-a' }}
      />

      <SimpleColorPicker
        title="Font Color"
        subtitle="Theme Quick Tweaks Font Color"
        value={globalFontColor}
        stateObjName="themeColors"
        propertyPath="--global-font-color"
        modalId="global-font-clr"
        hslaPaths={{ h: '--gfh', s: '--gfs', l: '--gfl', a: '--gfa' }}
      />

      <SimpleColorPicker
        title="Field Background Color"
        subtitle="Theme Quick Tweaks Field Background Color"
        value={globalFldBgClr}
        stateObjName="themeColors"
        propertyPath="--global-fld-bg-color"
        modalId="global-fld-bg-clr"
        hslaPaths={{ h: '--gfbg-h', s: '--gfbg-s', l: '--gfbg-l', a: '--gfbg-a' }}
      />

      <ThemeStylePropertyBlock label="Border">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={['--g-bdr-width', '--g-bdr-rad']}
            stateObjName="themeVars"
            id="g-bdr"
          />
          <BorderControl
            subtitle="Theme Quick Tweaks Border Color"
            objectPaths={borderPathsObj}
            id="global-bdr"
            hslaPaths={{ h: '--gfbc-h', s: '--gfbc-s', l: '--gfbc-l', a: '--gfbc-a' }}
          />
        </div>
      </ThemeStylePropertyBlock>
      {/* <ThemeStylePropertyBlock label="Outline">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={['--g-bdr-width', '--g-bdr-rad']}
            stateObjName="themeVars"
            id="g-bdr"
          />
          <OutlineControl
            subtitle="Theme Quick Tweaks Outline Color"
            objectPaths={outlinePathsObj}
            id="global-outline"
            hslaPaths={{ h: '--gfbc-h', s: '--gfbc-s', l: '--gfbc-l', a: '--gfbc-a' }}
          />
        </div>
      </ThemeStylePropertyBlock> */}

      <div className={css(ut.flxcb, ut.mt2)}>
        <span className={css(ut.fw500)}>Font Family</span>
        <span className={css(ut.flxc)}>
          <ResetStyle
            id="g-fnt"
            stateObjName="themeVars"
            propertyPath="--g-font-family"
          />
          <FontPicker id="global-font-fmly" />
        </span>
      </div>

      <div className={css(ut.flxcb, ut.mt2)}>
        <span className={css(ut.fw500)}>Field Sizes</span>
        <span className={css(ut.flxc)}>
          <ThemeStyleReset id="global-theme" />
          <select
            value={styles.fieldsSize}
            onChange={setSizes}
            className={css(sc.select)}
            data-testid="field-sizes-select"
          >
            {Object.keys(sizes).map((key, index) => (
              <option
                key={`size-${index * 5 * 2}`}
                value={key}
                data-testid={`globl-size-${key}`}
              >
                {sizes[key]}
              </option>
            ))}
          </select>
        </span>
      </div>

      <FontSizeControl
        stateObjName="themeVars"
        propertyPath="--fld-fs"
        id="fld-fs"
      />
    </>

  )
}
const sizes = {
  'small-2': 'Extra Small',
  'small-1': 'Small',
  medium: 'Medium(Default)',
  // large: 'Large',
  'large-1': 'Large',
  'large-2': 'Extra Large',
}
const borderPathsObj = [
  {
    object: 'themeVars',
    paths: {
      'border-style': '--global-fld-bdr',
      'border-width': '--g-bdr-width',
      'border-radius': '--g-bdr-rad',
    },
  },
  {
    object: 'themeColors',
    paths: { 'border-color': '--global-fld-bdr-clr' },
  },
]

// const outlinePathsObj = {
//   object: 'themeVars',
//   paths: {
//     outline: '--global-outline',
//     'outline-offset': '--global-outline-offset',
//   },
// }
// const outlinePathsObj = [
//   {
//     object: 'themeVars',
//     paths: {
//       'outline-width': '--g-o-w',
//       'outline-offset': '--g-o-offset',
//       'outline-style': '--g-o-s',
//     },
//   },
//   {
//     object: 'themeColors',
//     paths: {
//       'outline-color': '--g-o-c',
//     },
//   },
// ]
