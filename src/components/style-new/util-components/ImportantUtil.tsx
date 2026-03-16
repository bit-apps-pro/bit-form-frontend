import { useState } from 'react'
import { useFela } from 'react-fela'
import StarIcn from '../../../Icons/StarIcn'
import Tip from '../../Utilities/Tip'


type importantProps = {
  value: string | object;
  className?: string;
  changeAction: (newValue: string | object) => void;
}

export default function ImportantUtil({ value, className, changeAction }: importantProps) {
  const [isImportant, setIsImportant] = useState<boolean>(() => {
    const cssValue = typeof value === 'string' ? value : Object.values(value)[0]
    if (cssValue?.match(/(!important)/gi)?.[0]) return true
    return false
  })

  const { css } = useFela()

  const importantClickHandler = () => {
    setIsImportant(prevState => !prevState)
    if (typeof value === 'string') {
      const newValue = isImportant ? value.replace(/(!important)/gi, '') : `${value} !important`
      changeAction(newValue)
      return
    }
    const newObject: { [key: string]: string } = {}
    Object.keys(value).forEach(key => {
      const newValue = isImportant ? value[key].replace(/(!important)/gi, '') : `${value[key]} !important`
      newObject[key] = newValue
    })
    changeAction(newObject)
  }


  return (
    <Tip msg="Set style as !important" className={""}>
      <button
        className={`${css(cls.btn, isImportant ? cls.active : {})} ${className}`}
        type="button"
        onClick={importantClickHandler}
      >
        <StarIcn size="12" />
      </button>
    </Tip>
  )
}

const cls = {
  btn: {
    se: 20,
    flx: 'center',
    p: 2,
    oe: 'none',
    brs: '50%',
    b: 'none',
    curp: 1,
    bd: 'none',
    cr: 'var(--white-0-0-29)',
    ':hover': { bd: 'var(--white-0-95)', cr: 'var(--white-0-29)' },
  },
  active: { cr: 'var(--b-50) !important' },
}
