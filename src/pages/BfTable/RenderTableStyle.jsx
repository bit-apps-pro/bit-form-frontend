import { useAtomValue } from 'jotai'
import { $frontendTable } from '../../GlobalStates/GlobalStates'
import { jsObjtoCssStr } from '../../components/style-new/styleHelpers'

export default function RenderTableStyle() {
  const bfTable = useAtomValue($frontendTable)
  const stylesObj = bfTable?.table_styles?.style || {}
  const styleStr = jsObjtoCssStr(stylesObj)
  return (
    <style>
      {styleStr}
    </style>
  )
}
