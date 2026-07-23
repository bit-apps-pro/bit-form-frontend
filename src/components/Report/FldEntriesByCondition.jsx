/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { hideAll } from 'tippy.js'

import Scrollbars from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { $bits, $fieldsArr, $reportId, $reports, $reportSelector, $updateBtn } from '../../GlobalStates/GlobalStates'
import CheckMarkIcn from '../../Icons/CheckMarkIcn'
import EditIcn from '../../Icons/EditIcn'
import ListFilterIcn from '../../Icons/ListFilterIcn'
import ListFilterPlusIcn from '../../Icons/ListFilterPlusIcn'
import RefreshIcn from '../../Icons/RefreshIcn'
import SearchIcon from '../../Icons/SearchIcon'
import TrashIcn from '../../Icons/TrashIcn'
import ut from '../../styles/2.utilities'
import bitsFetch from '../../Utils/bitsFetch'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import Btn from '../Utilities/Btn'
import ConfirmModal from '../Utilities/ConfirmModal'
import Downmenu from '../Utilities/Downmenu'
import Modal from '../Utilities/Modal'
import SnackMsg from '../Utilities/SnackMsg'
import ConditionalLogic from './ConditionalLogic'

export default function FldEntriesByCondition({ fetchData, setRefreshResp }) {
  const currentReport = useAtomValue($reportSelector)
  const [reportId, setReportId] = useAtom($reportId)
  const [reports, setReports] = useAtom($reports)
  const rprtIndx = reports.findIndex(r => r?.id && r.id.toString() === reportId?.id?.toString())

  const formFields = useAtomValue($fieldsArr)
  const [showMdl, setshowMdl] = useState(false)
  const [reportIndex, setReportIndex] = useState(rprtIndx || 0)
  const { formID } = useParams()
  const [confMdl, setconfMdl] = useState({ show: false })
  const [availableReports, setAvailableReports] = useState([])
  const [reportUpdate, setReportUpdate] = useState(false)
  const [proModal, setProModal] = useState({ show: false, msg: '' })
  const bits = useAtomValue($bits)
  const { isPro } = bits
  const [isLoading, setisLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const { css } = useFela()

  useEffect(() => {
    setReportIndex(rprtIndx)
  }, [reportId])

  useEffect(() => {
    setAvailableReport()
  }, [reports])

  useEffect(() => {
    if (reports[reportIndex] && reports[reportIndex]?.details) {
      if (!reports[reportIndex]?.details?.conditions) {
        const tmpConf = deepCopy([...reports])
        if (tmpConf[reportIndex]) {
          tmpConf[reportIndex].details.conditions = [
            { field: '', logic: '', val: '' },
            'or',
            { field: '', logic: '', val: '' }]
          setReports(tmpConf)
        }
      }
    }
  }, [])

  const setAvailableReport = () => {
    const tmpReports = []
    reports.forEach(r => r.id && tmpReports.push({ label: r?.details?.report_name || '', value: r.id.toString(), isDefault: r.isDefault }))
    setAvailableReports([...tmpReports])
    return tmpReports
  }

  const reportFetchById = (rprtId) => {
    const rprt = reports.find(r => r?.id?.toString() === rprtId.toString())
    setReportId({ id: rprtId, isDefault: rprt?.isDefault === '1' })
    setRefreshResp(1)
  }

  const saveReport = () => {
    let { id } = reports[reportIndex]

    if (!reportUpdate) {
      id = 0
    }
    if (reports[reportIndex]?.details?.report_name === '') {
      setSnackbar({ show: true, msg: __('report name cann\'t be empty') })
      return
    }
    setisLoading(true)
    const reportSaveProm = bitsFetch({ report: reports[reportIndex].details, formId: formID, reportId: id }, 'bitforms_save_report')
      .then(response => {
        if (response?.success) {
          const { data } = response
          if (reportUpdate && reportId.id === id) {
            reportFetchById(data.report_id)
          }
          const tmpReport = deepCopy(reports)
          tmpReport[reportIndex].id = data?.report_id?.toString()
          setReports(tmpReport)
        } else if (!response?.success) {
          return 'Error occured'
        }
        setisLoading(false)
        setshowMdl(false)
        return response
      })

    toast.promise(reportSaveProm, {
      loading: __('Saving...', 'biform'),
      success: (res) => res?.data?.message || res?.data,
      error: __('Error occurred, Please try again.'),
    })
  }

  const reportHandler = (e) => {
    const { value, name } = e.target
    const tmpConf = deepCopy([...reports])
    tmpConf[reportIndex].details[name] = value
    setReports(tmpConf)
  }

  const onCloseMdl = () => {
    setshowMdl(false)
    const tmpConf = deepCopy([...reports])
    if (!tmpConf[reportIndex]?.id) {
      tmpConf.splice(reportIndex, 1)
      setReports(tmpConf)
    }
  }

  const createNewReport = () => {
    if (!isPro) {
      setProModal({ show: true, msg: 'Only the default report is available in the free version!' })
      return
    }
    setReportUpdate(false)
    const tmpConf = deepCopy([...reports])

    const arrLen = tmpConf.push({
      // id: tmpIndex,
      isDefault: '0',
      type: 'table',
      details: {
        report_name: 'Untitled filter ',
        hiddenColumns: [],
        pageSize: 10,
        sortBy: [],
        filters: [],
        globalFilter: '',
        order: [],
        conditions: [
          { field: '', logic: '', val: '' },
          'or',
          { field: '', logic: '', val: '' }],
      },
    })
    const tmpIndex = arrLen - 1
    setReports(tmpConf)
    setTimeout(() => {
      setReportIndex(tmpIndex)
      setshowMdl(true)
    }, 1)
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx">

        <Downmenu>
          <div className={`flx ${css(reportSearch.filterDropdownTrigger)}`}>
            <div className={css(reportSearch.filterName)}>
              {currentReport?.details?.report_name}
            </div>
            <span className={css(reportSearch.filterIconRight)}>
              <ListFilterIcn size="16" stroke="2" />
            </span>
          </div>
          <ReportsListMenu
            availableReports={availableReports}
            setAvailableReports={setAvailableReports}
            setAvailableReport={setAvailableReport}
            reportFetchById={reportFetchById}
            setReportIndex={setReportIndex}
            setReportUpdate={setReportUpdate}
            setProModal={setProModal}
            confMdl={confMdl}
            setconfMdl={setconfMdl}
            setshowMdl={setshowMdl}
            createNewReport={createNewReport}
          />
        </Downmenu>

        <button
          className={css(reportSearch.refreshButton)}
          onClick={() => { setRefreshResp(1) }}
          type="button"
          title={__('Refresh')}
        >
          <RefreshIcn size="18" />
        </button>

        <div>
          <ConfirmModal
            show={confMdl.show}
            close={closeConfMdl}
            btnTxt={confMdl.btnTxt}
            btnClass={confMdl.btnClass}
            body={confMdl.body}
            action={confMdl.action}
          />

          <Modal
            md
            show={showMdl}
            setModal={setshowMdl}
            title="Create Filter"
            style={{ overflow: 'auto' }}
            onCloseMdl={onCloseMdl}
          >
            <>
              <div className="flx mt-4">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  aria-label="Report name"
                  type="text"
                  name="report_name"
                  value={reports[reportIndex]?.details?.report_name || ''}
                  onChange={reportHandler}
                  placeholder="Please enter report name"
                  className="ml-2 btcd-paper-inp w-6"
                />
              </div>
              <div className="mt-4">
                <ConditionalLogic
                  formFields={formFields}
                  dataConf={reports}
                  setDataConf={setReports}
                  reportInd={reportIndex || 0}
                />
                <Btn
                  className={css(ut.ftRight, ut.mb3)}
                  onClick={saveReport}
                >
                  {__('Save')}
                  {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
                </Btn>
              </div>
            </>
          </Modal>
        </div>

        <div>
          <Modal
            sm
            show={proModal.show}
            setModal={() => setProModal({ show: false })}
            title={__('Premium Feature')}
            className="pro-modal"
          >
            <h4 className="txt-center mt-5">
              {proModal.msg}
            </h4>
            <div className="txt-center">
              <a
                href="https://www.bitapps.pro/bit-form"
                target="_blank"
                rel="noreferrer"
              >
                <button className="btn btn-lg blue" type="button">{__('Buy Premium')}</button>
              </a>
            </div>
          </Modal>
        </div>
      </div>
    </>
  )
}
const reportSearch = {
  filterDropdownTrigger: {
    bd: '#fff',
    cr: 'var(--bf-text-clr-darkgray)',
    b: '1px solid var(--bf-stroke-clr)',
    mnw: 180,
    brs: 'var(--bf-bdr-radius-sm)',
    px: '12px',
    ff: 'var(--bf-font-family-base) !important',
    fts: 'normal',
    fw: 500,
    fs: 14,
    lh: '17px',
    w: 200,
    jc: 'space-between',
    ai: 'center',
    cur: 'pointer',
    h: 'var(--bf-thead-inp-height)',
    '&:hover': {
      cr: 'var(--bf-text-clr-dark)',
      bd: 'var(--b-79-96)',
    },
  },
  filterName: {
    ws: 'nowrap',
    ow: 'hidden',
    toe: 'ellipsis',
    flx: 1,
  },
  filterIconRight: {
    flx: 'center',
    pl: 8,
    // cr: 'var(--bf-text-clr-gray)',
    h: '100%',
    bl: '1px solid var(--bf-stroke-clr)',
  },
  refreshButton: {
    flx: 'center',
    b: '1px solid #e2e2e2',
    p: 8,
    ml: 8,
    brs: 'var(--bf-bdr-radius-sm)',
    cur: 'pointer',
    bd: '#fff',
    cr: 'var(--bf-text-clr-darkgray)',
    ':hover': { bd: 'var(--b-79-96)', cr: 'var(--blue)' },
    ':focus-visible': { focusOutline: 1 },
    h: 'var(--bf-thead-inp-height)',
  },
  filterListContainer: {
    p: '10px 5px',
    w: 270,
  },
  filterListHeader: {
    dy: 'flex',
    ai: 'center',
    jc: 'space-between',
    mb: 8,
  },
  filterListTitle: {
    cr: 'rgb(63, 63, 63)',
    fw: 700,
    fs: 15,
  },
  newFilterBtn: {
    h: 'var(--bf-thead-inp-height) !important',
    gp: 5,
    w: '50% !important',
  },
  searchAndNewFilterRow: {
    dy: 'flex',
    ai: 'center',
    gp: 8,
    pb: 10,
    mb: 10,
    bb: '1px solid var(--bf-stroke-clr)',
  },
  searchBoxWrapper: {
    pn: 'relative',
    flx: 1,
    tn: 'all 0.2s ease',
    w: '50%',
    '&:focus-within': {
      w: '60%',
    },
    '&:focus-within ~ button': {
      w: '40% !important',
      // dy: 'none',
    },
  },
  searchIcon: {
    pn: 'absolute !important',
    tp: '50%',
    lt: 10,
    transform: 'translateY(-50%)',
    cr: 'hsla(0, 0%, 50%, 100%)',
    pointerEvents: 'none',
    lh: 0,
    // h: '100%'
  },
  searchInput: {
    bxs: 'border-box',
    b: '1px solid #E6E6E6!important',
    brs: 'var(--bf-bdr-radius-sm) !important',
    p: '8px 10px 8px 32px!important',
    ff: 'var(--bf-font-family-base) !important',
    fts: 'normal',
    fw: 500,
    fs: 13,
    lh: 15,
    w: '100%',
    h: 'var(--bf-thead-inp-height)',
    mnh: 'auto!important',
    oe: 'none!important',
    tn: '0.2s all ease',
    ':focus': {
      focusShadow: 1,
    },
    '::placeholder': {
      cr: '#999',
    },
  },
  filterItem: {
    dy: 'flex',
    ai: 'center',
    jc: 'space-between',
    p: '8px 10px',
    brs: 'var(--bf-bdr-radius-sm)',
    mb: 4,
    h: 42,
    tn: 'all 0.3s ease',
    cur: 'pointer',
    ':hover': {
      bd: 'var(--b-79-96)',
    },
    ':hover .actions': {
      oy: 1,
      dy: 'inline-flex',
    },
    '&.active': {
      b: '1px solid var(--bf-stroke-clr)',
    },
  },
  filterItemContent: {
    dy: 'flex',
    ai: 'center',
    gp: 8,
    flx: 1,
    ow: 'hidden',
  },
  filterItemLabel: {
    fs: 14,
    fw: 500,
    ff: 'var(--bf-font-family-base) !important',
    ws: 'nowrap',
    ow: 'hidden',
    toe: 'ellipsis',
  },
  tickIcon: {
    cr: 'var(--bf-text-clr-darkgray)',
    flxs: 0,
    mr: 4,
  },
  filterActions: {
    dy: 'none',
    ai: 'center',
    gp: 4,
    oy: 0,
    tn: 'opacity 1s ease',
  },
  filterActionsVisible: {
    op: 1,
    dy: 'flex',
  },
  actionBtn: {
    flx: 'center',
    b: 'none',
    bd: 'transparent',
    p: 4,
    brs: 4,
    cur: 'pointer',
    cr: 'hsl(0deg 1% 29%)',
    ':hover': { bd: 'var(--b-79-96)', cr: 'var(--blue)' },
  },
  deleteBtn: {
    ':hover': { cr: 'var(--red-100-61)' },
  },
  noResults: {
    cr: '#666',
    fs: 13,
    ta: 'center',
    p: '20px 0',
  },
}

const ReportsListMenu = ({
  availableReports, setAvailableReports, setAvailableReport, reportFetchById, setProModal, confMdl, setconfMdl, setReportUpdate, setReportIndex, setshowMdl, createNewReport,
}) => {
  const { css } = useFela()
  const bits = useAtomValue($bits)
  const { isPro } = bits
  const currentReport = useAtomValue($reportSelector)
  const [reports, setReports] = useAtom($reports)
  const setUpdateBtn = useSetAtom($updateBtn)
  // const [hoveredReport, setHoveredReport] = useState(null)

  const searchReport = (e) => {
    const { value } = e.target
    const filtedReports = setAvailableReport().filter(r => r.label?.toLowerCase().includes(value.toLowerCase()))
    setAvailableReports(filtedReports)
  }

  const handleInput = (val) => {
    if (val === currentReport?.id) return
    reportFetchById(val)
    setUpdateBtn(oldUpdateBtn => ({ ...oldUpdateBtn, unsaved: true }))
    hideAll()
  }

  const editCurrentReport = (val, e) => {
    e.stopPropagation()
    if (!isPro) {
      setProModal({ show: true, msg: 'Edit option available in the pro version!' })
      return
    }
    setReportUpdate(true)
    const rprtIndex = availableReports.findIndex(r => r.value === val)
    setTimeout(() => {
      setReportIndex(rprtIndex)
      setshowMdl(true)
    }, 1)
    hideAll()
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  const deleteReportAlert = (val, e) => {
    e.stopPropagation()
    confMdl.btnTxt = __('Delete')
    confMdl.body = __('Are you sure to delete this report')
    confMdl.btnClass = ''
    confMdl.action = () => { delItem(val); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const delItem = (id) => {
    const deletedReportProm = bitsFetch({ report_id: id }, 'bitforms_delete_report')
      .then(response => {
        if (response?.success) {
          const rpDeletedId = reports.findIndex(r => r.id === id)
          const tmpReport = deepCopy([...reports])
          tmpReport.splice(rpDeletedId, 1)

          setReports(tmpReport)
        } else if (!response?.success) {
          return 'Error occured'
        }
        return response
      })

    toast.promise(deletedReportProm, {
      loading: __('Deleting ...'),
      success: (res) => res?.data?.message || res?.data,
      error: __('Error occurred, Please try again.'),
    })
  }

  const handleNewFilterClick = () => {
    createNewReport()
    hideAll()
  }

  return (
    <div className={css(reportSearch.filterListContainer)}>
      <div className={css(reportSearch.filterListHeader)}>
        <span className={css(reportSearch.filterListTitle)}>{__('Filter List')}</span>
      </div>

      <div className={css(reportSearch.searchAndNewFilterRow)}>
        <div className={css(
          reportSearch.searchBoxWrapper,
          // isSearchFocused && reportSearch.searchBoxWrapperExpanded,
        )}
        >
          <span className={css(reportSearch.searchIcon)}>
            <SearchIcon size="14" />
          </span>
          <input
            aria-label="Search filters"
            type="text"
            placeholder={__('Search filters...')}
            onChange={searchReport}
            className={css(reportSearch.searchInput)}
          />
        </div>
        <Btn
          className={css(
            reportSearch.newFilterBtn,
            // isSearchFocused && reportSearch.newFilterBtnHidden,
          )}
          onClick={handleNewFilterClick}
          size="sm"
        >
          <ListFilterPlusIcn size={15} stroke="2" />
          {__('New Filter')}
        </Btn>

      </div>

      {availableReports.length === 0 && (
        <div className={css(reportSearch.noResults)}>{__('No matching filter found')}</div>
      )}

      <Scrollbars style={{ height: 200 }} autoHide>
        <div>
          {availableReports?.map((report) => {
            const isActive = report.value === currentReport?.id
            // const isHovered = hoveredReport === report.value
            const isNonDefault = report.isDefault.toString() === '0'

            return (
              <div
                key={`filter-item-${report.value}`}
                className={`${css(reportSearch.filterItem)} ${isActive && 'active'}`}
                onClick={() => handleInput(report.value)}
                // onMouseEnter={() => setHoveredReport(report.value)}
                // onMouseLeave={() => setHoveredReport(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleInput(report.value)}
              >
                <div className={css(reportSearch.filterItemContent)}>
                  <span className={css(reportSearch.filterItemLabel)} title={report?.label}>
                    {report?.label}
                  </span>
                </div>

                <div>
                  {isActive && (
                    <span className={`${css(reportSearch.tickIcon)} check-icon`}>
                      <CheckMarkIcn size={18} stroke={2} />
                    </span>
                  )}

                  {isNonDefault && (
                    <div className={`${css(reportSearch.filterActions)} actions`}>
                      <button
                        className={css(reportSearch.actionBtn)}
                        title={__('Edit')}
                        onClick={(e) => editCurrentReport(report.value, e)}
                        type="button"
                      >
                        <EditIcn size="18" />
                      </button>
                      <button
                        className={css(reportSearch.actionBtn, reportSearch.deleteBtn)}
                        title={__('Delete')}
                        onClick={(e) => deleteReportAlert(report.value, e)}
                        type="button"
                      >
                        <TrashIcn size="18" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Scrollbars>
    </div>
  )
}
