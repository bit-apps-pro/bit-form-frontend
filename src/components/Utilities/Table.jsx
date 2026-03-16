/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import { useAtom, useAtomValue } from 'jotai'
import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { ReactSortable } from 'react-sortablejs'
import {
  useColumnOrder, useFilters, useFlexLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable,
} from 'react-table'
import { useSticky } from 'react-table-sticky'
import { $reportId, $reportSelector } from '../../GlobalStates/GlobalStates'
import ChevronDoubleIcn from '../../Icons/ChevronDoubleIcn'
import ChevronLeft from '../../Icons/ChevronLeft'
import ChevronRightIcon from '../../Icons/ChevronRightIcon'
import CopyIcn from '../../Icons/CopyIcn'
import EyeOffIcon from '../../Icons/EyeOffIcon'
import SearchIcn from '../../Icons/SearchIcn'
import SortIcn from '../../Icons/SortIcn'
import ToggleLeftIcn from '../../Icons/ToggleLeftIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { __ } from '../../Utils/i18nwrap'
import TableLoader from '../Loaders/TableLoader'
import ConfirmModal from './ConfirmModal'
import Menu from './Menu'
import Select from './Select'
import TableCheckBox from './TableCheckBox'

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef()
    const resolvedRef = ref || defaultRef
    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])
    return <TableCheckBox refer={resolvedRef} rest={rest} />
  },
)

function GlobalFilter({ globalFilter, setGlobalFilter, setSearch }) {
  const [delay, setDelay] = useState(null)

  const handleSearch = e => {
    delay && clearTimeout(delay)
    const { value } = e.target

    setGlobalFilter(value || undefined)

    setDelay(setTimeout(() => {
      setSearch(value || undefined)
    }, 1000))
  }

  return (
    <div className="f-search ml-2">
      <span><SearchIcn size="16" /></span>
      <input
        value={globalFilter || ''}
        onChange={handleSearch}
        placeholder={__('Search')}
        className="search-input-box"
      />
    </div>
  )
}

function ColumnHide({ cols, setCols, tableCol, tableAllCols }) {
  return (
    <Menu icn={<EyeOffIcon size="21" />}>
      <Scrollbars autoHide style={{ width: 200 }}>
        <ReactSortable list={cols} setList={l => setCols(l)} handle=".btcd-pane-drg">
          {tableCol.map((column, i) => (
            <div key={tableAllCols[i + 1].id} className={`btcd-pane ${(column.Header === 'Actions' || typeof column.Header === 'object') && 'd-non'}`}>
              <TableCheckBox cls="scl-7" id={tableAllCols[i + 1].id} title={column.Header} rest={tableAllCols[i + 1].getToggleHiddenProps()} />
              <span className="btcd-pane-drg">&#8759;</span>
            </div>
          ))}
        </ReactSortable>
      </Scrollbars>
    </Menu>
  )
}

function Table(props) {
  const [confMdl, setconfMdl] = useState({ show: false, btnTxt: '' })
  const {
    columns, data, fetchData, refreshResp, report, rightHeader, centerHeader, centerHeaderClasses, leftHeader, leftHeaderClasses, initialState,
  } = props
  const [currentReportData, updateReportData] = useAtom($reportSelector)
  const reportId = useAtomValue($reportId)
  const defaultInitialState = initialState || {
    pageIndex: 0,
    hiddenColumns: [],
    pageSize: 10,
    sortBy: [],
    filters: [],
    globalFilter: '',
    columnOrder: [],
    conditions: [],
  }
  // CREATE A REF TO STORE CURRENT PAGE DATA
  const currentPageRef = useRef([])

  // DEFINE handleSelectAllPageRows BEFORE useTable
  const handleSelectAllPageRows = useCallback(() => {
    const currentPage = currentPageRef.current

    if (!currentPage.length) return
    const allCurrentPageSelected = currentPage.every(row => row.isSelected)

    if (allCurrentPageSelected) {
      currentPage.forEach(row => row.toggleRowSelected(false))
    } else {
      currentPage.forEach(row => row.toggleRowSelected(true))
    }
  }, [])

  // Define components with useCallback to make them stable
  const HeaderComponent = useCallback(() => {
    const allCurrentPageSelected = currentPageRef.current.length > 0 && currentPageRef.current.every(row => row.isSelected)
    const someCurrentPageSelected = currentPageRef.current.some(row => row.isSelected)
    return (
      <IndeterminateCheckbox
        checked={allCurrentPageSelected}
        indeterminate={someCurrentPageSelected && !allCurrentPageSelected}
        onChange={handleSelectAllPageRows}
      />
    )
  }, [handleSelectAllPageRows])

  const CellComponent = useCallback(({ row }) => (
    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
  ), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setSortBy,
    setHiddenColumns,
    state,
    preGlobalFilteredRows,
    selectedFlatRows, // row select
    allColumns, // col hide
    setGlobalFilter,
    state: {
      pageIndex, pageSize, sortBy, filters, globalFilter, hiddenColumns, columnOrder,
    },
    setColumnOrder,
  } = useTable(
    {
      debug: true,
      fetchData,
      columns,
      data,
      manualPagination: typeof props.pageCount !== 'undefined',
      pageCount: props.pageCount || Math.ceil(data.length / (props.pageSize || 10)),
      initialState: defaultInitialState,
      autoResetPage: false,
      autoResetHiddenColumns: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useSticky,
    useColumnOrder,
    // useBlockLayout,
    useFlexLayout,
    props.resizable ? useResizeColumns : '', // resize
    props.rowSeletable ? useRowSelect : '', // row select
    props.rowSeletable ? (hooks => {
      hooks.allColumns.push(cols => [
        {
          id: 'selection',
          width: 50,
          maxWidth: 50,
          minWidth: 67,
          sticky: 'left',
          Header: HeaderComponent,
          Cell: CellComponent,
        },
        ...cols,
      ])
    }) : '',
  )
  useEffect(() => {
    currentPageRef.current = page
  }, [page])
  const [stateSavable, setstateSavable] = useState(false)

  const [search, setSearch] = useState(globalFilter)
  const { css } = useFela()
  useEffect(() => {
    if (fetchData) {
      fetchData({ pageIndex, pageSize, sortBy, filters, globalFilter: search, conditions: currentReportData?.details?.conditions })
    }
  }, [refreshResp, pageIndex, pageSize, sortBy, filters, search])

  useEffect(() => {
    if (pageIndex > pageCount) {
      gotoPage(0)
    }
  }, [gotoPage, pageCount, pageIndex])

  useEffect(() => {
    if (!Number.isNaN(report)) {
      let details

      if (currentReportData && currentReportData.details && typeof currentReportData.details === 'object') {
        details = {
          ...currentReportData.details, hiddenColumns, pageSize, sortBy, filters, globalFilter, columnOrder,
        }
      } else {
        details = {
          hiddenColumns, pageSize, sortBy, filters, globalFilter, columnOrder,
        }
      }
      updateReportData({ ...currentReportData, details, type: 'table' })
      setstateSavable(false)
    } else if (stateSavable) {
      setstateSavable(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortBy, filters, globalFilter, hiddenColumns, columnOrder])
  useEffect(() => {
    if (currentReportData && currentReportData.details && typeof currentReportData.details === 'object' && report !== undefined) {
      setHiddenColumns(currentReportData?.details?.hiddenColumns || [])
      setPageSize(currentReportData?.details?.pageSize || 10)
      setSortBy(currentReportData?.details?.sortBy || [])
      setGlobalFilter(currentReportData?.details?.globalFilter || '')

      //  setFilters(currentReportData.details.filters)
      // setColumnOrder(currentReportData.details.order)
      return
    }

    setHiddenColumns([])
    setPageSize(10)
    setSortBy([])
    setGlobalFilter('')
    // setFilters([])
    // setColumnOrder([])
  }, [reportId])

  useEffect(() => {
    if (columns.length && allColumns.length >= columns.length) {
      if (currentReportData && 'details' in currentReportData) {
        if (stateSavable && currentReportData.details) {
          const details = { ...currentReportData.details, order: ['selection', ...columns.map(singleColumn => ('id' in singleColumn ? singleColumn.id : singleColumn.accessor))], type: 'table' }
          if (state.columnOrder.length === 0 && typeof currentReportData.details === 'object' && 'order' in currentReportData.details) {
            setColumnOrder(currentReportData.details.order)
          } else {
            setColumnOrder(details.order)
            updateReportData({ ...currentReportData, details })
          }
        } else if (!stateSavable && typeof currentReportData.details === 'object' && currentReportData.details && 'order' in currentReportData.details) {
          setColumnOrder(currentReportData.details.order)
          setstateSavable(true)
        } else if (!stateSavable) {
          setstateSavable(true)
        }
      } else if (typeof props.pageCount !== 'undefined' && report) {
        const details = { hiddenColumns: state.hiddenColumns, order: ['selection', ...columns.map(singleColumn => ('id' in singleColumn ? singleColumn.id : singleColumn.accessor))], pageSize, sortBy: state.sortBy, filters: state.filters, globalFilter: state.globalFilter }
        updateReportData({ details, type: 'table' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  const showBulkDupMdl = () => {
    confMdl.action = () => { props.duplicateData(selectedFlatRows, data, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter: search } }); closeConfMdl() }
    confMdl.btnTxt = __('Duplicate')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'blue'
    confMdl.body = `${__('Do You want Deplicate these')} ${selectedFlatRows.length} ${__('item')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showStModal = () => {
    confMdl.action = (e) => { props.setBulkStatus(e, selectedFlatRows); closeConfMdl() }
    confMdl.btn2Action = (e) => { props.setBulkStatus(e, selectedFlatRows); closeConfMdl() }
    confMdl.btnTxt = __('Disable')
    confMdl.btn2Txt = __('Enable')
    confMdl.body = `${__('Do you want to change these')} ${selectedFlatRows.length} ${__('status')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showDelModal = () => {
    confMdl.action = () => { props.setBulkDelete(selectedFlatRows, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter: search } }); closeConfMdl() }
    confMdl.btnTxt = __('Delete')
    confMdl.btn2Txt = null
    confMdl.btnClass = ''
    confMdl.body = `${__('Are you sure to delete these')} ${selectedFlatRows.length} ${__('items')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  return (
    <>
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
      <div className="flx flx-between mt-1 mr-2">
        <div className={`btcd-t-actions ${leftHeaderClasses}`}>
          <div className="flx" style={{ marginLeft: 7 }}>

            {props.columnHidable && (
              <ColumnHide
                cols={props.columns}
                setCols={props.setTableCols}
                tableCol={columns}
                tableAllCols={allColumns}
              />
            )}
            {leftHeader}
            {props.rowSeletable && selectedFlatRows.length > 0
              && (
                <>
                  {'setBulkStatus' in props
                    && (
                      <button
                        onClick={showStModal}
                        className="icn-btn btcd-icn-lg tooltip"
                        style={{ '--tooltip-txt': '"Status"' }}
                        aria-label="icon-btn"
                        type="button"
                      >
                        <ToggleLeftIcn size="22" stroke="2" />
                      </button>
                    )}
                  {'duplicateData' in props
                    && (
                      <button
                        onClick={showBulkDupMdl}
                        className="icn-btn btcd-icn-sm tooltip"
                        style={{ '--tooltip-txt': '"Duplicate"' }}
                        aria-label="icon-btn"
                        type="button"
                      >
                        <CopyIcn w="15" />
                      </button>
                    )}
                  <button
                    onClick={showDelModal}
                    className="icn-btn btcd-icn-sm tooltip"
                    style={{ '--tooltip-txt': '"Delete"' }}
                    aria-label="icon-btn"
                    type="button"
                  >
                    <TrashIcn size="21" />
                  </button>
                  <small className={css(cls.pill)}>
                    {selectedFlatRows.length}
                    {' '}
                    {__('Row Selected')}
                  </small>
                </>
              )}
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
              setSearch={setSearch}
              data={props.data}
              cols={props.columns}
              formID={props.formID}
              report={report}
              fetchData={fetchData}
            />
          </div>
        </div>
        <div className={`table-center-header ${centerHeaderClasses}`}>
          {centerHeader}
        </div>
        <div className="table-right-menu">
          {rightHeader}
        </div>
      </div>
      <div className="mt-2">
        <Scrollbars className="btcd-scroll" style={{ height: props.height }}>
          <div {...getTableProps()} className={`${props.className} ${props.rowClickable && 'rowClickable'}`}>
            <div className="thead">
              {headerGroups.map((headerGroup, i) => (
                <div key={`t-th-${i + 8}`} className="tr" {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <div key={column.id} className="th flx" {...column.getHeaderProps()}>
                      <div {...column.id !== 't_action' && column.getSortByToggleProps()} style={{ display: 'flex', alignItems: 'center' }}>
                        {column.render('Header')}
                        {' '}
                        {(column.id !== 't_action' && column.id !== 'selection') && (
                          <span style={{ marginLeft: 5, display: 'flex', flexDirection: 'column' }}>
                            {(column.isSorted || column.isSortedDesc) && <SortIcn />}
                            {(column.isSorted || !column.isSortedDesc) && <SortIcn style={{ transform: 'rotate(180deg)' }} />}
                          </span>
                        )}
                      </div>
                      {props.resizable
                        && (
                          <div
                            {...column.getResizerProps()}
                            className={`btcd-t-resizer ${column.isResizing ? 'isResizing' : ''}`}
                          />
                        )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {props.loading ? <TableLoader /> : (
              <div className="tbody" {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row)
                  return (
                    <div
                      key={`t-r-${row.index}`}
                      className={`tr ${row.isSelected ? 'btcd-row-selected' : ''}`}
                      {...row.getRowProps()}
                    >
                      {row.cells.map(cell => (
                        <div
                          key={`t-d-${cell.row.index}`}
                          className="td flx"
                          {...cell.getCellProps()}
                          {...props.rowClickable
                          && typeof cell.column.Header === 'string'
                          && {
                            onClick: e => props.onRowClick(e, row.cells, cell.row.index, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter } }),
                            onKeyPress: e => props.onRowClick(e, row.cells, cell.row.index, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter } }),
                            role: 'button',
                            tabIndex: 0,
                          }
                          }
                          // onClick={(e) => props.rowClickable && typeof cell.column.Header === 'string' && props.onRowClick(e, row.cells, cell.row.index, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter } })}
                          // onKeyDown={(e) => props.rowClickable && typeof cell.column.Header === 'string' && props.onRowClick(e, row.cells, cell.row.index, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter } })}
                          aria-label="cell"
                        >
                          {cell.render('Cell')}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Scrollbars>
      </div>

      <div className="btcd-pagination">
        <small>
          {props.countEntries >= 0 && (
            `${__('Total Entries:')}
            ${props.countEntries}`
          )}
        </small>
        <div className="flx mr-2">
          <button
            aria-label="Go first"
            className="icn-btn"
            type="button"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <ChevronDoubleIcn dir="left" />
          </button>
          <button
            aria-label="Back"
            className="icn-btn"
            type="button"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <ChevronLeft />
          </button>
          <button
            aria-label="Next"
            className="icn-btn"
            type="button"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <ChevronRightIcon />
          </button>
          <button
            aria-label="Last"
            className="icn-btn"
            type="button"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <ChevronDoubleIcn dir="right" />
          </button>

          <small className="mr-2">
            {__('Page')}
            {' '}
            <strong>
              {pageIndex + 1}
              {' '}
              {__('of')}
              {' '}
              {pageOptions.length}
            </strong>
          </small>

          <Select
            size="sm"
            w={170}
            value={pageSize}
            onChange={(value, e) => {
              setPageSize(Number(value))
              if (props.getPageSize) {
                props.getPageSize(value, pageIndex)
              }
            }}
            options={[
              { label: 'Showing 10', value: 10 },
              { label: 'Showing 20', value: 20 },
              { label: 'Showing 30', value: 30 },
              { label: 'Showing 40', value: 40 },
              { label: 'Showing 50', value: 50 },
              { label: 'Showing 100', value: 100 },
              { label: 'Showing 200', value: 200 },
              { label: 'Showing 500', value: 500 },
              { label: 'Showing 1000', value: 1000 },
            ]}
          />
        </div>
      </div>
    </>
  )
}

const cls = {
  pill: {
    bd: 'hsla(var(--blue-h), var(--blue-s), var(--blue-l), 0.8)',
    cr: 'var(--white)',
    py: 5,
    px: 7,
    brs: 5,
  },
}

export default memo(Table)
