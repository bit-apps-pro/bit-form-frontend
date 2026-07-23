import { useAtom } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { $bits } from '../../GlobalStates/GlobalStates'
import { pdfFontList } from '../../Utils/StaticData/pdfConfigurationData'
import ProOverlay from '../Utilities/ProOverlay'
import SnackMsg from '../Utilities/SnackMsg'
import FontBlock from './FontBlock'

export default function PdfFontList() {
  const [snack, setSnackbar] = useState({ show: false })
  const [bits, setBits] = useAtom($bits)
  const { isPro } = bits
  const { css } = useFela()
  return (
    <div className="btcd-captcha mb-4">
      <div className="pos-rel">
        {!isPro && <ProOverlay style={{ height: '105%', marginTop: 0, width: '100%' }} />}
        <SnackMsg snack={snack} setSnackbar={setSnackbar} />

        <div className={css(styleFontList.wrp)}>
          {Object.keys(pdfFontList).map((label) => (
            <div key={label}>
              <h3 className={css({ m: '5px 0px 10px 0px', bb: '1px solid rgb(157 153 153)' })}>{label}</h3>
              {pdfFontList[label].map((font, index) => (
                <FontBlock key={`font-${index + 1}`} font={font} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const styleFontList = {
  wrp: {
    h: '80vh',
    owy: 'scroll',
    w: '500px',
    pr: 10,
  },
}
