import { useEffect, useMemo, useState } from 'react'
import { useFela } from 'react-fela'
import ut from '../../styles/2.utilities'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import Btn from '../Utilities/Btn'
import DropDown from '../Utilities/DropDown'
import Modal from '../Utilities/Modal'
import SnackMsg from '../Utilities/SnackMsg'

export default function Export({ showExportMdl, close, cols, formID, report }) {
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const { css } = useFela()
  const [data, setData] = useState({
    fileFormate: 'csv',
    sort: 'ASC',
    sortField: 'bitforms_form_entry_id',
    limit: null,
    custom: 'all',
    formId: formID,
    filter: 'All Entries',
    selectedField: '',
  })

  const [selectedColumns, setSelectedColumns] = useState([])
  const { order, hidden } = useMemo(() => ({
    order: report ? report[report.length - 1]?.details?.order : ['bf3-1-'],
    hidden: report ? report[report.length - 1]?.details?.hiddenColumns : [],
  }), [report])

  const columns = useMemo(() => cols.filter((col) => col.Header !== '#' && typeof col.Header !== 'object'), [cols])

  const colHeading = useMemo(() => {
    const arr = []
    let i = 0
    columns.map((col) => {
      if (!hidden?.includes(col.accessor)) {
        arr[i] = {
          key: col.accessor,
          val: col.Header,
        }
        // fieldKey[i] = col.accessor
        i += 1
      }
    })
    return arr
  }, [columns, hidden])

  // const fieldKey = []

  useEffect(() => {
    const hiddenColumns = report.find(rpt => rpt.details.report_name === data.filter)?.details.hiddenColumns || []
    const notHidden = columns.filter(col => !hiddenColumns?.includes(col.accessor)).map(col => ({ label: col.Header, value: col.accessor }))

    setSelectedColumns(notHidden)
  }, [report, cols, data.filter])

  const onSelectColumsChange = (val) => {
    const newCols = columns.filter(col => val.split(',').includes(col.accessor)).map(col => ({ label: col.Header, value: col.accessor }))
    setSelectedColumns(newCols)
  }

  // fieldKey = fieldKey.filter((col) => !hidden.includes(col))
  // colHeading = colHeading.filter((col) => !hidden.includes(col.key))
  // data.selectedField = JSON.stringify(fieldKey)
  const getEntry = async (e) => {
    e.preventDefault()

    const newData = { ...data }
    const selectedReport = report.find(rpt => rpt.details.report_name === data.filter)

    newData.filter = selectedReport ? selectedReport.details.conditions || [] : []
    newData.selectedField = JSON.stringify(selectedColumns.map(col => col.value))
    if (selectedColumns.length < 1) {
      return setSnackbar({ ...{ show: true, msg: __('Please select at least one column') } })
    }
    setIsLoading(true)
    try {
      const res = await bitsFetch(
        { data: newData },
        'bitforms_filter_export_data',
      )
      if (res !== undefined && res.success && res.data?.count !== 0) {
        const XLSX = await import('xlsx')
        const header = ['Entry ID', ...selectedColumns.map(col => col.label)]
        const ws = XLSX.utils.json_to_sheet(res.data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.sheet_add_aoa(ws, [header])
        XLSX.utils.book_append_sheet(wb, ws)
        XLSX.writeFile(wb, `bitform ${formID}.${newData?.fileFormate}`)
      } else if (res !== undefined && res.success && res.data?.count === 0) {
        setSnackbar({ ...{ show: true, msg: __('no response found') } })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInput = (typ, val) => {
    setData(prev => ({
      ...prev,
      [typ]: typeof val === 'number' ? Number(val) : val,
    }))
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <Modal md show={showExportMdl} setModal={close} title="Export Data" style={{ overflow: 'auto' }}>
        <div>
          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('How many rows to export')}</b>
            <select
              className="btcd-paper-inp ml-2"
              name="custom"
              style={{ width: 250 }}
              onChange={(e) => handleInput(e.target.name, e.target.value)}
              value={data.custom || ''}
            >
              <option disabled value="0">Choose option</option>
              <option value="all">All</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {data.custom === 'custom' && (
            <div className="mt-3 flx">
              <b style={{ width: 200 }}>{__('Enter row number')}</b>
              <input
                aria-label="Export Row Number"
                type="text"
                style={{ width: 250 }}
                name="limit"
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                className="btcd-paper-inp mt-2"
                placeholder="Export Row Number"
                value={data.limit || ''}
              />
            </div>
          )}

          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('Select filter')}</b>
            <select
              className="btcd-paper-inp ml-2"
              name="filter"
              style={{ width: 250 }}
              onChange={(e) => handleInput(e.target.name, e.target.value)}
              value={data.filter}
            >
              {report?.map(rpt => <option key={rpt.id} value={rpt.details.report_name}>{rpt.details.report_name}</option>)}
            </select>
          </div>
          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('Select columns')}</b>
            <div className="w-4 " style={{ paddingRight: '14px' }}>

              <DropDown
                placeholder="Select column"
                className={css({
                  '&.msl-wrp': {
                    margin: '0 0 0 10px!important',
                    transition: 'all 0.2s ease!important',
                    '&:hover': {
                      borderColor: 'black!important',
                    },
                  },
                  '&.msl-wrp > .msl': {
                    'background-color': '#fff!important',

                  },
                })}
                isMultiple
                action={onSelectColumsChange}
                options={columns.map(col => ({ label: col.Header, value: col.accessor }))}
                value={selectedColumns}
              />
            </div>
          </div>
          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('Sort Order')}</b>
            <select
              className="btcd-paper-inp ml-2"
              name="sort"
              style={{ width: 250 }}
              value={data.sort || 'ASC'}
              onChange={(e) => handleInput(e.target.name, e.target.value)}
            >
              {/* <option selected disabled>Choose your sort type</option> */}
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('Sort by')}</b>
            <select
              className="btcd-paper-inp ml-2"
              name="sortField"
              value={data.sortField || 'bitforms_form_entry_id'}
              onChange={(e) => handleInput(e.target.name, e.target.value)}
              style={{ width: 250 }}
            >
              <option value="bitforms_form_entry_id">ID</option>
              {colHeading.map((col) => (
                <option key={col.key} value={col.key}>{col.val}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('Export File Format')}</b>
            <select
              className="btcd-paper-inp ml-2"
              name="fileFormate"
              value={data.fileFormate || 'csv'}
              style={{ width: 250 }}
              onChange={(e) => handleInput(e.target.name, e.target.value)}
            >
              {/* <option selected disabled>Choose Type</option> */}
              <option value="csv">CSV</option>
              <option value="xlsx">Xlsx</option>
              <option value="xls">Xls</option>
              <option value="fods">Fods</option>
              <option value="ods">Ods</option>
              <option value="prn">Prn</option>
              <option value="txt">Text</option>
              <option value="html">Html</option>
              <option value="eth">Eth</option>
            </select>
          </div>
          <Btn
            onClick={e => getEntry(e)}
            disabled={isLoading}
            className={css(ut.mt1)}
            size="sm"
          >
            {__('Export')}
            {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
          </Btn>
        </div>
      </Modal>
    </div>
  )
}
