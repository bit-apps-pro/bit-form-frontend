// @ts-nocheck
/* eslint-disable react/no-unstable-nested-components */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { $bits, $pdfTemplates, $proModal, $updateBtn } from '../../../GlobalStates/GlobalStates'
import CopyIcn from '../../../Icons/CopyIcn'
import DirectionIcn from '../../../Icons/DirectionIcn'
import DownloadIcon from '../../../Icons/DownloadIcon'
import EditIcn from '../../../Icons/EditIcn'
import ImageIcn from '../../../Icons/ImageIcn'
import LockIcn from '../../../Icons/LockIcn'
import PlusIcn from '../../../Icons/PlusIcn'
import Settings2Icn from '../../../Icons/Settings2Icn'
import StackIcn from '../../../Icons/StackIcn'
import TextIcn from '../../../Icons/TextIcn'
import TrashIcn from '../../../Icons/TrashIcn'
import ut from '../../../styles/2.utilities'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy, IS_PRO } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import proHelperData from '../../../Utils/StaticData/proHelperData'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import Button from '../../Utilities/Button'
import ConfirmModal from '../../Utilities/ConfirmModal'
import ProOverlay from '../../Utilities/ProOverlay'
import SingleToggle from '../../Utilities/SingleToggle'
import Table from '../../Utilities/Table'
import { createDefaultPdfTemplate } from './PdfTemplateEditor'
import { Bits, PdfTemplate } from '../Types/templates.types'

function hasVisibleContent(value: any): boolean {
  if (!value || typeof value !== 'string') return false
  const text = value.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, '').trim()
  return text.length > 0
}

interface PdfTemplateBadgesProps {
  template: PdfTemplate
  css: (styles: any) => string
}

function PdfTemplateBadges({ template, css }: PdfTemplateBadgesProps) {
  const setting = template.setting || {}
  const pdfConfig = template.pdf_config || {}
  const badges: Array<{ key: string; icon?: React.ReactNode; text: string; style: string }> = []

  if (hasVisibleContent(pdfConfig.header)) {
    badges.push({
      key: 'header',
      text: __('Header'),
      style: 'header',
    })
  }

  if (hasVisibleContent(template.body)) {
    badges.push({
      key: 'body',
      text: __('Body'),
      style: 'body',
    })
  }

  if (hasVisibleContent(pdfConfig.footer)) {
    badges.push({
      key: 'footer',
      text: __('Footer'),
      style: 'footer',
    })
  }

  if (setting.password?.pass) {
    badges.push({
      key: 'password',
      icon: <LockIcn size="13" stroke={2} />,
      text: __('Password'),
      style: 'password',
    })
  }

  if (setting.allowDownload === 'all') {
    badges.push({
      key: 'download',
      icon: <DownloadIcon size="13" stroke={2} />,
      text: __('All users'),
      style: 'download',
    })
  } else if (setting.allowDownload === 'loggedIn') {
    badges.push({
      key: 'download',
      icon: <DownloadIcon size="13" stroke={2} />,
      text: __('Logged-in'),
      style: 'download',
    })
  }

  if (setting.override) {
    badges.push({
      key: 'override',
      icon: <Settings2Icn size="13" />,
      text: __('Custom'),
      style: 'override',
    })

    if (setting.paperSize) {
      badges.push({
        key: 'paperSize',
        text: setting.paperSize.toUpperCase(),
        style: 'layout',
      })
    }

    if (setting.orientation) {
      badges.push({
        key: 'orientation',
        icon: <DirectionIcn size="13" dir={setting.orientation === 'l' ? 'right' : 'down'} />,
        text: setting.orientation === 'l' ? __('Landscape') : __('Portrait'),
        style: 'layout',
      })
    }
  }

  if (setting.watermark?.active === 'txt') {
    badges.push({
      key: 'watermarkText',
      icon: <TextIcn size="13" />,
      text: __('Text Watermark'),
      style: 'watermark',
    })
  } else if (setting.watermark?.active === 'img') {
    badges.push({
      key: 'watermarkImg',
      icon: <ImageIcn w="13" />,
      text: __('Image Watermark'),
      style: 'watermark',
    })
  }

  if (badges.length === 0) {
    return <span className={css(info.noInfo)}>{__('—')}</span>
  }

  return (
    <div className={css(info.wrap)}>
      {badges.map(badge => (
        <span key={badge.key} className={css(info.badge, info[badge.style])}>
          {badge.icon && <span className={css(info.icon)}>{badge.icon}</span>}
          <span className={css(info.text)} title={badge.text}>{badge.text}</span>
        </span>
      ))}
    </div>
  )
}

interface AllPdfTemplatesProps {
  formID: number | string
}

interface ConfirmModalState {
  show: boolean
  btnTxt?: string
  body?: React.ReactNode
  btnClass?: string
  action?: () => void
}

export default function AllPdfTemplates({ formID }: AllPdfTemplatesProps) {
  const [pdfTem, setPdfTem] = useAtom<PdfTemplate[]>($pdfTemplates)
  const [confMdl, setconfMdl] = useState<ConfirmModalState>({ show: false })
  const { css } = useFela()
  const navigate = useNavigate()
  const { formType } = useParams<{ formType: string }>()
  const setProModal = useSetAtom($proModal)
  const markUnsaved = useSetAtom($updateBtn)

  const bits = useAtomValue<Bits>($bits)
  let { pdf } = bits.allFormSettings || {}

  if (pdf === undefined) {
    pdf = {
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
  }

  const { pathname: url } = useLocation()

  const duplicateTem = (i: number) => {
    const newPdfTemObj = create(pdfTem, draft => {
      const {
        title, body, setting, pdf_config: pdfConfig,
      } = draft[i]
      const newTitle = `${title} - Copy`
      draft.splice(i + 1, 0, {
        title: newTitle, body, setting, pdf_config: pdfConfig,
      } as PdfTemplate)
      draft.push({ updateTem: 1 } as PdfTemplate)
    })
    setPdfTem(newPdfTemObj)
  }

  const delTem = (i: number, templateData: { original: PdfTemplate }) => {
    if (templateData.original.id) {
      const deletePromise = bitsFetch({ formID, id: templateData.original.id }, 'bitforms_delete_pdf_template')
        .then(res => {
          if (res !== undefined && res.success) {
            const pdfTemp = deepCopy(pdfTem)
            pdfTemp.splice(i, 1)
            setPdfTem(pdfTemp)
          }
        })
      toast.promise(deletePromise, {
        loading: 'Deleting',
        success: 'Successfully Deleted',
        error: 'Error Occurred',
      })
    } else {
      const pdfTemp = deepCopy(pdfTem)
      pdfTemp.splice(i, 1)
      setPdfTem(pdfTemp)
    }
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }
  const temDelConf = (i: number, templateData: { original: PdfTemplate }) => {
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

  const createNewTemplate = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.pdfProInstalledAlert })
      return
    }
    const lastIndex = pdfTem.length
    const newPdfTem = create(pdfTem, draft => {
      draft.push(createDefaultPdfTemplate(pdf))
      draft.push({ updateTem: 1 } as PdfTemplate)
    })
    setPdfTem(newPdfTem)
    navigate(`/form/settings/${formType}/${formID}/pdf-templates/${lastIndex}`)
  }

  const toggleStatus = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    setPdfTem(prev => create(prev, draft => {
      if (!draft[i].pdf_config) draft[i].pdf_config = {}
      draft[i].pdf_config.status = e.target.checked ? 1 : 0
    }))
    markUnsaved(prev => ({ ...prev, unsaved: true }))
  }

  const addNewBtn = (
    <Button onClick={createNewTemplate} className="tertiary">
      <PlusIcn size="16" />
      {__('Add new template')}
    </Button>
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
      Header: __('PDF Name'),
      accessor: (row: PdfTemplate) => row.setting?.pdfFileName || '',
      id: 'pdfFileName',
      minWidth: 110,
      width: 140,
      Cell: (row: any) => (
        <span
          className={css(styles.ellipseText)}
          title={row.cell.value}
        >
          {row.cell.value || <span className={css(info.noInfo)}>{__('—')}</span>}
        </span>
      ),
    },
    {
      Header: __('PDF Settings'),
      accessor: (row: PdfTemplate) => row.setting,
      id: 'pdfSettings',
      minWidth: 130,
      width: 180,
      Cell: (row: any) => (
        <PdfTemplateBadges
          template={row.row.original}
          css={css}
        />
      ),
    },
    {
      Header: __('Status'),
      accessor: 'pdf_config.status',
      minWidth: 50,
      width: 60,
      Cell: (row: any) => (
        <SingleToggle
          name={`pdf-tem-status-${row.row.index}`}
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
      {!IS_PRO && <ProOverlay style={{ height: '110%', left: -53, width: '110%' }} />}
      <h2>{__('PDF Templates')}</h2>
      <h5>
        {__('How to setup PDF Templates:')}
        &nbsp;
        <a href={tutorialLinks.pdfTemplate.link} target="_blank" rel="noreferrer" className="yt-txt ml-1 mr-1">
          {__('YouTube')}
        </a>
        <a href={tutorialLinks.pdfTemplateDoc.link} target="_blank" rel="noreferrer" className="doc-txt">
          {__('Documentation')}
        </a>
      </h5>
      {pdfTem.length > 0 ? (
        <div className={css(pdfListStyles)}>
          <Table
            height="60vh"
            className={`btcd-neu-table ${css(tableStyles)} mr-1`}
            columns={col}
            data={pdfTem.sort((a, b) => (b.id as number) - (a.id as number))}
            rightHeader={addNewBtn}
            searchPlaceholder={__('Search templates...')}
            countLabel={`${__('Showing')} ${pdfTem.length} ${__('of')} ${pdfTem.length} ${__('templates')}`}
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
  text: {
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  header: {
    bd: 'var(--bf-primary-50, #eff6ff)',
    cr: 'var(--bf-primary-700, #1d4ed8)',
  },
  body: {
    bd: 'hsla(var(--bf-success-h), var(--bf-success-s), 95%, 1)',
    cr: 'hsla(var(--bf-success-h), var(--bf-success-s), 28%, 1)',
  },
  footer: {
    bd: 'var(--bf-secondary-100, #eef2ff)',
    cr: 'var(--bf-secondary-700, #4338ca)',
  },
  password: {
    bd: 'hsla(var(--bf-danger-h), var(--bf-danger-s), 96%, 1)',
    cr: 'hsla(var(--bf-danger-h), var(--bf-danger-s), 40%, 1)',
  },
  download: {
    bd: 'hsla(var(--bf-success-h), var(--bf-success-s), 95%, 1)',
    cr: 'hsla(var(--bf-success-h), var(--bf-success-s), 28%, 1)',
  },
  override: {
    bd: 'hsla(var(--bf-warning-h), var(--bf-warning-s), 95%, 1)',
    cr: 'hsla(var(--bf-warning-h), var(--bf-warning-s), 35%, 1)',
  },
  layout: {
    bd: 'hsla(168, 76%, 95%, 1)',
    cr: 'hsla(168, 76%, 32%, 1)',
  },
  watermark: {
    bd: 'var(--bf-secondary-100, #eef2ff)',
    cr: 'var(--bf-secondary-700, #4338ca)',
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

const pdfListStyles = {
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
    pn: 'relative'
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
