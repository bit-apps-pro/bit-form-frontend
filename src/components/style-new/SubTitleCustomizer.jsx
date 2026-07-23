import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import ut from '../../styles/2.utilities'
import BorderControl from './BorderControl'
import FontSizeControl from './FontSizeControl'
import FontWeightAndStyleControl from './FontWeightAndStyleControl'
import ResetStyle from './ResetStyle'
import ShadowControl from './ShadowControl'
import SimpleColorPicker from './SimpleColorPicker'
import SpacingControl from './SpacingControl'
import ThemeStylePropertyBlock from './ThemeStylePropertyBlock'

export default function SubTitleCustomizer() {
  const { css } = useFela()
  const themeColors = useAtomValue($themeColors)

  const { '--sub-titl-sh': stSh,
    '--sub-titl-c': stC,
    '--sub-titl-bg': stBg } = themeColors

  return (
    <div className={css(ut.m10)}>
      <SimpleColorPicker
        title="Background Color"
        subtitle="Subtitle Background Color"
        value={stBg}
        stateObjName="themeColors"
        propertyPath="--sub-titl-bg"
        modalId="sub-titl-bg"
      />

      <ThemeStylePropertyBlock label="Border">
        <div className={css(ut.flxc)}>
          <ResetStyle
            // propertyPath={['--sub-titl-bdr', '--sub-titl-bdr-width', '--sub-titl-bdr-rad']}
            propertyPath={['--sub-titl-bdr-width', '--sub-titl-bdr-rad']}
            stateObjName="themeVars"
            id="sub-titl-bdr"
          />
          <BorderControl
            subtitle="Subtitle Border"
            objectPaths={borderPathsObj}
            id="sub-titl-bdr"
          />
        </div>
      </ThemeStylePropertyBlock>

      <FontSizeControl
        stateObjName="themeVars"
        propertyPath="--sub-titl-fs"
        id="sub-titl-fs"
      />

      <FontWeightAndStyleControl
        fontWeightVar="--sub-titl-font-w"
        fontStyleVar="--sub-titl-font-style"
        id="sub-titl-font"
      />

      <ThemeStylePropertyBlock label="Shadow">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={subTitlShObj.paths.shadow}
            stateObjName={subTitlShObj.object}
            id="sub-titl-sh"
          />
          <ShadowControl
            subtitle="Subtitle Shadow"
            value={stSh}
            objectPaths={subTitlShObj}
            id="sub-titl-sh"
          />
        </div>
      </ThemeStylePropertyBlock>

      <ThemeStylePropertyBlock label="Spacing">
        <SpacingControl
          action={{ type: 'spacing-control' }}
          subtitle="Subtitle Spacing"
          objectPaths={stSpacingObj}
          id="subtitl-spacing-ctrl"
        />
      </ThemeStylePropertyBlock>

      <SimpleColorPicker
        title="Text Color"
        subtitle="Subtitle Text Color"
        value={stC}
        stateObjName="themeColors"
        propertyPath="--sub-titl-c"
        modalId="sub-titl-c"
      />
    </div>
  )
}
const stSpacingObj = {
  object: 'themeVars',
  paths: { margin: '--sub-titl-m', padding: '--sub-titl-p' },
}

const subTitlShObj = {
  object: 'themeColors',
  paths: { shadow: '--sub-titl-sh' },
}

const borderPathsObj = [
  {
    object: 'themeVars',
    paths: {
      'border-style': '--sub-titl-bdr',
      'border-width': '--sub-titl-bdr-width',
      'border-radius': '--sub-titl-bdr-rad',
    },
  },
  {
    object: 'themeColors',
    paths: { 'border-color': '--sub-titl-bdr-clr' },
  },
]
