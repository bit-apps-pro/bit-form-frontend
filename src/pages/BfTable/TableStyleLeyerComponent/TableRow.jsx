import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { $viewId } from '../../../GlobalStates/GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Accordion from '../../../components/style-new/util-components/Accordion'
import TableStyleProperties from './TableStyleProperties'

export default function TableRow() {
  const { formID, viewId } = useParams()
  const tblId = useAtomValue($viewId)
  const currentTableId = viewId === 'new' ? tblId : viewId
  const clsNameKey = `.bf${formID}-${currentTableId}-tbl tr`
  const states = { Hover: ':hover', 'Nth child even': ':nth-child(even)', 'Nth child odd': ':nth-child(odd)' }

  return (
    <Accordion title={__('Table Rows')}>
      <TableStyleProperties
        styleLayer="caption"
        clsNameKey={clsNameKey}
        states={states}
      />
    </Accordion>
  )
}
