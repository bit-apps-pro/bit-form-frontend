// @ts-nocheck
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import { $bits, $fieldsArr, $mailTemplates, $pdfTemplates, $proModal, $updateBtn, $workflows } from '../../../GlobalStates/GlobalStates'
import BackIcn from '../../../Icons/BackIcn'
import CloseIcn from '../../../Icons/CloseIcn'
import FileUploadIcn from '../../../Icons/FileUploadIcn'
import PlusIcn from '../../../Icons/PlusIcn'
import TrashIcn from '../../../Icons/TrashIcn'
import { IS_PRO } from '../../../Utils/Helpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { fileUpOrMappableImageFieldTypes, nonMappableFields } from '../../../Utils/StaticData/allStaticArrays'
import proHelperData from '../../../Utils/StaticData/proHelperData'
import { generateCLRef } from '../../../Utils/clRef'
import { __ } from '../../../Utils/i18nwrap'
import useWPUsers from '../../../hooks/useWPUsers'
import app from '../../../styles/app.style'
import PdfTemplateEditor, { createDefaultPdfTemplate } from '../../UIv3/PDFSettings/PdfTemplateEditor'
import Button from '../../Utilities/Button'
import DropDown from '../../Utilities/DropDown'
import Modal from '../../Utilities/Modal'
import ProBadge from '../../Utilities/ProBadge'
import SettingCard from '../../Utilities/SettingCard'
import SingleToggle from '../../Utilities/SingleToggle'
import TinyMCE from '../../Utilities/TinyMCE'
import Accordion from '../../style-new/util-components/Accordion'
import InlineConditionalLogic from '../CompSettings/Workflows/InlineConditionalLogic'
import {
  Bits, FormField, MailOptionGroup, MailRoute, MailTemplate, PdfTemplate,
} from '../Types/templates.types'

// Single form for creating a new email template AND editing an existing one. Mode is decided by the
// presence of the :id route param. New mode keeps a local draft (with a clRef temp id so inline
// conditional logic can bind before the template has a DB id); edit mode mutates $mailTemplates[id].
export default function EmailTemplateConfigEditor() {
  const { formType, formID, id } = useParams<{ formType: string; formID: string; id?: string }>()
  const isEdit = id !== undefined
  const navigate = useNavigate()
  const [mailTemp, setMailTem] = useAtom<MailTemplate[]>($mailTemplates)
  const formFields = useAtomValue<FormField[]>($fieldsArr)
  const [filterFields] = useState<FormField[]>(() => formFields.filter(field => !nonMappableFields.includes(field.typ)))
  const { userMail } = useWPUsers()
  const [pdfTem, setPdfTem] = useAtom<PdfTemplate[]>($pdfTemplates)
  const setProModal = useSetAtom($proModal)
  const { css } = useFela()
  const bits = useAtomValue<Bits>($bits)
  const { isPro } = bits
  const workflows = useAtomValue<any[]>($workflows)
  const setWorkflows = useSetAtom($workflows)
  const markUnsaved = useSetAtom($updateBtn)

  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfModalIdx, setPdfModalIdx] = useState<number | null>(null)

  const openPdfModal = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.pdfProInstalledAlert })
      return
    }
    const newIndex = pdfTem.length
    setPdfTem(prev => create(prev, draft => {
      draft.push(createDefaultPdfTemplate(bits.allFormSettings?.pdf))
      draft.push({ updateTem: 1 } as PdfTemplate)
    }))
    setPdfModalIdx(newIndex)
    setShowPdfModal(true)
  }

  const [draft, setDraft] = useState<MailTemplate>(() => ({
    title: 'Untitled Template',
    sub: 'Email Subject',
    // eslint-disable-next-line no-template-curly-in-string
    body: '${bf_all_data}',
    status: 1,
    config: {},
    // temp ref so inline CL can bind before the template has a DB id (remapped to the real id on save)
    clRef: generateCLRef('emailcl'),
  }))
  const savedRef = useRef(false)

  useEffect(() => {
    if (isEdit) return
    const targetId = draft.clRef
    return () => {
      if (savedRef.current) return
      setWorkflows((prev: any[]) => {
        const idx = prev.findIndex((wf: any) =>
          wf?.info?.type === 'advanced'
          && wf?.info?.action === 'email'
          && String(wf?.info?.targetId) === String(targetId),
        )
        if (idx === -1) return prev
        return create(prev, (d: any[]) => { d.splice(idx, 1) })
      })
    }
  }, [])

  if (isEdit && (mailTemp.length < 1 || !mailTemp[Number(id)])) {
    return <Navigate to={`/form/settings/edit/${formID}/email-templates`} replace />
  }

  const tem = isEdit ? mailTemp[Number(id)] : draft
  const updateTem = (updater: (t: MailTemplate) => void) => {
    if (isEdit) {
      setMailTem(prev => create(prev, d => { updater(d[Number(id)]) }))
    } else {
      setDraft(prev => create(prev, d => { updater(d) }))
    }
  }

  const cfg = tem.config || {}
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => updateTem(t => { t.title = e.target.value })
  const handleSubject = (e: React.ChangeEvent<HTMLInputElement>) => updateTem(t => { t.sub = e.target.value })
  const handleBody = (val: string) => updateTem(t => { t.body = val })
  const handleStatus = (e: React.ChangeEvent<HTMLInputElement>) => updateTem(t => { t.status = e.target.checked ? 1 : 0 })
  const addFieldToSubject = (e: React.ChangeEvent<HTMLSelectElement>) => updateTem(t => { t.sub += e.target.value })
  const setEmailConfig = (typ: string, value: any) => updateTem(t => { if (!t.config) t.config = {}; t.config[typ] = value })

  // Multi-PDF attachments. Option values are single-key JSON ({"id":"7"} / {"index":"0"}),
  // so they never contain a comma — safe for the DropDown's comma-joined value contract.
  // `pdfId` (legacy single key) is kept in sync with the first selection so older Pro
  // versions keep attaching one PDF.
  const pdfAttachmentValue = cfg.pdfIds ?? (cfg.pdfId ? [cfg.pdfId] : [])
  const pdfTemplateOptions = (pdfTem || [])
    .map((itm, i) => ({
      label: itm.title,
      value: itm.id ? JSON.stringify({ id: String(itm.id) }) : JSON.stringify({ index: String(i) }),
    }))
    // drop marker/incomplete entries AFTER mapping so `index` values stay aligned with $pdfTemplates
    .filter(opt => opt.label !== undefined)
  const setPdfAttachments = (val: string) => {
    const ids = val ? val.split(',') : []
    updateTem(t => {
      if (!t.config) t.config = {}
      t.config.pdfIds = ids
      t.config.pdfId = ids[0] || ''
    })
  }

  // Conditional email routing (Pro): send to a recipient when a field condition matches.
  const routing = cfg.routing || []
  const proGuard = () => {
    if (!isPro) {
      setProModal({ show: true })
      return false
    }
    return true
  }
  const addRoute = () => {
    if (!proGuard()) return
    setEmailConfig('routing', [...routing, { to: '', field: '', operator: 'equal', value: '' }])
  }
  const updateRoute = (i: number, key: keyof MailRoute, val: string) => setEmailConfig('routing', routing.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)))
  const removeRoute = (i: number) => setEmailConfig('routing', routing.filter((_, idx) => idx !== i))

  const openMediaLibrary = () => {
    if (!window.wp || !window.wp.media) return
    const frame = window.wp.media({
      title: __('Select Email Attachments'),
      multiple: true,
      button: { text: __('Add to Email') },
    })
    frame.on('select', () => {
      const ids = frame.state().get('selection').map((attachment: any) => attachment.id)
      setEmailConfig('mediaAttachment', ids)
    })
    frame.open()
  }

  const fileInFormField = () => formFields
    .filter(field => fileUpOrMappableImageFieldTypes.includes(field.type))
    .map(field => ({ label: field.name, value: field.key }))

  // Recipient options (form email fields + WP user emails) — computed once, reused by every dropdown.
  const mailOpts = useMemo<MailOptionGroup[]>(() => {
    const mail: MailOptionGroup[] = []
    const emailFlds = formFields.filter(fld => fld.type === 'email').map(fld => ({ label: fld.name, value: `\${${fld.key}}` }))
    if (emailFlds.length > 0) mail.push({ title: 'Form Fields', type: 'group', childs: emailFlds })
    if (userMail && Array.isArray(userMail)) mail.push({ title: 'WP Emails', type: 'group', childs: userMail })
    return mail
  }, [formFields, userMail])

  const save = () => {
    savedRef.current = true
    setMailTem(create(mailTemp, d => {
      if (!isEdit) d.push(tem)
      d.push({ updateTem: 1 } as MailTemplate)
    }))
    navigate(`/form/settings/${formType}/${formID}/email-templates`)
  }

  return (
    <div className={css(ed.wrap)}>
      <div className={css(ed.bar)}>
        <NavLink
          to={`/form/settings/${formType}/${formID}/email-templates`}
          className={`${css(app.btn)} btcd-btn-o-gray`}
        >
          <BackIcn className="mr-1" />
          {__('Back')}
        </NavLink>

        <input
          onChange={handleTitle}
          type="text"
          className={`btcd-paper-inp ${css(ed.nameInp)}`}
          placeholder={__('Template Name')}
          value={tem.title}
          aria-label={__('Template Name')}
          title="Template Name"
        />

        <div className="flx" style={{ alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <b>{__('Active Status')}</b>
          <SingleToggle
            name={`mail-tem-status-${id || 'new'}`}
            isChecked={tem.status === undefined ? true : !!tem.status}
            action={handleStatus}
          />
        </div>

        <button
          id="secondary-update-btn"
          onClick={save}
          className={`${css(app.btn)} blue`}
          type="button"
        >
          {isEdit ? __('Update Template') : __('Save Template')}
        </button>
      </div>

      <div className={css(ed.body)}>

        <SettingCard title={__('Recipients Emails & Others')} subtitle={__('Who will receives this notification email.')}>
          <DropDown
            action={val => setEmailConfig('to', val ? val.split(',') : [])}
            value={cfg.to}
            placeholder={__('Add Email Receiver')}
            title={<span className={css(ed.label)}>{__('To (Email)')}</span>}
            isMultiple
            titleClassName="w-10"
            className={`w-10 ${css(ed.ddTight)}`}
            addable
            options={mailOpts}
          />

          <div className="mt-3">
            <Accordion
              title={__('Conditional Email Routing')}
              subtitle={__('Send the notification to a different recipient when a submitted value matches a condition.')}
              isPro
              proProperty="conditionalEmailRouting"
              open={routing.length > 0}
              cls={css(ed.accr)}
            >
              <div className={css({ px: 30 })}>
                {routing.map((route, i) => (
                  <div key={`route-${i + 1}`} className="flx mt-2" style={{ alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="btcd-paper-inp"
                      style={{ width: 180 }}
                      placeholder={__('Email Address')}
                      value={route.to}
                      onChange={e => updateRoute(i, 'to', e.target.value)}
                    />
                    <span>{__('if')}</span>
                    <select className="btcd-paper-inp" style={{ width: 130 }} value={route.field} onChange={e => updateRoute(i, 'field', e.target.value)}>
                      <option value="">{__('Select')}</option>
                      {filterFields !== null && filterFields.map(f => <option key={f.key} value={f.key}>{f.name}</option>)}
                    </select>
                    <select className="btcd-paper-inp" style={{ width: 120 }} value={route.operator} onChange={e => updateRoute(i, 'operator', e.target.value)}>
                      <option value="equal">{__('equal')}</option>
                      <option value="not_equal">{__('not equal')}</option>
                      <option value="contain">{__('contains')}</option>
                      <option value="not_contain">{__('not contains')}</option>
                    </select>
                    <input
                      type="text"
                      className="btcd-paper-inp"
                      style={{ width: 130 }}
                      placeholder={__('Enter a value')}
                      value={route.value}
                      onChange={e => updateRoute(i, 'value', e.target.value)}
                    />
                    <Button onClick={() => removeRoute(i)} icn className="sh-sm white"><TrashIcn size={15} /></Button>
                  </div>
                ))}
                <Button onClick={addRoute} className="tertiary mt-2">
                  <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                  {__('Add Routing Rule')}
                </Button>
              </div>
            </Accordion>
          </div>

          <Accordion
            title={__('Other Email Configurations')}
            subtitle={__('CC, BCC, From, Reply-To —(optional).')}
            open={!!(cfg.from || cfg.from_name || cfg.replyto?.length || cfg.cc?.length || cfg.bcc?.length)}
            cls={css(ed.accr)}
          >
            <div className={css({ px: 30 })}>
              <DropDown
                action={val => setEmailConfig('cc', val ? val.split(',') : [])}
                value={cfg.cc}
                placeholder={__('Add Email CC')}
                title={<span className={css(ed.label)}>{__('CC')}</span>}
                isMultiple
                className={`w-10 ${css(ed.ddTight)}`}
                addable
                options={mailOpts}
              />
              <DropDown
                action={val => setEmailConfig('bcc', val ? val.split(',') : [])}
                value={cfg.bcc}
                placeholder={__('Add Email BCC')}
                title={<span className={css(ed.label)}>{__('BCC')}</span>}
                isMultiple
                titleClassName={css(ed.field)}
                className={`w-10 ${css(ed.ddTight)}`}
                addable
                options={mailOpts}
              />
              <DropDown
                action={val => setEmailConfig('from', val)}
                value={cfg.from}
                placeholder={__('Add mail from address')}
                title={<span className={css(ed.label)}>{__('From Mail')}</span>}
                titleClassName={css(ed.field)}
                className={`w-10 ${css(ed.ddTight)}`}
                addable
                options={mailOpts}
                tip={__('Some servers block emails if "From Email" differs from the authenticated (login) email — use the same email to ensure delivery.')}
              />
              <div className={css(ed.field)}>
                <label htmlFor="from_name" className={css(ed.label)}>{__('From Name')}</label>
                <input
                  id="from_name"
                  type="text"
                  className="btcd-paper-inp w-10"
                  style={{ height: '35px', marginTop: 5, background: 'var(--bf-bg-white)' }}
                  value={cfg.from_name || ''}
                  onChange={e => setEmailConfig('from_name', e.target.value)}
                  placeholder={__('Add mail from name')}
                />
              </div>
              <DropDown
                action={val => setEmailConfig('replyto', val ? val.split(',') : [])}
                value={cfg.replyto}
                placeholder={__('Reply To')}
                title={<span className={css(ed.label)}>{__('Reply To')}</span>}
                isMultiple
                titleClassName={css(ed.field)}
                className={`w-10 ${css(ed.ddTight)}`}
                addable
                options={mailOpts}
              />
            </div>
          </Accordion>
        </SettingCard>

        <SettingCard title={__('Subject')}>
          <div className="flx" style={{ alignItems: 'center', gap: 8 }}>
            <input
              onChange={handleSubject}
              type="text"
              className="btcd-paper-inp"
              style={{ flex: 1 }}
              placeholder={__('Email Subject Here')}
              value={tem.sub}
              aria-label={__('Subject')}
            />
            <select
              onChange={addFieldToSubject}
              className="btcd-paper-inp"
              style={{ width: 150 }}
              aria-label={__('Add field')}
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
        </SettingCard>

        <SettingCard title={__('Email Body')}>
          <label htmlFor={`mail-tem-${formID}`} className="w-10">
            <TinyMCE
              id={`mail-tem-${formID}`}
              formFields={formFields}
              value={tem.body}
              onChangeHandler={handleBody}
              width="100%"
              mapAllFieldWithTable
              mapAllField
              height="400"
            />
          </label>
        </SettingCard>

        <SettingCard title={__('Attachments')}>
          <DropDown
            action={val => setEmailConfig('attachment', val ? val.split(',') : [])}
            value={cfg.attachment}
            placeholder={__('Select form file fields')}
            title={<span className={css(ed.label)}>{__('Form File Fields')}</span>}
            isMultiple
            titleClassName="w-10"
            className={`w-10 mt-0 ${css(ed.ddTight)}`}
            options={fileInFormField()}
          />
          <div className="mt-3">

            <label htmlFor="pdf-attach-template" className={css(ed.label)}>{__('PDF Attachment Templates')} {!isPro && <ProBadge proProperty="pdfTemplate" />}</label>
            <div className="mt-1" />
            {pdfTem?.length > 0 ? (
              <div className={css(ed.pdfFieldWrapper)}>
                <DropDown
                  action={setPdfAttachments}
                  value={pdfAttachmentValue}
                  placeholder={__('Select PDF templates')}
                  isMultiple
                  titleClassName={css(ed.pdfDdGrow)}
                  className={`w-10 mt-0 ${css(ed.ddTight)}`}
                  options={pdfTemplateOptions}
                />
                <Button onClick={openPdfModal} className={`secondary mt-0 ${css({ h: 'stretch' })}`}>
                  <PlusIcn size="14" className="mr-1" />
                  {__('Add PDF')}
                </Button>
              </div>
            ) : (
              <div className={css(ed.emptyPdfState)}>
                <span>{__('No PDF templates found. Create one to attach to this email.')}</span>
                <Button onClick={openPdfModal} className="secondary mt-0">
                  <PlusIcn size="14" className="mr-1" />
                  {__('Create PDF Template')}
                </Button>
              </div>
            )}
          </div>
          <div className="mt-3">
            <span className={css(ed.label)}>{__('WordPress Media Library')}</span>
            <div
              role="button"
              tabIndex={0}
              className={css(ed.dropzone)}
              onClick={openMediaLibrary}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openMediaLibrary() }}
            >
              <FileUploadIcn size={34} />
              <div className={css(ed.dzText)}>{__('Drag & drop files here')}</div>
              <div className={css(ed.dzHint)}>{__('or browse from media library')}</div>
              <button type="button" className={`${css(app.btn)} blue mt-2`} onClick={e => { e.stopPropagation(); openMediaLibrary() }}>
                {__('Browse Files')}
              </button>
            </div>
            <div className="mt-1 flx" style={{ alignItems: 'center', gap: 10 }}>
              <small>{`${(cfg.mediaAttachment && cfg.mediaAttachment.length) || 0} ${__('selected')}`}</small>
              {cfg.mediaAttachment && cfg.mediaAttachment.length > 0 && (
                <button type="button" className={`${css(app.btn)}`} onClick={() => setEmailConfig('mediaAttachment', [])}>
                  {__('Clear')}
                </button>
              )}
            </div>
          </div>
        </SettingCard>

        <Modal
          show={showPdfModal}
          setModal={setShowPdfModal}
          md
          title={__('Add PDF Template')}
          autoHeight
          closeOnOutsideClick={false}
        >
          {pdfModalIdx !== null && (
            <PdfTemplateEditor modalMode editingIndex={pdfModalIdx} onClose={() => setShowPdfModal(false)} />
          )}
        </Modal>

        {(tem.id || tem.clRef) && (
          <InlineConditionalLogic
            action="email"
            targetId={tem.id || tem.clRef}
            formID={formID}
            title={`Email Logic - ${tem.title || tem.id || ''}`}
            effectLabels={{ show: __('Send'), hide: __('Don\'t Send') }}
          />
        )}
      </div>
    </div>
  )
}

const ed = {
  wrap: {
    mxw: 920,
    // m: '0 auto',
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
  nameInp: {
    w: 240,
    fw: 600,
  },
  body: {},
  field: {
    w: '100%',
    mt: 14,
  },
  // override DropDown's built-in 10px top margin on its control for a tighter label→input gap,
  // and fix the 99% width alignment issue from DropDown.jsx
  ddTight: {
    '&.msl-vars': { w: '100% !important' },
  },
  // lighter, lower-emphasis accordion section titles
  accr: {
    '& .btcd-accr-title .title': {
      cr: 'var(--bf-text-clr-secondary, #64748b)',
      fw: 600,
    },
  },
  pdfFieldWrapper: {
    flx: 'align-center',
    gp: 8,
  },
  // let the DropDown fill the row next to the "Add PDF" button (its wrapper is otherwise
  // shrink-to-content, leaving empty space and forcing selected chips onto multiple lines)
  pdfDdGrow: {
    flexGrow: 1,
    minWidth: 0,
  },
  emptyPdfState: {
    flx: 'column',
    gp: 10,
    p: 16,
    ta: 'center',
    b: '1px dashed var(--bf-stroke-clr)',
    brs: 'var(--bf-bdr-radius-lg, 8px)',
    bd: 'var(--bf-bg-offwhite, #f8fafc)',
    cr: 'var(--bf-text-clr-secondary, #6b7280)',
    fs: 13,
    ai: 'center',
  },
  label: {
    dy: 'inline-block',
    fw: 500,
    fs: 13,
    cr: 'var(--bf-text-clr-dark, #1f2937)',
    mb: 2,
  },
  dropzone: {
    mt: 4,
    p: '24px 16px',
    fd: 'column',
    flx: 'center',
    ta: 'center',
    cur: 'pointer',
    b: '2px dashed var(--bf-stroke-clr)',
    brs: 'var(--bf-bdr-radius-lg, 8px)',
    bd: 'var(--bf-bg-offwhite, #f8fafc)',
    cr: 'var(--bf-text-clr-secondary, #6b7280)',
    tn: 'border-color .2s, background .2s',
    '&:hover': {
      bcr: 'var(--bf-primary-500, #3b82f6)',
      bd: 'var(--bf-bg-bluishwhite, #f5faff)',
    },
  },
  dzText: {
    mt: 8,
    fw: 600,
    fs: 14,
    cr: 'var(--bf-text-clr-dark, #1f2937)',
  },
  dzHint: {
    fs: 12,
  },
}
