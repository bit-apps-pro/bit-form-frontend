import { useState } from 'react'
import { useFela } from 'react-fela'
import FormTemplates from '../components/Template/FormTemplates'
import SnackMsg from '../components/Utilities/SnackMsg'
import { __ } from '../Utils/i18nwrap'

export default function FormTemplatePage() {
  const [snack, setSnackbar] = useState({ show: false })
  const [modal, setModal] = useState(false)
  const { css } = useFela()
  return (
    <div className={css(tempPageStyle.main)}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <h2 className={css(tempPageStyle.h2)}>{__('Create a New Form')}</h2>
      <FormTemplates
        setTempModal={setModal}
        setSnackbar={setSnackbar}
      />
    </div>
  )
}

const tempPageStyle = {
  main: {
    p: 10,
  },
  h2: {
    py: 10,
    my: 0,
    bb: '1px solid var(--white-0-90)',
  },
}
