import loadable from '@loadable/component'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { $fields, $reportSelector } from '../GlobalStates/GlobalStates'
import BackIcn from '../Icons/BackIcn'
import PrintIcon from '../Icons/PrintIcon'
import { IS_PRO, dateTimeFormatter, generateReportData, getLastNthDate, isObjectEmpty, makeFieldsArrByLabel } from '../Utils/Helpers'
import filterFieldTypesForReport from '../Utils/StaticData/filterFieldTypesForReport'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import ProBadgeOverlay from '../components/CompSettings/StyleCustomize/ChildComp/ProBadgeOverlay'
import Loader from '../components/Loaders/Loader'
import LoaderSm from '../components/Loaders/LoaderSm'
import FldEntriesByCondition from '../components/Report/FldEntriesByCondition'
import DateFilter from '../components/ReportView/DateFilter'
import SubmissionsDataTable from '../components/ReportView/SubmissionsDataTable'
import Btn from '../components/Utilities/Btn'
import Cooltip from '../components/Utilities/Cooltip'
import DropDown from '../components/Utilities/DropDown'
import TableCheckBox from '../components/Utilities/TableCheckBox'
import ut from '../styles/2.utilities'

const FieldReport = loadable(() => import('../components/ReportView/FieldReport'), { fallback: <Loader className="g-c" style={{ height: 300, width: 500 }} /> })

export default function ReportView() {
  console.log('ReportView Rendered')
  const { formType, formID } = useParams()
  const [isloading, setisloading] = useState(true)
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [refreshResp, setRefreshResp] = useState(1)
  const [checkedStatus, setCheckedStatus] = useState(['0', '1', '2', '3', '9'])
  const fields = useAtomValue($fields)
  const fieldsNotFound = useRef(isObjectEmpty(fields))
  const [reportedFields, setReportedFields] = useState(() => filterDefaultReportedFields(fields))
  const [allResp, setAllResp] = useState([])
  const { css } = useFela()
  const navigate = useNavigate()
  const currentReport = useAtomValue($reportSelector)
  const analyticsContainerRef = useRef(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const handlePrint = useReactToPrint({
    removeAfterPrint: true,
    content: () => analyticsContainerRef.current,
    onBeforeGetContent: () => setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),
  })

  console.log({ isPrinting })

  if (fieldsNotFound.current && !isObjectEmpty(fields)) {
    setReportedFields(filterDefaultReportedFields(fields))
    fieldsNotFound.current = false
  }

  const fetchData = useCallback(({
    pageSize, pageIndex, sortBy, filters, globalFilter, conditions, entriesFilterByDate,
  }) => {
    setisloading(true)

    if (refreshResp) return setRefreshResp(0)

    bitsFetch(
      {
        id: formID,
        sortBy,
        filters,
        globalFilter,
        conditions,
        entriesFilterByDate,
      },
      'bitforms_get_entries_for_report',
    ).then((res) => {
      if (res?.success) {
        setAllResp(res.data.entries)
      }
      setisloading(false)
    })
    setFromDate(entriesFilterByDate?.start_date)
    setToDate(entriesFilterByDate?.end_date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport.id, formID, refreshResp])

  const reportData = generateReportData(allResp, fields, { reportedFields, checkedStatus, fromDate, toDate })

  const totalSubmission = reportData?.submissionStatsData?.reduce((acc, cur) => acc + cur.value, 0) || 0

  useEffect(() => {
    const startDateFormate = dateTimeFormatter(getLastNthDate(30), 'Y-m-d')
    const endDateFormate = dateTimeFormatter(new Date(), 'Y-m-d')
    const entriesFilterByDate = {
      start_date: startDateFormate,
      end_date: endDateFormate,
    }
    fetchData({
      entriesFilterByDate,
      conditions: currentReport?.details?.conditions,
    })
  }, [fetchData])

  const statusCheckedAction = (checked, status) => {
    if (checked) {
      setCheckedStatus(prevState => [...prevState, status])
    } else {
      setCheckedStatus(prevState => prevState.filter(item => item !== status))
    }
    setRefreshResp(1)
  }

  const firstResp = allResp?.[0] || {}
  const allFields = makeFieldsArrByLabel(fields, [], filterFieldTypesForReport)
  const fieldOption = allFields.filter(fld => fld.key in firstResp && firstResp[fld.key] !== null).map((fld) => ({ label: fld.name, value: fld.key })) || []

  const setAllowedReportedFields = (val) => {
    const allowedFields = val.map(item => item.value)
    setReportedFields(allowedFields)
  }

  const checkStatusInArr = status => checkedStatus.includes(status)

  return (
    <div className={css(style.mainWrapper)}>
      <div className={css(style.headerWrapper)}>
        <Btn
          className={`${css({ mr: 10 })}`}
          onClick={() => navigate(`/form/responses/${formType}/${formID}`)}
          size="sm"
          variant="secondary-outline"
        >
          <BackIcn className="mr-1" />
          {__('Responses', 'biform')}
        </Btn>
        <h3 className={css(style.title, { m: 0 })}> Analytics Report</h3>
        <div className={css(ut.flxc)}>
          <FldEntriesByCondition
            fetchData={fetchData}
            setRefreshResp={setRefreshResp}
          />
          {isloading && (
            <div className={css(ut.flxc, ut.ml2)}>
              <LoaderSm size={20} className={css(ut.mr1)} />
              <span>Entries are loading...</span>
            </div>
          )}
        </div>
      </div>
      <div className={css(ut.divider)} />
      <div className={css(style.centerWrapper)}>
        <div className={`${css(style.reportWrapper)} report-view`} ref={analyticsContainerRef}>
          <style>{reportPrintStyle}</style>
          <SubmissionsDataTable data={reportData?.submissionStatsData} filterOption={{ fromDate, toDate }} />
          <div className={css(style.fieldReportWrap)}>
            <span className={css(ut.title)}>Advance Field Wise Report</span>
            <hr />
            {
              Object.entries(reportData?.fieldData).map(([key, value]) => (
                <FieldReport
                  key={key}
                  title={fields[key]?.adminLbl || fields[key]?.lbl}
                  data={value}
                />
              ))
            }
            {!Object.entries(reportData?.fieldData).length && (
              <p>Please select fields to view reports individually</p>
            )}
          </div>
          <div className={`${css(style.printFooter)} print-footer`}>
            Thank you for using Bit Form. If you like the plugin, please give us a
            {' '}
            <a target="_blank" href="https://wordpress.org/support/plugin/bit-form/reviews/#new-post" rel="noreferrer">review</a>
            {' '}
            on WordPress.org to help us spread more.
          </div>
        </div>
        <div className={css(style.reportOptionWrapper)}>
          <div className="filter-option">
            <span className={css(ut.title)}>Filter Options</span>
            <Cooltip icnSize={14}>
              All filters below will get entries based on analytics report
            </Cooltip>
            <hr />
            <div>
              <span className={css(ut.sectionTitle)}>Filter by Date</span>
              <DateFilter fetchData={fetchData} className={css({ mt: 5 })} />
            </div>
            <div className={css(style.checkWrp)}>
              <span className={css(ut.sectionTitle)}>Entry Status</span>
              {
                statusList.map((status) => (
                  <TableCheckBox
                    key={status.value}
                    id={status.value}
                    onChange={e => statusCheckedAction(e.target.checked, status.value)}
                    title={status.label}
                    checked={checkStatusInArr(status.value)}
                    className={css(ut.flxc, style.check)}
                  />
                ))
              }
            </div>
            <div className={css({ pn: 'relative' })}>
              {!IS_PRO && <ProBadgeOverlay />}
              <DropDown
                className={`w-10 ${css(style.msl)}`}
                titleClassName={css(ut.sectionTitle)}
                title={__('Select Fields for Report:')}
                isMultiple
                addable
                options={fieldOption}
                placeholder={__('Select Field')}
                jsonValue
                action={setAllowedReportedFields}
                value={reportedFields}
                disabled={!IS_PRO}
              />
            </div>

          </div>
          <div className="other-option">
            <h4 className={css(ut.mt3, ut.mb1)}>Other Info</h4>
            <span>
              Total Entry:
              {' '}
              {totalSubmission}
            </span>
          </div>
          <div className={css(style.printWarp)}>
            <Btn className={css({ fs: '14px !important' })} size="sm" onClick={handlePrint} disabled={isloading || isPrinting}>
              <PrintIcon size={16} />
              <span className={css(ut.ml1)}>
                {isloading && __('Loading...')}
                {isPrinting && __('Printing...')}
                {(!isloading && !isPrinting) && __('Print Report')}
              </span>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

const reportPrintStyle = `
  @media print {
    .report-view {
      width: 100% !important;
      overflow: visible !important;
      height: fit-content !important;
    }
    .print-footer {
      display: block;
    }
  }
`

const statusList = [
  { value: '0', label: 'Read' },
  { value: '1', label: 'Unread' },
  { value: '2', label: 'Unconfirmed' },
  { value: '3', label: 'Confirmed' },
  { value: '9', label: 'Draft' },
]

const filterDefaultReportedFields = (fields) => {
  const defaultReportFieldType = ['check', 'radio', 'select', 'html-select', 'country', 'decision-box']
  const defaultReportedFields = Object.entries(fields).filter(([key, value]) => defaultReportFieldType.includes(value.typ)).map(([key, value]) => (key))
  return defaultReportedFields
}

const style = {
  mainWrapper: {
    p: '5px 1rem',
  },
  headerWrapper: {
    mb: 5,
    dy: 'flex',
    jc: 'space-between',
  },
  checkWrp: {
    m: '1rem 0',
  },
  check: {
    m: '5px 0',
    dy: 'table !important',
  },
  fieldReportWrap: {
    m: '1rem 0',
  },
  centerWrapper: {
    dy: 'flex',
  },
  reportWrapper: {
    p: '1rem',
    w: '75%',
    h: 'calc(100vh - 85px)',
    brs: 10,
    owy: 'scroll',
    owx: 'hidden',
    bd: 'rgb(237, 243, 253)',
  },
  reportOptionWrapper: {
    w: '25%',
    p: '1rem',
    pr: 0,
    h: 'calc(100vh - 85px)',
    owy: 'scroll',
    owx: 'hidden',
  },
  printWarp: {
    flx: 'center',
    mt: 10,
  },
  printFooter: {
    dy: 'none',
  },
}
