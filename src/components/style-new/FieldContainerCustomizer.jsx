import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import ut from '../../styles/2.utilities'
import BorderControl from './BorderControl'
import ResetStyle from './ResetStyle'
import ShadowControl from './ShadowControl'
import SimpleColorPicker from './SimpleColorPicker'
import SpacingControl from './SpacingControl'
import ThemeStylePropertyBlock from './ThemeStylePropertyBlock'

export default function FieldContainerCustomizer() {
  const themeColors = useAtomValue($themeColors)
  const themeVars = useAtomValue($themeVars)
  const { css } = useFela()

  const { '--fld-wrp-m': wrpMagin,
    '--fld-wrp-p': wrpPadding } = themeVars

  const { '--fld-wrp-bg': fwBg,
    '--fld-wrp-sh': fwSh } = themeColors

  return (
    <div className={css(ut.m10)}>
      <SimpleColorPicker
        title="Background colors"
        subtitle="Field Background Color"
        value={fwBg}
        stateObjName="themeColors"
        propertyPath="--fld-wrp-bg"
        modalId="fld-cnr-bg-cuser"
      />
      <ThemeStylePropertyBlock label="Spacing">
        <SpacingControl
          value={{ margin: wrpMagin, padding: wrpPadding }}
          action={{ type: 'spacing-control' }}
          subtitle="Spacing control"
          objectPaths={fldWrapperObj}
          id="fld-spacing-ctrl"
        />
      </ThemeStylePropertyBlock>
      <ThemeStylePropertyBlock label="Shadow">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={fldwrpShPathObj.paths.shadow}
            stateObjName={fldwrpShPathObj.object}
            id="fld-wrp-sh-reset"
          />
          <ShadowControl
            subtitle="Field Container Shadow"
            value={fwSh}
            objectPaths={fldwrpShPathObj}
            id="fld-wrp-sh"
          />
        </div>
      </ThemeStylePropertyBlock>
      <ThemeStylePropertyBlock label="Border">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={['--fld-wrp-bdr-width', '--fld-wrp-bdr-rad']}
            stateObjName="themeVars"
            id="fld-wrp-bdr"
          />
          <BorderControl
            subtitle="Field Container Border"
            objectPaths={borderPathsObj}
            id="fld-wrp-bdr"
          />
        </div>
      </ThemeStylePropertyBlock>
    </div>
  )
}

const fldWrapperObj = {
  object: 'themeVars',
  paths: { margin: '--fld-wrp-m', padding: '--fld-wrp-p' },
}
const fldwrpShPathObj = {
  object: 'themeColors',
  paths: { shadow: '--fld-wrp-sh' },
}

const borderPathsObj = [
  {
    object: 'themeVars',
    paths: {
      'border-style': '--fld-wrp-bdr',
      'border-width': '--fld-wrp-bdr-width',
      'border-radius': '--fld-wrp-bdr-rad',
    },
  },
  {
    object: 'themeColors',
    paths: { 'border-color': '--fld-wrp-bdr-clr' },
  },
]
