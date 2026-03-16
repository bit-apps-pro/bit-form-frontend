import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { $fields } from '../GlobalStates/GlobalStates'
import { getUploadedFilesArr, isValidJsonString } from '../Utils/FormBuilderHelper'
import { __ } from '../Utils/i18nwrap'
import Modal from './Utilities/Modal'
import Table from './Utilities/Table'
import TableFileLink from './Utilities/TableFileLink'

function RepeaterDataTable(props) {
  const { formID } = useParams()
  const fields = useAtomValue($fields)
  const { title, rptData, entryId } = props
  const allResp = isValidJsonString(rptData) ? JSON.parse(rptData) : []
  const filterdKeys = Object.keys(allResp[0] || []).filter(fldKey => !['divider', 'spacer', 'image', 'title'].includes(fields[fldKey]?.typ))
  const tableColumns = filterdKeys.map((fieldKey) => {
    const fldData = fields[fieldKey] || {}
    return {
      Header: fldData.adminLbl || fldData.lbl || fldData.fieldName || fieldKey,
      accessor: fieldKey,
      fieldType: fldData.typ,
      minWidth: 50,
      ...(fldData.typ?.match(/^(file-up|check|select|image-select|signature)$/) && {
        Cell: (row) => {
          if (
            row.cell.value !== null
            && row.cell.value !== undefined
            && row.cell.value !== ''
          ) {
            if (fldData.typ === 'file-up') {
              return (
                <>
                  {getUploadedFilesArr(row.cell.value).map((itm, i) => (
                    <TableFileLink
                      key={`file-n-${row.cell.row.index + i}`}
                      fname={itm}
                      link={`${bits.baseDLURL}formID=${formID}&entryID=${entryId}&fileID=${itm}`}
                    />
                  ))}
                </>
              )
            }
            if (fldData.typ === 'signature') {
              return (
                <TableFileLink
                  fname={row.cell.value}
                  link={`${bits.baseDLURL}formID=${formID}&entryID=${entryId}&fileID=${row.cell.value}`}
                />
              )
            }
            if (fldData.typ === 'check' || fldData.typ === 'select' || fldData.typ === 'image-select') {
              try {
                if (Array.isArray(row.cell.value)) return row.cell.value.join(', ')
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
            return row.cell.value
          }
          return null
        },
      }),
    }
  }) || []

  const isloading = false
  const countEntries = allResp.length
  return (
    <Modal
      lg
      show
      setModal={props.close}
      title={__(`${title} Data List`)}
    >
      <Table
        className="f-table btcd-entries-f"
        height="76vh"
        columns={tableColumns}
        data={allResp}
        loading={isloading}
        countEntries={countEntries}
        resizable
      />
    </Modal>
  )
}

export default RepeaterDataTable
