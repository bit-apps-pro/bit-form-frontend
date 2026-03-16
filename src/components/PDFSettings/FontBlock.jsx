import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { $bits } from '../../GlobalStates/GlobalStates'
import FontIcn from '../../Icons/FontIcn'
import bitsFetch from '../../Utils/bitsFetch'
import LoaderSm from '../Loaders/LoaderSm'
import Btn from '../Utilities/Btn'
import SnackMsg from '../Utilities/SnackMsg'

export default function FontBlock({ font }) {
  const { css } = useFela()
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const [bits, setBits] = useAtom($bits)
  const isDownloaded = bits.downloadedPdfFonts.includes(font.name)

  const handleDownloadFont = fontName => {
    setIsLoading(true)
    bitsFetch({ fontName }, 'bitforms_download_pdf_font')
      .then(res => {
        if (res !== undefined && res.success) {
          setBits(prvState => create(prvState, draft => {
            const getFont = prvState.downloadedPdfFonts
            console.log(getFont, fontName)
            if (getFont && !getFont?.includes(fontName)) {
              draft.downloadedPdfFonts.push(fontName)
            } else {
              draft.downloadedPdfFonts = [fontName]
            }
          }))
        }
        setSnackbar({ show: true, msg: `${res.data.message}` })
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setSnackbar({ show: true, msg: 'Something went wrong!' })
        setIsLoading(false)
      })
  }
  return (
    <div className={`${css(styleFontList.block)} w-10`}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className={css(styleFontList.name)}>
        <div className={css({ mr: 10 })}>
          <FontIcn size="18" />
        </div>
        <div>{font.name}</div>
      </div>
      <Btn
        size="sm"
        onClick={() => handleDownloadFont(font.name)}
        variant={isDownloaded ? 'success' : 'primary'}
      >
        {isDownloaded ? 'Downloaded' : 'Download'}
        {' '}
        {isLoading && (
          <LoaderSm
            size={14}
            clr="#fff"
            className="ml-2"
          />
        )}
      </Btn>
    </div>
  )
}

const styleFontList = {
  block: {
    flx: 'center-between',
    b: '1px solid #e0e0e0',
    p: '5px',
    brs: '8px',
    mb: '5px',
    ':hover': {
      b: '1px solid rgb(0, 123, 255)',
      tn: 'all 0.2s ease 0s',
    },
  },
  name: {
    flx: 'align-center',
  },
}
