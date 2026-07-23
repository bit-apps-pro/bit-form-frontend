// @ts-nocheck
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import {
  useEffect, useMemo, useRef, useState,
} from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom'
import { $bits, $fieldsArr, $pdfTemplates, $proModal } from '../../../GlobalStates/GlobalStates'
import BackIcn from '../../../Icons/BackIcn'
import FileUploadIcn from '../../../Icons/FileUploadIcn'
import PdfIcn from '../../../Icons/PdfIcn'
import RtlIcn from '../../../Icons/RtlIcn'
import Settings2Icn from '../../../Icons/Settings2Icn'
import TweaksIcn from '../../../Icons/TweaksIcn'
import { deepCopy, IS_PRO } from '../../../Utils/Helpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { nonMappableFields } from '../../../Utils/StaticData/allStaticArrays'
import { pageSizes, pdfFontList } from '../../../Utils/StaticData/pdfConfigurationData'
import proHelperData from '../../../Utils/StaticData/proHelperData'
import { getPdfFontObj } from '../../../Utils/globalHelpers'
import { __ } from '../../../Utils/i18nwrap'
import app from '../../../styles/app.style'
import { compareVersions } from '../../Template/templateHelpers'
import CheckBox from '../../Utilities/CheckBox'
import CoolCopy from '../../Utilities/CoolCopy'
import SettingCard from '../../Utilities/SettingCard'
import SingleToggle from '../../Utilities/SingleToggle'
import TinyMCE from '../../Utilities/TinyMCE'
import Tip from '../../Utilities/Tip'
import { assignNestedObj } from '../../style-new/styleHelpers'
import Accordion from '../../style-new/util-components/Accordion'
import { Bits, FormField, PdfTemplate, PdfTemplateSetting } from '../Types/templates.types'

declare global {
  interface Window {
    wp?: {
      media: (options: any) => {
        state: () => {
          get: (key: string) => any
          first: () => { toJSON: () => any }
        }
        on: (event: string, callback: () => void) => void
        open: () => void
      }
    }
  }
}

const defaultPdfSetting: PdfTemplateSetting = {
  direction: 'ltr',
  font: {
    name: 'DejaVuSansCondensed',
    fontFamily: 'dejavusanscondensed',
  },
  fontColor: '#000000',
  fontFamily: 'dejavusanscondensed',
  fontSize: 10,
  orientation: 'p',
  paperSize: 'a4',
  pdfFileName: '',
  watermark: {},
}
// eslint-disable-next-line no-template-curly-in-string
const allDataShortcode = '${bf_all_data}'

// Common PDF header/footer defaults.
// Header: a document title (heading tag) — editable per template.
// Footer: date + page numbers via mPDF-native placeholders {DATE j-m-Y}, {PAGENO}/{nbpg} (resolved by
// mPDF inside the header/footer; they do NOT collide with ${...} smart tags). Other mPDF placeholders:
// {nb} (total pages, whole doc), {DATE ...} with any PHP date format.
export const defaultPdfHeader = `<h2 style="text-align: center; margin: 0; font-size: 16px; color: #333333;">${__('Page Header')}</h2>`
export const defaultPdfFooter = `<div style="font-size: 9px; color: #666666;"><span style="float: left;">{DATE j-m-Y}</span><span style="float: right;">${__('Page')} {PAGENO} of {nbpg}</span></div>`

export const createDefaultPdfTemplate = (pdfSetting?: PdfTemplateSetting): PdfTemplate => {
  const setting = deepCopy(pdfSetting || defaultPdfSetting)
  delete setting.id

  return {
    title: 'Untitled PDF Template',
    setting: { ...setting, password: { static: true, pass: '' } },
    pdf_config: { status: 1, header: defaultPdfHeader, footer: defaultPdfFooter },
    body: allDataShortcode,
  }
}

export interface PdfTemplateEditorProps {
  modalMode?: boolean
  editingIndex?: number
  onClose?: () => void
}

export default function PdfTemplateEditor({ modalMode = false, editingIndex, onClose }: PdfTemplateEditorProps = {}) {
  const { formType, formID, id } = useParams<{ formType: string; formID: string; id?: string }>()
  const navigate = useNavigate()
  const [pdfTemp, setPdfTem] = useAtom<PdfTemplate[]>($pdfTemplates)
  const formFields = useAtomValue<FormField[]>($fieldsArr)
  const { css } = useFela()
  const bits = useAtomValue<Bits>($bits)
  const { isPro } = bits
  const setProModal = useSetAtom($proModal)
  const createdTemplateRef = useRef(false)
  const resolvedId = modalMode ? String(editingIndex) : id
  const selectedIndex = Number(resolvedId)
  const isNewTemplate = resolvedId === undefined
  const pdfConf: PdfTemplate | null = isNewTemplate ? null : pdfTemp[selectedIndex]
  const pdfConfig = pdfConf?.pdf_config || { status: 1, header: '', footer: '' }
  const pdfStatus = Number(pdfConfig.status) === 0 ? 0 : 1
  const shortcode = `\${bf_pdf_download.${pdfConf?.id}}`
  const passwordShortcode = `\${bf_pdf_password.${pdfConf?.id}}`
  const filterFields = useMemo(
    () => formFields.filter(field => !nonMappableFields.includes(field.typ)),
    [formFields],
  )
  const listUrl = `/form/settings/${formType}/${formID}/pdf-templates`

  useEffect(() => {
    if (modalMode || !isNewTemplate || createdTemplateRef.current) return

    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.pdfProInstalledAlert })
      navigate(listUrl, { replace: true })
      return
    }

    createdTemplateRef.current = true
    const newIndex = pdfTemp.length
    setPdfTem(prevState => create(prevState, draft => {
      draft.push(createDefaultPdfTemplate(bits.allFormSettings?.pdf))
      draft.push({ updateTem: 1 } as PdfTemplate)
    }))
    navigate(`${listUrl}/${newIndex}`, { replace: true })
  }, [bits.allFormSettings?.pdf, isNewTemplate, listUrl, navigate, pdfTemp.length, setPdfTem, setProModal, modalMode])

  const update = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.pdfProInstalledAlert })
      return
    }
    const newPdfTem = create(pdfTemp, draft => {
      draft.push({ updateTem: 1 } as PdfTemplate)
    })
    setPdfTem(newPdfTem)
    if (modalMode) {
      onClose?.()
    } else {
      navigate(listUrl)
    }
  }

  const handleOverride = (checked: boolean) => {
    setPdfTem(prevState => create(prevState, draft => {
      if (typeof draft[selectedIndex].setting !== 'object' || draft[selectedIndex].setting === null) {
        draft[selectedIndex].setting = {}
      }

      if (checked) {
        draft[selectedIndex].setting.override = true
        return
      }

      const { password, pdfFileName, allowDownload } = draft[selectedIndex].setting
      const globalPdf = deepCopy(bits.allFormSettings?.pdf || defaultPdfSetting)
      delete globalPdf.id
      draft[selectedIndex].setting = {
        ...globalPdf,
        ...(password !== undefined && { password }),
        ...(pdfFileName !== undefined && { pdfFileName }),
        ...(allowDownload !== undefined && { allowDownload }),
        override: false,
      }
    }))
  }

  const settingHandler = (path: string, value: any) => {
    let val = value
    setPdfTem(prevState => create(prevState, draft => {
      if (path === 'setting->font') {
        const fontObj = getPdfFontObj(val)
        val = fontObj
      }

      assignNestedObj(draft[selectedIndex], path, val)
    }))
  }

  const watermarkHandler = (value: string) => {
    setPdfTem(prvState => create(prvState, draft => {
      if (!draft[selectedIndex].setting.watermark) {
        draft[selectedIndex].setting.watermark = {}
      }

      if (value) {
        draft[selectedIndex].setting.watermark.active = value
      } else {
        delete draft[selectedIndex].setting.watermark.active
      }
    }))
  }

  const setWpMedia = () => {
    if (typeof window.wp !== 'undefined' && window.wp.media) {
      const wpMediaMdl = window.wp.media({
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

  const addFieldToValue = (e: React.ChangeEvent<HTMLSelectElement>, state: string) => {
    const { value } = e.target
    if (!value) return
    setPdfTem(prevState => create(prevState, draft => {
      if (state === 'pass') {
        if (!draft[selectedIndex].setting.password) {
          draft[selectedIndex].setting.password = { pass: '', static: true }
        }
        draft[selectedIndex].setting.password.pass += value
      }
      if (state === 'pdfFileName') {
        if (!draft[selectedIndex].setting.pdfFileName) {
          draft[selectedIndex].setting.pdfFileName = ''
        }
        draft[selectedIndex].setting.pdfFileName += value
      }
    }))
  }

  const handleStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    settingHandler('pdf_config->status', e.target.checked ? 1 : 0)
  }

  const fieldSelectOptions = (
    <>
      <option value="">{__('+ Add field')}</option>
      <optgroup label={__('Form Fields')}>
        {filterFields !== null && filterFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && (
          <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>
        ))}
      </optgroup>
      <optgroup label={`${__('General Smart Codes')} ${isPro ? '' : '(PRO)'}`}>
        {isPro && SmartTagField?.map(f => (
          <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
            {f.label}
          </option>
        ))}
      </optgroup>
    </>
  )

  const passwordFieldOptions = (
    <>
      <option value="">{__('+ Add field')}</option>
      <optgroup label={__('Form Fields')}>
        {filterFields !== null && filterFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && (
          <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>
        ))}
      </optgroup>
      <optgroup label={`${__('General Smart Codes')} ${isPro ? '' : '(PRO)'}`}>
        {isPro && SmartTagField?.map(f => !f.name.match(/^(_bf_entry_id)$/) && (
          <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
            {f.label}
          </option>
        ))}
      </optgroup>
    </>
  )

  if (!modalMode && isNewTemplate) return null

  if (pdfTemp.length < 1 || Number.isNaN(selectedIndex) || !pdfConf) {
    if (modalMode) {
      onClose?.()
      return null
    }
    return (
      <Navigate
        to={listUrl}
        replace
      />
    )
  }

  const barCls = modalMode ? css(style.barModal) : css(style.bar)

  return (
    <div className={css(style.wrap)}>
      <div className={barCls}>
        {!modalMode && (
          <NavLink
            to={listUrl}
            className={`${css(app.btn)} btcd-btn-o-gray`}
          >
            <BackIcn className="mr-1" />
            {__('Back')}
          </NavLink>
        )}

        <input
          onChange={(e) => settingHandler(e.target.name, e.target.value)}
          type="text"
          className={`btcd-paper-inp ${css(style.nameInp)}`}
          placeholder={__('Template Name')}
          value={pdfConf.title}
          name="title"
          aria-label={__('Template Name')}
          title="Template Name"
        />

        <div className="flx" style={{ alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <b>{__('Active')}</b>
          <SingleToggle
            name={`pdf-tem-status-${resolvedId || 'new'}`}
            isChecked={pdfStatus === 1}
            action={handleStatus}
          />
        </div>

        <button
          id="secondary-update-btn"
          onClick={update}
          className={`${css(app.btn)} blue`}
          type="button"
        >
          <PdfIcn size={14} className="mr-1" />
          {__('Save template')}
        </button>
      </div>

      <div className={css(style.body)}>
        <SettingCard title={(
          <div className={css(style.cardTitle)}>
            <PdfIcn size={16} />
            {__('PDF content')}
          </div>
        )}
        >
          <div className={css(style.editorSection)}>
            <span className={css(style.sectionLabel, style.sectionLabelCenter)}>{__('HEADER')}</span>
            <TinyMCE
              id={`pdf-header-${formID}-${resolvedId}`}
              formFields={formFields}
              value={typeof pdfConfig.header === 'string' ? pdfConfig.header : ''}
              onChangeHandler={(val: string) => settingHandler('pdf_config->header', val)}
              width="100%"
              height="120"
            />
          </div>

          <div className={css(style.editorSection)}>
            <span className={css(style.sectionLabel, style.sectionLabelCenter)}>{__('Body')}</span>
            <TinyMCE
              id={`pdf-body-${formID}-${resolvedId}`}
              formFields={formFields}
              value={pdfConf.body}
              onChangeHandler={(val: string) => settingHandler('body', val)}
              width="100%"
              mapAllFieldWithTable
              mapAllField
              height="400"
            />
          </div>

          <div className={css(style.editorSection)}>
            <span className={css(style.sectionLabel, style.sectionLabelCenter)}>{__('Footer')}</span>
            <TinyMCE
              id={`pdf-footer-${formID}-${resolvedId}`}
              formFields={formFields}
              value={typeof pdfConfig.footer === 'string' ? pdfConfig.footer : ''}
              onChangeHandler={(val: string) => settingHandler('pdf_config->footer', val)}
              width="100%"
              height="120"
            />
          </div>
        </SettingCard>

        <SettingCard title={(
          <div className={css(style.cardTitle)}>
            <Settings2Icn size={16} />
            {__('File settings')}
          </div>
        )}
        >
          <div className={css(style.fieldRow)}>
            <label className={css(style.fieldLabel)}>{__('PDF file name')}</label>
            <div className={css(style.fieldInputGroup)}>
              <input
                name="pdfFileName"
                onChange={(e) => settingHandler('setting->pdfFileName', e.target.value)}
                value={pdfConf.setting?.pdfFileName || ''}
                className="btcd-paper-inp"
                placeholder={__('PDF file name')}
                type="text"
              />
              <select
                onChange={(e) => addFieldToValue(e, 'pdfFileName')}
                className={`btcd-paper-inp ${css(style.addFieldSelect)}`}
                value=""
              >
                {fieldSelectOptions}
              </select>
            </div>
          </div>

          <div className={css(style.fieldRow)}>
            <label className={css(style.fieldLabel)}>{__('PDF password')}</label>
            <div className={css(style.fieldInputGroup)}>
              <input
                name="pdfFilePass"
                onChange={(e) => settingHandler('setting->password->pass', e.target.value)}
                value={pdfConf.setting?.password?.pass || ''}
                className="btcd-paper-inp"
                placeholder={__('Static Password')}
                type="text"
              />
              <select
                onChange={(e) => addFieldToValue(e, 'pass')}
                className={`btcd-paper-inp ${css(style.addFieldSelect)}`}
                value=""
              >
                {passwordFieldOptions}
              </select>
              {pdfConf.setting?.password?.pass && (
                <Tip msg={__('PDF Password Shortcode')}>
                  <CoolCopy id="pdf-password-code" value={passwordShortcode} inpWidth="200" />
                </Tip>
              )}
            </div>
          </div>

          {bits.proInfo && !compareVersions(bits.proInfo?.installedVersion, '2.11.6') && (
            <span className={css({ mt: 14, mb: 6, cr: 'red', dy: 'inline-block' })}>
              {__('To use those feature (PDF Password, Allow Download, PDF Download Link), please update to Pro version 2.11.6 or later.')}
            </span>
          )}

          <div className={css(style.fieldRow)}>
            <label className={css(style.fieldLabel)}>{__('Allow download (link)')}</label>
            <div className={css(style.fieldInputGroup)}>
              <CheckBox
                radio
                onChange={() => settingHandler('setting->allowDownload', '')}
                checked={!pdfConf?.setting?.allowDownload}
                title={<span>{__('None')}</span>}
                value=""
              />
              <CheckBox
                radio
                onChange={() => settingHandler('setting->allowDownload', 'all')}
                checked={pdfConf?.setting?.allowDownload === 'all'}
                title={<span>{__('All users')}</span>}
                value="all"
              />
              <CheckBox
                radio
                onChange={() => settingHandler('setting->allowDownload', 'loggedIn')}
                checked={pdfConf?.setting?.allowDownload === 'loggedIn'}
                title={<span>{__('Only logged-in users')}</span>}
                value="loggedIn"
              />

              {pdfConf.setting?.allowDownload && (
                <Tip msg={__('Download Link Shortcode')}>
                  <CoolCopy id="download-link-copy" value={shortcode} inpWidth="300" />
                </Tip>
              )}
            </div>
          </div>
        </SettingCard>

        <SettingCard
          title={(
            <div className={css(style.cardTitle)}>
              <TweaksIcn size={16} />
              {__('Override default PDF settings')}
            </div>
          )}
          right={(
            <SingleToggle
              name="pdf-override-default"
              isChecked={!!pdfConf.setting?.override}
              action={(e: React.ChangeEvent<HTMLInputElement>) => handleOverride(e.target.checked)}
            />
          )}
        >
          {pdfConf.setting?.override && (
            <>
              <Accordion title={__('Page Layout')} open variant="boxed" cls={css(style.accr)}>
                <div className={css(style.accordionBody)}>
                  <div className={css(style.grid2)}>
                    <label htmlFor="paper_size" className={css(style.fieldCol)}>
                      <span className={css(style.fieldLabel)}>{__('Paper size')}</span>
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

                    <label htmlFor="orientation" className={css(style.fieldCol)}>
                      <span className={css(style.fieldLabel)}>{__('Orientation')}</span>
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
                </div>
              </Accordion>

              <Accordion title={__('Typography')} open variant="boxed" cls={css(style.accr)}>
                <div className={css(style.accordionBody)}>
                  <div className={css(style.grid2)}>
                    <label htmlFor="font" className={css(style.fieldCol)}>
                      <span className={css(style.fieldLabel)}>{__('Font family')}</span>
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

                    <label htmlFor="fontSize" className={css(style.fieldCol)}>
                      <span className={css(style.fieldLabel)}>{__('Font size (px)')}</span>
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

                  <div className={css(style.fieldRow)}>
                    <span className={css(style.fieldLabel)}>{__('Language direction')}</span>
                    <div className={css(style.dirButtons)}>
                      <button
                        type="button"
                        onClick={() => settingHandler('setting->direction', 'ltr')}
                        className={`${css(style.dirBtn)} ${pdfConf.setting?.direction === 'ltr' ? css(style.dirBtnActive) : ''}`}
                      >
                        <RtlIcn size={20} flip />
                        {__('LTR')}
                      </button>
                      <button
                        type="button"
                        onClick={() => settingHandler('setting->direction', 'rtl')}
                        className={`${css(style.dirBtn)} ${pdfConf.setting?.direction === 'rtl' ? css(style.dirBtnActive) : ''}`}
                      >
                        <RtlIcn size={20} />
                        {__('RTL')}
                      </button>
                    </div>
                  </div>
                </div>
              </Accordion>

              <Accordion title={__('Watermark')} open variant="boxed" cls={css(style.accr)}>
                <div className={css(style.accordionBody)}>
                  <div className={css(style.fieldRow)}>
                    <span className={css(style.fieldLabel)}>{__('Type')}</span>
                    <div className={css(style.pillGroup)}>
                      <button
                        type="button"
                        onClick={() => watermarkHandler(pdfConf.setting?.watermark?.active === 'txt' ? '' : 'txt')}
                        className={`${css(style.pill)} ${pdfConf.setting?.watermark?.active === 'txt' ? css(style.pillActive) : ''}`}
                      >
                        {__('Text')}
                      </button>
                      <button
                        type="button"
                        onClick={() => watermarkHandler(pdfConf.setting?.watermark?.active === 'img' ? '' : 'img')}
                        className={`${css(style.pill)} ${pdfConf.setting?.watermark?.active === 'img' ? css(style.pillActive) : ''}`}
                      >
                        {__('Image')}
                      </button>
                    </div>
                  </div>

                  {pdfConf.setting?.watermark?.active === 'txt' && (
                    <div className={css(style.fieldRow)}>
                      <label htmlFor="watermarkText" className={css(style.fieldCol)}>
                        <span className={css(style.fieldLabel)}>{__('Watermark text')}</span>
                        <input
                          id="watermarkText"
                          name="watermarkText"
                          onChange={(e) => settingHandler('setting->watermark->txt', e.target.value)}
                          value={pdfConf.setting?.watermark?.txt || ''}
                          className="btcd-paper-inp mt-1"
                          placeholder={__('Watermark Text')}
                          type="text"
                        />
                      </label>
                    </div>
                  )}

                  {pdfConf.setting?.watermark?.active === 'img' && (
                    <>
                      <div className={css(style.fieldRow)}>
                        <span className={css(style.fieldLabel)}>{__('Watermark image')}</span>
                        <WatermarkUpload
                          src={pdfConf.setting?.watermark?.img?.src}
                          onUpload={(url: string) => settingHandler('setting->watermark->img->src', url)}
                          onBrowse={setWpMedia}
                        />
                      </div>

                      <div className={css(style.grid2)}>
                        <label htmlFor="width" className={css(style.fieldCol)}>
                          <span className={css(style.fieldLabel)}>{__('Width (mm)')}</span>
                          <input
                            id="width"
                            onChange={(e) => settingHandler('setting->watermark->img->width', e.target.value)}
                            value={pdfConf.setting?.watermark?.img?.width || ''}
                            className="btcd-paper-inp mt-1"
                            placeholder={__('Image width')}
                            type="number"
                          />
                        </label>
                        <label htmlFor="height" className={css(style.fieldCol)}>
                          <span className={css(style.fieldLabel)}>{__('Height (mm)')}</span>
                          <input
                            id="height"
                            onChange={(e) => settingHandler('setting->watermark->img->height', e.target.value)}
                            value={pdfConf.setting?.watermark?.img?.height || ''}
                            className="btcd-paper-inp mt-1"
                            placeholder={__('Image height')}
                            type="number"
                          />
                        </label>
                      </div>

                      <div className={css(style.grid2)}>
                        <label htmlFor="posX" className={css(style.fieldCol)}>
                          <span className={css(style.fieldLabel)}>{__('Position X (mm)')}</span>
                          <input
                            id="posX"
                            onChange={(e) => settingHandler('setting->watermark->img->posX', e.target.value)}
                            value={pdfConf.setting?.watermark?.img?.posX || ''}
                            className="btcd-paper-inp mt-1"
                            placeholder={__('Position X')}
                            type="number"
                          />
                        </label>
                        <label htmlFor="posY" className={css(style.fieldCol)}>
                          <span className={css(style.fieldLabel)}>{__('Position Y (mm)')}</span>
                          <input
                            id="posY"
                            onChange={(e) => settingHandler('setting->watermark->img->posY', e.target.value)}
                            value={pdfConf.setting?.watermark?.img?.posY || ''}
                            className="btcd-paper-inp mt-1"
                            placeholder={__('Position Y')}
                            type="number"
                          />
                        </label>
                      </div>

                      <div className={css(style.grid2)}>
                        <div className={css(style.fieldCol)}>
                          <span className={css(style.fieldLabel)}>{__('Show behind page content')}</span>
                          <div className={css({ flx: 'align-center', gp: 15, mt: 8 })}>
                            <CheckBox
                              radio
                              onChange={e => settingHandler('setting->watermark->img->imgBehind', e.target.value)}
                              checked={pdfConf.setting?.watermark?.img?.imgBehind === 'true'}
                              title={<span>{__('Yes')}</span>}
                              value="true"
                            />
                            <CheckBox
                              radio
                              onChange={e => settingHandler('setting->watermark->img->imgBehind', e.target.value)}
                              checked={pdfConf.setting?.watermark?.img?.imgBehind === 'false'}
                              title={<span>{__('No')}</span>}
                              value="false"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {pdfConf.setting?.watermark?.active && (
                    <div className={css(style.grid2)}>
                      <label htmlFor="opacity" className={css(style.fieldCol)}>
                        <span className={css(style.fieldLabel)}>{__('Opacity (0-100)')}</span>
                        <input
                          id="opacity"
                          onChange={(e) => settingHandler('setting->watermark->alpha', e.target.value)}
                          value={pdfConf.setting?.watermark?.alpha || ''}
                          className="btcd-paper-inp mt-1"
                          placeholder={__('e.g. 50')}
                          max="100"
                          type="number"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </Accordion>
            </>
          )}
        </SettingCard>
      </div>
    </div>
  )
}

interface WatermarkUploadProps {
  src?: string
  onUpload: (url: string) => void
  onBrowse?: () => void
}

function WatermarkUpload({ src, onUpload, onBrowse }: WatermarkUploadProps) {
  const { css } = useFela()
  const [dragOver, setDragOver] = useState(false)
  const [reading, setReading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const readImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(__('Please upload an image file.'))
      return
    }

    setReading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      onUpload(e.target?.result as string)
      setReading(false)
      toast.success(__('Image added successfully.'))
    }
    reader.onerror = () => {
      setReading(false)
      toast.error(__('Failed to read image.'))
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) readImage(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleClick = () => {
    if (onBrowse) {
      onBrowse()
    } else {
      fileInputRef.current?.click()
    }
  }

  return (
    <div
      className={css([style.dropzone, dragOver && style.dropzoneActive])}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className={css(style.fileInput)}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) readImage(file)
          e.target.value = ''
        }}
      />
      {src ? (
        <img className={css(style.previewImg)} src={src} alt="" />
      ) : (
        <>
          <FileUploadIcn size={34} />
          <div className={css(style.dropzoneTitle)}>{__('Upload image')}</div>
          <div className={css(style.dropzoneHint)}>{__('Click to browse or drag & drop')}</div>
        </>
      )}
      {reading && <div className={css(style.uploading)}>{__('Reading...')}</div>}
    </div>
  )
}

const style = {
  wrap: {
    mxw: 920,
  },
  bar: {
    pn: 'sticky',
    tp: -30,
    zx: 10,
    flx: 'align-center',
    gp: 12,
    p: '14px 16px',
    mb: 16,
    bd: 'var(--bf-bg-white)',
    bb: '1px solid var(--bf-stroke-clr)',
    bs: 'var(--bf-shadow-bottom, 0 1px 2px 0 rgba(0,0,0,.05))',
  },
  barModal: {
    flx: 'align-center',
    gp: 12,
    p: '14px 16px',
    mb: 16,
    bd: 'var(--bf-bg-white)',
    bb: '1px solid var(--bf-stroke-clr)',
  },
  nameInp: {
    w: 280,
    fw: 600,
  },
  body: {},
  cardTitle: {
    flx: 'align-center',
    gp: 8,
    fw: 700,
    fs: 15,
    cr: 'var(--bf-text-clr-dark, #1f2937)',
  },
  editorSection: {
    '&:not(:first-child)': { mt: 20 },
  },
  sectionLabel: {
    dy: 'block',
    fs: 11,
    fw: 600,
    cr: 'var(--bf-text-clr-secondary, #6b7280)',
    tt: 'uppercase',
    ls: '0.5px',
    mb: 6,
  },
  sectionLabelCenter: {
    ta: 'center',
  },
  fieldRow: {
    mt: 14,
    '&:first-child': { mt: 0 },
  },
  fieldLabel: {
    dy: 'block',
    fw: 500,
    fs: 13,
    cr: 'var(--bf-text-clr-dark, #1f2937)',
    mb: 4,
  },
  fieldInputGroup: {
    flx: 'align-center',
    gp: 10,
    fxw: 'wrap',
  },
  addFieldSelect: {
    w: 130,
    cur: 'pointer',
  },
  grid2: {
    dy: 'flex',
    ai: 'flex-start',
    gp: 12,
    mt: 12,
    '&:first-child': { mt: 0 },
    '@media (max-width: 576px)': { fd: 'column' },
  },
  accordionBody: {
    p: 0,
  },
  fieldCol: {
    w: '100%',
    flex: 1,
  },
  dirButtons: {
    flx: 'align-center',
    gp: 10,
    mt: 5,
  },
  dirBtn: {
    flx: 'center',
    gp: 6,
    w: '100%',
    p: '10px 16px',
    brs: 'var(--bf-bdr-radius-sm, 6px)',
    b: '1px solid var(--bf-stroke-clr)',
    bd: 'var(--bf-bg-white)',
    cr: 'var(--bf-text-clr-dark, #1f2937)',
    fs: 14,
    fw: 500,
    cur: 'pointer',
    tn: 'all .2s',
    ':hover': {
      bd: 'var(--bf-bg-offwhite, #f8fafc)',
    },
  },
  dirBtnActive: {
    bd: 'var(--bf-bg-bluishwhite, #f5faff)',
    bcr: 'var(--bf-primary-500, #3b82f6)',
    cr: 'var(--bf-primary-600, #2563eb)',
  },
  dirIcon: {
    se: 20,
  },
  pillGroup: {
    flx: 'align-center',
    gp: 8,
    mt: 4,
  },
  pill: {
    p: '8px 16px',
    brs: 'var(--bf-bdr-radius-sm, 6px)',
    b: '1px solid var(--bf-stroke-clr)',
    bd: 'var(--bf-bg-white)',
    cr: 'var(--bf-text-clr-dark, #1f2937)',
    fs: 14,
    fw: 500,
    cur: 'pointer',
    tn: 'all .2s',
    ':hover': {
      bd: 'var(--bf-bg-offwhite, #f8fafc)',
    },
  },
  pillActive: {
    bd: 'var(--bf-bg-bluishwhite, #f5faff)',
    bcr: 'var(--bf-primary-500, #3b82f6)',
    cr: 'var(--bf-primary-600, #2563eb)',
  },
  accr: {
    mt: 10,
    '&:first-child': { mt: 0 },
  },
  dropzone: {
    mt: 6,
    p: '28px 16px',
    fd: 'column',
    flx: 'center',
    ta: 'center',
    cur: 'pointer',
    b: '2px dashed var(--bf-stroke-clr)',
    brs: 'var(--bf-bdr-radius-lg, 8px)',
    bd: 'var(--bf-bg-offwhite, #f8fafc)',
    cr: 'var(--bf-text-clr-secondary, #6b7280)',
    tn: 'border-color .2s, background .2s',
    pn: 'relative',
    ':hover': {
      bcr: 'var(--bf-primary-500, #3b82f6)',
      bd: 'var(--bf-bg-bluishwhite, #f5faff)',
    },
  },
  dropzoneActive: {
    bcr: 'var(--bf-primary-500, #3b82f6)',
    bd: 'var(--bf-bg-bluishwhite, #f5faff)',
  },
  fileInput: {
    pn: 'absolute',
    oy: 0,
    w: 0,
    h: 0,
  },
  dropzoneTitle: {
    mt: 8,
    fw: 600,
    fs: 14,
    cr: 'var(--bf-text-clr-dark, #1f2937)',
  },
  dropzoneHint: {
    fs: 12,
    mt: 2,
  },
  previewImg: {
    maxHeight: 120,
    maxWidth: '100%',
    brs: 4,
  },
  uploading: {
    pn: 'absolute',
    tp: 0,
    lt: 0,
    w: '100%',
    h: '100%',
    flx: 'center',
    bd: 'rgba(255,255,255,0.85)',
    cr: 'var(--bf-text-clr-dark, #1f2937)',
    fw: 600,
    fs: 14,
  },
}
