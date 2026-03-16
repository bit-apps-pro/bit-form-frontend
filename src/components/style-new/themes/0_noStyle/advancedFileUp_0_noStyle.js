import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

/* eslint-disable camelcase */
export default function advancedFileUp_0_noStyle({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses_0_noStyle(fk),
      [`.filepond-${fk}-container.readonly`]: {
        opacity: '.7',
        cursor: 'not-allowed',
        'pointer-events': 'none',
      },
      [`.filepond-${fk}-container.disabled`]: {
        opacity: '.5',
        cursor: 'not-allowed',
        'pointer-events': 'none',
      },

      [`.${fk}-inp-fld-wrp`]: { position: 'relative', margin: 'var(--fld-m, 0)' },

      /* filepond-root */
      [`.${fk}-inp-wrp .filepond--root`]: {
        'min-height': '40px',
      },

      /* the text color of the drop label */
      [`.${fk}-inp-wrp .filepond--drop-label`]: {
        'min-height': '40px !important',
        color: 'var(--global-font-color)',
        cursor: 'pointer',
      },

      /* underline color for "Browse" button */
      [`.${fk}-inp-wrp .filepond--label-action`]: { 'text-decoration-color': 'var(--global-font-color)' },

      /* use a hand cursor intead of arrow for the action buttons */
      [`.${fk}-inp-wrp .filepond--file-action-button`]: {
        cursor: 'pointer',
        'background-color': 'var(--bg-5)',
        color: 'var(--global-font-color)',
      },

      /* the color of the focus ring */
      [`.${fk}-inp-wrp .filepond--file-action-button:hover`]: { 'box-shadow': '0 0 0 0.125em rgba(255, 255, 255, 0.9)' },
      [`.${fk}-inp-wrp .filepond--file-action-button:focus`]: { 'box-shadow': '0 0 0 0.125em rgba(255, 255, 255, 0.9)' },

      /* the background color of the filepond drop area */
      [`.${fk}-inp-wrp .filepond--panel-root`]: {
        'background-color': 'var(--bg-10)',
      },
      [`.${fk}-inp-wrp .filepond--panel`]: {
        // 'border-radius': '0.5em',
        outline: '1px solid var(--bg-0)',
      },
      /* the border radius of the file item */
      [`.${fk}-inp-wrp .filepond--item-panel`]: {
        // 'border-radius': '0.5em',
        'background-color': 'var(--bg-30)',
      },

      /* error state color */
      [`.${fk}-inp-wrp [data-filepond-item-state*='error'] .filepond--item-panel`]: { 'background-color': 'red' },
      [`.${fk}-inp-wrp [data-filepond-item-state*='invalid'] .filepond--item-panel`]: { 'background-color': 'red' },

      /* complete state color */
      [`.${fk}-inp-wrp [data-filepond-item-state='processing-complete'] .filepond--item-panel`]: {
        'background-color': '#34c45c',
      },

      /* the background color of the drop circle */
      [`.${fk}-inp-wrp .filepond--drip-blob`]: {
        'background-color': 'var(--bg-20)',
      },

      /* the text color of the file status and info labels */
      [`.${fk}-inp-wrp .filepond--file`]: { color: 'var(--global-font-color)' },

    }
  }
  return {}
}
