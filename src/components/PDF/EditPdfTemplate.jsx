/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom'
import { $bits, $fieldsArr, $pdfTemplates, $proModal } from '../../GlobalStates/GlobalStates'
import BackIcn from '../../Icons/BackIcn'
import { deepCopy, IS_PRO } from '../../Utils/Helpers'
import { SmartTagField } from '../../Utils/StaticData/SmartTagField'
import { nonMappableFields } from '../../Utils/StaticData/allStaticArrays'
import { pageSizes, pdfFontList } from '../../Utils/StaticData/pdfConfigurationData'
import proHelperData from '../../Utils/StaticData/proHelperData'
import { getPdfFontObj } from '../../Utils/globalHelpers'
import { __ } from '../../Utils/i18nwrap'
import app from '../../styles/app.style'
import { compareVersions } from '../Template/templateHelpers'
import Btn from '../Utilities/Btn'
import CheckBox from '../Utilities/CheckBox'
import CoolCopy from '../Utilities/CoolCopy'
import TinyMCE from '../Utilities/TinyMCE'
import Tip from '../Utilities/Tip'
import { assignNestedObj } from '../style-new/styleHelpers'

export default function EditPdfTemplate() {
  const { formType, formID, id } = useParams()
  const navigate = useNavigate()
  const [pdfTemp, setPdfTem] = useAtom($pdfTemplates)
  const formFields = useAtomValue($fieldsArr)
  const { css } = useFela()
  const bits = useAtomValue($bits)
  const { isPro } = bits
  const [filterFields] = useState(() => formFields.filter(field => !nonMappableFields.includes(field.typ)))
  const pdfConf = pdfTemp[id]
  const shortcode = `\${bf_pdf_download.${pdfConf?.id}}`
  const passwordShortcode = `\${bf_pdf_password.${pdfConf?.id}}`
  const setProModal = useSetAtom($proModal)

  const update = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.pdfProInstalledAlert })
      return
    }
    const newPdfTem = create(pdfTemp, draft => {
      draft.push({ updateTem: 1 })
    })
    setPdfTem(newPdfTem)
    navigate(`/form/settings/${formType}/${formID}/pdf-templates`)
  }

  const handleOverride = (e) => {
    setPdfTem(prevState => create(prevState, draft => {
      if (typeof draft[id].setting !== 'object' || draft[id].setting === null) {
        draft[id].setting = {}
      }

      draft[id].setting.override = !!e.target.checked
    }))
  }

  const settingHandler = (path, value) => {
    let val = value
    setPdfTem(prevState => create(prevState, draft => {
      if (path === 'setting->font') {
        const fontObj = getPdfFontObj(val)
        val = fontObj
      }

      assignNestedObj(draft[id], path, val)
    }))
  }

  const watermarkHandler = (e, value) => {
    setPdfTem(prvState => create(prvState, draft => {
      if (e.target.checked) {
        draft[id].setting.watermark.active = value
      } else {
        delete draft[id].setting.watermark.active
      }
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

        settingHandler('setting->watermark->img->src', url)
      })

      wpMediaMdl.open()
    }
  }

  // TODO: Don't remove this code, temporary block this feature
  // const passwordHandler = (e, val) => {
  //   setPdfTem(prevState => create(prevState, draft => {
  //     if (val === 'static') {
  //       if (e.target.checked) {
  //         assignNestedObj(draft[id], 'setting->password->static', true)
  //         deleteNestedObj(draft[id], 'setting->password->dynamic')
  //       } else {
  //         deleteNestedObj(draft[id], 'setting->password->static')
  //         deleteNestedObj(draft[id], 'setting->password->pass')
  //       }
  //     }
  //     if (val === 'dynamic') {
  //       if (e.target.checked) {
  //         assignNestedObj(draft[id], 'setting->password->dynamic', true)
  //         deleteNestedObj(draft[id], 'setting->password->static')
  //         deleteNestedObj(draft[id], 'setting->password->pass')
  //       } else {
  //         deleteNestedObj(draft[id], 'setting->password->dynamic')
  //       }
  //     }
  //   }))
  // }

  const addFieldToValue = (e, state) => {
    const pdfTem = deepCopy(pdfTemp)
    if (state === 'pass') {
      if (!pdfTem[id].setting.password) pdfTem[id].setting.password = { pass: '', static: true }
      pdfTem[id].setting.password.pass += e.target.value
    }
    if (state === 'pdfFileName') {
      pdfTem[id].setting.pdfFileName += e.target.value
    }
    setPdfTem(pdfTem)
  }

  return (
    pdfTemp.length < 1 ? (
      <Navigate
        to={`/form/settings/edit/${formID}/pdf-templates`}
        replace
      />
    ) : (
      <div style={{ width: 900 }}>
        <NavLink
          to={`/form/settings/${formType}/${formID}/pdf-templates`}
          className={`${css(app.btn)} btcd-btn-o-gray`}
        >
          <BackIcn className="mr-1" />
          {__('Back')}
        </NavLink>

        <button
          id="secondary-update-btn"
          onClick={update}
          className={`${css(app.btn)} blue f-right`}
          type="button"
        >
          {__('Update Template')}
        </button>

        <div className="mt-3 flx">
          <b className="w-2">
            {__('Template Name:')}
          </b>
          <input
            onChange={(e) => settingHandler(e.target.name, e.target.value)}
            type="text"
            className="btcd-paper-inp w-9"
            placeholder={__('Template Name')}
            value={pdfConf.title}
            name="title"
          />
        </div>

        <div className="mt-3">
          <div>
            <b>{__('Body:')}</b>
          </div>

          <label
            htmlFor={`t-m-e-${id}-${formID}`}
            className="mt-2 w-10"
          >
            <TinyMCE
              id={`mail-tem-${formID}`}
              formFields={formFields}
              value={pdfConf.body}
              onChangeHandler={(val) => settingHandler('body', val)}
              width="100%"
              mapAllFieldWithTable
              mapAllField
              height="400"
            />
          </label>
        </div>
        <div className={css(cs.size)}>
          <label htmlFor="pdfFilePass" className={css({ w: 165 })}>
            <b>
              {__('PDF File Name')}
            </b>
          </label>

          <div className={css({ flx: 'align-center', gp: 10 })}>
            <input
              id="pdfFileName"
              name="pdfFileName"
              onChange={(e) => settingHandler('setting->pdfFileName', e.target.value)}
              value={pdfConf.setting?.pdfFileName}
              className="btcd-paper-inp"
              placeholder={__('PDF File Name')}
              type="text"
            />
            <select
              onChange={(e) => addFieldToValue(e, 'pdfFileName')}
              className="btcd-paper-inp w-5"
              style={{ width: 100 }}
            >
              <option value="">{__('Add field')}</option>
              <optgroup label="Form Fields">
                {filterFields !== null && filterFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>)}
              </optgroup>
              <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
                {isPro && SmartTagField?.map(f => (
                  <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
        {bits.proInfo && !compareVersions(bits.proInfo?.installedVersion, '2.11.6') && (
          <span className={css({ mt: 20, cr: 'red', dy: 'inline-block' })}>To use those feature (PDF Password, Allow Download, PDF Download Link), please update to Pro version 2.11.6 or later.</span>
        )}
        <div className={css(cs.size)}>
          <label htmlFor="pdfFilePass" className={css({ w: 165 })}>
            <b>
              {__('PDF Password')}
            </b>
          </label>
          {/* <CheckBox
            name="static"
            onChange={(e) => passwordHandler(e, 'static')}
            checked={pdfConf.setting?.password?.static === true}
            title={<small className="txt-dp"><b>{__('Static')}</b></small>}
          /> */}
          {/* <CheckBox
            name="static"
            onChange={(e) => passwordHandler(e, 'dynamic')}
            checked={pdfConf.setting?.password?.dynamic === true}
            title={<small className="txt-dp"><b>{__('Dynamic')}</b></small>}
          /> */}

          <div className={css({ flx: 'align-center', gp: 10 })}>
            <input
              id="pdfFilePass"
              name="pdfFilePass"
              onChange={(e) => settingHandler('setting->password->pass', e.target.value)}
              value={pdfConf.setting?.password?.pass}
              className="btcd-paper-inp"
              placeholder={__('Static Password')}
              type="text"
            />
            <select
              onChange={(e) => addFieldToValue(e, 'pass')}
              className="btcd-paper-inp w-5"
              style={{ width: 100 }}
            >
              <option value="">{__('Add field')}</option>
              <optgroup label="Form Fields">
                {filterFields !== null && filterFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>)}
              </optgroup>
              <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
                {isPro && SmartTagField?.map(f => !f.name.match(/^(_bf_entry_id)$/) && (
                  <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            </select>
            {pdfConf.setting?.password?.pass
              && (
                <Tip msg={__('PDF Password Shortcode')}>
                  <CoolCopy id="fld-stng-key" value={passwordShortcode} inpWidth="200" className={css({ h: 40 })} />
                </Tip>
              )}
          </div>
        </div>

        <div className={css(cs.size)}>
          <label>
            <b>{__('Allow Download (Link)')}</b>
          </label>
          <div className={css({ flx: 'align-center', gp: 10 })}>
            <CheckBox
              radio
              onChange={() => settingHandler('setting->allowDownload', 'all')}
              checked={pdfConf?.setting?.allowDownload === 'all'}
              title={<small className="txt-dp"><b>{__('All User')}</b></small>}
              value="all"
            />
            <CheckBox
              radio
              onChange={() => settingHandler('setting->allowDownload', 'loggedIn')}
              checked={pdfConf?.setting?.allowDownload === 'loggedIn'}
              title={<small className="txt-dp"><b>{__('Only Logged In User')}</b></small>}
              value="loggedIn"
            />

            {pdfConf.setting?.allowDownload && (
              <Tip msg={__('Download Link Shortcode')}>
                <CoolCopy id="fld-stng-key" value={shortcode} inpWidth="200" className={css({ dy: 'inline-block', h: 40 })} />
              </Tip>
            )}
          </div>
        </div>

        {/* <div className="mt-3 flx">
          <b className="w-3">
            {__('Link Shortcode: ')}
          </b>

        </div> */}

        <div className={css(cs.checkbox)}>
          <CheckBox
            onChange={e => handleOverride(e)}
            checked={pdfConf.setting?.override}
            title={__('Override Default Settings')}
          />
        </div>

        {/* ============== */}
        {pdfConf.setting?.override && (
          <>
            <div className={css(cs.size)}>
              <label htmlFor="paper_size" className={css({ w: 300, mr: 20 })}>
                <b>{__('Paper Size')}</b>
                <select
                  id="paper_size"
                  name="paperSize"
                  onChange={(e) => settingHandler('setting->paperSize', e.target.value)}
                  value={pdfConf.setting?.paperSize}
                  className="btcd-paper-inp mt-1"
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
                  onChange={(e) => settingHandler('setting->orientation', e.target.value)}
                  value={pdfConf.setting?.orientation}
                  className="btcd-paper-inp mt-1"
                >
                  <option value="p">{__('Portrait')}</option>
                  <option value="l">{__('Landscape')}</option>
                </select>
              </label>
            </div>

            <div className={css(cs.size)}>
              <label htmlFor="font" className={css({ w: 300, mr: 20 })}>
                <b>{__('Font Family')}</b>
                <select
                  id="font"
                  name="font"
                  onChange={(e) => settingHandler('setting->font', e.target.value)}
                  value={pdfConf.setting?.font?.name}
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
                  onChange={(e) => settingHandler('setting->fontSize', e.target.value)}
                  value={pdfConf.setting?.fontSize}
                  className="btcd-paper-inp mt-1"
                  placeholder={__('Font Size')}
                  type="number"
                />
              </label>
            </div>

            <div className="mt-2">
              <label htmlFor="active">
                <b>{__('Watermark')}</b>
                <CheckBox
                  name="active"
                  onChange={e => watermarkHandler(e, 'txt')}
                  checked={pdfConf.setting?.watermark?.active === 'txt'}
                  title={<small className="txt-dp"><b>{__('Text')}</b></small>}
                />
                <CheckBox
                  name="active"
                  onChange={e => watermarkHandler(e, 'img')}
                  checked={pdfConf.setting?.watermark?.active === 'img'}
                  title={<small className="txt-dp"><b>{__('Image')}</b></small>}
                />
              </label>
            </div>
            {
              pdfConf.setting?.watermark?.active && (
                <div className={css(cs.bdr)}>
                  {pdfConf.setting?.watermark.active === 'txt' && (
                    <div className={css(cs.size)}>
                      <label htmlFor="watermarkText" className={css({ w: 300 })}>
                        <b>{__('Watermark Text')}</b>
                        <input
                          id="watermarkText"
                          name="watermarkText"
                          onChange={(e) => settingHandler('setting->watermark->txt', e.target.value)}
                          value={pdfConf.setting?.watermark?.txt}
                          className="btcd-paper-inp mt-1"
                          placeholder={__('Watermark Text')}
                          type="text"
                        />
                      </label>
                    </div>
                  )}
                  {pdfConf.setting?.watermark.active === 'img' && (
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
                            Upload
                          </Btn>
                          {
                            pdfConf.setting?.watermark?.img?.src && (
                              <img
                                className={css(cs.img)}
                                src={pdfConf.setting?.watermark?.img?.src}
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
                            onChange={(e) => settingHandler('setting->watermark->img->width', e.target.value)}
                            value={pdfConf.setting?.watermark?.img?.width}
                            className="btcd-paper-inp mt-1"
                            placeholder="Image width"
                            type="number"
                          />
                        </label>
                        <label htmlFor="height" className={css({ w: 300 })}>
                          <b>{__('Height')}</b>
                          <input
                            id="height"
                            onChange={(e) => settingHandler('setting->watermark->img->height', e.target.value)}
                            value={pdfConf.setting?.watermark?.img?.height}
                            className="btcd-paper-inp mt-1"
                            placeholder="Image height"
                            type="number"
                          />
                        </label>
                      </div>
                      <div className={css(cs.size)}>
                        <label htmlFor="posX" className={css({ w: 300 })}>
                          <b>{__('Position X (Units in millimeters)')}</b>
                          <input
                            id="posX"
                            onChange={(e) => settingHandler('setting->watermark->img->posX', e.target.value)}
                            value={pdfConf.setting?.watermark?.img?.posX}
                            className="btcd-paper-inp mt-1"
                            placeholder="Position x"
                            type="number"
                          />
                        </label>
                        <label htmlFor="posY" className={css({ w: 300 })}>
                          <b>{__('Position Y (Units in millimeters)')}</b>
                          <input
                            id="posY"
                            onChange={(e) => settingHandler('setting->watermark->img->posY', e.target.value)}
                            value={pdfConf.setting?.watermark?.img?.posY}
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
                            onChange={e => settingHandler('setting->watermark->img->imgBehind', e.target.value)}
                            checked={pdfConf.setting?.watermark?.img?.imgBehind === 'true'}
                            title={<small className="txt-dp"><b>Yes</b></small>}
                            value="true"
                          />
                          <CheckBox
                            radio
                            onChange={e => settingHandler('setting->watermark->img->imgBehind', e.target.value)}
                            checked={pdfConf.setting?.watermark?.img?.imgBehind === 'false'}
                            title={<small className="txt-dp"><b>No</b></small>}
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
                        onChange={(e) => settingHandler('setting->watermark->alpha', e.target.value)}
                        value={pdfConf.setting?.watermark?.alpha}
                        className="btcd-paper-inp mt-1"
                        placeholder={__('Opacity')}
                        max="100"
                        type="number"
                      />
                    </label>
                  </div>

                </div>
              )
            }

            {/* <div className="mt-4">
              <label htmlFor="fontColor" className={css(cs.font)}>
                <b>{__('Font Color')}</b>
                <input
                  id="fontColor"
                  name="fontColor"
                  type="color"
                  className={css(cs.color)}
                  value={pdfConf.setting.fontColor}
                  onChange={(e) => settingHandler(e.target.name, e.target.value)}
                />
              </label>
            </div> */}

            <div className="mt-2">
              <label htmlFor="direction">
                <b>{__('Language Direction')}</b>
                <CheckBox
                  radio
                  onChange={e => settingHandler('setting->direction', e.target.value)}
                  checked={pdfConf.setting?.direction === 'ltr'}
                  title={<small className="txt-dp"><b>{__('LTR')}</b></small>}
                  value="ltr"
                />
                <CheckBox
                  radio
                  onChange={e => settingHandler('setting->direction', e.target.value)}
                  checked={pdfConf.setting.direction === 'rtl'}
                  title={<small className="txt-dp"><b>{__('RTL')}</b></small>}
                  value="rtl"
                />
              </label>
            </div>

            {/* ============== */}
            <button
              id="secondary-update-btn"
              onClick={update}
              className={`${css(app.btn)} blue f-right`}
              type="button"
            >
              {__('Update Template')}
            </button>
          </>

        )}
      </div>
    )
  )
}
const cs = {
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
    mt: 10,
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
