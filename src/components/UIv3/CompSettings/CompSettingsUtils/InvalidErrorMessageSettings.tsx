/* eslint-disable no-param-reassign */
import { useFela } from 'react-fela'
import FieldStyle from '../../../../styles/FieldStyle.style'

import ErrorMessageSettings from '../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function InvalidErrorMessageSettings({ hideIcons = false, propsFldKey }) {
  const { css } = useFela()

  return (
    <SimpleAccordion
      id="invld-err-msg-stng"
      title="Invalid Error Message:"
      className={css(FieldStyle.fieldSection)}
    >
      <ErrorMessageSettings
        id="invalid-err-msg"
        type="invalid"
        title="Invalid Error Message"
        tipTitle="By enabling this feature, user will see the error message when input value is Invalid"
        allowIcons={!hideIcons}
        propsFldKey={propsFldKey}
      />
    </SimpleAccordion>
  )
}
