import { useAtom } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { $bits } from '../../GlobalStates/GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import { pdfFontList } from '../../Utils/StaticData/pdfConfigurationData'
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
        {!isPro && (
          <div className="pro-blur flx" style={{ height: '110%', left: -15, width: '104%', top: -3 }}>
            <div className="pro">
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  {' '}
                  {__('Available On Pro')}
                </span>
              </a>
            </div>
          </div>
        )}
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
