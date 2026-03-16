import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $fields, $updateBtn, $workflows } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import { SmartTagField } from '../../Utils/StaticData/SmartTagField'
import Button from '../Utilities/Button'
import Downmenu from '../Utilities/Downmenu'
import Tip from '../Utilities/Tip'
import LogicBlock from './LogicBlock'
import LogicChip from './LogicChip'
import { accessToNested, filterFormFields } from './WorkflowHelpers'

export default function WorkflowLogicSection({ lgcGrp, lgcGrpInd, condGrp, condGrpInd }) {
  const { css } = useFela()
  const [workflows, setWorkflows] = useAtom($workflows)
  const setUpdateBtn = useSetAtom($updateBtn)
  const fields = useAtomValue($fields)

  const addLogic = (typ, path = '', isGroup = 0) => {
    const logicData = [typ]
    const logicObj = { field: '', logic: '', val: '' }

    if (isGroup) logicData.push([logicObj, typ, logicObj])
    else logicData.push(logicObj)
    setWorkflows(prvSt => create(prvSt, prv => {
      let tmp = prv[lgcGrpInd].conditions[condGrpInd].logics
      tmp = accessToNested(tmp, path)
      tmp.push(...logicData)
    }))

    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const delLogic = (lgcInd, subLgcInd, subSubLgcInd) => {
    const tmpWorkflows = create(workflows, draftWorkflows => {
      const tmpLogics = draftWorkflows[lgcGrpInd].conditions[condGrpInd].logics
      if (tmpLogics.length > 1) {
        if (subSubLgcInd !== undefined) {
          if (tmpLogics[lgcInd][subLgcInd].length === subSubLgcInd + 1) {
            if (tmpLogics[lgcInd][subLgcInd].length === 3) {
              const tmp = tmpLogics[lgcInd][subLgcInd][subSubLgcInd - 2]
              tmpLogics[lgcInd].splice(subLgcInd, 1)
              tmpLogics[lgcInd].push(tmp)
            } else {
              tmpLogics[lgcInd][subLgcInd].splice(subSubLgcInd - 1, 2)
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (tmpLogics[lgcInd][subLgcInd].length === 3) {
              const tmp = tmpLogics[lgcInd][subLgcInd][subSubLgcInd + 2]
              tmpLogics[lgcInd].splice(subLgcInd, 1)
              tmpLogics[lgcInd].push(tmp)
            } else {
              tmpLogics[lgcInd][subLgcInd].splice(subSubLgcInd, 2)
            }
          }
        } else if (subLgcInd !== undefined) {
          if (tmpLogics[lgcInd].length === subLgcInd + 1) {
            if (tmpLogics[lgcInd].length === 3) {
              const tmp = tmpLogics[lgcInd][subLgcInd - 2]
              tmpLogics.splice(lgcInd, 1)
              tmpLogics.splice(lgcInd, 0, tmp)
            } else {
              tmpLogics[lgcInd].splice(subLgcInd - 1, 2)
            }
          } else if (tmpLogics[lgcInd].length === 3) {
            const tmp = tmpLogics[lgcInd][subLgcInd + 2]
            tmpLogics.splice(lgcInd, 1)
            tmpLogics.splice(lgcInd, 0, tmp)
          } else {
            tmpLogics[lgcInd].splice(subLgcInd, 2)
          }
        } else if (lgcInd !== 0) {
          tmpLogics.splice(lgcInd - 1, 2)
        } else {
          tmpLogics.splice(lgcInd, 2)
        }
      }
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const changeLogic = (val, lgcInd, subLgcInd, subSubLgcInd) => {
    const tmpWorkflows = create(workflows, draftWorkflows => {
      const tmpLogics = draftWorkflows[lgcGrpInd].conditions[condGrpInd].logics
      if (subSubLgcInd !== undefined) {
        if (val === 'null') {
          tmpLogics[lgcInd][subLgcInd][subSubLgcInd].val = ''
        }
        tmpLogics[lgcInd][subLgcInd][subSubLgcInd].logic = val
      } else if (subLgcInd !== undefined) {
        if (val === 'null') {
          tmpLogics[lgcInd][subLgcInd].val = ''
        }
        tmpLogics[lgcInd][subLgcInd].logic = val
      } else {
        if (val === 'null') {
          tmpLogics[lgcInd].val = ''
        }
        tmpLogics[lgcInd].logic = val
      }
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const changeLogicChip = (val, lgcInd, subLgcInd, subSubLgcInd) => {
    const tmpWorkflows = create(workflows, draftWorkflows => {
      const tmpLogics = draftWorkflows[lgcGrpInd].conditions[condGrpInd].logics
      if (subSubLgcInd !== undefined) {
        tmpLogics[lgcInd][subLgcInd][subSubLgcInd] = val
      } else if (subLgcInd !== undefined) {
        tmpLogics[lgcInd][subLgcInd] = val
      } else {
        tmpLogics[lgcInd] = val
      }
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const getLogicPath = (logicsObj, lgcInd, subLgcInd, subSubLgcInd) => {
    if (subSubLgcInd !== undefined) {
      return logicsObj[lgcInd][subLgcInd][subSubLgcInd]
    }
    if (subLgcInd !== undefined) {
      return logicsObj[lgcInd][subLgcInd]
    }
    return logicsObj[lgcInd]
  }

  const changeValue = (val, lgcInd, subLgcInd, subSubLgcInd, valKey = '') => {
    const tmpWorkflows = create(workflows, draftWorkflows => {
      const tmpLogics = draftWorkflows[lgcGrpInd].conditions[condGrpInd].logics
      const logicPath = getLogicPath(tmpLogics, lgcInd, subLgcInd, subSubLgcInd)

      if (valKey) {
        if (typeof logicPath.val === 'string') {
          logicPath.val = {}
        }
        logicPath.val[valKey] = val
      } else {
        logicPath.val = val
      }
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const changeFormField = (val, lgcInd, subLgcInd, subSubLgcInd) => {
    const isSmartTag = SmartTagField.find(field => field.name === val)
    const tmpWorkflows = create(workflows, draftWorkflows => {
      const tmpLogics = draftWorkflows[lgcGrpInd].conditions[condGrpInd].logics
      const logicPath = getLogicPath(tmpLogics, lgcInd, subLgcInd, subSubLgcInd)
      logicPath.field = val
      if (typeof logicPath.val === 'undefined') logicPath.val = ''
      if (!isSmartTag?.custom) delete logicPath.smartKey
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addInlineLogic = (typ, lgcInd, subLgcInd, subSubLgcInd) => {
    const tmpWorkflows = create(workflows, draftWorkflows => {
      const tmpLogics = draftWorkflows[lgcGrpInd].conditions[condGrpInd].logics
      if (subSubLgcInd !== undefined) {
        tmpLogics[lgcInd][subLgcInd].splice(subSubLgcInd + 1, 0, typ, { field: '', logic: '', val: '' })
      } else if (subLgcInd !== undefined) {
        tmpLogics[lgcInd].splice(subLgcInd + 1, 0, typ, { field: '', logic: '', val: '' })
      } else {
        tmpLogics.splice(lgcInd + 1, 0, typ, { field: '', logic: '', val: '' })
      }
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const cloneInLineLogic = (lgcInd, subLgcInd, subSubLgcInd) => {
    let typ = subSubLgcInd !== undefined ? workflows[lgcGrpInd].conditions[condGrpInd].logics[lgcInd][subLgcInd][subSubLgcInd - 1] : subLgcInd !== undefined ? workflows[lgcGrpInd].conditions[condGrpInd].logics[lgcInd][subLgcInd - 1] : workflows[lgcGrpInd].conditions[condGrpInd].logics[lgcInd - 1]
    if (!(typ === 'and' || typ === 'or')) typ = 'and'
    const tmpWorkflows = create(workflows, draftWorkflows => {
      const tmpLogics = draftWorkflows[lgcGrpInd].conditions[condGrpInd].logics
      if (subSubLgcInd !== undefined) {
        const clonedLogic = { ...tmpLogics[lgcInd][subLgcInd][subSubLgcInd] }
        tmpLogics[lgcInd][subLgcInd].splice(subSubLgcInd + 1, 0, typ, clonedLogic)
      } else if (subLgcInd !== undefined) {
        const clonedLogic = { ...tmpLogics[lgcInd][subLgcInd] }
        tmpLogics[lgcInd].splice(subLgcInd + 1, 0, typ, clonedLogic)
      } else {
        const clonedLogic = { ...tmpLogics[lgcInd] }
        tmpLogics.splice(lgcInd + 1, 0, typ, clonedLogic)
      }
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const changeSmartKey = (val, lgcInd, subLgcInd, subSubLgcInd) => {
    const tmpWorkflows = create(workflows, draftWorkflows => {
      const tmpLogics = draftWorkflows[lgcGrpInd].conditions[condGrpInd].logics
      const logicPath = getLogicPath(tmpLogics, lgcInd, subLgcInd, subSubLgcInd)
      logicPath.smartKey = val
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const isSmartTagNeeded = (logics, indx) => {
    if (lgcGrp.action_type !== 'oninput') return true
    const fldExistsInLogic = logics.findIndex(lgc => lgc.field && (lgc.field in fields))
    return fldExistsInLogic >= 0 && fldExistsInLogic !== indx
  }
  const addNestedLogic = (typ, indx, isGroup = 0) => {
    const logicData = [typ]
    const logicObj = { field: '', logic: '', val: '' }
    if (isGroup) logicData.push([logicObj, typ, logicObj])
    else logicData.push(logicObj)

    setWorkflows(prvSt => create(prvSt, draft => {
      const { logics } = prvSt[lgcGrpInd].conditions[condGrpInd]
      const newLogics = [...logics[indx], ...logicData]
      draft[lgcGrpInd].conditions[condGrpInd].logics[indx] = newLogics
    }))
  }

  return (
    condGrp?.logics?.map((logic, ind) => (
      <span key={`logic-${ind + 44}`}>
        {typeof logic === 'object' && !Array.isArray(logic) && (
          <LogicBlock
            logic={logic}
            fieldVal={logic.field}
            changeFormField={changeFormField}
            changeValue={changeValue}
            changeSmartKey={changeSmartKey}
            logicValue={logic.logic}
            changeLogic={changeLogic}
            addInlineLogic={addInlineLogic}
            cloneInLineLogic={cloneInLineLogic}
            delLogic={delLogic}
            lgcGrpInd={lgcGrpInd}
            lgcInd={ind}
            value={logic.val}
            actionType={lgcGrp?.action_type}
            smartTagAllowed={isSmartTagNeeded(condGrp.logics, ind)}
            formFields={filterFormFields(condGrp)}
          />
        )}
        {typeof logic === 'string' && (
          <LogicChip logic={logic} onChange={e => changeLogicChip(e.target.value, ind)} />
        )}
        {Array.isArray(logic) && (
          <div className="p-2 br-10 btcd-logic-grp mt-2 mb-2 pl-4 pr-4">
            {logic.map((subLogic, subInd) => (
              <span key={`subLogic-${subInd * 7}`}>
                {typeof subLogic === 'object' && !Array.isArray(subLogic) && (
                  <LogicBlock
                    logic={subLogic}
                    fieldVal={subLogic.field}
                    changeFormField={changeFormField}
                    changeValue={changeValue}
                    changeSmartKey={changeSmartKey}
                    logicValue={subLogic.logic}
                    changeLogic={changeLogic}
                    addInlineLogic={addInlineLogic}
                    cloneInLineLogic={cloneInLineLogic}
                    delLogic={delLogic}
                    lgcGrpInd={lgcGrpInd}
                    lgcInd={ind}
                    subLgcInd={subInd}
                    value={subLogic.val}
                    actionType={lgcGrp?.action_type}
                    smartTagAllowed={isSmartTagNeeded(logic, subInd)}
                    formFields={filterFormFields(condGrp)}
                  />
                )}
                {typeof subLogic === 'string' && (
                  <LogicChip
                    logic={subLogic}
                    nested
                    onChange={e => changeLogicChip(e.target.value, ind, subInd)}
                  />
                )}
                {Array.isArray(subLogic) && (
                  <div className="p-2 br-10 btcd-logic-grp mt-2 mb-2 pl-4 pr-4">
                    {subLogic.map((subSubLogic, subSubLgcInd) => (
                      <span key={`subsubLogic-${subSubLgcInd + 90}`}>
                        {typeof subSubLogic === 'object' && !Array.isArray(subSubLogic) && (
                          <LogicBlock
                            logic={subSubLogic}
                            fieldVal={subSubLogic.field}
                            changeFormField={changeFormField}
                            changeValue={changeValue}
                            changeSmartKey={changeSmartKey}
                            logicValue={subSubLogic.logic}
                            changeLogic={changeLogic}
                            addInlineLogic={addInlineLogic}
                            cloneInLineLogic={cloneInLineLogic}
                            delLogic={delLogic}
                            lgcGrpInd={lgcGrpInd}
                            lgcInd={ind}
                            subLgcInd={subInd}
                            subSubLgcInd={subSubLgcInd}
                            value={subSubLogic.val}
                            actionType={lgcGrp?.action_type}
                            smartTagAllowed={isSmartTagNeeded(subLogic, subSubLgcInd)}
                            formFields={filterFormFields(condGrp)}
                          />
                        )}
                        {typeof subSubLogic === 'string' && (
                          <LogicChip
                            logic={subSubLogic}
                            nested
                            onChange={e => changeLogicChip(e.target.value, ind, subInd, subSubLgcInd)}
                          />
                        )}
                      </span>
                    ))}
                    <Downmenu
                      place="bottom"
                    >
                      <Tip msg="Add Logic">
                        <Button
                          icn
                          className="blue sh-sm"
                        >
                          <CloseIcn size="14" className="icn-rotate-45" />
                        </Button>
                      </Tip>
                      <div>
                        <button
                          type="button"
                          className={css(accordionStyle.addItemBtn)}
                          onClick={() => addInlineLogic('and', ind, subInd, subLogic.length)}
                        >
                          <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                          Add AND
                        </button>
                        <button
                          type="button"
                          className={css(accordionStyle.addItemBtn)}
                          onClick={() => addInlineLogic('or', ind, subInd, subLogic.length)}
                        >
                          <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                          Add OR
                        </button>
                      </div>
                    </Downmenu>
                  </div>
                )}
              </span>
            ))}
            <Downmenu
              place="bottom"
            >
              <Tip msg="Add Logic">
                <Button
                  icn
                  className="blue sh-sm"
                >
                  <CloseIcn size="14" className="icn-rotate-45" />
                </Button>
              </Tip>
              <div>
                <button
                  type="button"
                  className={css(accordionStyle.addItemBtn)}
                  onClick={() => addNestedLogic('and', ind)}
                >
                  <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                  Add AND
                </button>
                <button
                  type="button"
                  className={css(accordionStyle.addItemBtn)}
                  onClick={() => addNestedLogic('or', ind)}
                >
                  <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                  Add OR
                </button>
                <button
                  type="button"
                  className={css(accordionStyle.addItemBtn)}
                  onClick={() => addNestedLogic('and', ind, 1)}
                >
                  <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                  Add AND Group
                </button>
                <button
                  type="button"
                  className={css(accordionStyle.addItemBtn)}
                  onClick={() => addNestedLogic('or', ind, 1)}
                >
                  <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                  Add OR Group
                </button>
              </div>
            </Downmenu>
          </div>
        )}
      </span>
    ))
  )
}

const accordionStyle = {
  addItemBtn: {
    dy: 'block',
    w: '100%',
    b: 0,
    oe: 0,
    brs: 8,
    ta: 'left',
    cr: '#444',
    fs: 12,
    fw: 500,
    p: 5,
    pr: 20,
    bd: 'none',
    curp: 1,
    ':hover': { bc: '#EFEFEF' },
  },
}
