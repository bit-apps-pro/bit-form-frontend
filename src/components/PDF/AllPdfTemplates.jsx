/* eslint-disable react/no-unstable-nested-components */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { $bits, $pdfTemplates, $proModal } from '../../GlobalStates/GlobalStates'
import CopyIcn from '../../Icons/CopyIcn'
import EditIcn from '../../Icons/EditIcn'
import LayoutIcn from '../../Icons/LayoutIcn'
import StackIcn from '../../Icons/StackIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { deepCopy, IS_PRO } from '../../Utils/Helpers'
import proHelperData from '../../Utils/StaticData/proHelperData'
import tutorialLinks from '../../Utils/StaticData/tutorialLinks'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import Btn from '../Utilities/Btn'
import Button from '../Utilities/Button'
import ConfirmModal from '../Utilities/ConfirmModal'
import Table from '../Utilities/Table'

export default function AllPdfTemplates({ formID }) {
  const [pdfTem, setPdfTem] = useAtom($pdfTemplates)
  const [confMdl, setconfMdl] = useState({ show: false })
  // const [checkGlobalPdfConfMdl, setCheckGlobalPdfConfMdl] = useState({ show: false })
  const { css } = useFela()
  const navigate = useNavigate()
  const { formType } = useParams()
  const setProModal = useSetAtom($proModal)

  const bits = useAtomValue($bits)
  let { pdf } = bits.allFormSettings

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

  const duplicateTem = i => {
    const newPdfTemObj = create(pdfTem, draft => {
      const { title, body, setting } = draft[i]
      const newTitle = `${title} - Copy`
      draft.splice(i + 1, 0, { title: newTitle, body, setting })
      draft.push({ updateTem: 1 })
    })
    setPdfTem(newPdfTemObj)
  }

  const delTem = (i, templateData) => {
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
  const temDelConf = (i, templateData) => {
    confMdl.btnTxt = __('Delete')
    confMdl.body = __('Are you sure to delete this template')
    confMdl.btnClass = ''
    confMdl.action = () => { delTem(i, templateData); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const temDupConf = i => {
    confMdl.btnTxt = __('Duplicate')
    confMdl.body = __('Are you sure to duplicate this template?')
    confMdl.btnClass = 'blue'
    confMdl.action = () => { duplicateTem(i); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  // const gotoPDFSetting = () => {
  //   confMdl.show = false
  //   setCheckGlobalPdfConfMdl({ ...confMdl })
  //   navigate('/app-settings/pdf')
  // }

  // const alertConfig = () => {
  //   checkGlobalPdfConfMdl.btnTxt = __('Go to PDF Settings')
  //   checkGlobalPdfConfMdl.body = __('Please configure PDF settings first.')
  //   checkGlobalPdfConfMdl.btnClass = 'blue'
  //   checkGlobalPdfConfMdl.action = () => { gotoPDFSetting() }
  //   checkGlobalPdfConfMdl.show = true
  //   checkGlobalPdfConfMdl.btn2Txt = __('Back')
  //   setCheckGlobalPdfConfMdl({ ...checkGlobalPdfConfMdl })
  // }

  // const closePDFConfMdl = () => {
  //   checkGlobalPdfConfMdl.show = false
  //   setCheckGlobalPdfConfMdl({ ...checkGlobalPdfConfMdl })
  // }

  const defaultTemplate = {
    title: 'Untitled PDF Template',
    setting: { ...pdf, password: { static: true, pass: '' } },
    body: '${bf_all_data}',
  }

  const createNewTemplate = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.pdfProInstalledAlert })
      return
    }
    // if (undefined === pdf) {
    //   alertConfig()
    //   return
    // }
    const lastIndex = pdfTem.length
    const newPdfTem = create(pdfTem, draft => {
      draft.push(defaultTemplate)
      draft.push({ updateTem: 1 })
    })
    setPdfTem(newPdfTem)
    navigate(`/form/settings/${formType}/${formID}/pdf-templates/${lastIndex}`)
  }

  const col = [
    {
      Header: __('Template Name'),
      accessor: 'title',
      Cell: row => (
        <NavLink to={`${url}/${row.row.index}`}>
          <b>{row.cell.value}</b>
        </NavLink>
      ),
    },
    {
      Header: __('Action'),
      accessor: 'action',
      Cell: row => (
        <>
          <Button
            onClick={() => temDupConf(row.row.index)}
            className="icn-btn mr-2 tooltip pos-rel"
            style={{ '--tooltip-txt': `'${__('Duplicate')}'` }}
          >
            <CopyIcn size="22" />
          </Button>
          <NavLink
            to={`${url}/${row.row.index}`}
            className="icn-btn mr-2 flx flx-center tooltip pos-rel"
            style={{ '--tooltip-txt': `'${__('Edit')}'` }}
          >
            <EditIcn size="22" />
          </NavLink>
          <Button
            onClick={() => temDelConf(row.row.index, row.row)}
            className="icn-btn tooltip pos-rel"
            style={{ '--tooltip-txt': `'${__('Delete')}'` }}
          >
            <TrashIcn size="21" />
          </Button>
        </>
      ),
    },
  ]

  return (
    <div className="w-7">
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />
      {/* <ConfirmModal
        show={checkGlobalPdfConfMdl.show}
        close={closePDFConfMdl}
        btnTxt={checkGlobalPdfConfMdl.btnTxt}
        btnClass={checkGlobalPdfConfMdl.btnClass}
        body={checkGlobalPdfConfMdl.body}
        action={checkGlobalPdfConfMdl.action}
        btn2Txt={__('Close')}
        btn2Action={closePDFConfMdl}
      /> */}
      <h2>{__('PDF Templates')}</h2>
      <h5 className="mt-3">
        {__('How to setup PDF Templates:')}
        <a href={tutorialLinks.pdfTemplate.link} target="_blank" rel="noreferrer" className="yt-txt ml-1 mr-1">
          {__('YouTube')}
        </a>
        <a href={tutorialLinks.pdfTemplateDoc.link} target="_blank" rel="noreferrer" className="doc-txt">
          {__('Documentation')}
        </a>
      </h5>
      <div className="">
        <Btn
          size="sm"
          onClick={createNewTemplate}
        >
          <LayoutIcn size="20" />
          &nbsp;
          {__('Add New Template')}
        </Btn>
        {pdfTem.length > 0 ? (
          <Table
            height="60vh"
            className="btcd-neu-table mr-1"
            columns={col}
            data={pdfTem.sort((a, b) => b.id - a.id)}
          />
        )
          : (
            <div className={css(ut.btcdEmpty, ut.txCenter)}>
              <StackIcn size="50" />
              {__('Empty')}
            </div>
          )}
      </div>
    </div>
  )
}
