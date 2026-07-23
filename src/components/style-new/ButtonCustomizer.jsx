/* eslint-disable object-curly-newline */
import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import ut from '../../styles/2.utilities'
import BackgroundControl from './BackgroundControl'
import BorderControl from './BorderControl'
import FontSizeControl from './FontSizeControl'
import FontWeightAndStyleControl from './FontWeightAndStyleControl'
import ResetStyle from './ResetStyle'
import ShadowControl from './ShadowControl'
import SimpleColorPicker from './SimpleColorPicker'
import SpacingControl from './SpacingControl'
import ThemeStylePropertyBlock from './ThemeStylePropertyBlock'

export default function ButtonCustomizer() {
  const { css } = useFela()
  const themeColors = useAtomValue($themeColors)

  const { // '--btn-bgc': btnBgc,
    '--btn-bg': btnBg,
    '--btn-c': btnC,
    '--btn-sh': btnSh } = themeColors

  return (
    <div className={css(ut.m10)}>
      {/* <SimpleColorPicker
        title="Background Color"
        subtitle="Button Background Color"
        value={btnBgc}
        stateObjName="themeColors"
        propertyPath="--btn-bgc"
        modalId="btn-bgc"
      /> */}

      <BackgroundControl
        title="Background"
        subtitle="Button Background (Gradiant)"
        value={btnBg}
        stateObjName="themeColors"
        objectPaths={{
          object: 'themeColors',
          paths: {},
        }}
        propertyPath="--btn-bg"
        modalId="btn-bg"
      />

      <ThemeStylePropertyBlock label="Border">
        <div className={css(ut.flxc)}>
          {/* <ResetStyle propertyPath={['--err-bdr', '--err-bdr-width', '--err-bdr-rad']} stateObjName="themeVars" /> */}
          <ResetStyle
            propertyPath={['--btn-bdr-width', '--btn-bdr-rad']}
            stateObjName="themeVars"
            id="btn-bdr"
          />
          <BorderControl
            subtitle="Button Border"
            objectPaths={borderPathsObj}
            id="btn-bdr"
          />
        </div>
      </ThemeStylePropertyBlock>

      <FontSizeControl
        stateObjName="themeVars"
        propertyPath="--btn-fs"
        id="btn-fs"
      />

      <FontWeightAndStyleControl
        fontWeightVar="--btn-fw"
        fontStyleVar="--btn-f-style"
        id="btn-font"
      />

      <ThemeStylePropertyBlock label="Shadow">
        <div className={css(ut.flxc)}>
          <ResetStyle
            propertyPath={btnShObj.paths.shadow}
            stateObjName={btnShObj.object}
            id="btn-sh"
          />
          <ShadowControl
            subtitle="Button Shadow"
            value={btnSh}
            objectPaths={btnShObj}
            id="btn-sh"
          />
        </div>
      </ThemeStylePropertyBlock>

      <ThemeStylePropertyBlock label="Spacing">
        <SpacingControl
          action={{ type: 'spacing-control' }}
          subtitle="Button Spacing"
          objectPaths={btnMsgSpacingObj}
          id="btn-spacing-ctrl"
        />
      </ThemeStylePropertyBlock>

      <SimpleColorPicker
        title="Text Color"
        subtitle="Button Text Color"
        value={btnC}
        stateObjName="themeColors"
        propertyPath="--btn-c"
        modalId="btn-c"
      />

    </div>
  )
}
const btnMsgSpacingObj = {
  object: 'themeVars',
  paths: { margin: '--btn-m', padding: '--btn-p', shadow: '--btn-sh' },
}

const btnShObj = {
  object: 'themeColors',
  paths: { shadow: '--btn-sh' },
}

const borderPathsObj = [
  {
    object: 'themeVars',
    paths: {
      'border-style': '--btn-bdr',
      'border-width': '--btn-bdr-width',
      'border-radius': '--btn-bdr-rad',
    },
  },
  {
    object: 'themeColors',
    paths: { 'border-color': '--btn-bdr-clr' },
  },
]
