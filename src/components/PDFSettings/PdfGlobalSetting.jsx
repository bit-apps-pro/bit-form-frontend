/* eslint-disable react/no-array-index-key */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { $bits } from '../../GlobalStates/GlobalStates'
import { IS_PRO } from '../../Utils/Helpers'
import { pageSizes, pdfFontList } from '../../Utils/StaticData/pdfConfigurationData'
import bitsFetch from '../../Utils/bitsFetch'
import { getPdfFontObj } from '../../Utils/globalHelpers'
import { __ } from '../../Utils/i18nwrap'
import useSWROnce from '../../hooks/useSWROnce'
import LoaderSm from '../Loaders/LoaderSm'
import { compareVersions } from '../Template/templateHelpers'
import Btn from '../Utilities/Btn'
import CheckBox from '../Utilities/CheckBox'
import SnackMsg from '../Utilities/SnackMsg'
import { assignNestedObj } from '../style-new/styleHelpers'

export default function PdfGlobalSetting() {
  const [bits, setBits] = useAtom($bits)
  const { isPro } = bits
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setisLoading] = useState(false)

  const [pdfSetting, setPdfSetting] = useState({
    paperSize: 'a4',
    orientation: 'p',
    // font: 'AboriginalSansREGULAR.ttf',
    font: {
      name: 'DejaVuSansCondensed',
      fontFamily: 'dejavusanscondensed',
    },
    fontSize: 10,
    fontColor: '#000000',
    direction: 'ltr',
    fontFamily: 'aboriginalsansregular',
    pdfFileName: 'bitform',
    watermark: {
      // active: 'txt',
      // alpha: 20,
      // txt: 'Biform',
      // img: {
      //   src: 'link',
      //   width: null,
      //   height: null,
      //   posX: null,
      //   posY: null,
      //   imgBehind: false,
      // },
    },
  })

  const { mutate } = useSWROnce('bitforms_get_pdf_setting', {}, {
    fetchCondition: IS_PRO,
    onSuccess: (data) => {
      if (data?.integration_details) {
        const tmp = JSON.parse(data.integration_details)
        tmp.id = data.id
        setPdfSetting(tmp)
      }
    },
  })

  const { css } = useFela()

  const handleInput = (typ, val) => {
    let tempValue = val
    setPdfSetting(prvState => create(prvState, draft => {
      if (typ === 'font') {
        const fontObj = getPdfFontObj(val)
        tempValue = fontObj
      }
      assignNestedObj(draft, typ, tempValue)
    }))
  }

  const watermarkHandler = (e, value) => {
    // checked
    setPdfSetting(prvState => create(prvState, draft => {
      if (e.target.checked) {
        draft.watermark.active = value
      } else {
        delete draft.watermark.active
      }
    }))
  }

  const saveConfig = () => {
    if (!isPro) return
    const fontObj = getPdfFontObj(pdfSetting.font.name)
    pdfSetting.fontFamily = fontObj.fontFamily

    if (pdfSetting.watermark?.active === 'txt') {
      delete pdfSetting.watermark.img
    }

    if (pdfSetting.watermark?.active === 'img') {
      delete pdfSetting.watermark.txt
    }

    const tempSetting = { ...pdfSetting }
    setisLoading(true)

    bitsFetch({ pdfSetting }, 'bitforms_save_pdf_setting')
      .then(res => {
        if (res !== undefined && res.success) {
          if (res.data && res.data.id) {
            tempSetting.id = res.data.id
          }
          setBits(prvState => create(prvState, draft => {
            draft.allFormSettings.pdf = tempSetting
            draft.downloadedPdfFonts.push(tempSetting.font.name)
          }))
          setPdfSetting(tempSetting)
          mutate(tempSetting)
        }
        setSnackbar({ show: true, msg: `${res.data.message}` })
        setisLoading(false)
      })
  }

  const setWpMedia = () => {
    if (typeof wp !== 'undefined' && wp.media) {
      const wpMediaMdl = wp.media({
        title: 'Media',
        button: { text: 'Select picture' },
        library: { type: 'image' },
        multiple: false,
      })

      wpMediaMdl.on('select', () => {
        const { url } = wpMediaMdl.state().get('selection').first().toJSON()
        const tempSetting = create(pdfSetting, draft => {
          assignNestedObj(draft, 'watermark->img->src', url)
        })

        setPdfSetting(tempSetting)
      })

      wpMediaMdl.open()
    }
  }

  const checkPhpExtension = () => {
    const requiredExtensions = ['mbstring', 'gd', 'zlib', 'xml']
    const missingExtensions = []
    requiredExtensions.forEach((ext) => {
      if (!bits?.serverInfo?.loaded_extensions?.includes(ext)) {
        missingExtensions.push(ext)
      }
    })
    return missingExtensions
  }

  return (
    <div className="btcd-captcha mb-4 pr-2">
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
        <small className="d-blk mt-3">
          <a
            className="btcd-link"
            href="https://bitapps.pro/docs/bit-form/pdf-attachment/"
            target="_blank"
            rel="noreferrer"
          >
            {__('Learn more about PDF Attachment')}
          </a>
        </small>
        {/* <h2>{__('Global PDF Setting')}</h2> */}
        <p className={css({ fs: 15, mxw: 'max(90%,700px)' })}>
          <strong>{__('Note:')}</strong>
          {' '}
          {__('This global settings will be set as the default for any new PDF attachment generated from your forms.')}
          {' '}
          <strong>{__('Remember,')}</strong>
          {' '}
          {__('If you haven\'t used PDFs yet, you\'ll need to click the "Save" button to apply these global PDF settings. You can also customize settings for a specific PDF template by accessing the PDF templates in your form settings.')}
          {!compareVersions(bits.serverInfo.php_version, '7.4') && (
            <span style={{ color: 'red' }}>
              {' '}
              {__('Please update your PHP version is 7.4 or higher.')}
            </span>
          )}
          {checkPhpExtension().length > 0 && (
            <span style={{ color: 'red' }}>
              {' '}
              {checkPhpExtension().join(', ')}
              {' '}
              {__(' PHP extension is missing in your server. Please install it.')}
            </span>
          )}
        </p>
        <div className="btcd-hr" />

        <div className="w-5">
          <div className="mt-2">
            <label htmlFor="paper_size">
              <b>{__('Paper Size')}</b>
              <select
                id="paper_size"
                name="paperSize"
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                value={pdfSetting.paperSize}
                className="btcd-paper-inp mt-1"
              >
                {pageSizes.map((item, index) => (<option key={`${index}-${item.val}`} value={item.value}>{item.label}</option>))}
              </select>
            </label>
          </div>
          <div className="mt-2">
            <label htmlFor="orientation">
              <b>{__('Orientation')}</b>
              <select
                id="orientation"
                name="orientation"
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                value={pdfSetting.orientation}
                className="btcd-paper-inp mt-1"
              >
                <option value="p">{__('Portrait')}</option>
                <option value="l">{__('Landscape')}</option>
              </select>
            </label>
          </div>

          <div className="mt-2">
            <label htmlFor="font">
              <b>{__('Font Family')}</b>
              <select
                id="font"
                name="font"
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                value={pdfSetting.font.name}
                className="btcd-paper-inp mt-1"
              >
                {
                  Object.keys(pdfFontList).map(key => (
                    <optgroup key={key} label={key}>
                      {pdfFontList[key].map((item, index) => (
                        <option
                          key={`${index}-${item.name}`}
                          value={item.name}
                        >
                          {item.name}
                        </option>
                      ))}
                    </optgroup>
                  ))
                }
              </select>
              <span className={css({ fs: 13 })}>
                <strong>{__('Note:')}</strong>
                {' '}
                {__('To use Arabic, Chinese, Japanese and Korean languages, you need to install additional fonts! Please navigate to the ')}
                <strong>
                  {__('Available Font for PDF')}
                  {' '}
                </strong>
                {__('tab to proceed.')}
              </span>
            </label>
          </div>

          <div className="mt-4">
            <label htmlFor="fontSize">
              <b>{__('Font Size (Pixels)')}</b>
              <input
                id="fontSize"
                name="fontSize"
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                value={pdfSetting.fontSize}
                className="btcd-paper-inp mt-1"
                placeholder="Font Size"
                type="number"
              />
            </label>
          </div>

          {/* watermark */}

          <div className="mt-2">
            <label htmlFor="active">
              <b>{__('Watermark')}</b>
              <CheckBox
                name="active"
                onChange={(e) => watermarkHandler(e, 'txt')}
                checked={pdfSetting?.watermark?.active === 'txt'}
                title={<small className="txt-dp"><b>{__('Text')}</b></small>}
              />
              <CheckBox
                name="active"
                onChange={e => watermarkHandler(e, 'img')}
                checked={pdfSetting?.watermark?.active === 'img'}
                title={<small className="txt-dp"><b>{__('Image')}</b></small>}
              />
            </label>
          </div>
          {pdfSetting.watermark?.active && (
            <div className={css(c.bdr)}>
              {pdfSetting.watermark.active === 'txt' && (
                <div className="mt-4">
                  <label htmlFor="watermarkText">
                    <b>{__('Watermark Text')}</b>
                    <input
                      id="watermarkText"
                      name="watermarkText"
                      onChange={(e) => handleInput('watermark->txt', e.target.value)}
                      value={pdfSetting?.watermark?.txt}
                      className="btcd-paper-inp mt-1"
                      placeholder="Watermark Text"
                      type="text"
                    />
                  </label>
                </div>
              )}
              {pdfSetting.watermark.active === 'img' && (
                <>
                  <div className="mt-4">
                    <label htmlFor="watermarkImg" className={css({ flx: 'align-center' })}>
                      <b>{__('Watermark Image')}</b>
                      <Btn className="ml-2" onClick={setWpMedia}>{__('Upload')}</Btn>

                      <img className={css(c.img)} src={pdfSetting.watermark?.img?.src} alt="" />
                    </label>
                  </div>
                  <div className={css(c.size)}>
                    <label htmlFor="width" className={css({ w: 300 })}>
                      <b>{__('Width')}</b>
                      <input
                        id="width"
                        onChange={(e) => handleInput('watermark->img->width', e.target.value)}
                        value={pdfSetting?.watermark?.img?.width}
                        className="btcd-paper-inp mt-1"
                        placeholder="Image width"
                        type="number"
                      />
                    </label>
                    <label htmlFor="height" className={css({ w: 300 })}>
                      <b>{__('Height')}</b>
                      <input
                        id="height"
                        onChange={(e) => handleInput('watermark->img->height', e.target.value)}
                        value={pdfSetting?.watermark?.img?.height}
                        className="btcd-paper-inp mt-1"
                        placeholder="Image height"
                        type="number"
                      />
                    </label>
                  </div>
                  <div className={css(c.size)}>
                    <label htmlFor="posX" className={css({ w: 300 })}>
                      <b>{__('Position X (Units in millimeters)')}</b>
                      <input
                        id="posX"
                        onChange={(e) => handleInput('watermark->img->posX', e.target.value)}
                        value={pdfSetting?.watermark?.img?.posX}
                        className="btcd-paper-inp mt-1"
                        placeholder="Position x"
                        type="number"
                      />
                    </label>
                    <label htmlFor="posY" className={css({ w: 300 })}>
                      <b>{__('Position Y (Units in millimeters)')}</b>
                      <input
                        id="posY"
                        onChange={(e) => handleInput('watermark->img->posY', e.target.value)}
                        value={pdfSetting?.watermark?.img?.posY}
                        className="btcd-paper-inp mt-1"
                        placeholder="Position Y"
                        type="number"
                      />
                    </label>
                  </div>
                  <div className="mt-2">
                    <label htmlFor="imgBehind">
                      <b>{__('Show watermark behind the page content')}</b>
                      <CheckBox
                        radio
                        name="imgBehind"
                        onChange={e => handleInput('watermark->img->imgBehind', e.target.value)}
                        checked={pdfSetting?.watermark?.img?.imgBehind === 'true'}
                        title={<small className="txt-dp"><b>{__('Yes')}</b></small>}
                        value="true"
                      />
                      <CheckBox
                        radio
                        name="imgBehind"
                        onChange={e => handleInput('watermark->img->imgBehind', e.target.value)}
                        checked={pdfSetting?.watermark?.img?.imgBehind === 'false'}
                        title={<small className="txt-dp"><b>{__('No')}</b></small>}
                        value="false"
                      />
                    </label>
                  </div>
                </>
              )}
              <div className="mt-2">
                <label htmlFor="opacity">
                  <b>{__('Opacity (0-100)')}</b>
                  <input
                    id="opacity"
                    name="alpha"
                    onChange={(e) => handleInput('watermark->alpha', e.target.value)}
                    value={pdfSetting?.watermark?.alpha}
                    className="btcd-paper-inp mt-1"
                    placeholder="Opacity"
                    max="100"
                    type="number"
                  />
                </label>
              </div>

            </div>
          )}

          {/* <div className="mt-4">
          <label htmlFor="fontColor" className={css(c.font)}>
            <b>{__('Font Color')}</b>
            <input
              id="fontColor"
              name="fontColor"
              type="color"
              className={css(c.color)}
              value={pdfSetting.fontColor}
              onChange={(e) => handleInput(e.target.name, e.target.value)}
            />
          </label>
        </div> */}

          <div className="mt-2">
            <label htmlFor="direction">
              <b>{__('Language Direction')}</b>
              <CheckBox
                radio
                name="direction"
                onChange={e => handleInput(e.target.name, e.target.value)}
                checked={pdfSetting.direction === 'ltr'}
                title={<small className="txt-dp"><b>{__('LTR')}</b></small>}
                value="ltr"
              />
              <CheckBox
                radio
                name="direction"
                onChange={e => handleInput(e.target.name, e.target.value)}
                checked={pdfSetting.direction === 'rtl'}
                title={<small className="txt-dp"><b>{__('RTL')}</b></small>}
                value="rtl"
              />
            </label>
          </div>

          <Btn
            onClick={() => saveConfig()}
            className="mt-2"
          >
            {pdfSetting.id ? __('Update') : __('Save')}
            {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
          </Btn>
        </div>
      </div>
    </div>
  )
}

const c = {
  font: {
    flx: 'align-center',
  },
  color: {
    b: '1px solid rgb(239 239 239) !important',
    w: 30,
    h: 30,
    ml: 20,
  },
  bdr: {
    pl: 15,
  },
  size: {
    flx: 'align-center',
    mt: 20,
    gp: 40,
  },
  img: {
    w: 50,
    ml: 20,
  },
  code: {
    brs: 5,
    p: '2px 5px',
    fw: 700,
  },
}
