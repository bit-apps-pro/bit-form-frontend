/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
// eslint-disable-next-line import/no-extraneous-dependencies
import loadable from '@loadable/component'
import { useAtom, useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { memo, useCallback, useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { $bits, $frontendTable, $frontendTables, $newTableId } from '../../GlobalStates/GlobalStates'
import EditIcn from '../../Icons/EditIcn'
import TrashIcn from '../../Icons/TrashIcn'
import {
  dateTimeFormatter,
  IS_PRO,
} from '../../Utils/Helpers'
import { formsReducer } from '../../Utils/Reducers'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import { compareVersions } from '../../components/Template/templateHelpers'
import ConfirmModal from '../../components/Utilities/ConfirmModal'
import CopyText from '../../components/Utilities/CopyText'
import OptionMenu from '../../components/Utilities/OptionMenu'
import SnackMsg from '../../components/Utilities/SnackMsg'
import Table from '../../components/Utilities/Table'
import app from '../../styles/app.style'

const WelComeTable = loadable(() => import('./WelComeTable'), { fallback: <div>Loading...</div> })

function AllViews() {
  const [modal, setModal] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [allViews, setAllViews] = useAtom($frontendTables)
  const [confMdl, setconfMdl] = useState({ show: false, btnTxt: '' })
  const newTableId = useAtomValue($newTableId)
  const bits = useAtomValue($bits)
  const { formID, formType } = useParams()
  const navigate = useNavigate()
  const { css } = useFela()
  const resetFrontendTable = useResetAtom($frontendTable)

  // const tmp = [...allTables]
  useEffect(() => {
    resetFrontendTable()
    if (!IS_PRO) return
    bitsFetch({ formID }, 'bitforms_get_views')
      .then(res => {
        if (res === undefined || !res.success) {
          setAllViews([])
          setSnackbar({ show: true, msg: res.data })
        } else if (res.success) {
          const tmp = res.data.map(itm => ({ ...itm, shortcode: `[bitform-view id='${itm.id}']` }))
          setAllViews(tmp)
        }
      })
  }, [formID])

  const showDateTime = date => (
    <div style={{ lineHeight: 0.7, fontWeight: 500 }}>
      {dateTimeFormatter(date, bits.dateFormat)}
      <br />
      <br />
      <small>{dateTimeFormatter(date, bits.timeFormat)}</small>
    </div>
  )

  const calculateProgress = (entries, views) => (entries === 0 ? 0.00 : ((entries / (views === '0' ? 1 : views)) * 100).toFixed(2))

  const createNewView = () => {
    if (!compareVersions(bits?.proInfo?.installedVersion, '2.9.0')) {
      setSnackbar({ show: true, msg: 'To use this feature you need Bit Form Pro(Version: 2.9.0)' })
      return
    }
    navigate(`/form/settings/${formType}/${formID}/data-views/new`)
  }

  const [cols, setCols] = useState([
    // { width: 250, minWidth: 80, Header: __('Table Name'), accessor: 'formName', Cell: v => <Link to={`/form/responses/edit/${v.row.original.formID}/`} className="btcd-tabl-lnk">{v.row.values.formName}</Link> },
    { width: 250, minWidth: 80, Header: __('View Name'), accessor: 'table_name', Cell: v => <Link to={`/form/settings/${formType}/${formID}/data-views/${v.row.original.id}`} type="button" className="btcd-tabl-lnk">{v.row.original.table_name}</Link> },
    { width: 220, minWidth: 200, Header: __('Short Code'), accessor: 'shortcode', Cell: val => <CopyText value={val.row.values.shortcode} className={`cpyTxt ${css({ w: 230 })}`} /> },
    { width: 160, minWidth: 60, Header: __('Created'), accessor: 'created_at', Cell: row => showDateTime(row.row.original.created_at) },
  ])

  useEffect(() => {
    const ncols = cols.filter(itm => itm.accessor !== 't_action')
    // eslint-disable-next-line max-len
    ncols.push({
      sticky: 'right',
      width: 100,
      minWidth: 60,
      Header: __('Actions'),
      accessor: 't_action',
      Cell: val => (
        <OptionMenu title={__('Actions')} w={165} h={107}>
          <Link
            to={`/form/settings/${formType}/${formID}/data-views/${val.row.original.id}`}
            type="button"
            className="flx"
            aria-label="actions"
          >
            <EditIcn size={18} />
            {__('Edit Table')}
          </Link>

          <button
            type="button"
            onClick={() => showDelModal(val.row.original.id, val.row.index)}
          >
            <TrashIcn size={16} />
            &nbsp;
            {__('Delete')}
          </button>
        </OptionMenu>
      ),
    })
    setCols([...ncols])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newTableId])

  const setBulkDelete = useCallback(rows => {
    const rowID = []
    const tblId = []
    for (let i = 0; i < rows.length; i += 1) {
      rowID.push(rows[i].id)
      tblId.push(rows[i].original.id)
    }
    const tmp = [...allViews]
    const newData = [...allViews]
    for (let i = rowID.length - 1; i >= 0; i -= 1) {
      newData.splice(Number(rowID[i]), 1)
    }
    setAllViews(alltables => formsReducer(alltables, { data: newData, type: 'set' }))
    const ajaxData = { tblId }

    bitsFetch(ajaxData, 'bitforms_bulk_table_delete_form')
      .then(res => {
        if (res === undefined || !res.success) {
          setAllViews(alltables => formsReducer(alltables, { data: tmp, type: 'set' }))
        } else if (res.success) {
          setSnackbar({ show: true, msg: res.data })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allViews])

  const handleDelete = (tableId, index) => {
    bitsFetch({ id: tableId }, 'bitforms_delete_atable').then(response => {
      if (response.success) {
        setAllViews(alltables => formsReducer(alltables, { type: 'remove', data: index }))
        setSnackbar({ show: true, msg: __('Table Deleted Successfully') })
      }
    })
  }

  const setTableCols = useCallback(newCols => { setCols(newCols) }, [])

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  const showDelModal = (tableId, index) => {
    confMdl.action = () => { handleDelete(tableId, index); closeConfMdl() }
    confMdl.btnTxt = __('Delete')
    confMdl.btn2Txt = null
    confMdl.btnClass = ''
    confMdl.body = __('Are you sure to delete this table?')
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

      {allViews.length ? (
        <div>
          <Table
            className="f-table btcd-all-frm"
            leftHeaderClasses={css(styles.leftHeader)}
            height={525}
            columns={cols}
            data={allViews}
            rowSeletable
            newTableId={newTableId}
            resizable
            setBulkDelete={setBulkDelete}
            setTableCols={setTableCols}
            centerHeader={<h3>Data View List (Beta)</h3>}
            rightHeader={(
              <button
                onClick={() => createNewView()}
                type="button"
                data-testid="create-table-btn"
                className={`round btcd-btn-lg blue blue-sh ${css(app.btn)}`}
              >
                {__('Create View')}
              </button>
            )}
          />
        </div>
      ) : <WelComeTable setModal={setModal} createNewView={createNewView} />}
    </div>
  )
}

export default memo(AllViews)

const styles = {
  leftHeader: {
    width: 'auto !important',
  },
}
