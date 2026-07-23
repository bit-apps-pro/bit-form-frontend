/* eslint-disable no-param-reassign */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { Fragment, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $proModal } from '../../../../../GlobalStates/GlobalStates'
import CloseIcn from '../../../../../Icons/CloseIcn'
import EditIcn from '../../../../../Icons/EditIcn'
import TrashIcn from '../../../../../Icons/TrashIcn'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { IS_PRO } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import proHelperData from '../../../../../Utils/StaticData/proHelperData'
import EditOptions from '../../../../CompSettings/EditOptions/EditOptions'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import Btn from '../../../../Utilities/Btn'
import CheckBox from '../../../../Utilities/CheckBox'
import Modal from '../../../../Utilities/Modal'

interface ListsAndOptionsSettingsProps {
  className?: string
  /**
   * Callback to set the current option list index for editing
   */
  onEditList?: (index: number) => void
  /**
   * Whether option icons are shown (affects EditOptions component)
   */
  showOptionIcon?: boolean
}

interface OptionList {
  [key: string]: Array<{
    lbl: string
    val?: string
    img?: string
    check?: boolean
  }>
}

/**
 * Lists & Options Settings Component
 * 
 * Manages multiple option lists for dropdown fields. Allows users to:
 * - Create multiple option lists
 * - Switch between lists
 * - Edit list names
 * - Add/remove lists
 * - Edit options within each list
 * - Set active list
 * 
 * This is a PRO feature that enables dynamic option lists.
 */
export default function ListsAndOptionsSettings({
  className = '',
  onEditList,
  showOptionIcon = false
}: ListsAndOptionsSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const setProModal = useSetAtom($proModal)
  const { css } = useFela()

  const [optionModalOpen, setOptionModalOpen] = useState(false)
  const [duplicateListName, setDuplicateListName] = useState<number | false>(false)
  const [currentOptList, setCurrentOptList] = useState(0)

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const optionsList = fieldData?.optionsList || []
  const activeList = fieldData?.config?.activeList ?? 0
  const adminLabel = fieldData?.adminLbl ?? ''
  const listLength = optionsList.length

  const isListNameExist = (listName: string): boolean => {
    return optionsList.some(listObj => Object.keys(listObj)[0] === listName)
  }

  const handleAddNewOptionList = (): void => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.optionList })
      return
    }

    let newKey = `List-${optionsList.length + 1}`
    while (isListNameExist(newKey)) {
      newKey = `${newKey}1`
    }

    const updatedFields = create(fields, draft => {
      draft[fldKey].optionsList = [
        ...optionsList,
        {
          [newKey]: [
            { lbl: 'Option 1' },
            { lbl: 'Option 2' },
            { lbl: 'Option 3' },
          ],
        },
      ]
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Add New List: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'add_new_list',
      state: { fields: updatedFields, fldKey }
    })
  }

  const handleRemoveList = (index: number): void => {
    const updatedFields = create(fields, draft => {
      draft[fldKey].optionsList.splice(index, 1)
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Remove List: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'remove_list',
      state: { fields: updatedFields, fldKey }
    })
  }

  const handleListNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const { value, defaultValue } = e.target

    if (!isListNameExist(value)) {
      const updatedFields = create(fields, draft => {
        draft[fldKey].optionsList[index] = {
          [value]: draft[fldKey].optionsList[index][defaultValue]
        }
      })

      setFields(updatedFields)
      addToBuilderHistory({
        event: `List Name Change: ${fieldData.lbl || adminLabel || fldKey}`,
        type: 'list_name_change',
        state: { fields: updatedFields, fldKey }
      })
      setDuplicateListName(false)
    } else {
      e.preventDefault()
      setDuplicateListName(index)
    }
  }

  const handleOptionList = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const updatedFields = create(fields, draft => {
      const field = draft[fldKey]
      field.config.activeList = index

      const listKey = Object.keys(field.optionsList[index])[0]
      const defaultOpt = field.optionsList[index][listKey].find(opt => opt.check)
      field.config.defaultValue = defaultOpt ? (defaultOpt.val || defaultOpt.lbl) : ''
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Change Active List: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'change_active_list',
      state: { fields: updatedFields, fldKey }
    })
  }

  const openOptionModal = (index: number): void => {
    setCurrentOptList(index)
    setOptionModalOpen(true)
    onEditList?.(index)
  }

  const handleEditOptions = (newOpts: Array<any>): void => {
    const updatedFields = create(fields, draft => {
      const listKey = Object.keys(draft[fldKey].optionsList[currentOptList])[0]
      draft[fldKey].optionsList[currentOptList][listKey] = newOpts

      if (currentOptList === activeList) {
        const defaultOpt = newOpts.find(opt => opt.check)
        draft[fldKey].config.defaultValue = defaultOpt ? (defaultOpt.val || defaultOpt.lbl) : ''
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Modify Option List: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'modify_options_list',
      state: { fields: updatedFields, fldKey }
    })
  }

  const setCustomType = (customType: string): void => {
    setFields(allFields => create(allFields, draft => {
      if (!draft[fldKey].customTypeList) {
        draft[fldKey].customTypeList = []
      }
      draft[fldKey].customTypeList[currentOptList] = customType
    }))
  }

  const currentListOptions = optionsList[currentOptList]
    ? Object.values(optionsList[currentOptList])[0]
    : []

  return (
    <>
      <SimpleAccordion
        id="lst-n-opt"
        title="Lists & Options"
        className={`${css(FieldStyle.fieldSection)} ${className}`}
        open
      >
        <div className={css({ p: '5px 10px' })}>
          {optionsList.map((listObj: OptionList, index: number) => {
            const listName = Object.keys(listObj)[0]
            return (
              <Fragment key={`list-name-${index + 1}`}>
                <div className={css(ut.flxcb)}>
                  <input
                    data-testid={`lst-name-inp-${index}`}
                    type="text"
                    value={listName}
                    className={css(FieldStyle.input, { mr: 10, my: 5 })}
                    onChange={e => handleListNameChange(e, index)}
                  />
                  <CheckBox
                    id={`lst-opt-${index}`}
                    radio
                    name="option-list"
                    className={css({ p: 0 })}
                    onChange={e => handleOptionList(e, index)}
                    checked={index === activeList}
                    value={index}
                    tip="Select this list as active"
                  />
                  <button
                    data-testid={`lst-opt-edt-btn-${index}`}
                    type="button"
                    className={css(styles.deleteButton)}
                    title="Edit List Options"
                    onClick={() => openOptionModal(index)}
                  >
                    <EditIcn size={19} />
                  </button>
                  {listLength > 1 && index !== activeList && (
                    <button
                      data-testid={`lst-opt-del-btn-${index}`}
                      type="button"
                      className={css(styles.deleteButton)}
                      onClick={() => handleRemoveList(index)}
                      title="Delete List"
                    >
                      <TrashIcn size={19} />
                    </button>
                  )}
                </div>
                {duplicateListName === index && (
                  <span className={css({ cr: 'red', ml: 5 })}>
                    Duplicate List Name Not Allowed
                  </span>
                )}
              </Fragment>
            )
          })}
          <Btn
            dataTestId="edt-opt-stng"
            variant="primary-outline"
            size="sm"
            className={css({ mt: 10 })}
            onClick={handleAddNewOptionList}
          >
            {__('Add Options List')}
            <span className={css({ ml: 3, mt: 3, tm: 'rotate(45deg)' })}>
              <CloseIcn size="13" stroke="3" />
            </span>
          </Btn>
        </div>
      </SimpleAccordion>

      <Modal
        md
        autoHeight
        show={optionModalOpen}
        setModal={() => setOptionModalOpen(false)}
        className="o-v"
        title={__('Options')}
        width="730px"
      >
        <div className="pos-rel">
          <EditOptions
            optionMdl={optionModalOpen}
            options={currentListOptions}
            setOptions={handleEditOptions}
            lblKey="lbl"
            valKey="val"
            imgKey="img"
            type="radio"
            hasGroup
            showUpload={showOptionIcon}
            customType={fieldData?.customTypeList?.[currentOptList]}
            setCustomType={setCustomType}
          />
        </div>
      </Modal>
    </>
  )
}

const styles = {
  deleteButton: {
    se: 25,
    flx: 'center',
    b: 'none',
    p: 3,
    mr: 1,
    tn: '.2s all',
    curp: 1,
    brs: '50%',
    bd: 'none',
    ':hover': { bd: 'var(--b-20-93)', cr: 'var(--blue)' },
  },
}