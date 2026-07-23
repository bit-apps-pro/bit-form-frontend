/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import EditOptions from '../../../../CompSettings/EditOptions/EditOptions'
import OptionList from '../../../../CompSettings/OptionList'
import Modal from '../../../../Utilities/Modal'

interface ActiveOptionsSettingsProps {
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string
  /**
   * Whether to show option icons in the editor
   */
  showOptionIcon?: boolean
}

interface Option {
  lbl: string
  val?: string
  img?: string
  check?: boolean
}

/**
 * Active Options Settings Component
 * 
 * Displays the currently active option list and provides functionality
 * to edit options through a modal interface.
 * 
 * Features:
 * - Displays active options list
 * - Click to edit options
 * - Modal-based option editor
 * - Auto-updates default value based on checked option
 * - Supports custom types
 * 
 * @component
 * @example
 * ```tsx
 * <ActiveOptionsSettings 
 *   showOptionIcon={true}
 * />
 * ```
 */
export default function ActiveOptionsListSettings({
  className = '',
  showOptionIcon = false
}: ActiveOptionsSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  const [optionModalOpen, setOptionModalOpen] = useState(false)

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const optionsList = fieldData?.optionsList || []
  const activeListIndex = fieldData?.config?.activeList ?? 0
  const adminLabel = fieldData?.adminLbl ?? ''

  // Get the active list options
  const activeList = optionsList[activeListIndex]
  const activeListKey = activeList ? Object.keys(activeList)[0] : ''
  const activeOptions: Option[] = activeList?.[activeListKey] || []

  const handleOpenModal = (): void => {
    setOptionModalOpen(true)
  }

  const handleCloseModal = (): void => {
    setOptionModalOpen(false)
  }

  const handleEditOptions = (newOptions: Option[]): void => {
    const updatedFields = create(fields, draft => {
      const listKey = Object.keys(draft[fldKey].optionsList[activeListIndex])[0]
      draft[fldKey].optionsList[activeListIndex][listKey] = newOptions

      // Update default value if a checked option exists
      const defaultOption = newOptions.find(opt => opt.check)
      draft[fldKey].config.defaultValue = defaultOption
        ? (defaultOption.val || defaultOption.lbl)
        : ''
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Modify Active Options: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'modify_active_options',
      state: { fields: updatedFields, fldKey }
    })
  }

  const setCustomType = (customType: string): void => {
    setFields(allFields => create(allFields, draft => {
      if (!draft[fldKey].customTypeList) {
        draft[fldKey].customTypeList = []
      }
      draft[fldKey].customTypeList[activeListIndex] = customType
    }))
  }

  return (
    <>
      <div className={`${css(FieldStyle.fieldSection)} ${className}`}>
        <div className={css(FieldStyle.fieldSectionTitle)}>
          {__('Active Options')}
        </div>
        <OptionList
          options={activeOptions}
          onClick={handleOpenModal}
        />
      </div>

      <Modal
        md
        autoHeight
        show={optionModalOpen}
        setModal={handleCloseModal}
        className="o-v"
        title={__('Edit Options')}
        width="730px"
      >
        <div className="pos-rel">
          <EditOptions
            optionMdl={optionModalOpen}
            options={activeOptions}
            setOptions={handleEditOptions}
            lblKey="lbl"
            valKey="val"
            imgKey="img"
            type="radio"
            hasGroup
            showUpload={showOptionIcon}
            customType={fieldData?.customTypeList?.[activeListIndex]}
            setCustomType={setCustomType}
          />
        </div>
      </Modal>
    </>
  )
}