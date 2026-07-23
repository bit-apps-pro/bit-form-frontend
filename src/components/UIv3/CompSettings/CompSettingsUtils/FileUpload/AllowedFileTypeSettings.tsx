import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import DropDown from '../../../../Utilities/DropDown'

export default function AllowedFileTypeSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])

  const { css } = useFela()
  const { allowedFileType } = fieldData.config
  const existType = allowedFileType ? allowedFileType.split(',._RF_,') : []

  const options = [
    { label: 'Images', value: '.xbm,.tif,.pjp,.pjpeg,.svgz,.jpg,.jpeg,.ico,.tiff,.gif,.svg,.bmp,.png,.jfif,.webp,.tif' },
    { label: 'Audios', value: '.opus,.flac,.webm,.weba,.wav,.ogg,.m4a,.mp3,.oga,.mid,.amr,.aiff,.wma,.au,.acc,.wpl' },
    { label: 'Videos', value: '.ogm,.wmv,.mpg,.webm,.ogv,.mov,.asx,.mpeg,.mp4,.m4v,.avi,.3g2,.3gp,.flv,.mkv,.swf' },
    { label: 'Documents', value: '.doc,.docx,.odt,.pdf,.rtf,.tex,.txt,.wks,.wps,.wpd' },
    { label: 'Zip', value: '.7z,.arj,.deb,.pkg,.rar,.rpm,.gz,.z,.zip' },
    { label: 'Presentation', value: '.key,.odp,.pps,.ppt,.pptx' },
    { label: 'Spreadsheet', value: '.ods,.xlr,.xls,.xlsx' },
    { label: 'Databases', value: '.csv,.dat,.db,.dbf,.log,.mdb,.sav,.sql,.tar,.sql,.sqlite,.xml' },
  ]

  const setAllowedFileType = (value: { label: string, value: string }[]) => {
    const val = value.map(itm => itm.value)
    if (val.join(',') === '') {
      fieldData.config.allowedFileType = ''
    } else {
      fieldData.config.allowedFileType = val.join(',._RF_,')
    }
    const allFields = create(prevFields => ({ ...prevFields, [fldKey]: fieldData }))
    setFields(allFields)
    addToBuilderHistory({ event: `Changed Allowed File Type: ${fieldData.lbl || fldKey}`, type: 'allow_file_type', state: { fldKey, fields: allFields } })
  }

  const style = {
    msl: {
      '&.msl-vars': {
        '--font-size': '13px',
      },
      '& .msl-options .msl-option:hover': {
        bd: 'var(--b-79-96)',
      },
      '& .msl-options .msl-option:focus': {
        bd: 'var(--b-79-96)',
      },
      '& .msl': {
        bd: 'var(--b-79-96) !important',
      },
    },
  }

  return (
    <div className={css(FieldStyle.fieldSection)}>
      <DropDown
        className={`w-10 ${css(style.msl)}`}
        titleClassName="title"
        title={__('Allowed File Type:')}
        isMultiple
        addable
        options={options}
        placeholder={__('Select File Type')}
        jsonValue
        action={setAllowedFileType}
        value={existType}
      />
    </div>
  )
}