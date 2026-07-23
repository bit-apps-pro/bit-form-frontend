import { useState } from 'react'
import type { ComponentType } from 'react'
import { useFela } from 'react-fela'
import BoxFullIconRaw from '../../../Icons/BoxFullIcon'
import BoxIconRaw from '../../../Icons/BoxIcon'
import CloseIcnRaw from '../../../Icons/CloseIcn'
import ut from '../../../styles/2.utilities'
import { __ } from '../../../Utils/i18nwrap'
import GrowRaw from '../../CompSettings/StyleCustomize/ChildComp/Grow'
import SizeControlRaw from '../../CompSettings/StyleCustomize/ChildComp/SizeControl'
import { getNumFromStr, getStrFromStr, unitConverter } from '../../style-new/styleHelpers'
import StyleSegmentControlRaw from '../../Utilities/StyleSegmentControl'
import type { BoxShadow, ConfirmationStyles } from '../Types/confirmMessage.types'
import ui from './Message.styles'
import { UNIT_OPTIONS } from './messageStaticData'

// untyped JS components — loosen props until they are migrated to TS
const BoxFullIcon = BoxFullIconRaw as ComponentType<any>
const BoxIcon = BoxIconRaw as ComponentType<any>
const CloseIcn = CloseIcnRaw as ComponentType<any>
const Grow = GrowRaw as ComponentType<any>
const SizeControl = SizeControlRaw as ComponentType<any>
const StyleSegmentControl = StyleSegmentControlRaw as ComponentType<any>

type StyleChangeHandler = (name: string, value: string) => void

interface StylePanelProps {
  styles?: ConfirmationStyles
  onStyleChange: StyleChangeHandler
}

interface ColorFieldProps {
  name: string
  value?: string
  onChange: StyleChangeHandler
  textWidth?: number
  colorInputStyle?: Record<string, any>
}

/** paired color-picker + hex/text input bound to the same style property */
function ColorField({ name, value, onChange, textWidth = 165, colorInputStyle }: ColorFieldProps) {
  const { css } = useFela()
  return (
    <>
      <input
        type="color"
        name={name}
        className={css(colorInputStyle || {}, ui.input, ui.colorInput)}
        value={value || ''}
        onChange={e => onChange(name, e.target.value)}
      />
      <input
        type="text"
        name={name}
        className={css({ w: textWidth }, ui.input)}
        value={value || ''}
        onChange={e => onChange(name, e.target.value)}
      />
    </>
  )
}

type ColorStateType = 'default' | 'hover'

export function BackgroundPanel({ styles, onStyleChange }: StylePanelProps) {
  const { css } = useFela()
  const [closeColorType, setCloseColorType] = useState<ColorStateType>('default')
  const [closeIconColorType, setCloseIconColorType] = useState<ColorStateType>('default')

  const closeBgName = closeColorType === 'default' ? 'closeBackground' : 'closeHover'
  const closeIconName = closeIconColorType === 'default' ? 'closeIconColor' : 'closeIconHover'

  return (
    <div className={css({ dy: 'flex', fd: 'column', p: '0px 20px', rg: 5 })}>
      <div className={css({ flx: 'align-center', cg: 5 })}>
        <span className={css(ui.label, ui.backgrounLabel)}>{__('Message Background Color')}</span>
        <ColorField
          name="background"
          value={styles?.background}
          onChange={onStyleChange}
          colorInputStyle={{ ml: 88 }}
        />
      </div>
      <div className={css({ flx: 'align-center', cg: 5 })}>
        <span className={css(ui.label, ui.backgrounLabel)}>{__('Message Text Color')}</span>
        <ColorField
          name="color"
          value={styles?.color}
          onChange={onStyleChange}
          colorInputStyle={{ ml: 88 }}
        />
      </div>
      <div className={css({ flx: 'align-center', cg: 5 })}>
        <span className={css(ui.label, ui.backgrounLabel)}>{__('Close Button Background Color')}</span>
        <select
          name="closeColorType"
          className={css({ w: 80 }, ui.selectInput)}
          value={closeColorType}
          onChange={e => setCloseColorType(e.target.value as ColorStateType)}
        >
          <option value="default">{__('Default')}</option>
          <option value="hover">{__('Hover')}</option>
        </select>
        <ColorField
          name={closeBgName}
          value={styles?.[closeBgName]}
          onChange={onStyleChange}
        />
      </div>
      <div className={css({ flx: 'align-center', cg: 5 })}>
        <span className={css(ui.label, ui.backgrounLabel)}>{__('Close Icon Color')}</span>
        <select
          name="closeIconColorType"
          className={css({ w: 80 }, ui.selectInput)}
          value={closeIconColorType}
          onChange={e => setCloseIconColorType(e.target.value as ColorStateType)}
        >
          <option value="default">{__('Default')}</option>
          <option value="hover">{__('Hover')}</option>
        </select>
        <ColorField
          name={closeIconName}
          value={styles?.[closeIconName]}
          onChange={onStyleChange}
        />
      </div>
    </div>
  )
}

const BORDER_TYPES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']

export function BorderPanel({ styles, onStyleChange }: StylePanelProps) {
  const { css } = useFela()
  return (
    <div className={css({ dy: 'flex', fd: 'column', p: '0px 20px' })}>
      <div className={css({ flx: 'align-center' })}>
        <span className={css(ui.valueLabel, { ml: 102 })}>{__('Color')}</span>
        <span className={css(ui.valueLabel, { ml: 124 })}>{__('Thickness')}</span>
        <span className={css(ui.valueLabel, { ml: 30 })}>{__('Type')}</span>
      </div>
      <div className={css({ flx: 'align-center', mb: 5, cg: 5 })}>
        <span className={css({ w: 55 }, ui.label)}>{__('Border')}</span>
        <ColorField
          name="borderColor"
          value={styles?.borderColor}
          onChange={onStyleChange}
          textWidth={150}
        />
        <input
          type="text"
          name="borderWidth"
          className={css({ w: 80 }, ui.input)}
          value={styles?.borderWidth || ''}
          onChange={e => onStyleChange('borderWidth', e.target.value)}
        />
        <select
          name="borderType"
          className={css({ w: 80 }, ui.selectInput)}
          value={styles?.borderType}
          onChange={e => onStyleChange('borderType', e.target.value)}
        >
          {BORDER_TYPES.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className={css({ flx: 'align-center', cg: 5 })}>
        <span className={css({ w: 55 }, ui.label)}>{__('Radius')}</span>
        <input
          type="text"
          name="borderRadius"
          className={css({ w: 80 }, ui.input)}
          value={styles?.borderRadius || ''}
          onChange={e => onStyleChange('borderRadius', e.target.value)}
        />
      </div>
    </div>
  )
}

interface ShadowPanelProps {
  shadows?: BoxShadow[]
  onShadowChange: (index: number, name: string, value: string) => void
  onShadowAdd: () => void
  onShadowDelete: (index: number) => void
}

const SHADOW_TEXT_FIELDS: Array<keyof BoxShadow> = ['x', 'y', 'blur', 'spread']

export function ShadowPanel({ shadows, onShadowChange, onShadowAdd, onShadowDelete }: ShadowPanelProps) {
  const { css } = useFela()
  return (
    <div className={css({ dy: 'flex', fd: 'column', p: '0px 20px' })}>
      <div className={css({ flx: 'align-center', cg: 5 })}>
        <span className={css(ui.valueLabel, { ml: 48 })}>{__('Color')}</span>
        <span className={css(ui.valueLabel, { ml: 92 })}>X</span>
        <span className={css(ui.valueLabel, { ml: 45 })}>Y</span>
        <span className={css(ui.valueLabel, { ml: 42 })}>{__('Blur')}</span>
        <span className={css(ui.valueLabel, { ml: 25 })}>{__('Spread')}</span>
        <span className={css(ui.valueLabel, { ml: 12 })}>{__('Inset')}</span>
      </div>
      <div className={css({ flx: 'space-between' })}>
        <div className={css({ h: 110, ow: 'auto', px: 5, pt: 2, w: '100%' })}>
          {shadows?.map((shadow, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`shadow-${index}`} className={css({ flx: 'align-center', mb: 5, cg: 5 })}>
              <ColorField
                name="color"
                value={shadow.color}
                onChange={(name, value) => onShadowChange(index, name, value)}
                textWidth={120}
              />
              {SHADOW_TEXT_FIELDS.map(field => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  className={css({ w: 50 }, ui.input)}
                  value={shadow[field]}
                  onChange={e => onShadowChange(index, field, e.target.value)}
                />
              ))}
              <select
                name="inset"
                className={css({ w: 72 }, ui.selectInput)}
                value={shadow.inset}
                onChange={e => onShadowChange(index, 'inset', e.target.value)}
              >
                <option value="">{__('Outset')}</option>
                <option value="inset">{__('Inset')}</option>
              </select>
              <span
                role="button"
                tabIndex={0}
                aria-label={__('Delete shadow')}
                onKeyDown={() => onShadowDelete(index)}
                onClick={() => onShadowDelete(index)}
              >
                <CloseIcn size="12" className={css({ curp: 1 })} />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={css({ flx: 'center', pt: 5 })}>
        <span
          className={css({ curp: 1 })}
          role="button"
          tabIndex={0}
          aria-label={__('Add shadow')}
          onKeyDown={onShadowAdd}
          onClick={onShadowAdd}
        >
          <CloseIcn size="12" className={css({ curp: 1, tm: 'rotate(45deg)' })} />
        </span>
      </div>
    </div>
  )
}

export function WidthPanel({ styles, onStyleChange }: StylePanelProps) {
  const { css } = useFela()
  return (
    <div className={css({ dy: 'flex', fd: 'column', p: '0px 20px' })}>
      <div className={css({ flx: 'align-center', cg: 5 })}>
        <span className={css(ui.label, { w: 55 })}>{__('Width')}</span>
        <input
          type="text"
          name="width"
          className={css({ w: '100px' }, ui.input)}
          value={styles?.width || ''}
          onChange={e => onStyleChange('width', e.target.value)}
        />
      </div>
    </div>
  )
}

interface PaddingPanelProps {
  padding?: string
  onPaddingChange: (padding: string) => void
}

type PaddingController = 'All' | 'Individual'

const SEGMENT_OPTIONS = [
  { label: 'All', icn: <BoxFullIcon stroke={1.7} size={14} />, show: ['icn'], tip: 'All Side' },
  { label: 'Individual', icn: <BoxIcon stroke={1.7} size={15} />, show: ['icn'], tip: 'Individual Side' },
]

const PADDING_SIDES = [
  { id: '0', variant: 'top' },
  { id: '1', variant: 'right' },
  { id: '2', variant: 'bottom' },
  { id: '3', variant: 'left' },
]

export function PaddingPanel({ padding, onPaddingChange }: PaddingPanelProps) {
  const { css } = useFela()
  const [controller, setController] = useState<PaddingController>('All')
  const values = (padding || '').trim().split(' ')

  const handleValues = ({ value, unit, id }: { value: string | number; unit: string; id: string | number }) => {
    const index = Number(id)
    const next = [...values]
    const preUnit = getStrFromStr(next[index] || 'px')
    const converted = unitConverter(unit, value, preUnit)
    next[index] = converted + unit

    const paddingStr = controller === 'All'
      ? `${next[0]}`
      : `${next[0] || '0px'} ${next[1] || '0px'} ${next[2] || '0px'} ${next[3] || '0px'}`
    onPaddingChange(paddingStr)
  }

  const sizeControlCommonProps = (id: string) => ({
    min: '0',
    id,
    inputHandler: handleValues,
    sizeHandler: ({ unitKey, unitValue, id: indexId }: { unitKey: string; unitValue: string | number; id: string }) => handleValues({ value: unitValue, unit: unitKey, id: indexId }),
    value: getNumFromStr(values[Number(id)]) || 0,
    unit: getStrFromStr(values[Number(id)]) || 'px',
    options: UNIT_OPTIONS,
  })

  return (
    <div className={css(ui.segmentWrapper)}>
      <div className={css(ui.titlecontainer)}>
        <span className={css(ui.title)}>{__('Padding')}</span>
        <StyleSegmentControl
          defaultActive="All"
          options={SEGMENT_OPTIONS}
          onChange={(lbl: PaddingController) => setController(lbl)}
          show={['icn']}
          noShadow
        />
      </div>
      <div className={css(ui.segmentcontainer)}>
        <Grow open={controller === 'All'}>
          <div className={css({ p: 2 })}>
            <SizeControl
              {...sizeControlCommonProps('0')}
              label={<BoxFullIcon size={14} />}
              width="110px"
            />
          </div>
        </Grow>
        <Grow open={controller === 'Individual'}>
          <div className={css(ut.flxc, { flxp: 'wrap', jc: 'end', p: 2 })}>
            {PADDING_SIDES.map(side => (
              <SizeControl
                key={side.variant}
                {...sizeControlCommonProps(side.id)}
                label={<BoxIcon size={14} variant={side.variant} />}
                width="100px"
                className={css(ut.mr1, ut.mb1)}
              />
            ))}
          </div>
        </Grow>
      </div>
    </div>
  )
}
