import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { $viewId } from '../../../GlobalStates/GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Accordion from '../../../components/style-new/util-components/Accordion'
import TableStyleProperties from './TableStyleProperties'

export default function TableWrp() {
  const { formID, viewId } = useParams()
  const tblId = useAtomValue($viewId)
  const currentTableId = viewId === 'new' ? tblId : viewId
  const clsNameKey = `.bf${formID}-${currentTableId}-tbl-wrp`

  return (
    <Accordion title={__('Table Wrapper')}>
      <TableStyleProperties
        styleLayer="tableWrp"
        clsNameKey={clsNameKey}
      />
    </Accordion>
  )
}
