import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import Accordion from '../../../components/style-new/util-components/Accordion'
import TableStyleProperties from './TableStyleProperties'

export default function EvenRow() {
  const { formID, viewId } = useParams()
  const clsNameKey = `.bf${formID}-${viewId}-tbody tr:nth-of-type(even)>*`

  return (
    <Accordion title={__('Table Even Row')}>
      <TableStyleProperties
        styleLayer="evenRow"
        clsNameKey={clsNameKey}
      />
    </Accordion>
  )
}
