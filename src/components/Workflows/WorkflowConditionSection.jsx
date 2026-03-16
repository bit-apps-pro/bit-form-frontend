import { useSetAtom } from 'jotai'
import { create } from 'mutative'
import { Fragment, useState } from 'react'
import { useFela } from 'react-fela'
import { hideAll } from 'tippy.js'
import { $updateBtn, $workflows } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import CopyIcn from '../../Icons/CopyIcn'
import PlusIcn from '../../Icons/PlusIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { deepCopy, firstCharCap } from '../../Utils/Helpers'
import { defaultConds } from '../../Utils/StaticData/form-templates/templateProvider'
import Button from '../Utilities/Button'
import ConfirmModal from '../Utilities/ConfirmModal'
import Downmenu from '../Utilities/Downmenu'
import Tip from '../Utilities/Tip'
import WorkflowAccordion from './WorkflowAccordion'
import WorkflowActionSection from './WorkflowActionSection'
import { accessToNested } from './WorkflowHelpers'
import WorkflowLogicSection from './WorkflowLogicSection'

export default function WorkflowConditionSection({ lgcGrpInd, lgcGrp }) {
  const { css } = useFela()
  const setWorkflows = useSetAtom($workflows)
  const setUpdateBtn = useSetAtom($updateBtn)
  const generateAccrTtl = title => title.replace(/-/g, ' ').split(' ').map(word => firstCharCap(word)).join(' ')

  const addCondition = condType => {
    hideAll()
    setWorkflows(prevWorkflows => create(prevWorkflows, draftWorkflow => {
      const { conditions } = draftWorkflow[lgcGrpInd]
      const condData = { ...defaultConds, cond_type: condType }
      if (condType === 'else') delete condData.logics
      if (condType === 'else-if' && conditions[conditions.length - 1].cond_type === 'else') conditions.splice(conditions.length - 1, 0, condData)
      else conditions.push(condData)
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addLogic = (typ, condGrpInd, logicPath = '', isGroup = 0) => {
    hideAll()
    const logicData = [typ]
    const logicObj = { field: '', logic: '', val: '' }

    if (isGroup) logicData.push([logicObj, typ, logicObj])
    else logicData.push(logicObj)
    setWorkflows(prvSt => create(prvSt, prv => {
      let tmp = prv[lgcGrpInd].conditions[condGrpInd].logics
      tmp = accessToNested(tmp, logicPath)
      tmp.push(...logicData)
    }))

    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  return (
    <div className={css(accordionStyle.container)}>
      <div className={css(accordionStyle.section)}>
        {lgcGrp.action_behaviour === 'cond' && (
          <div className={css(accordionStyle.sideBdr)}>
            <div className={css(accordionStyle.sideBdrLn)} />
            <div className={css(accordionStyle.sideBdrCrl)} />
          </div>
        )}
        {lgcGrp?.conditions?.map((condGrp, condGrpInd) => (
          <Fragment key={`wkf-${condGrpInd + 99}`}>
            {(lgcGrp.action_behaviour === 'cond' && condGrp.cond_type !== 'else') && (
              <WorkflowAccordion
                key={condGrp.cond_type + 0}
                title={generateAccrTtl(condGrp.cond_type)}
                accordionActions={condGrp.cond_type !== 'if' && <WorkflowAccordionActions lgcGrpInd={lgcGrpInd} condGrpInd={condGrpInd} />}
              >
                <WorkflowLogicSection
                  lgcGrp={lgcGrp}
                  lgcGrpInd={lgcGrpInd}
                  condGrp={condGrp}
                  condGrpInd={condGrpInd}
                />
                <div className="mt-1">
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
                        onClick={() => addLogic('and', condGrpInd)}
                      >
                        <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                        Add AND
                      </button>
                      <button
                        type="button"
                        className={css(accordionStyle.addItemBtn)}
                        onClick={() => addLogic('or', condGrpInd)}
                      >
                        <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                        Add OR
                      </button>
                      <button
                        type="button"
                        className={css(accordionStyle.addItemBtn)}
                        onClick={() => addLogic('and', condGrpInd, '', 1)}
                      >
                        <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                        Add AND Group
                      </button>
                      <button
                        type="button"
                        className={css(accordionStyle.addItemBtn)}
                        onClick={() => addLogic('or', condGrpInd, '', 1)}
                      >
                        <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                        Add OR Group
                      </button>
                    </div>
                  </Downmenu>
                </div>
              </WorkflowAccordion>
            )}
            {lgcGrp.action_behaviour === 'cond' && (
              <WorkflowAccordion
                key={condGrp.cond_type + 1}
                title={condGrp.cond_type === 'else' ? 'Else' : 'Then'}
                titleOutline={condGrp.cond_type !== 'else'}
                accordionActions={condGrp.cond_type === 'else'
                  && (
                    <WorkflowAccordionActions
                      lgcGrpInd={lgcGrpInd}
                      condGrpInd={condGrpInd}
                      add={false}
                      clone={false}
                    />
                  )}
              >
                <WorkflowActionSection
                  lgcGrp={lgcGrp}
                  lgcGrpInd={lgcGrpInd}
                  condGrp={condGrp}
                  condGrpInd={condGrpInd}
                />
              </WorkflowAccordion>
            )}
            {lgcGrp.action_behaviour !== 'cond' && (
              <WorkflowActionSection
                lgcGrp={lgcGrp}
                lgcGrpInd={lgcGrpInd}
                condGrp={condGrp}
                condGrpInd={condGrpInd}
              />
            )}
          </Fragment>
        ))}
      </div>
      {lgcGrp.action_behaviour === 'cond' && (
        <Downmenu
          place="bottom"
        >
          <Tip msg="Add Condition">
            <Button
              icn
              className="blue sh-sm ml-2"
            >
              <CloseIcn size="14" className="icn-rotate-45" />
            </Button>
          </Tip>
          <div>
            <button
              type="button"
              className={css(accordionStyle.addItemBtn)}
              onClick={() => addCondition('else-if')}
            >
              <CloseIcn size="9" className="icn-rotate-45 mr-1" />
              Add &quot;Else If&quot;
            </button>
            {lgcGrp.conditions[lgcGrp.conditions.length - 1].cond_type !== 'else' && (
              <button
                type="button"
                className={css(accordionStyle.addItemBtn)}
                onClick={() => addCondition('else')}
              >
                <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                Add &quot;Else&quot;
              </button>
            )}
          </div>
        </Downmenu>
      )}

    </div>
  )
}

const WorkflowAccordionActions = ({ lgcGrpInd, condGrpInd, add, clone, remove }) => {
  const [confMdl, setConfMdl] = useState({ show: false })
  const setWorkflows = useSetAtom($workflows)
  const setUpdateBtn = useSetAtom($updateBtn)

  const closeConfMdl = () => {
    setConfMdl({ show: false })
  }

  const deleteCondition = () => {
    setConfMdl({ show: false })
    setWorkflows(prvSt => create(prvSt, prv => {
      prv[lgcGrpInd].conditions.splice(condGrpInd, 1)
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const showDeleteConfMdl = () => {
    setConfMdl({
      btnTxt: 'Delete',
      body: 'Are you sure to delete this logic?',
      btnClass: '',
      action: () => {
        deleteCondition(condGrpInd)
        closeConfMdl()
      },
      show: true,
    })
  }

  const cloneCondition = () => {
    setWorkflows(prvSt => create(prvSt, prv => {
      prv[lgcGrpInd].conditions.splice(condGrpInd + 1, 0, deepCopy(prv[lgcGrpInd].conditions[condGrpInd]))
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addNewElseIf = () => {
    setWorkflows(prvSt => create(prvSt, prv => {
      prv[lgcGrpInd].conditions.splice(condGrpInd + 1, 0, {
        ...defaultConds,
        cond_type: 'else-if',
      })
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const checkIfNeeded = typ => (typeof typ === 'boolean' ? typ : true)

  return (
    <>
      <div>
        {checkIfNeeded(add) && (
          <Tip msg="Add Else If">
            <Button
              onClick={addNewElseIf}
              icn
              className="white ml-2 sh-sm"
            >
              <PlusIcn size="16" />
            </Button>
          </Tip>
        )}
        {checkIfNeeded(clone) && (
          <Tip msg="Clone">
            <Button
              onClick={cloneCondition}
              icn
              className="white ml-2 sh-sm"
            >
              <CopyIcn size="16" />
            </Button>
          </Tip>
        )}
        {checkIfNeeded(remove) && (
          <Tip msg="Delete">
            <Button
              onClick={showDeleteConfMdl}
              icn
              className="white ml-2 sh-sm"
            >
              <TrashIcn size="16" />
            </Button>
          </Tip>
        )}

      </div>
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />
    </>
  )
}

const accordionStyle = {
  container: { mt: 10 },
  section: {
    pn: 'relative',
    w: '100%',
    zx: 1,
    mb: 10,
    pb: 10,
  },
  sideBdr: {
    flx: 'center',
    fd: 'column',
    w: 50,
    pn: 'absolute',
    h: '100%',
    zx: -1,
  },
  sideBdrLn: {
    w: 2,
    bc: 'var(--b-50)',
    h: '100%',
  },
  sideBdrCrl: {
    brs: '50%',
    bc: 'var(--b-50)',
    h: 8,
    w: 8,
    mt: -1,
  },

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
