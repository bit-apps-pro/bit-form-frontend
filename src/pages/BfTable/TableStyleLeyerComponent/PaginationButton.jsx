import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { $viewId } from '../../../GlobalStates/GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Accordion from '../../../components/style-new/util-components/Accordion'
import TableStyleProperties from './TableStyleProperties'

export default function PaginationButton() {
  const { formID, viewId } = useParams()
  const tblId = useAtomValue($viewId)
  const currentTableId = viewId === 'new' ? tblId : viewId
  const clsNameKey = `.bf${formID}-${currentTableId}-pgn-btn`
  const states = { Hover: ':hover', Focus: ':focus', 'Focus visible': ':focus-visible' }

  return (
    <Accordion title={__('Pagination Button')}>
      <TableStyleProperties
        styleLayer="viewBtn"
        clsNameKey={clsNameKey}
        states={states}
      />
    </Accordion>
  )
}
