import bfTableSelect from './bf-table-select'
import BitTableView from './class-table-view'

export default function BitFormTableView() {
  const table = Object.keys(window?.bf_view_globals.bf_tables || {})
  table.forEach(tableKey => {
    const tableInfo = window.bf_view_globals.bf_tables[tableKey]
    if (tableInfo) {
      const { formId, viewId } = tableInfo
      const container = bfTableSelect(`.bf${formId}-${viewId}-tbl-wrp`)
      tableInfo.inits = new BitTableView(container, tableInfo)
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof bit_data_view !== 'undefined') bit_data_view()
  else console.error('bit_data_view is not defined')
})
