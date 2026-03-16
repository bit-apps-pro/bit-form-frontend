import { useFela } from 'react-fela'
import EditIcn from '../../Icons/EditIcn'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import Tip from '../Utilities/Tip'

export default function OptionList({ options, onClick }) {
  const { css } = useFela()
  return (
    <div className={css(FieldStyle.optionList)}>
      {options.map((opt, idx) => (
        <div key={`option-${idx * 2}`} className={css(FieldStyle.option)}>
          <div className={css(FieldStyle.optionLabelInput)}>
            <span>
              {opt.lbl}
              {opt.val && ` (${opt.val})`}
            </span>
          </div>
          <Tip msg="Option Edit">
            <button
              data-testid="opt-edt-btn"
              type="button"
              onClick={onClick}
              className={css(ut.icnBtn)}
            >
              <EditIcn size={18} />
            </button>
          </Tip>
        </div>
      ))}
    </div>
  )
}
