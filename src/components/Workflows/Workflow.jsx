/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { $bits } from '../../GlobalStates/GlobalStates'
import tutorialLinks from '../../Utils/StaticData/tutorialLinks'
import { __ } from '../../Utils/i18nwrap'
import ConfirmModal from '../Utilities/ConfirmModal'

import AdvancedConditionalLogic from '../UIv3/CompSettings/Workflows/AdvancedConditionalLogic'
import ProOverlay from '../Utilities/ProOverlay'

function Workflow() {
  const [confMdl, setconfMdl] = useState({ show: false })
  const bits = useAtomValue($bits)
  const { isPro } = bits

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  return (
    <div className="btcd-workflow pos-rel" style={{ width: '93%' }}>
      {!isPro && (<ProOverlay proProperty="advancedConditionalLogic" />)}
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />
      <h2>{__('Conditional Logics')}</h2>
      <h5>
        How to configure conditional logics:
        &nbsp;
        <a href={tutorialLinks.conditionalLogic.link} target="_blank" rel="noreferrer" className="yt-txt ml-1 mr-1">
          YouTube
        </a>
        <a href={tutorialLinks.conditionalLogicDoc.link} target="_blank" rel="noreferrer" className="doc-txt">
          Documentation
        </a>
      </h5>

      {/* Advanced conditional logic builder (Pro only). */}
      {isPro && <AdvancedConditionalLogic />}
    </div>
  )
}

export default Workflow
