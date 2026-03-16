/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import FileUploadIcn from '../../Icons/FileUploadIcn'
import { __ } from '../../Utils/i18nwrap'

function CustomFileUpload({
  accept, onChange, name, multiple = false, iconShow, title = __('Choose/Drop your file (.json)'), fileUploadStyle = { w: '100%', H: '50' },
}) {
  const { css } = useFela()

  const fileInpue = useRef(null)

  const [fileName, setFileName] = useState('')
  const [dragged, setDragged] = useState(false)
  const onFileInputChange = e => {
    onChange(e)

    if (e.target.files.length > 0) {
      e.target.files.length > 1
        ? setFileName(oleName => `${e.target.files.length} File Selected`)
        : setFileName(oleName => e.target.files[0].name)
    } else {
      setFileName(oleName => '')
    }
  }

  const dragEnderAction = () => {
    setDragged(true)
  }
  const dragLeaveAction = () => {
    setDragged(false)
  }
  const dragEndAction = () => {
    setDragged(false)
  }

  return (
    <div
      className={css(cls.container, fileUploadStyle, dragged && { bc: 'var(--b-36-96)' })}
      onDragEnter={dragEnderAction}
      onDrop={dragEndAction}
      onDragLeave={dragLeaveAction}
    >
      {iconShow && <FileUploadIcn w="30" />}
      <h4 className={css({ my: 5 })}>{title}</h4>
      {fileName && <span className={css({ fs: 12 })}>{fileName}</span>}
      <input
        type="file"
        ref={fileInpue}
        className={`${css(cls.inputFile)} fileUpload`}
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={onFileInputChange}
      />
    </div>
  )
}
export default CustomFileUpload

const cls = {
  container: {
    pn: 'relative',
    b: '1px dashed var(--white-0-78)',
    brs: 8,
    p: 10,
    flx: 'align-center',
    fd: 'column',
    cur: 'pointer',
  },
  inputFile: {
    dy: 'block',
    se: '100%',
    b: 'none',
    pn: 'absolute',
    tp: 0,
    lt: 0,
    oy: 0,
  },
}
