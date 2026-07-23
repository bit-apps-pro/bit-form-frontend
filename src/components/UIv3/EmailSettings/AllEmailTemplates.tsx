// @ts-nocheck
/* eslint-disable react/no-unstable-nested-components */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { $mailTemplates, $updateBtn, $workflows } from '../../../GlobalStates/GlobalStates'
import ConditionalIcn from '../../../Icons/ConditionalIcn'
import CopyIcn from '../../../Icons/CopyIcn'
import EditIcn from '../../../Icons/EditIcn'
import FileUploadIcn from '../../../Icons/FileUploadIcn'
import PdfIcn from '../../../Icons/PdfIcn'
import PlusIcn from '../../../Icons/PlusIcn'
import StackIcn from '../../../Icons/StackIcn'
import TrashIcn from '../../../Icons/TrashIcn'
import UserIcn from '../../../Icons/UserIcn'
import ut from '../../../styles/2.utilities'
import app from '../../../styles/app.style'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import Button from '../../Utilities/Button'
import ConfirmModal from '../../Utilities/ConfirmModal'
import SingleToggle from '../../Utilities/SingleToggle'
import Table from '../../Utilities/Table'
import { removeInlineConditionalWorkflow } from '../CompSettings/Workflows/InlineConditionalLogic'
import { MailTemplate, Workflow } from '../Types/templates.types'

interface EmailTemplateBadgesProps {
  template: MailTemplate
  workflows: Workflow[]
  css: (styles: any) => string
}

function EmailTemplateBadges({ template, workflows, css }: EmailTemplateBadgesProps) {
  const cfg = template.config || {}
  const toCount = Array.isArray(cfg.to) ? cfg.to.length : 0
  const ccCount = Array.isArray(cfg.cc) ? cfg.cc.length : 0
  const bccCount = Array.isArray(cfg.bcc) ? cfg.bcc.length : 0
  const fileCount = (Array.isArray(cfg.attachment) ? cfg.attachment.length : 0)
    + (Array.isArray(cfg.mediaAttachment) ? cfg.mediaAttachment.length : 0)
  const pdfCount = Array.isArray(cfg.pdfIds) ? cfg.pdfIds.length : (cfg.pdfId ? 1 : 0)
  const targetId = String(template.id || template.clRef || '')
  const hasConditional = (Array.isArray(cfg.routing) && cfg.routing.length > 0)
    || workflows.some(wf => wf?.info?.type === 'advanced'
      && wf?.info?.action === 'email'
      && String(wf?.info?.targetId) === targetId
      && wf?.status === 1)

  const badges: Array<{ key: string; icon?: React.ReactNode; text: React.ReactNode; style: string }> = []
  if (toCount > 0) {
    badges.push({
      key: 'to',
      icon: <UserIcn size="13" stroke={2} />,
      text: toCount === 1 ? cfg.to![0] : `${toCount} ${__('recipients')}`,
      style: 'recipient',
    })
  }
  if (ccCount > 0) {
    badges.push({
      key: 'cc',
      icon: <UserIcn size="13" stroke={2} />,
      text: 'CC',
      style: 'cc',
    })
  }
  if (bccCount > 0) {
    badges.push({
      key: 'bcc',
      icon: <UserIcn size="13" stroke={2} />,
      text: 'BCC',
      style: 'bcc',
    })
  }
  if (fileCount > 0) {
    badges.push({
      key: 'files',
      icon: <FileUploadIcn size="13" />,
      text: `${fileCount} ${fileCount === 1 ? __('file') : __('files')}`,
      style: 'files',
    })
  }
  if (pdfCount > 0) {
    badges.push({
      key: 'pdf',
      icon: <PdfIcn size="13" stroke={2} />,
      text: pdfCount === 1 ? 'PDF' : `${pdfCount} PDF`,
      style: 'pdf',
    })
  }
  if (hasConditional) {
    badges.push({
      key: 'conditional',
      icon: <ConditionalIcn size="13" />,
      text: __('Conditional'),
      style: 'conditional',
    })
  }

  if (badges.length === 0) {
    return <span className={css(info.noInfo)}>{__('—')}</span>
  }

  return (
    <div className={css(info.wrap)}>
      {badges.map(badge => (
        <span key={badge.key} className={css(info.badge, info[badge.style])}>
          <span className={css(info.icon)}>{badge.icon}</span>
          <span>{badge.text}</span>
        </span>
      ))}
    </div>
  )
}

interface AllEmailTemplatesProps {
  formID: number | string
}

interface ConfirmModalState {
  show: boolean
  btnTxt?: string
  body?: React.ReactNode
  btnClass?: string
  action?: () => void
}

export default function AllEmailTemplates({ formID }: AllEmailTemplatesProps) {
  const [mailTem, setMailTem] = useAtom<MailTemplate[]>($mailTemplates)
  const workflows = useAtomValue<Workflow[]>($workflows)
  const setWorkflows = useSetAtom($workflows)
  const setUpdateBtn = useSetAtom($updateBtn)
  const markUnsaved = () => setUpdateBtn(prev => ({ ...prev, unsaved: true }))
  const [confMdl, setconfMdl] = useState<ConfirmModalState>({ show: false })
  const { css } = useFela()
  const { pathname: url } = useLocation()

  const duplicateTem = (i: number) => {
    const newMailTemObj = create(mailTem, draft => {
      draft.splice(i + 1, 0, { title: draft[i].title, sub: draft[i].sub, body: draft[i].body } as MailTemplate)
      draft.push({ updateTem: 1 } as MailTemplate)
    })
    setMailTem(newMailTemObj)
  }

  const delTem = async (i: number, templateData: { original: MailTemplate }) => {
    if (templateData.original.id) {
      const deletePromise = bitsFetch({ formID, id: templateData.original.id }, 'bitforms_delete_mailtemplate')
        .then(res => {
          if (res !== undefined && res.success) {
            const mailTemp = deepCopy(mailTem)
            mailTemp.splice(i, 1)
            setMailTem(mailTemp)
          }
        })
      toast.promise(deletePromise, {
        loading: 'Deleting',
        success: 'Successfully Deleted',
        error: 'Error Occurred',
      })
    } else {
      const mailTemp = deepCopy(mailTem)
      mailTemp.splice(i, 1)
      setMailTem(mailTemp)
    }
    const wfTargetId = templateData.original.id || templateData.original.clRef
    await removeInlineConditionalWorkflow('email', wfTargetId, formID, workflows, setWorkflows, markUnsaved)
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }
  const temDelConf = (i: number, templateData: { original: MailTemplate }) => {
    confMdl.btnTxt = __('Delete')
    confMdl.body = __('Are you sure to delete this template')
    confMdl.btnClass = ''
    confMdl.action = () => { delTem(i, templateData); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const temDupConf = (i: number) => {
    confMdl.btnTxt = __('Duplicate')
    confMdl.body = __('Are you sure to duplicate this template?')
    confMdl.btnClass = 'blue'
    confMdl.action = () => { duplicateTem(i); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const toggleStatus = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    setMailTem(prev => create(prev, draft => {
      draft[i].status = e.target.checked ? 1 : 0
    }))
    markUnsaved(prev => ({ ...prev, unsaved: true }))
  }

  const addNewBtn = (
    <Link to={`${url}/new`} className={`${css(app.btn)} tertiary`}>
      <PlusIcn size="16" />
      {__('Add new template')}
    </Link>
  )

  const col = [
    {
      Header: __('Template Name'),
      accessor: 'title',
      minWidth: 130,
      width: 160,
      Cell: (row: any) => (
        <NavLink
          to={`${url}/${row.row.index}`}
          className={css(styles.ellipseText)}
          title={row.cell.value}
        >
          <b>{row.cell.value}</b>
        </NavLink>
      ),
    },
    {
      Header: __('Subject'),
      accessor: 'sub',
      minWidth: 110,
      width: 140,
      Cell: (row: any) => (
        <span
          className={css(styles.ellipseText)}
          title={row.cell.value}
        >
          {row.cell.value}
        </span>
      ),
    },
    {
      Header: __('Other Info'),
      accessor: 'config',
      minWidth: 100,
      width: 130,
      Cell: (row: any) => (
        <EmailTemplateBadges
          template={row.row.original}
          workflows={workflows}
          css={css}
        />
      ),
    },
    {
      Header: __('Status'),
      accessor: 'status',
      minWidth: 50,
      width: 60,
      Cell: (row: any) => (
        <SingleToggle
          name={`mail-tem-status-${row.row.index}`}
          isChecked={row.cell.value === undefined ? true : !!row.cell.value}
          action={e => toggleStatus(e as unknown as React.ChangeEvent<HTMLInputElement>, row.row.index)}
        />
      ),
    },
    {
      Header: __('Actions'),
      accessor: 'action',
      minWidth: 80,
      width: 100,
      Cell: (row: any) => (
        <>
          <Button onClick={() => temDupConf(row.row.index)} className="icn-btn tooltip pos-rel" style={{ '--tooltip-txt': `'${__('Duplicate')}'` } as React.CSSProperties}>
            <CopyIcn size="22" />
          </Button>
          <NavLink to={`${url}/${row.row.index}`} className="icn-btn flx flx-center tooltip pos-rel" style={{ '--tooltip-txt': `'${__('Edit')}'` } as React.CSSProperties}>
            <EditIcn size="22" />
          </NavLink>
          <Button onClick={() => temDelConf(row.row.index, row.row)} className="icn-btn tooltip pos-rel" style={{ '--tooltip-txt': `'${__('Delete')}'` } as React.CSSProperties}>
            <TrashIcn size="21" />
          </Button>
        </>
      ),
    },
  ]

  return (
    <div className={css(styles.rootContainer)}>
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />
      <h2>{__('Email Templates')}</h2>
      <h5>
        {__('How to setup Email Templates & Send Email Notification:')}
        &nbsp;
        <a href={tutorialLinks.emailTemplates.link} target="_blank" rel="noreferrer" className="yt-txt ml-1 mr-1">
          {__('YouTube')}
        </a>
        <a href={tutorialLinks.emailTemplatesDoc.link} target="_blank" rel="noreferrer" className="doc-txt">
          {__('Documentation')}
        </a>
      </h5>
      {mailTem.length > 0 ? (
        <div className={css(emailListStyles)}>
          <Table
            height="50vh"
            className={`btcd-neu-table ${css(tableStyles)} mr-1`}
            columns={col}
            data={mailTem}
            rightHeader={addNewBtn}
            searchPlaceholder={__('Search templates...')}
            countLabel={`${__('Showing')} ${mailTem.length} ${__('of')} ${mailTem.length} ${__('templates')}`}
            paginationClassName="btcd-pagination-compact"
          />
        </div>
      )
        : (
          <>
            <div className={css(styles.emptyBar)}>
              {addNewBtn}
            </div>
            <div className={css(ut.btcdEmpty, ut.txCenter)}>
              <StackIcn size="50" />
              {__('Empty')}
            </div>
          </>
        )}
      <div className={css(ut.highlightWrapper)}>
        <strong>{__('Note: ')}</strong>
        {__('By default, all enabled Email Templates are sent automatically. Add conditional logic only to send a specific email based on submitted values.')}
      </div>
    </div>
  )
}

const info = {
  wrap: {
    dy: 'flex',
    flxp: 'wrap',
    gp: 6,
  },
  badge: {
    dy: 'inline-flex',
    ai: 'center',
    gp: 4,
    px: 7,
    py: 3,
    brs: 'var(--bf-bdr-radius-sm, 6px)',
    fs: 11,
    fw: 500,
    lh: 1.3,
    ws: 'nowrap',
  },
  icon: {
    w: 13,
    h: 13,
    flx: 'center',
    '& svg': { w: '100%', h: '100%' },
  },
  recipient: {
    bd: 'var(--bf-primary-50, #eff6ff)',
    cr: 'var(--bf-primary-700, #1d4ed8)',
  },
  cc: {
    bd: 'var(--bf-secondary-100, #eef2ff)',
    cr: 'var(--bf-secondary-700, #4338ca)',
  },
  bcc: {
    bd: 'hsla(var(--bf-danger-h), var(--bf-danger-s), 96%, 1)',
    cr: 'hsla(var(--bf-danger-h), var(--bf-danger-s), 40%, 1)',
  },
  files: {
    bd: 'hsla(var(--bf-success-h), var(--bf-success-s), 95%, 1)',
    cr: 'hsla(var(--bf-success-h), var(--bf-success-s), 28%, 1)',
  },
  pdf: {
    bd: 'hsla(168, 76%, 95%, 1)',
    cr: 'hsla(168, 76%, 32%, 1)',
  },
  conditional: {
    bd: 'hsla(var(--bf-warning-h), var(--bf-warning-s), 95%, 1)',
    cr: 'hsla(var(--bf-warning-h), var(--bf-warning-s), 35%, 1)',
  },
  noInfo: {
    cr: 'var(--bf-text-clr-secondary, #9ca3af)',
    fs: 12,
  },
}

const tableStyles = {
  padding: 0,
  background: 'var(--bf-bg-white)',
  border: '1px solid var(--bf-stroke-clr)',
  borderRadius: 'var(--bf-bdr-radius-md)',
  overflow: 'hidden',

  '& .thead': {
    bd: 'var(--bf-bg-offwhite, #f8fafc)',
    borderRadius: 'var(--bf-bdr-radius-md) var(--bf-bdr-radius-md) 0 0',
    padding: '10px 12px',
    borderBottom: '1px solid var(--bf-stroke-clr)',

    '& .th': {
      borderRight: 'none',
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      color: 'var(--bf-text-clr-tertiary, #64748b)',
    },
    '& .th:nth-child(4)': {
      jc: 'center',
    },
  },

  '& .tbody': {
    '& .tr': {
      p: '12px 10px',
      bb: '1px solid var(--bf-stroke-clr)',

      '&:last-child': {
        bb: 'none',
      },

      '& .td': {
        br: 'none',
        cr: 'var(--bf-text-clr-dark)',
      },
      '& .td:nth-child(4)': {
        jc: 'center',
      },
    },
  },

  '& .icn-btn': {
    bd: 'var(--bf-bg-white)',
    b: '1px solid var(--bf-stroke-clr)',
    brs: 'var(--bf-bdr-radius-sm)',
    mr: 6,
    mt: 0,
    p: '5px !important',

    '&:hover': {
      bd: 'var(--bf-bg-offwhite, #f8fafc)',
    },

    '&:last-child': {
      mr: 0,
    },
  },
}

const emailListStyles = {
  '& .btcd-pagination-compact': {
    margin: '6px 0 0 0',
    paddingBottom: 0,

    '& > small': {
      color: 'var(--bf-text-clr-secondary)',
    },
  },
}
const styles = {
  rootContainer: {
    mnw: 800,
    mxw: 1000,
  },
  emptyBar: {
    flx: 'align-center',
    jc: 'center',
    mb: 10,
  },
  ellipseText: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}
