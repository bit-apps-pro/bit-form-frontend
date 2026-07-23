import { useAtomValue } from 'jotai'
import { $customCodes } from '../../GlobalStates/GlobalStates'

// Rendered last in the builder iframe portal so user custom CSS wins on equal
// specificity over field styles (each field emits its own <RenderStyle/> earlier
// in the DOM). Raw CSS string — do NOT pass through json2CssStr.
export default function RenderCustomCSS() {
  const customCodes = useAtomValue($customCodes)
  if (!customCodes?.CSS) return null
  return <style data-bf-custom-css>{customCodes.CSS}</style>
}
