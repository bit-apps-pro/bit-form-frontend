import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $fieldsArr, $frontendTable, $updateTblBtn } from '../../GlobalStates/GlobalStates'
import CalculatorField from '../../components/Utilities/CalculationField/CalculatorField'
import FieldStyle from '../../styles/FieldStyle.style'

export default function TableAndFieldMap({ clmItem, index }) {
  const { css } = useFela()
  // thead: 'header name', fk: '', w: '10%'
  const { thead, fk, w } = clmItem
  const [frontendTable, setFrontendTable] = useAtom($frontendTable)
  const formFields = useAtomValue($fieldsArr)
  const clmLan = frontendTable.table_config.columnsMap.length
  const setUpdateTblBtn = useSetAtom($updateTblBtn)

  const buttonHandler = (type) => {
    const prvClm = [...frontendTable.table_config.columnsMap]
    if (type === 'add') {
      prvClm.splice(index + 1, 0, {
        thead: 'header name',
        fk: '',
        w: '10%',
      })
    }
    if (type === 'remove') {
      prvClm.splice(index, 1)
    }

    const newConf = create(frontendTable, drft => {
      drft.table_config.columnsMap = [...prvClm]
    })
    setFrontendTable({ ...newConf })
    setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const inputHandler = (name, value) => {
    setFrontendTable(prvConf => create(prvConf, drft => {
      drft.table_config.columnsMap[index][name] = value
    }))
    setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))
  }
  return (
    <div className={css(MapStyle.fldMapRow)}>
      <div className={css({ flx: 'center-between', gp: 5 })}>
        <input
          className={css(FieldStyle.input)}
          type="text"
          aria-label="Table head title"
          placeholder="Table head title"
          value={thead}
          name="thead"
          onChange={(e) => inputHandler(e.target.name, e.target.value)}
        />
        <input
          className={css(FieldStyle.input)}
          type="text"
          aria-label="Table head title"
          placeholder="Table head title"
          value={w}
          name="w"
          onChange={(e) => inputHandler(e.target.name, e.target.value)}
        />
        {/* <select
          className={css(FieldStyle.input)}
          value={fk}
          name="fk"
          onChange={(e) => inputHandler(e.target)}
        >
          <option>Name</option>
          <option>Select One</option>
          <option>Select One</option>
        </select> */}
        <CalculatorField
          // key={`${index * 4}`}
          value={fk}
          onChange={(val) => inputHandler('fk', val)}
          formFields={formFields}
        />
      </div>
      <div className={css({ flx: 'center-between', gp: 5 })}>
        <button
          type="button"
          className={css(MapStyle.btn)}
          onClick={() => buttonHandler('add')}
        >
          +
        </button>

        <button
          type="button"
          className={css(MapStyle.btn)}
          onClick={() => buttonHandler('remove')}
          style={{ visibility: clmLan > 1 ? 'visible' : 'hidden' }}
        >
          -
        </button>
      </div>
    </div>
  )
}

const MapStyle = {

  fldMapRow: {
    flx: 'center-between',
    gp: 10,
  },
  btn: {
    b: '1px solid rgb(230, 230, 230) !important',
    cur: 'pointer',
    brs: '50%',
    '&:hover': {
      bd: 'var(--b-79-96)',
    },
  },
}
