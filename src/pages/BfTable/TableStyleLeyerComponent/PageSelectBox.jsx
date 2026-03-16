import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { $viewId } from '../../../GlobalStates/GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Accordion from '../../../components/style-new/util-components/Accordion'
import TableStyleProperties from './TableStyleProperties'

export default function PageSelectBox() {
  const { formID, viewId } = useParams()
  const tblId = useAtomValue($viewId)
  const currentTableId = viewId === 'new' ? tblId : viewId
  const clsNameKey = `.bf${formID}-${currentTableId}-tbl-pgn-slt`
  const states = { Hover: ':hover', focus: ':focus', 'Focus visible': ':focus-visible' }

  return (
    <Accordion title={__('Page Select Box')}>
      <TableStyleProperties
        styleLayer="viewBtn"
        clsNameKey={clsNameKey}
        states={states}
      />
    </Accordion>
  )
}
