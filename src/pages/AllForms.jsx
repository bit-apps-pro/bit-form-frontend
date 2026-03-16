/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
// eslint-disable-next-line import/no-extraneous-dependencies
import loadable from '@loadable/component'
import { useAtom, useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { memo, useCallback, useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { $bits, $forms, $newFormId } from '../GlobalStates/GlobalStates'
import CodeSnippetIcn from '../Icons/CodeSnippetIcn'
import ConditionalIcn from '../Icons/ConditionalIcn'
import CopyIcn from '../Icons/CopyIcn'
import DownloadIcon from '../Icons/DownloadIcon'
import EditIcn from '../Icons/EditIcn'
import FormResponseIcn from '../Icons/FormResponseIcn'
import InfoIcn from '../Icons/InfoIcn'
import Settings2 from '../Icons/Settings2'
import TrashIcn from '../Icons/TrashIcn'
import {
  dateTimeFormatter,
  generateAndSaveAtomicCss,
  generateUpdateFormData,
  getStatesToReset,
  replaceFormId,
  setFormReponseDataToStates,
  setStyleRelatedStates,
} from '../Utils/Helpers'
import { formsReducer } from '../Utils/Reducers'
import bitsFetch from '../Utils/bitsFetch'
import { addDomainName, JCOF, removeDomainName } from '../Utils/globalHelpers'
import { __ } from '../Utils/i18nwrap'
import FormTemplates from '../components/Template/FormTemplates'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import CopyText from '../components/Utilities/CopyText'
import Modal from '../components/Utilities/Modal'
import OptionMenu from '../components/Utilities/OptionMenu'
import Progressbar from '../components/Utilities/Progressbar'
import SingleToggle2 from '../components/Utilities/SingleToggle2'
import SnackMsg from '../components/Utilities/SnackMsg'
import Table from '../components/Utilities/Table'
import app from '../styles/app.style'

const Welcome = loadable(() => import('./Welcome'), { fallback: <div>Loading...</div> })

function AllFroms() {
  const [modal, setModal] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [allForms, setAllForms] = useAtom($forms)
  const [confMdl, setconfMdl] = useState({ show: false, btnTxt: '' })
  const newFormId = useAtomValue($newFormId)
  const bits = useAtomValue($bits)
  const { css } = useFela()
  const atomResetters = getStatesToReset().map(stateAtom => useResetAtom(stateAtom))

  const handleStatus = (e, id) => {
    const status = e.target.checked
    const data = { id, status }
    setAllForms(allforms => formsReducer(allforms, { type: 'update', data: { formID: id, status: data.status } }))
    bitsFetch(data, 'bitforms_change_status')
      .then(res => {
        if ('success' in res && !res.success) {
          setAllForms(allforms => formsReducer(allforms, { type: 'update', data: { formID: id, status: data.status } }))
          setSnackbar({ ...{ show: true, msg: __('Failed to change Form Status') } })
        }
      }).catch(() => {
        setAllForms(allforms => formsReducer(allforms, { type: 'update', data: { formID: id, status: !status } }))
        setSnackbar({ ...{ show: true, msg: __('Failed to change Form Status') } })
      })
  }

  const showDateTime = date => (
    <div style={{ lineHeight: 0.7, fontWeight: 500 }}>
      {dateTimeFormatter(date, bits.dateFormat)}
      <br />
      <br />
      <small>{dateTimeFormatter(date, bits.timeFormat)}</small>
    </div>
  )

  const calculateProgress = (entryCount, viewCount) => {
    const entries = Number(entryCount)
    const views = Number(viewCount)

    if (views <= 0 || entries <= 0) return 0.00

    const rate = (entries / views) * 100
    return Math.min(rate, 100).toFixed(2)
  }

  const [cols, setCols] = useState([
    { width: 70, minWidth: 60, Header: __('Status'), accessor: 'status', Cell: value => <SingleToggle2 className="flx" action={(e) => handleStatus(e, value.row.original.formID)} checked={value.row.original.status} /> },
    {
      width: 300,
      minWidth: 200,
      Header: __('Form Name'),
      accessor: 'formName',
      Cell: val => (
        <div className="bf-options-wrpr">
          <Link to={`/form/builder/edit/${val.row.original.formID}/fields-list`} className="btcd-tabl-lnk bf-form-name">{val.row.values.formName}</Link>
          <div className="bf-form-options">
            <Link
              to={`/form/builder/edit/${val.row.original.formID}/fields-list`}
              type="button"
              aria-label="actions"
            >
              {__('Edit')}
            </Link>
            <Link
              to={`/form/responses/edit/${val.row.original.formID}`}
              type="button"
              aria-label="actions"
            >
              {__('Entries')}
            </Link>
            <Link
              to={`/form/settings/edit/${val.row.original.formID}/form-settings`}
              type="button"
              aria-label="form settings"
            >
              {__('Settings')}
            </Link>
            <a
              href={`${bits.siteURL}/bitform-form-view/${val.row.original.formID}`}
              target="_blank"
              rel="noreferrer"
            >
              {__('Preview')}
            </a>
            <button type="button" onClick={() => showDupMdl(val.row.original.formID)}>
              {__('Duplicate')}
            </button>
            <button className="bf-delete-btn" type="button" onClick={() => showDelModal(val.row.original.formID, val.row.index)}>
              {__('Delete')}
            </button>
          </div>

        </div>
      ),
    },
    { width: 220, minWidth: 200, Header: __('Short Code'), accessor: 'shortcode', Cell: val => <CopyText value={`[${val.row.values.shortcode}]`} className="cpyTxt" /> },
    { width: 80, minWidth: 60, Header: __('Views'), accessor: 'views' },
    { width: 170, minWidth: 130, Header: __('Completion Rate'), accessor: 'conversion', Cell: val => <Progressbar value={calculateProgress(val.row.values.entries, val.row.values.views)} /> },
    { width: 100, minWidth: 60, Header: __('Responses'), accessor: 'entries', Cell: value => <Link to={`form/responses/edit/${value.row.original.formID}`} className="btcd-tabl-lnk">{value.row.values.entries}</Link> },
    { width: 160, minWidth: 60, Header: __('Created'), accessor: 'created_at', Cell: row => showDateTime(row.row.original.created_at) },
  ])

  useEffect(() => {
    // if (env in process && process.env==='deevelopment') {
    //   bitsFetch(null, 'bitforms_get_all_form')
    //     .then(res => {
    //       if (res?.success) {
    //         const dbForms = res.data.map(form => ({ formID: form.id, status: form.status !== '0', formName: form.form_name, shortcode: `bitform id='${form.id}'`, entries: form.entries, views: form.views, created_at: form.created_at }))
    //         setAllForms(allforms => formsReducer(allforms, { data: dbForms, type: 'set' }))
    //       }
    //     })
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const ncols = cols.filter(itm => itm.accessor !== 't_action')
    // eslint-disable-next-line max-len
    ncols.push({
      sticky: 'right',
      width: 70,
      minWidth: 40,
      Header: __('Actions'),
      accessor: 't_action',
      Cell: val => (
        <OptionMenu title={__('Actions')} w={165} h={342}>
          <Link
            to={`/form/builder/edit/${val.row.original.formID}/fields-list`}
            type="button"
            className="flx"
            aria-label="actions"
          >
            <EditIcn size={18} />
            {__('Edit Form')}
          </Link>
          <Link
            to={`/form/responses/edit/${val.row.original.formID}`}
            type="button"
            className="flx"
            aria-label="actions"
          >
            <FormResponseIcn size="18" />
            {__('Entries')}
          </Link>
          <Link
            to={`/form/settings/edit/${val.row.original.formID}/form-settings`}
            type="button"
            className="flx"
            aria-label="form settings"
          >
            <Settings2 size={18} />
            {__('Settings')}
          </Link>
          <button type="button" onClick={() => showDupMdl(val.row.original.formID)}>
            <CopyIcn size={18} />
            {__('Duplicate')}
          </button>
          <button type="button" onClick={() => showExportMdl(val.row.original.formID)}>
            <DownloadIcon size={18} />
            {__('Export')}
          </button>
          <Link
            to={`/form/settings/edit/${val.row.original.formID}/confirmations`}
            type="button"
            className="flx"
            aria-label="confirmations"
          >
            <InfoIcn size="18" stroke="3" />
            {__('Confirmations')}
          </Link>
          <Link
            to={`/form/settings/edit/${val.row.original.formID}/workflow`}
            type="button"
            className="flx"
            aria-label="Conditional Logic"
          >
            <ConditionalIcn size="18" />
            {__('Conditional Logic')}
          </Link>
          <Link
            to={`/form/settings/edit/${val.row.original.formID}/data-views`}
            type="button"
            className="flx"
            aria-label="Data Table"
          >
            <CodeSnippetIcn size="18" />
            {__('Data Table')}
          </Link>
          <Link
            to={`/form/settings/edit/${val.row.original.formID}/integrations`}
            type="button"
            className="flx"
            aria-label="Integrations"
          >
            <CodeSnippetIcn size="18" />
            {__('Integrations')}
          </Link>

          <button type="button" onClick={() => showDelModal(val.row.original.formID, val.row.index)}>
            <TrashIcn size={16} />
            &nbsp;
            {__('Delete')}
          </button>
        </OptionMenu>
      ),
    })
    setCols([...ncols])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFormId])

  const setBulkStatus = useCallback((e, rows) => {
    const status = e.target.innerHTML === 'Enable'
    const rowID = []
    const formID = []
    for (let i = 0; i < rows.length; i += 1) {
      rowID.push(rows[i].id)
      formID.push(rows[i].original.formID)
    }
    const tmp = [...allForms]
    const newData = [...allForms]
    for (let i = 0; i < rowID.length; i += 1) {
      newData[rowID[i]].status = status
    }
    setAllForms(allforms => formsReducer(allforms, { data: newData, type: 'set' }))
    const ajaxData = { formID, status }

    bitsFetch(ajaxData, 'bitforms_bulk_status_change')
      .then(res => {
        if (res !== undefined && !res.success) {
          setAllForms(allforms => formsReducer(allforms, { data: tmp, type: 'set' }))
        } else if (res.success) {
          setSnackbar({ show: true, msg: res.data })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setBulkDelete = useCallback(rows => {
    const rowID = []
    const formID = []
    for (let i = 0; i < rows.length; i += 1) {
      rowID.push(rows[i].id)
      formID.push(rows[i].original.formID)
    }
    const tmp = [...allForms]
    const newData = [...allForms]
    for (let i = rowID.length - 1; i >= 0; i -= 1) {
      newData.splice(Number(rowID[i]), 1)
    }
    setAllForms(allforms => formsReducer(allforms, { data: newData, type: 'set' }))
    const ajaxData = { formID }

    bitsFetch(ajaxData, 'bitforms_bulk_delete_form')
      .then(res => {
        if (res === undefined || !res.success) {
          setAllForms(allforms => formsReducer(allforms, { data: tmp, type: 'set' }))
        } else if (res.success) {
          setSnackbar({ show: true, msg: res.data })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = (formID, index) => {
    bitsFetch({ id: formID }, 'bitforms_delete_aform').then(response => {
      if (response.success) {
        setAllForms(allforms => formsReducer(allforms, { type: 'remove', data: index }))
        setSnackbar({ show: true, msg: __('Form Deleted Successfully') })
      }
    })
  }

  const handleDuplicate = (formID) => {
    const loadDuplicate = getFormDetails(formID).then(response => {
      if (response) {
        const formDetail = JSON.parse(response)
        const oldFormId = formDetail.form_id
        const newFormDetail = replaceFormId(formDetail, `b${oldFormId}`, `b${newFormId}`)
        const { style, themeVars, themeColors, fields } = newFormDetail
        newFormDetail.style = JCOF.stringify(style)
        newFormDetail.themeVars = JCOF.stringify(themeVars)
        newFormDetail.themeColors = JCOF.stringify(themeColors)
        newFormDetail.fields = addDomainName(fields)
        const newFormName = `${formDetail.form_name} (duplicate)`
        newFormDetail.form_name = newFormName
        newFormDetail.formSettings.formName = newFormName

        return bitsFetch({ formDetail: newFormDetail, newFormId }, 'bitforms_import_aform').then(res => {
          if (res.success) {
            const { data } = res

            const newConfirmations = data.formSettings.confirmation.type.successMsg
            const oldConfirmationStyles = style.lgLightStyles.confirmations
            oldConfirmationStyles.forEach((oldConfirmationStyle, index) => {
              const newConfirmation = newConfirmations[index]
              const { id: newConfirmationId } = newConfirmation
              const { confMsgId: oldConfirmationId } = oldConfirmationStyle
              const newConfirmationStyle = { ...oldConfirmationStyle }
              newConfirmationStyle.confMsgId = newConfirmationId
              newConfirmationStyle.style = replaceFormId(oldConfirmationStyle.style, `-${oldConfirmationId}`, `-${newConfirmationId}`)
              style.lgLightStyles.confirmations[index] = newConfirmationStyle
            })

            setFormReponseDataToStates(data)
            setStyleRelatedStates({ styles: style, themeVars, themeColors })
            generateAndSaveAtomicCss(data.id)
            const updatedFormData = generateUpdateFormData(newFormId)
            bitsFetch(updatedFormData, 'bitforms_update_form')
            atomResetters.forEach(resetAtom => resetAtom())

            setAllForms(allforms => formsReducer(allforms, {
              type: 'add',
              data: {
                formID: data.id,
                status: true,
                formName: data.form_name,
                shortcode: `bitform id='${data.id}'`,
                entries: 0,
                views: 0,
                conversion: 0.00,
                created_at: data.created_at,
              },
            }))
            return 'Duplicated Successfully.'
          }
          return res.data
        })
      }
    })

    toast.promise(loadDuplicate, {
      success: msg => msg,
      error: __('Error Occurred'),
      loading: __('Duplicate...'),
    })
  }

  const getFormDetails = (formID) => {
    const formExport = bitsFetch({ id: formID }, 'bitforms_export_aform').then(response => {
      if (response.success) {
        const { data } = response
        const themeColors = JCOF.parse(data.themeColors)
        const themeVars = JCOF.parse(data.themeVars)
        const style = JCOF.parse(data.style)
        const {
          workFlows, reports, layout, nestedLayouts, formInfo, form_name, form_id, formSettings, fields, breakpointSize, additional, builderSettings,
        } = data
        const staticStyles = data.staticStyles || {}
        let newFields = fields
        newFields = removeDomainName(newFields)
        const exportFormData = {
          themeColors,
          themeVars,
          staticStyles,
          style,
          workFlows,
          reports,
          layout,
          nestedLayouts,
          formInfo,
          form_name,
          form_id,
          formSettings,
          fields: newFields,
          breakpointSize,
          additional,
          builderSettings,
        }
        exportFormData.customCode = {}
        if (data.customCode.customJs) {
          exportFormData.customCode.customJs = data.customCode.customJs
        }
        if (data.customCode.customCss) {
          exportFormData.customCode.customCss = data.customCode.customCss
        }
        return JSON.stringify(exportFormData)
      }
    })
    return formExport
  }

  const handleExport = (formID) => {
    const formExport = getFormDetails(formID).then((formDetails) => {
      const formData = JSON.parse(formDetails)
      const blob = new Blob([formDetails], { type: 'application/json' })
      const urlBlob = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = urlBlob
      a.download = `bitform_export-${formID}(${formData?.form_name || 'Untitled Form'}).json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      return 'Exported Successfully'
    })
    toast.promise(formExport, {
      success: msg => msg,
      error: __('Error Occurred'),
      loading: __('Exporting...'),
    })
  }

  const setTableCols = useCallback(newCols => { setCols(newCols) }, [])

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  const showDelModal = (formID, index) => {
    confMdl.action = () => { handleDelete(formID, index); closeConfMdl() }
    confMdl.btnTxt = __('Delete')
    confMdl.btn2Txt = null
    confMdl.btnClass = ''
    confMdl.body = __('Are you sure to delete this form?')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showDupMdl = (formID) => {
    confMdl.action = () => { handleDuplicate(formID); closeConfMdl() }
    confMdl.btnTxt = __('Duplicate')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'blue'
    confMdl.body = __('Are you sure to duplicate this form ?')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showExportMdl = (formID) => {
    confMdl.action = () => { handleExport(formID); closeConfMdl() }
    confMdl.btnTxt = __('Export')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'blue'
    confMdl.body = __('Are you sure to export this form ?')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  return (
    <div id="all-forms">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ConfirmModal
        show={confMdl.show}
        body={confMdl.body}
        action={confMdl.action}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btn2Txt={confMdl.btn2Txt}
        btn2Action={confMdl.btn2Action}
        btnClass={confMdl.btnClass}
      />
      <Modal
        show={modal}
        setModal={setModal}
        title={__('Create a New Form')}
        subTitle=""
        lg
      >
        <FormTemplates
          setTempModal={setModal}
          newFormId={newFormId}
          setSnackbar={setSnackbar}
        />
      </Modal>
      {allForms.length ? (
        <div>
          <Table
            className="f-table btcd-all-frm"
            height={540}
            columns={cols}
            data={allForms}
            rowSeletable
            newFormId={newFormId}
            resizable
            columnHidable
            setBulkStatus={setBulkStatus}
            setBulkDelete={setBulkDelete}
            setTableCols={setTableCols}
            rightHeader={(
              <button
                onClick={() => setModal(true)}
                type="button"
                data-testid="create-form-btn"
                className={` round btcd-btn-lg blue blue-sh ${css(app.btn)}`}
              >
                {__('Create Form')}
              </button>
            )}
          />
        </div>
      ) : <Welcome setModal={setModal} />}
    </div>
  )
}

export default memo(AllFroms)
