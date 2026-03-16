import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function advancedFileUp_1_bitformDefault({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),
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
        'margin-bottom': '0px',
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

      [`.${fk}-inp-wrp .file-wrpr`]: {
        'background-color': 'var(--bg-10)',
        'border-radius': 'var(--g-bdr-rad)',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        width: '100%',
        height: 'auto',
        'margin-top': '10px',
        padding: '5px',
        outline: '1px solid var(--bg-15)',
      },

      [`.${fk}-inp-wrp .file-details`]: {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        padding: '0px 10px',
        width: '94%',
      },

      [`.${fk}-inp-wrp .file-title`]: {
        display: 'inline-block',
        'font-size': '12px',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        color: 'var(--global-font-color)',
      },

      [`.${fk}-inp-wrp .cross-btn`]: {
        cursor: 'pointer',
        border: 'none',
        'border-radius': '50px',
        'box-shadow': 'none',
        color: 'hsla(var(--gfh), var(--gfs), var(--gfl), 0.8)',
        'font-size': '20px',
        height: '25px',
        'line-height': '1',
        'min-height': '25px',
        'min-width': '25px',
        padding: '0',
        'text-decoration': 'none',
        width: '25px',
        transition: 'background-color 150ms',
        'background-color': 'var(--bg-15)',
      },
    }
  }
  return {}
}
