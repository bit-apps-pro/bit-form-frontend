/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import CloseIcn from '../../../../Icons/CloseIcn'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights, setRequired } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import EditOptions from '../../../CompSettings/EditOptions/EditOptions'
import OptionList from '../../../CompSettings/OptionList'
import Btn from '../../../Utilities/Btn'
import Modal from '../../../Utilities/Modal'

/**
 * Options List Settings Component
 * 
 * Manages the options list for radio buttons and checkboxes.
 * Includes:
 * - Display of current options
 * - Button to open edit modal
 * - Modal for adding/editing options
 * - Integration with custom types
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function OptionsListSettings({ showUpload }: { showUpload?: boolean }) {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [optionMdl, setOptionMdl] = useState(false)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const options = deepCopy(fields[fldKey].opt)
  const adminLabel = fieldData.adminLbl || ''

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const handleOptions = (newOpts: any[]) => {
    const reqOpts = newOpts.filter(opt => opt.req)
    reqOpts.length && setRequired({ target: { checked: true } })

    const allFields = create(fields, draft => {
      draft[fldKey].opt = newOpts
      if (reqOpts.length && draft[fldKey].err.req) {
        draft[fldKey].err.req.custom = true
        draft[fldKey].err.req.msg = `<p style="margin:0">${reqOpts.map(opt => opt.lbl).join(',')} is required</p>`
      } else if (draft[fldKey].err.req) {
        draft[fldKey].err.req.msg = `<p style="margin:0">${__('This field is required')}</p>`
      }
    })

    setFields(allFields)
    addToBuilderHistory({
      event: `Options List Moddified: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'option_list_modify',
      state: { fields: allFields, fldKey },
    })
    reCalculateFldHeights(fldKey)
  }

  const handleCustomType = (newCustomType: any) => {
    setFields(allFields => create(allFields, draft => {
      draft[fldKey].customType = newCustomType
    }))
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
          {__('Add/Edit Options')}
          <span className={css(style.plsIcn)}>
            <CloseIcn size="13" stroke="3" />
          </span>
        </Btn>
      </div>

      <Modal
        autoHeight
        show={optionMdl}
        setModal={closeOptionModal}
        className="o-v"
        title={__('Options')}
        width="755px"
      >
        <EditOptions
          optionMdl={optionMdl}
          options={options}
          setOptions={(newOpts) => handleOptions(newOpts)}
          lblKey="lbl"
          valKey="val"
          type={fieldData.typ}
          isRating={fieldData.typ}
          showUpload={showUpload}
          customType={fieldData.customType}
          setCustomType={handleCustomType}
        />
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