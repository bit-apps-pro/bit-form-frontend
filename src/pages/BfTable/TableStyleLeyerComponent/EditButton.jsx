import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { $viewId } from '../../../GlobalStates/GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Accordion from '../../../components/style-new/util-components/Accordion'
import TableStyleProperties from './TableStyleProperties'

export default function EditButton() {
  const { formID, viewId } = useParams()
  const tblId = useAtomValue($viewId)
  const currentTableId = viewId === 'new' ? tblId : viewId
  const clsNameKey = `.bf${formID}-${currentTableId}-tbl-edit-btn`
  // const states = ['Hover', 'Focus', 'Focus-visible']
  const states = { Hover: ':hover', Focus: ':focus', 'Focus visible': ':focus-visible' }

  return (
    <Accordion title={__('Edit Button')}>
      <TableStyleProperties
        styleLayer="editBtn"
        clsNameKey={clsNameKey}
        states={states}
      />
    </Accordion>
  )
}
