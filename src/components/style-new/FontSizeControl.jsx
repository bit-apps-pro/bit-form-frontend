/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import SizeControl from '../CompSettings/StyleCustomize/ChildComp/SizeControl'
import ResetStyle from './ResetStyle'
import { assignNestedObj, getNumFromStr, getStrFromStr, getValueByObjPath, getValueFromStateVar, unitConverter } from './styleHelpers'
import ThemeStylePropertyBlock from './ThemeStylePropertyBlock'

export default function FontSizeControl({ stateObjName, propertyPath, id }) {
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const [styles, setStyle] = useAtom($styles)
  const { fieldKey, element } = useParams()
  const { css } = useFela()

  const getFontValAndUnit = () => {
    let fs
    if (stateObjName === 'themeVars') {
      fs = themeVars[propertyPath]
    } else {
      fs = getValueByObjPath(styles, propertyPath)
    }
    while (fs?.match?.(/(var)/g)?.[0] === 'var') {
      fs = getValueFromStateVar(themeVars, fs)
    }
    const val = getNumFromStr(fs)
    const unt = getStrFromStr(fs)
    return [val, unt]
  }
  const [fldFSValue, fldFSUnit] = getFontValAndUnit()

  const updateHandler = (value, unit, globalVarUnit) => {
    const convertvalue = unitConverter(unit, value, globalVarUnit)
    const v = `${convertvalue}${unit || globalVarUnit}`
    switch (stateObjName) {
      case 'themeVars':
        setThemeVars(prvStyle => create(prvStyle, drft => {
          drft[propertyPath] = v
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, propertyPath, v, { themeVars: getLatestState('themeVars') }))
        break
      case 'styles':
        setStyle(prvStyle => create(prvStyle, drft => {
          assignNestedObj(drft, propertyPath, v)
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, propertyPath, v, { styles: getLatestState('styles') }))
        break
      default:
        break
    }
  }
  const fldFsSizeHandler = ({ value, unit }) => updateHandler(value, unit, fldFSUnit)

  return (
    <ThemeStylePropertyBlock label="Font Size">
      <div className={css(ut.flxc)}>
        <ResetStyle id={id} propertyPath={propertyPath} stateObjName={stateObjName} />
        <SizeControl
          inputHandler={fldFsSizeHandler}
          sizeHandler={({ unitKey, unitValue }) => fldFsSizeHandler({ unit: unitKey, value: unitValue })}
          value={fldFSValue}
          unit={fldFSUnit}
          width="128px"
          options={['px', 'em', 'rem']}
          dataTestId={id}
        />
      </div>
    </ThemeStylePropertyBlock>
  )
}
