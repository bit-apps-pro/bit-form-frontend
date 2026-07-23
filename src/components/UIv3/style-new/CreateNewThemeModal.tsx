import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { $proModal } from '../../../GlobalStates/GlobalStates'
import { IS_PRO } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import proHelperData from '../../../Utils/StaticData/proHelperData'
import Btn from '../../Utilities/Btn'
import Modal from '../../Utilities/Modal'
import { Theme } from '../Types/ThemeGallery.types'

interface CreateNewThemeModalProps {
  show: boolean
  appThemes: Theme[]
  onClose: () => void
  onCreate: (themeName: string, baseTheme: string) => void
}

export default function CreateNewThemeModal({
  show,
  appThemes,
  onClose,
  onCreate,
}: CreateNewThemeModalProps) {
  const { css } = useFela()
  const [themeName, setThemeName] = useState('')
  const [baseTheme, setBaseTheme] = useState('bitformDefault')
  const [error, setError] = useState('')
  const setProModal = useSetAtom($proModal)

  const handleCreate = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    setError('')

    if (!themeName.trim()) {
      setError('Please enter a theme name')
      return
    }

    if (themeName.trim().length < 3) {
      setError('Theme name must be at least 3 characters')
      return
    }

    onCreate(themeName.trim(), baseTheme)

    // Reset form
    setThemeName('')
    setBaseTheme('bitformDefault')
  }

  const handleClose = () => {
    setError('')
    setThemeName('')
    setBaseTheme('bitformDefault')
    onClose()
  }

  return (
    <Modal
      show={show}
      onCloseMdl={handleClose}
      title={__("Create New Theme")}
      sm
      isPro
    // width="500px"
    >
      <div className={css(styles.modalContent)}>
        <div className={css(styles.formGroup)}>
          <label className={css(styles.label)} htmlFor="theme-name">
            Theme Name <span className={css(styles.required)}>*</span>
          </label>
          <input
            id="theme-name"
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="e.g., My Custom Theme"
            className={css(styles.input)}
            autoFocus
          />
          {error && <span className={css(styles.error)}>{error}</span>}
        </div>

        <div className={css(styles.formGroup)}>
          <label className={css(styles.label)} htmlFor="base-theme">
            Base Theme <span className={css(styles.required)}>*</span>
          </label>
          <select
            id="base-theme"
            value={baseTheme}
            onChange={(e) => setBaseTheme(e.target.value)}
            className={css(styles.select)}
          >
            {appThemes.map((theme) => (
              <option key={theme.slug} value={theme.slug}>
                {theme.name}
              </option>
            ))}
          </select>
          <p className={css(styles.helpText)}>
            Your new theme will start with the styles from the selected base theme.
            You can customize it after creation.
          </p>
        </div>

        <div className={css(styles.actions)}>
          <Btn variant="outline" onClick={handleClose}>
            Cancel
          </Btn>
          <Btn onClick={handleCreate}>
            Create Theme
          </Btn>
        </div>
      </div>
    </Modal>
  )
}

const styles = {
  modalContent: {
    padding: '24px 10px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#1f2937',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#1f2937',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
  helpText: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '6px',
    lineHeight: '1.5',
  },
  error: {
    display: 'block',
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '6px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
  },
}