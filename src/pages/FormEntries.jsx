/* eslint-disable no-use-before-define */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import {
  $bits, $fieldLabels, $fields, $forms, $nestedLayouts, $reportId,
  $reportSelector,
  $reports,
} from '../GlobalStates/GlobalStates'
import SettingsIcn from '../Icons/SettingsIcn'
import { getUploadedFilesArr, isValidJsonString } from '../Utils/FormBuilderHelper'
import { dateTimeFormatter, deepCopy, formatIpNumbers } from '../Utils/Helpers'
import { formsReducer } from '../Utils/Reducers'
import { fileUpOrMappableImageFieldTypes } from '../Utils/StaticData/allStaticArrays'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import EditEntryData from '../components/EditEntryData'
import EntryRelatedInfo from '../components/EntryRelatedInfo/EntryRelatedInfo'
import EntryRelatedInfoModal from '../components/EntryRelatedInfo/EntryRelatedInfoModal'
import ExportImportMenu from '../components/ExportImport/ExportImportMenu'
import RepeaterDataTable from '../components/RepeaterDataTable'
import EntriesFilter from '../components/Report/EntriesFilter'
import FldEntriesByCondition from '../components/Report/FldEntriesByCondition'
import Btn from '../components/Utilities/Btn'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import Drawer from '../components/Utilities/Drawer'
import SnackMsg from '../components/Utilities/SnackMsg'
import Table from '../components/Utilities/Table'
import TableAction from '../components/Utilities/TableAction'
import TableFileLink from '../components/Utilities/TableFileLink'
import noData from '../resource/img/nodata.svg'
import ut from '../styles/2.utilities'
import app from '../styles/app.style'

function FormEntries({ allResp, setAllResp, isloading: isFetching }) {
  const allLabels = useAtomValue($fieldLabels)
  const nestedLayouts = useAtomValue($nestedLayouts)
  const [snack, setSnackbar] = useState({ show: false, msg: '' })
  const [isloading, setisloading] = useState(isFetching)
  const { formType, formID } = useParams()
  const fetchIdRef = useRef(0)
  const [pageCount, setPageCount] = useState(0)
  const [showEditMdl, setShowEditMdl] = useState(false)
  const [showRelatedInfoMdl, setshowRelatedInfoMdl] = useState(false)
  const [entryID, setEntryID] = useState(null)
  const [rowDtl, setRowDtl] = useState({ show: false, data: {} })
  const [confMdl, setconfMdl] = useState({ show: false })
  const [repeaterDataMdl, setRepeaterDataMdl] = useState({ show: false })
  const [tableColumns, setTableColumns] = useState([])
  const [entryLabels, setEntryLabels] = useState([])
  const setForms = useSetAtom($forms)
  const [countEntries, setCountEntries] = useState(0)
  const [refreshResp, setRefreshResp] = useState(0)
  const bits = useAtomValue($bits)
  const [currentReportData, setCurrentReport] = useAtom($reportSelector)
  const reportId = useAtomValue($reportId)
  const reports = useAtomValue($reports)
  const rprtIndx = reports.findIndex(r => r?.id && r.id.toString() === reportId?.id?.toString())
  const rowSl = useRef(0)
  const navigate = useNavigate()
  const { css } = useFela()
  const fields = useAtomValue($fields)
  const filterFieldType = ['divider', 'spacer', 'shortcode', 'image', 'title', 'section']

  useEffect(() => {
    const repeatedFieldKeys = Object.entries(nestedLayouts).reduce((acc, [key, val]) => {
      if (fields[key]?.typ !== 'repeater') return acc
      val.lg.forEach((itm) => {
        acc.push(itm.i)
      })
      return acc
    }, [])

    const tempAllLabels = allLabels.filter((itm) => !repeatedFieldKeys.includes(itm.key))
    if (currentReportData) {
      const allLabelObj = {}
      tempAllLabels.map((itm) => {
        allLabelObj[itm.key] = itm
      })
      const labels = []
      currentReportData.details?.order?.forEach((field) => {
        if (
          field
          && field !== 'sl'
          && field !== 'selection'
          && field !== 'table_ac'
          && allLabelObj[field] !== undefined
        ) {
          labels.push(allLabelObj[field])
        }
      })
      // temporary tuen off report feature
      tableHeaderHandler(labels.length ? labels : tempAllLabels)
    } else if (tempAllLabels.length) {
      tableHeaderHandler(tempAllLabels)
    }
    // tableHeaderHandler(currentReportData?.details?.order || allLabels)
  }, [allLabels, nestedLayouts])

  const closeConfMdl = useCallback(() => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }, [confMdl])

  const bulkDuplicateData = useCallback((rows, tmpData, action) => {
    const rowID = []
    const entries = []
    if (typeof rows[0] === 'object') {
      for (let i = 0; i < rows.length; i += 1) {
        rowID[rows[i].original.entry_id] = rows[i].id
        entries.push(rows[i].original.entry_id)
      }
    } else {
      rowID[rows.original.entry_id] = rows.id
      entries.push(rows.original.entry_id)
    }
    const newData = deepCopy(tmpData)

    const ajaxData = { formID, entries }
    bitsFetch(ajaxData, 'bitforms_duplicate_form_entries').then((res) => {
      if (res.success && res.data.message !== 'undefined') {
        if (action && action.fetchData && action.data) {
          action.fetchData(action.data)
        } else {
          let duplicatedEntry
          // let duplicatedEntryCount = 0
          Object.entries(res?.data?.details || {})?.forEach(
            ([resEntryId, duplicatedId]) => {
              // duplicatedEntryCount += 1
              duplicatedEntry = JSON.parse(
                JSON.stringify(newData[rowID[resEntryId]]),
              )
              // duplicatedEntry = [...newData.slice(rowID[resEntryId], parseInt(rowID[resEntryId], 10) + 1)]
              duplicatedEntry.entry_id = duplicatedId
              newData[rowID[resEntryId]].entry_id = resEntryId
              newData.unshift(duplicatedEntry)
              newData.pop()
            },
          )
          setAllResp(newData)
        }
        setSnackbar({ show: true, msg: res.data.message })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dupConfMdl = useCallback(
    (row, data, pCount) => {
      confMdl.btnTxt = __('Duplicate')
      confMdl.btnClass = 'blue'
      confMdl.body = __('Are you sure to duplicate this entry?')
      confMdl.action = () => {
        bulkDuplicateData(row, data, pCount)
        closeConfMdl()
      }
      confMdl.show = true
      setconfMdl({ ...confMdl })
    },
    [bulkDuplicateData, closeConfMdl, confMdl],
  )

  const closeRowDetail = useCallback(() => {
    setRowDtl({ ...rowDtl, show: false })
  }, [rowDtl])

  const setBulkDelete = useCallback((rows, action) => {
    const rowID = []
    const entries = []
    if (typeof rows[0] === 'object') {
      for (let i = 0; i < rows.length; i += 1) {
        rowID.push(rows[i].id)
        entries.push(rows[i].original.entry_id)
      }
    } else {
      rowID.push(rows.id)
      entries.push(rows.original.entry_id)
    }
    const ajaxData = { formID, entries }

    bitsFetch(ajaxData, 'bitforms_bulk_delete_form_entries').then((res) => {
      if (res.success) {
        if (action && action.fetchData && action.data) {
          action.fetchData(action.data)
        }
        setSnackbar({ show: true, msg: res.data.message })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const delConfMdl = useCallback(
    (row, data) => {
      if (row.idx !== undefined) {
        // eslint-disable-next-line no-param-reassign
        row.id = row.idx
        // eslint-disable-next-line no-param-reassign
        row.original = row.data[0].row.original
      }
      confMdl.btnTxt = 'Delete'
      confMdl.body = 'Are you sure to delete this entry'
      confMdl.btnClass = ''

      confMdl.action = () => {
        setBulkDelete(row, data)
        closeConfMdl()
        closeRowDetail()
      }
      confMdl.show = true
      setconfMdl({ ...confMdl })
    },
    [closeConfMdl, closeRowDetail, confMdl, setBulkDelete],
  )

  const tableHeaderHandler = (labels = []) => {
    const cols = labels?.map((val) => ({
      Header: val.adminLbl || val.name || val.key,
      accessor: val.key,
      fieldType: val.type,
      minWidth: 50,
      ...('type' in val
        && val.type.match(/^(file-up|advanced-file-up|signature|check|select|url|sys|repeater|image-select)$/) && {
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: (row) => {
          if (
            row.cell.value !== null
            && row.cell.value !== undefined
            && row.cell.value !== ''
          ) {
            if (fileUpOrMappableImageFieldTypes.includes(val.type)) {
              return (
                <>
                  {getUploadedFilesArr(row.cell.value).map((itm, i) => (
                    <TableFileLink
                      key={`file-n-${row.cell.row.index + i}`}
                      fname={itm}
                      link={`${bits.baseDLURL}formID=${formID}&entryID=${row.cell.row.original.entry_id}&fileID=${itm}`}
                    />
                  ))}
                </>
              )
            }
            if (val.type === 'repeater') {
              return (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault()
                    setRepeaterDataMdl({
                      show: true,
                      data: row.cell.value,
                      entryId: row.cell.row.original.entry_id,
                      title: val.adminLbl || val.name || val.key,
                    })
                  }}
                >
                  {__('View Repeater Data')}
                </a>
              )
            }
            if (val.type === 'check' || val.type === 'select' || val.type === 'image-select') {
              try {
                const vals = typeof row.cell.value === 'string'
                  && row.cell.value.length > 0
                  && row.cell.value[0] === '['
                  ? JSON.parse(row.cell.value)
                  : row.cell.value !== undefined && row.cell.value.split(',')
                return vals.map((itm, i) => (i < vals.length - 1 ? `${itm},` : itm))
              } catch (_) {
                return row.cell.value
              }
            }

            if (val.type === 'url' || val.key === '__referer') {
              return (<a href={row.cell.value} target="_blank" rel="noopener noreferrer">{row.cell.value}</a>)
            }

            if (val.key === '__user_id') {
              return bits?.user[row.cell.value]?.url ? (<a href={bits.user[row.cell.value].url}>{bits.user[row.cell.value].name}</a>) : null
            }
            if (val.key === '__entry_status') {
              const status = Number(row.cell.value)
              return getEntryStatus(status)
            }

            // eslint-disable-next-line no-restricted-globals
            if (val.key === '__user_ip' && isFinite(Number(row.cell.value))) {
              return formatIpNumbers(row.cell.value)
            }

            if (val.key === '__created_at' || val.key === '__updated_at') {
              return dateTimeFormatter(row.cell.value, bits.dateFormat)
            }

            return row.cell.value
          }
          return null
        },
      }),
    }))
    cols.unshift({
      Header: '#',
      accessor: 'sl',
      Cell: (value) => (
        <>
          {Number(value.state.pageIndex * value.state.pageSize)
            + Number(value.row.id)
            + 1}
        </>
      ),
      width: 40,
    })
    cols.push({
      id: 't_action',
      width: 70,
      maxWidth: 70,
      minWidth: 70,
      sticky: 'right',
      Header: (
        <span className="ml-2" title={__('Settings')}>
          <SettingsIcn size="20" />
        </span>
      ),
      accessor: 'table_ac',
      Cell: (val) => (
        <TableAction
          edit={() => editData(val.row)}
          del={() => delConfMdl(val.row, {
            fetchData: val.fetchData,
            data: {
              pageIndex: val.state.pageIndex,
              pageSize: val.state.pageSize,
              sortBy: val.state.sortBy,
              filters: val.state.filters,
              globalFilter: val.state.globalFilter,
            },
          })}
          dup={() => dupConfMdl(val.row, val.data, {
            fetchData: val.fetchData,
            data: {
              pageIndex: val.state.pageIndex,
              pageSize: val.state.pageSize,
              sortBy: val.state.sortBy,
              filters: val.state.filters,
              globalFilter: val.state.globalFilter,
            },
          })}
        />
      ),
    })
    const filteredEntryLabels = filteredEntryLabelsForTable(cols)
    setTableColumns(filteredEntryLabels)
    setEntryLabels(cols)
  }

  const getEntryStatus = status => {
    if (status === 0) { return 'Read' }
    if (status === 1) { return 'Unread' }
    if (status === 2) { return 'Unconfirmed' }
    if (status === 3) { return 'Confirmed' }
    if (status === 9) { return 'Draft' }
  }

  const editData = useCallback((row) => {
    if (row.idx !== undefined) {
      // eslint-disable-next-line no-param-reassign
      row.id = row.idx
      // eslint-disable-next-line no-param-reassign
      row.original = row.data[0].row.original
    }
    setEntryID(row.original.entry_id)
    setShowEditMdl(true)
  }, [])

  const relatedinfo = row => {
    if (row.idx !== undefined) {
      // eslint-disable-next-line no-param-reassign
      row.id = row.idx
      // eslint-disable-next-line no-param-reassign
      row.original = row.data[0].row.original
    }
    setEntryID(row.original.entry_id)
    setshowRelatedInfoMdl(true)
  }

  const fetchData = useCallback(({
    pageSize, pageIndex, sortBy, filters, globalFilter, conditions, entriesFilterByDate,
  }) => {
    // eslint-disable-next-line no-plusplus
    if (refreshResp) {
      setRefreshResp(0)
      setisloading(true)
      return
    }

    // eslint-disable-next-line no-plusplus
    const fetchId = ++fetchIdRef.current
    if (allResp.length < 1) {
      setisloading(true)
    }
    if (fetchId === fetchIdRef.current) {
      const startRow = pageSize * pageIndex
      bitsFetch(
        {
          id: formID,
          offset: startRow,
          pageSize,
          sortBy,
          filters,
          globalFilter,
          conditions,
          entriesFilterByDate,
        },
        'bitforms_get_form_entries',
      ).then((res) => {
        if (res?.success) {
          setPageCount(Math.ceil(res.data.count / pageSize))
          setCountEntries(res.data.count)
          setAllResp(res.data.entries)
        }

        setForms(allforms => formsReducer(allforms, {
          type: 'update',
          data: { formID, entries: res.data.count },
        }))

        setisloading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delConfMdl, dupConfMdl, editData, formID, refreshResp])

  const onRowClick = useCallback(
    (e, row, idx, rowFetchData) => {
      const slNumber = e.target.parentElement.children[1].textContent
      rowSl.current = slNumber
      if (!e.target.classList.contains('prevent-drawer')) {
        const newRowDtl = { ...rowDtl }
        if (newRowDtl.show && rowDtl.idx === idx) {
          newRowDtl.show = false
        } else {
          newRowDtl.data = row
          newRowDtl.idx = idx
          newRowDtl.show = true
        }
        setRowDtl({ ...newRowDtl })

        const statusCol = row.find(col => col.column.id === '__entry_status')
        if (statusCol && statusCol.value === '1') {
          const entryId = statusCol.row?.original?.entry_id
          if (!entryId) return
          bitsFetch({ formId: formID, entryId }, 'bitforms_entry_status_update')
            .then(resp => {
              if (resp.success) {
                const { fetchData: fetchRowData, data: reportData } = rowFetchData
                setTimeout(() => fetchRowData({ ...currentReportData.details, ...reportData }), 1000)
              }
            })
        }
      }
    },
    [rowDtl],
  )

  const filteredEntryLabelsForTable = lbls => lbls.filter(lbl => !filterFieldType.includes(lbl.fieldType))

  const filterEntryLabels = () => entryLabels.filter(el => !['sl', 'table_ac'].includes(el.accessor) && !filterFieldType.includes(el.fieldType))

  const drawerEntryMap = (entry) => {
    if (entry.fieldType === 'file-up' || entry.fieldType === 'advanced-file-up' || entry.fieldType === 'signature') {
      return (
        getUploadedFilesArr(allResp[rowDtl.idx]?.[entry.accessor])?.map((it, i) => (
          <TableFileLink
            key={`file-n-${i + 1.1}`}
            fname={it}
            width="100"
            link={`${bits.baseDLURL}formID=${formID}&entryID=${allResp[rowDtl.idx].entry_id}&fileID=${it}`}
          />
        ))
      )
    }
    if (entry.fieldType === 'repeater') {
      return (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setRepeaterDataMdl({
              show: true,
              data: allResp[rowDtl.idx]?.[entry.accessor],
              entryId: allResp[rowDtl.idx].entry_id,
              title: entry.Header,
            })
          }}
        >
          {__('View Repeater Data')}
        </a>
      )
    }
    if (entry.fieldType === 'color') {
      return (
        <div className="flx">
          {allResp[rowDtl.idx][entry.accessor]}
          <span
            style={{
              background: allResp[rowDtl.idx][entry.accessor],
              height: 20,
              width: 20,
              borderRadius: 5,
              display: 'inline-block',
              marginLeft: 10,
            }}
          />
        </div>
      )
    }
    if (entry.fieldType === 'check' || entry.fieldType === 'select' || entry.fieldType === 'image-select') {
      const value = isValidJsonString(allResp[rowDtl.idx]?.[entry.accessor]) ? JSON.parse(allResp[rowDtl.idx]?.[entry.accessor]) : allResp[rowDtl.idx]?.[entry.accessor]?.replace(/\[|\]|"/g, '')
      return Array.isArray(value) ? value.toString() : value
    }

    if (entry.fieldType === 'url' || entry.accessor === '__referer') {
      return <a href={allResp?.[rowDtl.idx]?.[entry.accessor]} target="_blank" rel="noreferrer noopener">{allResp?.[rowDtl.idx]?.[entry.accessor]}</a>
    }

    if (entry.accessor === '__user_id') {
      return bits?.user[allResp[rowDtl.idx]?.[entry.accessor]]?.url ? (<a href={bits.user[allResp[rowDtl.idx]?.[entry.accessor]].url}>{bits.user[allResp[rowDtl.idx]?.[entry.accessor]].name}</a>) : null
    }

    if (entry.accessor === '__created_at' || entry.accessor === '__updated_at') {
      return dateTimeFormatter(allResp[rowDtl.idx]?.[entry.accessor], bits.dateFormat)
    }

    if (entry.accessor === '__user_ip' && isFinite(allResp[rowDtl.idx]?.[entry.accessor])) {
      return formatIpNumbers(allResp[rowDtl.idx]?.[entry.accessor])
    }
    if (entry.accessor === '__entry_status') {
      const status = Number(allResp[rowDtl.idx]?.[entry.accessor])
      return getEntryStatus(status)
    }
    return allResp?.[rowDtl.idx]?.[entry.accessor]
  }
  const setTblColumns = (cols) => {
    const colOrder = ['selection', ...cols.map(c => c.accessor)]
    setCurrentReport({
      ...currentReportData,
      details: {
        ...currentReportData.details,
        order: colOrder,
      },
    })
    setTableColumns(cols)
  }

  return (
    <div id="form-res">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />

      {
        showEditMdl
        && (
          <EditEntryData
            close={setShowEditMdl}
            formID={formID}
            entryID={entryID}
            allResp={allResp}
            setAllResp={setAllResp}
            setSnackbar={setSnackbar}
          />
        )
      }

      {
        showRelatedInfoMdl
        && (
          <EntryRelatedInfoModal
            close={setshowRelatedInfoMdl}
            entryID={entryID}
            setSnackbar={setSnackbar}
            rowDtl={allResp[rowDtl.idx]}
          />
        )
      }

      <Drawer
        title={__(`Entry Details #${rowSl.current}`)}
        show={rowDtl.show}
        close={closeRowDetail}
        relatedinfo={() => relatedinfo(rowDtl)}
        delConfMdl={() => delConfMdl(rowDtl, rowDtl.fetchData)}
        editData={() => editData(rowDtl)}
        rowDetails={rowDtl}
      >
        <div>
          <table className="btcd-row-detail-tbl">
            <tbody>
              <tr className="txt-dp">
                <th>{__('Title')}</th>
                <th>{__('Value')}</th>
              </tr>
              {rowDtl.show
                && filterEntryLabels().map((label, i) => (
                  <tr key={`rw-d-${i + 2}`}>
                    <th>{label.Header}</th>
                    <td>{drawerEntryMap(label)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <hr />
          {
            rowDtl.data[0]?.row?.original?.entry_id && (
              <div className={css({ mxh: '80vh', ow: 'scroll' })}>
                <EntryRelatedInfo
                  close={setshowRelatedInfoMdl}
                  entryID={rowDtl.data[0]?.row?.original?.entry_id}
                  setSnackbar={setSnackbar}
                  rowDtl={allResp[rowDtl.idx]}
                />
              </div>
            )
          }

        </div>

      </Drawer>

      {
        repeaterDataMdl.show && (
          <RepeaterDataTable
            close={() => setRepeaterDataMdl(prevData => ({ ...prevData, show: false }))}
            rptData={repeaterDataMdl.data}
            show={repeaterDataMdl.show}
            entryId={repeaterDataMdl.entryId}
            title={repeaterDataMdl.title}
          />
        )
      }

      <div className="forms">
        <Table
          className="f-table btcd-entries-f"
          height="76vh"
          columns={tableColumns}
          data={allResp}
          loading={isloading}
          countEntries={countEntries}
          rowSeletable
          resizable
          columnHidable
          hasAction
          rowClickable
          leftHeader={(
            <FldEntriesByCondition
              fetchData={fetchData}
              setRefreshResp={setRefreshResp}
            />
          )}
          leftHeaderClasses={css(app.leftHeader)}
          rightHeader={(
            <>
              <Btn
                className={css(ut.mr1)}
                size="sm"
                onClick={() => navigate(`/form/settings/${formType}/${formID}/data-views`)}
              >
                {__('Data Views & Edit')}
              </Btn>
              <Btn className={css(ut.mr2)} size="sm" onClick={() => navigate(`/form/report-view/${formType}/${formID}`)}>
                {__('View Analytics Report')}
              </Btn>
              <ExportImportMenu
                data={allResp}
                cols={entryLabels}
                formID={formID}
                report={reports}
              />
              <EntriesFilter fetchData={fetchData} />
            </>
          )}
          initialState={{
            pageIndex: 0,
            hiddenColumns: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'hiddenColumns' in currentReportData.details) ? currentReportData.details.hiddenColumns : [],
            pageSize: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'pageSize' in currentReportData.details) ? currentReportData.details.pageSize : 10,
            sortBy: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'sortBy' in currentReportData.details) ? currentReportData.details.sortBy : [],
            filters: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'filters' in currentReportData.details) ? currentReportData.details.filters : [],
            globalFilter: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'globalFilter' in currentReportData.details) ? currentReportData.details.globalFilter : '',
            columnOrder: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'order' in currentReportData.details) ? currentReportData.details.order : [],
            conditions: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'conditions' in currentReportData.details) ? currentReportData.details.conditions : [],
          }}
          formID={formID}
          setTableCols={setTblColumns}
          fetchData={fetchData}
          setBulkDelete={setBulkDelete}
          duplicateData={bulkDuplicateData}
          pageCount={pageCount}
          edit={editData}
          onRowClick={onRowClick}
          refreshResp={refreshResp}
          report={rprtIndx || 0}// index - 0 setted as default report
        />
        {!isloading && allResp.length === 0 && (
          <div className="btcd-no-data txt-center">
            <img src={noData} alt="no data found" />
            <div className="mt-2 data-txt">{__('No Entry Found.')}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(FormEntries)
