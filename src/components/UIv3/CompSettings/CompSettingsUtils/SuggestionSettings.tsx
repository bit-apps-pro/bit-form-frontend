/* eslint-disable no-param-reassign */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $updateBtn } from '../../../../GlobalStates/GlobalStates'
import CloseIcn from '../../../../Icons/CloseIcn'
import ut from '../../../../styles/2.utilities'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import tippyHelperMsg from '../../../../Utils/StaticData/tippyHelperMsg'
import EditOptions from '../../../CompSettings/EditOptions/EditOptions'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import Btn from '../../../Utilities/Btn'
import Modal from '../../../Utilities/Modal'

export default function SuggestionSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const setUpdateBtn = useSetAtom($updateBtn)
  const [optionMdl, setOptionMdl] = useState(false)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const suggestions = fieldData.suggestions || []

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const handleSuggestions = (newSuggestions: any[]) => {
    fieldData.suggestions = newSuggestions
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    setUpdateBtn({ unsaved: true })
    addToBuilderHistory({
      event: `Suggestion Update: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'suggestion_update',
      state: { fields: allFields, fldKey },
    })
  }

  const hideSuggestionVal = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!IS_PRO) return

    if (checked) {
      fieldData.suggestionHide = true
    } else {
      fieldData.suggestionHide = false
      delete fieldData.suggestions
    }

    const req = checked ? 'on' : 'off'
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Suggestion ${req}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `${req.toLowerCase()}_defaultValue`,
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <>
      <SimpleAccordion
        id="sgsn-stng"
        title={__('Suggestion')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        tip={tippyHelperMsg.suggestion}
        tipProps={{ width: 250, icnSize: 17 }}
        toggleAction={hideSuggestionVal}
        toggleChecked={fieldData?.suggestionHide}
        open={fieldData?.suggestionHide}
        {...(IS_PRO && { disable: !fieldData?.suggestionHide })}
        isPro
        proProperty="suggestion"
      >
        <div className={css(FieldStyle.placeholder, ut.mb1)}>
          <Btn
            variant="primary-outline"
            size="sm"
            className={css({ mt: 10 })}
            onClick={openOptionModal}
            dataTestId="sgsn-stng-btn"
          >
            {__('Add/Edit Suggestions')}
            <span className={css(style.plsIcn)}>
              <CloseIcn size="13" stroke="4" />
            </span>
          </Btn>
        </div>
      </SimpleAccordion>

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={closeOptionModal}
        className="o-v"
        title={__('Suggestion')}
      >
        <div className="pos-rel">
          <EditOptions
            optionMdl={optionMdl}
            options={suggestions}
            setOptions={(newSuggestions) => handleSuggestions(newSuggestions)}
            lblKey="lbl"
            valKey="val"
            checkByDefault={false}
          />
        </div>
      </Modal>
    </>
  )
}

const style = {
  plsIcn: {
    ml: 8,
    mt: 3,
    tm: 'rotate(45deg)',
  },
}