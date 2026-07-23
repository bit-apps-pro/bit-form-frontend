import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import CloseIcn from '../../../../../Icons/CloseIcn'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import EditOptions from '../../../../CompSettings/EditOptions/EditOptions'
import OptionList from '../../../../CompSettings/OptionList'
import Btn from '../../../../Utilities/Btn'
import Modal from '../../../../Utilities/Modal'

export default function ConfigOptionsListSettings({ propsFldKey }: { propsFldKey?: string } = {}) {
  const { css } = useFela()
  const { fieldKey: paramKey } = useParams<{ fieldKey: string }>()
  const fldKey = propsFldKey ?? paramKey
  const [fields, setFields] = useAtom($fields)
  const [optionMdl, setOptionMdl] = useState(false)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const options = deepCopy(fields[fldKey].options)

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const handleOptions = (newOpts: any[]) => {
    const checkedOpt = newOpts.find(opt => opt.check)
    const allFields = create(fields, draft => {
      draft[fldKey].options = newOpts
      draft[fldKey].config.defaultValue = checkedOpt ? checkedOpt.i : ''
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Modify Options List: ${fieldData.lbl || fldKey}`,
      type: 'options_modify',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <>
      <div className={css(FieldStyle.fieldSection)}>
        <div className={css(FieldStyle.fieldSectionTitle)}>
          {__('Options')}
        </div>
        <OptionList
          options={options}
          onClick={() => setOptionMdl(true)}
        />
        <Btn
          dataTestId="edt-opt-stng"
          variant="primary-outline"
          size="sm"
          className={css({ mt: 10 })}
          onClick={openOptionModal}
        >
          {__('Edit Options')}
          <span className={css(style.plsIcn)}>
            <CloseIcn size="13" stroke="3" />
          </span>
        </Btn>
      </div>

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={closeOptionModal}
        className="o-v"
        title={__('Options')}
      >
        <div className="pos-rel">
          <EditOptions
            optionMdl={optionMdl}
            options={options}
            setOptions={newOpts => handleOptions(newOpts)}
            lblKey="lbl"
            valKey="val"
            type="radio"
            onlyVisualOptionsTab
            hideNDisabledOptions
          />
        </div>
      </Modal>
    </>
  )
}

const style = {
  plsIcn: {
    ml: 3,
    mt: 3,
    tm: 'rotate(45deg)',
  },
}