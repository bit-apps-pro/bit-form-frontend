/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import SizeControl from '../CompSettings/StyleCustomize/ChildComp/SizeControl'
import BorderControl from './BorderControl'
import FilterColorPicker from './FilterColorPicker'
import FilterController from './FilterController'
import ResetStyle from './ResetStyle'
import ShadowControl from './ShadowControl'
import SpacingControl from './SpacingControl'
import { getNumFromStr, getStrFromStr, unitConverter } from './styleHelpers'
import ThemeStylePropertyBlock from './ThemeStylePropertyBlock'

export default function IcnCustomizer({ elementKey }) {
  const { css } = useFela()
  const { element, fieldKey } = useParams()
  const themeColors = useAtomValue($themeColors)
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const weightVar = `--${elementKey}-w`
  const heightVar = `--${elementKey}-h`

  const title = () => {
    const value = elementKey.match(/(pre|suf)/gi)?.[0]
    if (value === 'pre') return 'Leading'
    if (value === 'suf') return 'Trailing'
  }

  const icnValue = (varName) => getNumFromStr(themeVars[varName])
  const icnUnit = (varName) => getStrFromStr(themeVars[varName])

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

  const preIconSpacingObj = {
    object: 'themeVars',
    paths: {
      margin: `--${elementKey}-m`,
      padding: `--${elementKey}-p`,
    },
  }
  const preIcnShObj = {
    object: 'themeColors',
    paths: { shadow: `--${elementKey}-sh` },
  }
  const preIcnFltrObj = {
    object: 'themeColors',
    paths: { filter: `--${elementKey}-fltr` },
  }

  const borderPathsObj = [
    {
      object: 'themeVars',
      paths: {
        'border-style': `--${elementKey}-bdr`,
        'border-width': `--${elementKey}-bdr-width`,
        'border-radius': `--${elementKey}-bdr-rad`,
      },
    },
    {
      object: 'themeColors',
      paths: { 'border-color': `--${elementKey}-bdr-clr` },
    },
  ]

  const { [`--${elementKey}-clr`]: fltrColorValue } = themeColors

  return (
    <div className={css(ut.m10)}>
      <ThemeStylePropertyBlock label="Border">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={[`--${elementKey}-bdr-width`, `--${elementKey}-bdr-rad`]}
            stateObjName="themeVars"
            id={`${elementKey}-bdr`}
          />
          <BorderControl
            subtitle={`${title()} Icon Border`}
            objectPaths={borderPathsObj}
            id={`${elementKey}-bdr`}
          />
        </div>
      </ThemeStylePropertyBlock>

      <FilterColorPicker
        title="Color"
        subtitle="Icon Fill Color"
        value={fltrColorValue}
        stateObjName="themeColors"
        propertyPath={`--${elementKey}-clr`}
        objectPaths={{
          object: 'themeColors',
          paths: {
            'icon-color': `--${elementKey}-clr`,
            filter: `--${elementKey}-fltr`,
          },
        }}
        modalId={`--${elementKey}-fltr`}
      />
      <ThemeStylePropertyBlock label="Filter">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={`--${elementKey}-fltr`}
            stateObjName="themeColors"
            id={`${elementKey}-fltr`}
          />
          <FilterController
            action={{ type: 'filter-control' }}
            subtitle={`${title()} Filter`}
            objectPaths={preIcnFltrObj}
            id="filter-control"
          />
        </div>
      </ThemeStylePropertyBlock>

      <ThemeStylePropertyBlock label="Spacing">
        <SpacingControl
          action={{ type: 'spacing-control' }}
          subtitle={`${title()} Icon Spacing`}
          objectPaths={preIconSpacingObj}
          id="pre-i-spacing-control"
        />
      </ThemeStylePropertyBlock>

      <ThemeStylePropertyBlock label="Shadow">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={preIcnShObj.paths.shadow}
            stateObjName={preIcnShObj.object}
            id={`${elementKey}-sh`}
          />
          <ShadowControl
            subtitle={`${title()} Icon Shadow`}
            value={themeColors[`--${elementKey}-sh`]}
            objectPaths={preIcnShObj}
            id={`${elementKey}-sh`}
          />
        </div>
      </ThemeStylePropertyBlock>

      <ThemeStylePropertyBlock label="Height">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={heightVar}
            stateObjName="themeVars"
            id={`${elementKey}-h`}
          />
          <SizeControl
            width="128px"
            value={Number(icnValue(heightVar))}
            unit={icnUnit(heightVar)}
            inputHandler={({ value, unit }) => icnSizeHandler({ v: value, u: unit }, heightVar)}
            sizeHandler={({ unitKey, unitValue }) => unitHandler(unitKey, unitValue, heightVar)}
            options={['px', 'em', 'rem', '%']}
            dataTestId={`${elementKey}-h`}
          />
        </div>
      </ThemeStylePropertyBlock>

      <ThemeStylePropertyBlock label="Width">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={weightVar}
            stateObjName="themeVars"
            id={`${elementKey}-w`}
          />
          <SizeControl
            width="128px"
            value={Number(icnValue(weightVar))}
            unit={icnUnit(weightVar)}
            inputHandler={({ value, unit }) => icnSizeHandler({ v: value, u: unit }, weightVar)}
            sizeHandler={({ unitKey, unitValue }) => unitHandler(unitKey, unitValue, weightVar)}
            options={['px', 'em', 'rem', '%']}
            dataTestId={`${elementKey}-w`}
          />
        </div>
      </ThemeStylePropertyBlock>

    </div>
  )
}
