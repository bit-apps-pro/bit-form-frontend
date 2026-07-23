/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { Link, useParams } from 'react-router-dom'
import { $customThemes } from '../../GlobalStates/CustomThemesState'
import { $builderSettings } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import SettingsIcn from '../../Icons/SettingsIcn'
import ut from '../../styles/2.utilities'
import sc from '../../styles/commonStyleEditorStyle'
import {
  addToBuilderHistory,
  generateHistoryData,
  getLatestState,
  reCalculateFldHeights,
} from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import SimpleAccordion from '../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import Cooltip from '../Utilities/Cooltip'
import SingleToggle from '../Utilities/SingleToggle'
import BorderControl from './BorderControl'
import FontPicker from './FontPicker'
import FontSizeControl from './FontSizeControl'
import { changeFormStylesDir, changeFormThemeVarsDir } from './formDirectionHelpers'
import LabelControl from './LabelControl'
import ResetStyle from './ResetStyle'
import SimpleColorPicker from './SimpleColorPicker'
import { updateFieldStyleByFieldSizing } from './themes/1_bitformLegacy/fieldSizeControlStyle'
import themes from './themes/themeList'
import ThemeStylePropertyBlock from './ThemeStylePropertyBlock'
import ThemeStyleReset from './ThemeStyleReset'

export default function ThemeQuickTweaksCustomizer() {
  const { css } = useFela()
  const { fieldKey, element, formType, formID } = useParams()
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const [themeColors, setThemeColors] = useAtom($themeColors)
  const [styles, setStyles] = useAtom($styles)
  const customThemes = useAtomValue($customThemes)
  const { '--dir': direction } = themeVars
  const { '--global-accent-color': globalPrimaryColor,
    '--global-font-color': globalFontColor,
    '--global-bg-color': globalBgColor,
    '--global-fld-bg-color': globalFldBgClr,
    '--fld-lbl-c': fldLblColor,
    '--fld-inp-c': fldInpColor } = themeColors
  const [{ addImportantRuleToStyles, atomicClassPrefix }, setBuilderSettings] = useAtom($builderSettings)
  // console.log('Styles', styles)
  // console.log('customThemes', customThemes)
  const [activeTheme] = useState(() => {
    const allThemes = [
      ...themes,
      ...Object.values(customThemes).map((theme) => ({
        ...theme,
      })),
    ]

    const activeThemeSlug = styles.theme
    return allThemes.find(theme => theme.slug === activeThemeSlug || theme.id === activeThemeSlug)
  })
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

  const handleImportantStyles = e => {
    setBuilderSettings(prv => ({ ...prv, addImportantRuleToStyles: e.target.checked }))
  }

  const handleClassPrefix = (value) => {
    setBuilderSettings(prv => ({ ...prv, atomicClassPrefix: value }))
  }

  return (
    <div className={css(style.sectionWrapper)}>
      <SimpleAccordion
        key="form-quick-customizers"
        id="form-quick-customizers"
        title="Form"
        className={css(style.sectionAccordion)}
        open
      >
        <ThemeStylePropertyBlock label="Theme">
          {/* // place a button or link to navigate to Theme Settings page */}
          <Link
            to={`/form/builder/${formType}/${formID}/themes`}
            className={css([style.preview_wrp])}
            data-testid="theme-settings-link"
            title={__('Go to Theme Gallery Settings')}
          >
            <span className={css(style.previewLabel)}>{activeTheme ? activeTheme.name : 'Untitled Theme'}</span>
            <SettingsIcn size={15} />
          </Link>
        </ThemeStylePropertyBlock>
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
          title="Form Background Color"
          subtitle="Theme Quick Tweaks Form Background Color"
          value={globalBgColor}
          stateObjName="themeColors"
          propertyPath="--global-bg-color"
          modalId="global-bg-clr"
          hslaPaths={{ h: '--gbg-h', s: '--gbg-s', l: '--gbg-l', a: '--gbg-a' }}
        />

        <SimpleColorPicker
          title="Form Text Color"
          subtitle="Theme Quick Tweaks Font Color"
          value={globalFontColor}
          stateObjName="themeColors"
          propertyPath="--global-font-color"
          modalId="global-font-clr"
          hslaPaths={{ h: '--gfh', s: '--gfs', l: '--gfl', a: '--gfa' }}
        />

        <ThemeStylePropertyBlock label="Font Family">
          <span className={css(ut.flxc)}>
            <ResetStyle
              id="g-fnt"
              stateObjName="themeVars"
              propertyPath="--g-font-family"
            />
            <FontPicker id="global-font-fmly" />
          </span>
        </ThemeStylePropertyBlock>
        <ThemeStylePropertyBlock label="Field Sizes">

          <div className={css(ut.flxc)}>
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
          </div>
        </ThemeStylePropertyBlock>

      </SimpleAccordion>

      <SimpleAccordion
        key="label-quick-customizers"
        id="label-quick-customizers"
        title="Label"
        className={css(style.sectionAccordion)}
      // open
      >
        <SimpleColorPicker
          title="Text Color"
          subtitle="Label Text Color"
          value={fldLblColor}
          stateObjName="themeColors"
          propertyPath="--fld-lbl-c"
          modalId="fld-lbl-c"
        />

        <FontSizeControl
          stateObjName="themeVars"
          propertyPath="--fld-lbl-fs"
          id="fld-lbl-fs"
        />

        <ThemeStylePropertyBlock label="Alignment">
          <LabelControl id="align" />
        </ThemeStylePropertyBlock>

      </SimpleAccordion>

      <SimpleAccordion
        key="input-quick-customizers"
        id="input-quick-customizers"
        title="Input Field"
        className={css(style.sectionAccordion)}
      // open
      >
        <SimpleColorPicker
          title="Background Color"
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

        <SimpleColorPicker
          title="Text Color"
          subtitle="Input Text Color"
          value={fldInpColor}
          stateObjName="themeColors"
          propertyPath="--fld-inp-c"
          modalId="fld-c"
          hslaPaths={{ h: '--fic-h', s: '--fic-s', l: '--fic-l', a: '--fic-a' }}
        />

        <FontSizeControl
          stateObjName="themeVars"
          propertyPath="--fld-fs"
          id="fld-fs"
        />
      </SimpleAccordion>

      <SimpleAccordion
        key="others-quick-customizers"
        id="others-quick-customizers"
        title="Others"
        className={css(style.sectionAccordion)}
      // open
      >
        <ThemeStylePropertyBlock label="Direction Right To Left (RTL)">
          <SingleToggle id="rtl" isChecked={direction === 'rtl'} action={handleDir} />
        </ThemeStylePropertyBlock>

        <ThemeStylePropertyBlock label="Add !important rule to all styles">
          <div className={css(ut.flxcb)}>
            <Cooltip className={css({ mr: 5 })}>
              {__('Add important rule to all styles to override the conflicting styles in frontend.')}
            </Cooltip>
            <SingleToggle id="important-rule" action={handleImportantStyles} isChecked={addImportantRuleToStyles} />
          </div>
        </ThemeStylePropertyBlock>

        <ThemeStylePropertyBlock label="Atomic Class Prefix">
          <div className={css(ut.flxcb)}>
            <Cooltip className={css({ mr: 5 })}>
              {__('Add prefix to atomic class names to avoid conflicts.')}
            </Cooltip>
            <input
              className={css(style.preview_wrp, style.input)}
              placeholder="e.g. bf"
              value={atomicClassPrefix}
              onChange={e => handleClassPrefix(e.target.value)}
              onBlur={() => handleClassPrefix(atomicClassPrefix.trim())}
            />
          </div>

        </ThemeStylePropertyBlock>
      </SimpleAccordion>

    </div>

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

const style = {
  sectionWrapper: {
    // p: '5px 10px 20px',
  },
  previewLabel: {
    // flx: 'center',
    ow: 'hidden',
    to: 'ellipsis',
    ws: 'nowrap',
    mr: 5,
    w: 100,
  },
  sectionAccordion: {
    bb: '1px solid var(--bf-stroke-clr)',

    py: 10,
    // mb: 10,
    '& .btgl': {
      p: '0 5px',
      curp: 1,
    },
    '& .title': {
      cr: 'var(--bf-text-clr-dark)',
      fs: 'var(--bf-font-base)',
    },
    '& .body': {
      px: 10,
      pb: 10,
    },
  },
  preview_wrp: {
    cr: 'var(--bf-text-clr-dark)',
    bd: 'var(--white-0-95)',
    w: 130,
    mnw: 130,
    brs: 'var(--bf-bdr-radius-sm)',
    px: 5,
    py: 3,
    flx: 'center-between',
    h: 30,
    fw: 500,
    ':hover': { bs: '0 0 0 1px var(--white-0-83)' },
    ta: 'left',
    pl: 5,
    b: 'none',
    // curp: 1,
    // dy: 'block',
    ':focus': { bs: '0 0 0 1px var(--b-50) !important', bcr: 'var(--b-50)!important' },
    '::placeholder': { fs: 12 },
  },
  clrVal: {
    w: 70,
    textOverflow: 'ellipsis',
    ta: 'left',
    ow: 'hidden',
  },
  // active: { focusShadow: 1 },
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
