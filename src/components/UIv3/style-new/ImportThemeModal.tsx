import { useSetAtom } from 'jotai'
import { useMemo, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { $proModal } from '../../../GlobalStates/GlobalStates'
import DocIcn from '../../../Icons/DocIcn'
import FileUploadIcn from '../../../Icons/FileUploadIcn'
import { IS_PRO } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import proHelperData from '../../../Utils/StaticData/proHelperData'
import Btn from '../../Utilities/Btn'
import Modal from '../../Utilities/Modal'
import TabsView from '../Utilities/TabsView'

interface ImportThemeModalProps {
  show: boolean
  existingForms?: Array<{ id: string; name: string }>
  onClose: () => void
  onImportFile: (file: File) => void
  onImportFromForm: (formId: string) => void
}

export default function ImportThemeModal({
  show,
  existingForms = [],
  onClose,
  onImportFile,
  onImportFromForm,
}: ImportThemeModalProps) {
  const { css } = useFela()
  const [importType, setImportType] = useState<'form' | 'file'>('form')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedForm, setSelectedForm] = useState('')
  const [error, setError] = useState('')
  const setProModal = useSetAtom($proModal)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.json')) {
        setError('Please select a valid JSON file')
        return
      }
      setError('')
      setSelectedFile(file)
    }
  }

  const handleImport = () => {

    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    setError('')

    if (importType === 'file') {
      if (!selectedFile) {
        setError('Please select a file to import')
        return
      }
      onImportFile(selectedFile)
    } else {
      if (!selectedForm) {
        setError('Please select a form to import from')
        return
      }
      onImportFromForm(selectedForm)
    }

    // Reset form
    setSelectedFile(null)
    setSelectedForm('')
    setImportType('form')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    setError('')
    setSelectedFile(null)
    setSelectedForm('')
    setImportType('form')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (!file.name.endsWith('.json')) {
        setError('Please select a valid JSON file')
        return
      }
      setError('')
      setSelectedFile(file)
    }
  }

  const formImportTabContent = (
    <div className={css(styles.section)}>
      <div className={css(styles.formGroup)}>
        <label className={css(styles.label)} htmlFor="form-select">
          Select Form
        </label>
        <select
          id="form-select"
          value={selectedForm}
          onChange={(e) => {
            setSelectedForm(e.target.value)
            setError('')
          }}
          className={css(styles.select)}
        >
          <option value="">-- Select a form --</option>
          {existingForms.map((form) => (
            <option key={form.id} value={form.id}>
              {form.name} (ID: {form.id})
            </option>
          ))}
        </select>
        <p className={css(styles.helpText)}>
          Import the theme styles from an existing form. This will create a new
          custom theme with the selected form's styling.
        </p>
      </div>

      {error && <span className={css(styles.error)}>{error}</span>}
    </div>
  )

  const fileImportTabContent = (
    <div className={css(styles.section)}>
      <div
        className={css(styles.dropzone, selectedFile && styles.dropzoneActive)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div className={css(styles.dropzoneContent)}>
          {selectedFile ? (
            <>
              <DocIcn size={48} />
              <p className={css(styles.fileName)}>{selectedFile.name}</p>
              <p className={css(styles.fileSize)}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <button
                className={css(styles.changeFileBtn)}
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                Change File
              </button>
            </>
          ) : (
            <>
              <FileUploadIcn size={48} />
              <p className={css(styles.dropzoneText)}>
                <strong>{__('Click to upload')}</strong> {__('or drag and drop')}
              </p>
              <p className={css(styles.dropzoneHint)}>
                Bit Form theme JSON file (.json)
              </p>
            </>
          )}
        </div>
      </div>

      {error && <span className={css(styles.error)}>{error}</span>}
    </div>
  )


  const tabs = useMemo(() => ([
    { id: 'form', label: __('Import from Form'), content: formImportTabContent },
    { id: 'file', label: __('Import from File'), content: fileImportTabContent },
  ]), [formImportTabContent, fileImportTabContent])

  return (
    <Modal
      show={show}
      onCloseMdl={handleClose}
      title={__("Import Theme (Style)")}
      isPro
    // width="550px"

    >
      <div className={css(styles.modalContent)}>
        {/* Import Type Tabs */}

        <TabsView
          tabs={tabs}
          defaultTab="form"
          variant="clean-bottom-line"
          // variant="rounded-bottom-tertiary"
          classNames={css({ mx: 10 })}
          onChange={(tabId) => {
            setImportType(tabId as 'form' | 'file')
            setError('')
          }}
        />

        {/* Actions */}
        <div className={css(styles.actions)}>
          <Btn variant="outline" onClick={handleClose}>
            Cancel
          </Btn>
          <Btn onClick={handleImport}>
            Import Theme
          </Btn>
        </div>
      </div>
    </Modal>
  )
}

const styles = {
  modalContent: {
    padding: '24px 0px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      color: '#374151',
    },
  },
  tabActive: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
  },
  section: {
    py: 20,
  },
  dropzone: {
    padding: '40px 20px',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: '#3b82f6',
      backgroundColor: '#f9fafb',
    },
  },
  dropzoneActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  dropzoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  dropzoneText: {
    fontSize: '14px',
    color: '#374151',
    margin: 0,
  },
  dropzoneHint: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
  },
  fileName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  },
  fileSize: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },
  changeFileBtn: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#3b82f6',
    backgroundColor: 'transparent',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
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
    marginTop: '12px',
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