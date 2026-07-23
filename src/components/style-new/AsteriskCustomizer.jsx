/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../GlobalStates/GlobalStates'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import TxtAlignLeftIcn from '../../Icons/TxtAlignLeftIcn'
import TxtAlignRightIcn from '../../Icons/TxtAlignRightIcn'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import SizeControl from '../CompSettings/StyleCustomize/ChildComp/SizeControl'
import StyleSegmentControl from '../Utilities/StyleSegmentControl'
import FontSizeControl from './FontSizeControl'
import FontWeightAndStyleControl from './FontWeightAndStyleControl'
import ResetStyle from './ResetStyle'
import SimpleColorPicker from './SimpleColorPicker'
import SpacingControl from './SpacingControl'
import { getNumFromStr, getStrFromStr, unitConverter } from './styleHelpers'
import ThemeStylePropertyBlock from './ThemeStylePropertyBlock'

export default function AsteriskCustomizer() {
  const { css } = useFela()
  const { element, fieldKey } = useParams()
  const themeColors = useAtomValue($themeColors)
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const [fields, setFields] = useAtom($fields)

  const lhVar = '--req-smbl-lh'
  const { '--req-smbl-c': flc } = themeColors

  const updateState = (varName, value = '') => {
    setThemeVars(prvStyle => create(prvStyle, drftStyle => {
      drftStyle[varName] = value
    }))
    addToBuilderHistory(generateHistoryData(element, fieldKey, varName, value, { themeVars: getLatestState('themeVars') }))
  }

  const unitHandler = (unit, value, name) => {
    const preUnit = getStrFromStr(themeVars[name])
    const convetVal = unitConverter(unit, value, preUnit)
    const val = `${convetVal}${unit}`
    updateState(name, val)
  }

  const icnSizeHandler = ({ v, u }, prop) => {
    const val = `${v}${u}`
    updateState(prop, val)
  }

  const setAsteriskPos = (posValue) => {
    if (posValue === 'left') {
      setThemeVars(prvStyle => create(prvStyle, drftStyle => {
        drftStyle['--fld-lbl-pn'] = 'relative'
        drftStyle['--req-smbl-pn'] = 'absolute'
        drftStyle['--req-smbl-rt'] = 'unset'
        drftStyle['--req-smbl-lt'] = '0px'
      }))
    } else if (posValue === 'right') {
      setThemeVars(prvStyle => create(prvStyle, drftStyle => {
        drftStyle['--fld-lbl-pn'] = 'relative'
        drftStyle['--req-smbl-pn'] = 'absolute'
        drftStyle['--req-smbl-rt'] = '0px'
        drftStyle['--req-smbl-lt'] = 'unset'
      }))
    } else {
      setThemeVars(prvStyle => create(prvStyle, drftStyle => {
        drftStyle['--fld-lbl-pn'] = 'unset'
        drftStyle['--req-smbl-pn'] = 'unset'
        drftStyle['--req-smbl-rt'] = 'unset'
        drftStyle['--req-smbl-lt'] = 'unset'
      }))

      setFields(prevFields => create(prevFields, draftFields => {
        Object.keys(fields).map(fldKey => {
          draftFields[fldKey].valid.reqPos = posValue
        })
      }))
    }
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Asterisk Position', posValue, { fields: getLatestState('fields'), themeVars: getLatestState('themeVars') }))
  }

  return (
    <div className={css(ut.m10)}>
      <SimpleColorPicker
        title="Color"
        subtitle="Asterisk Color"
        value={flc}
        stateObjName="themeColors"
        propertyPath="--req-smbl-c"
        modalId="req-smbl-c"
      />

      <ThemeStylePropertyBlock label="Spacing">
        <SpacingControl
          action={{ type: 'spacing-control' }}
          subtitle="Label Spacing"
          objectPaths={flSpacingObj}
          id="lbl-spacing-control"
        />
      </ThemeStylePropertyBlock>

      <FontWeightAndStyleControl
        fontWeightVar="--req-smbl-fw"
        fontStyleVar="--lbl-font-style"
        id="req-smbl"
      />

      <FontSizeControl
        stateObjName="themeVars"
        propertyPath="--req-smbl-fs"
        id="req-smbl-fs"
      />

      <ThemeStylePropertyBlock label="Line Height">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={lhVar}
            stateObjName="themeVars"
            id="req-smbl-lh"
          />
          <SizeControl
            width="128px"
            value={Number(getNumFromStr(themeVars[lhVar]))}
            unit={getStrFromStr(themeVars[lhVar]) || 'px'}
            inputHandler={({ value, unit }) => icnSizeHandler({ v: value, u: unit }, lhVar)}
            sizeHandler={({ unitKey, unitValue }) => unitHandler(unitKey, unitValue, lhVar)}
            options={['px', 'em', 'rem', '%']}
            dataTestId="req-smbl-lh"
          />
        </div>
      </ThemeStylePropertyBlock>

      <ThemeStylePropertyBlock label="Asterisk Position">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={lhVar}
            stateObjName="themeVars"
            id="req-smbl-lh"
          />
          <StyleSegmentControl
            className={css({ w: 128 })}
            show={['icn']}
            tipPlace="bottom"
            options={[
              { icn: <TxtAlignLeftIcn size="17" />, label: 'left', tip: 'left' },
              { icn: <TxtAlignLeftIcn size="17" />, label: 'before', tip: 'before' },
              { icn: <TxtAlignRightIcn size="17" />, label: 'after', tip: 'after' },
              { icn: <TxtAlignRightIcn size="17" />, label: 'right', tip: 'right' },
            ]}
            onChange={value => setAsteriskPos(value)}
            defaultActive="after"
          />
        </div>
      </ThemeStylePropertyBlock>
    </div>
  )
}

const flSpacingObj = {
  object: 'themeVars',
  paths: { margin: '--req-smbl-m', padding: '--req-smbl-p' },
}
