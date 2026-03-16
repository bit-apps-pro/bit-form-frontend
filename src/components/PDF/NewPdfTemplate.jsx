/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { $bits, $fieldsArr, $pdfTemplates } from '../../GlobalStates/GlobalStates'
import BackIcn from '../../Icons/BackIcn'
import { pageSizes, pdfFontList } from '../../Utils/StaticData/pdfConfigurationData'
import { getPdfFontObj } from '../../Utils/globalHelpers'
import { __ } from '../../Utils/i18nwrap'
import app from '../../styles/app.style'
import Btn from '../Utilities/Btn'
import CheckBox from '../Utilities/CheckBox'
import ConfirmModal from '../Utilities/ConfirmModal'
import TinyMCE from '../Utilities/TinyMCE'
import { assignNestedObj } from '../style-new/styleHelpers'

export default function NewPdfTemplate() {
  const [pdfTem, setPdfTem] = useAtom($pdfTemplates)
  const formFields = useAtomValue($fieldsArr)
  const { formType, formID } = useParams()
  const navigate = useNavigate()
  const { css } = useFela()

  const bits = useAtomValue($bits)
  const { pdf } = bits.allFormSettings
  const [confMdl, setConfMdl] = useState({ show: false })

  const backToPdfList = () => {
    confMdl.show = false
    setConfMdl({ ...confMdl })
    navigate(`/form/settings/${formType}/${formID}/pdf-templates`)
  }

  const gotoPDFSetting = () => {
    confMdl.show = false
    setConfMdl({ ...confMdl })
    navigate('/app-settings/pdf')
  }

  const alertConfig = () => {
    confMdl.btnTxt = __('Go to PDF Settings')
    confMdl.body = __('Please configure PDF settings first.')
    confMdl.btnClass = 'blue'
    confMdl.action = () => { gotoPDFSetting() }
    confMdl.show = true
    confMdl.btn2Txt = __('Back')
    setConfMdl({ ...confMdl })
  }

  useEffect(() => {
    if (undefined === pdf) {
      alertConfig()
    }
  }, [pdf])

  if (pdf?.id) delete pdf.id

  const [tem, setTem] = useState({
    title: 'Untitled PDF Template',
    setting: { ...pdf, password: { static: true, pass: '' } },
    body: 'PDF body',
  })

  const handleInput = (path, value) => {
    let val = value
    setTem(prevState => create(prevState, draft => {
      if (path === 'setting->font') {
        const fontObj = getPdfFontObj(val)
        val = fontObj
      }
      assignNestedObj(draft, path, val)
    }))
  }

  const watermarkHandler = (e, value) => {
    setTem(prvState => create(prvState, draft => {
      if (e.target.checked) {
        draft.setting.watermark.active = value
      } else {
        delete draft.setting.watermark.active
      }
    }))
  }

  const save = () => {
    const lastIndex = pdfTem.length
    const newPdfTem = create(pdfTem, draft => {
      draft.push(tem)
      draft.push({ updateTem: 1 })
    })
    setPdfTem(newPdfTem)
    navigate(`/form/settings/${formType}/${formID}/pdf-templates/${lastIndex}`)
  }

  const handleOverride = (e) => {
    setTem(prevState => create(prevState, draft => {
      if (e.target.checked) draft.setting.override = true
      else draft.setting.override = false
    }))
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
        handleInput('watermark->img->src', url)
      })

      wpMediaMdl.open()
    }
  }

  useEffect(() => {
    save()
  }, [])

  return (
    <div style={{ width: 900 }}>
      <ConfirmModal
        show={confMdl.show}
        close={backToPdfList}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
        btn2Txt={__('Back')}
        btn2Action={backToPdfList}
      />

      <NavLink
        to={`/form/settings/${formType}/${formID}/pdf-templates`}
        className={`${css(app.btn)} btcd-btn-o-gray`}
      >
        <BackIcn className="mr-1" />
        {__('Back', 'bitfrom')}
      </NavLink>

      <button
        id="secondary-update-btn"
        onClick={save}
        className={`${css(app.btn)} blue f-right`}
        type="button"
      >
        {__('Save Template')}
      </button>

      <div className="mt-3 flx">
        <b className="w-2" style={{ width: 103 }}>
          {__('Template Name:')}
          {' '}
        </b>
        <input
          onChange={(e) => handleInput(e.target.name, e.target.value)}
          name="title"
          type="text"
          className="btcd-paper-inp w-9"
          placeholder={__('Template Name')}
          value={tem.title}
        />
      </div>

      <div className="mt-3">
        <b>{__('Body:')}</b>
        {/* <div className="flx flx-between">
          <button className="btn" onClick={() => setTemplateModal(true)} type="button">{__('Choose Template')}</button>
        </div> */}
        <label htmlFor={`pdf-tem-${formID}`} className="mt-2 w-10">
          <TinyMCE
            id={`pdf-tem-${formID}`}
            formFields={formFields}
            value={tem.body}
            onChangeHandler={(value) => handleInput('body', value)}
            width="100%"
            height={300}
            mapAllFieldWithTable
            mapAllField
          />
        </label>
      </div>
      <div className={css(cs.checkbox)}>
        <CheckBox
          onChange={e => handleOverride(e, 'update')}
          checked={tem.setting.override}
          title="Override PDF global setting"
        />
      </div>

      {/* ============== */}
      {tem.setting.override && (
        <>
          <div className={css(cs.size)}>
            <label htmlFor="paper_size" className={css({ mr: 20, w: 300 })}>
              <b>{__('Paper Size')}</b>
              <select
                id="paper_size"
                name="paperSize"
                onChange={(e) => handleInput('setting->paperSize', e.target.value)}
                value={tem.setting.paperSize}
                className="btcd-paper-inp mt-1 w-100"
              >
                {pageSizes.map((item, index) => (
                  <option
                    key={`${index}-${item.val}`}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="orientation" className={css({ w: 300 })}>
              <b>{__('Orientation')}</b>
              <select
                id="orientation"
                name="orientation"
                onChange={(e) => handleInput('setting->orientation', e.target.value)}
                value={tem.setting.orientation}
                className="btcd-paper-inp mt-1 w-100"
              >
                <option value="p">{__('Portrait')}</option>
                <option value="l">{__('Landscape')}</option>
              </select>
            </label>
          </div>

          <div className={css(cs.size)}>
            <label htmlFor="font" className={css({ mr: 20, w: 300 })}>
              <b>{__('Font Family')}</b>
              <select
                id="font"
                name="font"
                onChange={(e) => handleInput('setting->font', e.target.value)}
                value={tem.setting?.font?.name}
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
            </label>

            <label htmlFor="fontSize" className={css({ w: 300 })}>
              <b>{__('Font Size (Pixels)')}</b>
              <input
                id="fontSize"
                name="fontSize"
                onChange={(e) => handleInput('setting->fontSize', e.target.value)}
                value={tem.setting.fontSize}
                className="btcd-paper-inp mt-1"
                placeholder={__('Font Size')}
                type="number"
              />
            </label>
          </div>

          <div className={css(cs.size)}>
            <label htmlFor="pdfFileName" className={css({ w: 300 })}>
              <b>{__('PDF File Name')}</b>
              <input
                id="pdfFileName"
                name="pdfFileName"
                onChange={(e) => handleInput('setting->pdfFileName', e.target.value)}
                value={tem.setting?.pdfFileName}
                className="btcd-paper-inp mt-1"
                placeholder={__('PDF File Name')}
                type="text"
              />
            </label>
          </div>

          {/* watermark */}

          <div className="mt-2">
            <label htmlFor="active">
              <b>{__('Watermark')}</b>
              <CheckBox
                name="active"
                onChange={e => watermarkHandler(e, 'txt')}
                checked={tem.setting?.watermark?.active === 'txt'}
                title={<small className="txt-dp"><b>{__('Text')}</b></small>}
              />
              <CheckBox
                name="active"
                onChange={e => watermarkHandler(e, 'img')}
                checked={tem.setting?.watermark?.active === 'img'}
                title={<small className="txt-dp"><b>{__('Image')}</b></small>}
              />
            </label>
          </div>
          {tem.setting.watermark?.active && (
            <div className={css(cs.bdr)}>
              {tem.setting.watermark.active === 'txt' && (
                <div className={css(cs.size)}>
                  <label htmlFor="watermarkText">
                    <b>{__('Watermark Text')}</b>
                    <input
                      id="watermarkText"
                      name="watermarkText"
                      onChange={(e) => handleInput('setting->watermark->txt', e.target.value)}
                      value={tem.setting?.watermark?.txt}
                      className="btcd-paper-inp mt-1"
                      placeholder={__('Watermark Text')}
                      type="text"
                    />
                  </label>
                </div>
              )}
              {tem.setting.watermark.active === 'img' && (
                <>
                  <div className="mt-4">
                    <label
                      htmlFor="watermarkImg"
                      className={css({ flx: 'align-center' })}
                    >
                      <b>{__('Watermark Image')}</b>
                      <Btn
                        className="ml-2"
                        onClick={setWpMedia}
                      >
                        {__('Upload')}
                      </Btn>
                      {
                        tem.setting.watermark?.img?.src && (
                          <img
                            className={css(cs.img)}
                            src={tem.setting.watermark?.img?.src}
                            alt=""
                          />
                        )
                      }
                    </label>
                  </div>
                  <div className={css(cs.size)}>
                    <label htmlFor="width" className={css({ w: 300 })}>
                      <b>{__('Width')}</b>
                      <input
                        id="width"
                        onChange={(e) => handleInput('setting->watermark->img->width', e.target.value)}
                        value={tem.setting?.watermark?.img?.width}
                        className="btcd-paper-inp mt-1"
                        placeholder={__('Image width')}
                        type="number"
                      />
                    </label>
                    <label htmlFor="height" className={css({ w: 300 })}>
                      <b>{__('Height')}</b>
                      <input
                        id="height"
                        onChange={(e) => handleInput('setting->watermark->img->height', e.target.value)}
                        value={tem.setting?.watermark?.img?.height}
                        className="btcd-paper-inp mt-1"
                        placeholder={__('Image height')}
                        type="number"
                      />
                    </label>
                  </div>
                  <div className={css(cs.size)}>
                    <label htmlFor="posX" className={css({ w: 300 })}>
                      <b>{__('Position X (Units in millimeters)')}</b>
                      <input
                        id="posX"
                        onChange={(e) => handleInput('setting->watermark->img->posX', e.target.value)}
                        value={tem.setting?.watermark?.img?.posX}
                        className="btcd-paper-inp mt-1"
                        placeholder={__('Position X')}
                        type="number"
                      />
                    </label>
                    <label htmlFor="posY" className={css({ w: 300 })}>
                      <b>{__('Position Y (Units in millimeters)')}</b>
                      <input
                        id="posY"
                        onChange={(e) => handleInput('setting->watermark->img->posY', e.target.value)}
                        value={tem.setting?.watermark?.img?.posY}
                        className="btcd-paper-inp mt-1"
                        placeholder={__('Position Y')}
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
                        onChange={e => handleInput('setting->watermark->img->imgBehind', e.target.value)}
                        checked={tem.setting?.watermark?.img?.imgBehind === 'true'}
                        title={<small className="txt-dp"><b>{__('Yes')}</b></small>}
                        value="true"
                      />
                      <CheckBox
                        radio
                        name="imgBehind"
                        onChange={e => handleInput('setting->watermark->img->imgBehind', e.target.value)}
                        checked={tem.setting?.watermark?.img?.imgBehind === 'false'}
                        title={<small className="txt-dp"><b>{__('No')}</b></small>}
                        value="false"
                      />
                    </label>
                  </div>
                </>
              )}
              <div className={css(cs.size)}>
                <label htmlFor="opacity" className={css({ w: 300 })}>
                  <b>{__('Opacity (0-100)')}</b>
                  <input
                    id="opacity"
                    name="alpha"
                    onChange={(e) => handleInput('setting->watermark->alpha', e.target.value)}
                    value={tem.setting?.watermark?.alpha}
                    className="btcd-paper-inp mt-1"
                    placeholder={__('Opacity')}
                    max="100"
                    type="number"
                  />
                </label>
              </div>
            </div>
          )}

          {/* <div className="mt-4">
            <label htmlFor="fontColor" className={css(cs.font)}>
              <b>{__('Font Color')}</b>
              <input
                id="fontColor"
                name="fontColor"
                type="color"
                className={css(cs.color)}
                value={tem.setting.fontColor}
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
                onChange={e => handleInput('setting->direction', e.target.value)}
                checked={tem.setting.direction === 'ltr'}
                title={<small className="txt-dp"><b>{__('LTR')}</b></small>}
                value="ltr"
              />
              <CheckBox
                radio
                name="direction"
                onChange={e => handleInput('setting->direction', e.target.value)}
                checked={tem.setting.direction === 'rtl'}
                title={<small className="txt-dp"><b>{__('RTL')}</b></small>}
                value="rtl"
              />
            </label>
          </div>
          {/* ============== */}
          <button
            id="secondary-update-btn"
            onClick={save}
            className={`${css(app.btn)} blue f-right`}
            type="button"
          >
            {__('Save Template')}
          </button>
        </>
      )}
    </div>
  )
}

const cs = {
  wrp: {
    flx: 'space-between',
    mt: 20,
  },
  checkbox: {
    mt: 10,
  },
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
    b: '1px solid var(--white-0-89)',
    bs: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
    brs: 5,
  },
}
