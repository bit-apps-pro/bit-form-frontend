import { useState, useRef } from 'react'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { useFela } from 'react-fela'
import { useAtomValue } from 'jotai'
import { hideAll } from 'tippy.js'
import { $reportSelector } from '../../GlobalStates/GlobalStates'
import CalendarIcn from '../../Icons/CalendarIcn'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import tableStyle from '../../styles/table.style'
import { dateTimeFormatter } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Btn from '../Utilities/Btn'
import Downmenu from '../Utilities/Downmenu'
import Tip from '../Utilities/Tip'

export default function EntriesFilter({ fetchData }) {
  const currentReport = useAtomValue($reportSelector)
  const initialRange = {
    startDate: null,
    endDate: null,
    key: 'date',
  }
  const [data, setData] = useState(initialRange)
  const { css } = useFela()
  const searchBtnClicked = useRef(false)

  const isValidDate = date => date instanceof Date && !Number.isNaN(date.getTime())

  const handleSearch = () => {
    searchBtnClicked.current = true
    searchByDateBetween(data)
    hideAll()
  }

  const searchByDateBetween = dates => {
    const { startDate, endDate } = dates
    const startDateFormate = startDate ? dateTimeFormatter(startDate, 'Y-m-d') : ''
    const endDateFormate = endDate ? dateTimeFormatter(endDate, 'Y-m-d') : ''
    const entriesFilterByDate = {
      start_date: startDateFormate,
      end_date: endDateFormate,
    }

    const { pageIndex, pageSize, sortBy, filters, globalFilter, conditions } = currentReport.details
    fetchData({
      pageIndex, pageSize, sortBy, filters, globalFilter, conditions, entriesFilterByDate,
    })
  }

  const handleClearRange = () => {
    setData(initialRange)
    searchByDateBetween(initialRange)
    searchBtnClicked.current = false
    hideAll()
  }

  const pickerRange = {
    ...data,
    startDate: isValidDate(data.startDate) ? data.startDate : new Date(),
    endDate: isValidDate(data.endDate) ? data.endDate : new Date(),
  }

  return (
    <div className="mr-2">
      <Downmenu>
        <div className="flx">
          {(searchBtnClicked.current && isValidDate(data.startDate) && isValidDate(data.endDate)) && (
            <div className="btcd-custom-date-range white ml-2">
              <span className="m-a">
                &nbsp;
                {`${dateTimeFormatter(data.startDate, 'Y-m-d')} - ${dateTimeFormatter(data.endDate, 'Y-m-d')}`}
              </span>
              <button
                aria-label="Close"
                type="button"
                className="icn-btn"
                onClick={handleClearRange}
              >
                <CloseIcn size="12" />
              </button>
            </div>
          )}
          <Tip msg={__('Filter Entries between Dates')}>
            <button
              aria-label="Fitler"
              // className="btn btn-date-range mb3 tooltip"
              className={css(tableStyle.tableActionBtn, ut.ml2)}
              style={{ '--tooltip-txt': `'${__('Filter')}'` }}
              type="button"
            >
              <CalendarIcn size="16" />
            </button>
          </Tip>
        </div>
        <div style={{ minHeight: '200px !important' }} className={css(tableStyle.dataRange)}>
          <DateRange
            onChange={item => setData(item.date)}
            moveRangeOnFirstSelection={false}
            retainEndDateOnFirstSelection
            editableDateInputs
            ranges={[pickerRange]}
            maxDate={new Date()}
            showSelectionPreview={false}
            showDateDisplay
            startDatePlaceholder="Start Date"
            endDatePlaceholder="End Date"
            direction="horizontal"
          />
          {/* <div className="flx flx-between ml-1"> */}
          <div className={css({ flx: '', jc: 'end', pt: 8, pb: 6 })}>
            <Btn className={css(ut.mr1)} size="sm" onClick={handleSearch}>{__('Search')}</Btn>
            <Btn variant="primary-outline" size="sm" onClick={handleClearRange}>{__('Clear')}</Btn>
          </div>
        </div>
      </Downmenu>
    </div>
  )
}
