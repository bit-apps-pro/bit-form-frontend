import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import Accordion from '../../../components/style-new/util-components/Accordion'
import TableStyleProperties from './TableStyleProperties'

export default function OddRow() {
  const { formID, viewId } = useParams()
  const clsNameKey = `.bf${formID}-${viewId}-tbody tr:nth-of-type(odd)>*`

  return (
    <Accordion title={__('Table Odd Row')}>
      <TableStyleProperties
        styleLayer="oddRow"
        clsNameKey={clsNameKey}
      />
    </Accordion>
  )
}
