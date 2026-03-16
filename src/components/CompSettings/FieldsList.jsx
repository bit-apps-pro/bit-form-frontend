import { useFela } from 'react-fela'
import { getFieldsBasedOnLayoutOrder } from '../../Utils/FormBuilderHelper'
import FieldLinkBtn from './FieldLinkButton'

export default function FieldsList() {
  const sortedFields = getFieldsBasedOnLayoutOrder()
  const hiddenFlds = Object.entries(sortedFields).filter(([, fld]) => fld?.valid?.hide)
  const notHiddenFlds = Object.entries(sortedFields).filter(([, fld]) => !fld?.valid?.hide)

  return (
    <>
      <FieldsList.Group title={`Hidden Fields (${hiddenFlds.length})`} filteredFields={hiddenFlds} />
      <FieldsList.Group title={`Fields (${notHiddenFlds.length})`} filteredFields={notHiddenFlds} />
    </>
  )
}

const Group = ({ title, filteredFields }) => {
  const { css } = useFela()
  if (!filteredFields.length) return <> </>
  return (
    <div>
      <div className={css(s.title)}>{title}</div>
      {filteredFields.map(([fldKey, fldData]) => {
        let { lbl } = fldData
        const { typ, adminLbl, txt } = fldData
        if (['decision-box', 'gdpr'].includes(typ)) {
          lbl = adminLbl
        } else if (typ === 'button') {
          lbl = txt
        }
        return (
          <FieldLinkBtn
            key={fldKey}
            fieldKey={fldKey}
            icn={typ}
            title={lbl || adminLbl || typ}
            subTitle={fldKey}
          />
        )
      })}
    </div>
  )
}

FieldsList.Group = Group

const s = {
  title: {
    fw: 500,
    fs: 16,
    mx: 8,
    pn: 'sticky',
    pt: 14,
    tp: 0,
    bd: 'var(--white)',
    h: 40,
  },
}
