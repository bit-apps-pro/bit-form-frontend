export default function advancedFileUpDefaultStyles(formId) {
  return {
    [`.filepond-bc${formId}-container.readonly`]: {
      opacity: '.7',
      cursor: 'not-allowed',
      'pointer-events': 'none',
    },
    [`.filepond-bc${formId}-container.disabled`]: {
      opacity: '.5',
      cursor: 'not-allowed',
      'pointer-events': 'none',
    },

    [`.bc${formId}-inp-fld-wrp`]: { position: 'relative', margin: 'var(--fld-m, 0)' },

    /* filepond-root */
    [`.bc${formId}-inp-wrp .filepond--root`]: {
      'min-height': '40px',
      'margin-bottom': '0px',
    },

    /* the text color of the drop label */
    [`.bc${formId}-inp-wrp .filepond--drop-label`]: {
      'min-height': '40px !important',
      color: `var(--bc${formId}-fld-clr)`,
      cursor: 'pointer',
    },

    /* underline color for "Browse" button */
    [`.bc${formId}-inp-wrp .filepond--label-action`]: { 'text-decoration-color': 'var(--global-font-color)' },

    /* use a hand cursor intead of arrow for the action buttons */
    [`.bc${formId}-inp-wrp .filepond--file-action-button`]: {
      cursor: 'pointer',
      'background-color': 'var(--bg-5)',
      color: `var(--bc${formId}-fld-clr)`,
    },

    /* the color of the focus ring */
    [`.bc${formId}-inp-wrp .filepond--file-action-button:hover`]: { 'box-shadow': '0 0 0 0.125em rgba(255, 255, 255, 0.9)' },
    [`.bc${formId}-inp-wrp .filepond--file-action-button:focus`]: { 'box-shadow': '0 0 0 0.125em rgba(255, 255, 255, 0.9)' },

    /* the background color of the filepond drop area */
    [`.bc${formId}-inp-wrp .filepond--panel-root`]: {
      'background-color': 'var(--bg-10)',
    },
    [`.bc${formId}-inp-wrp .filepond--panel`]: {
      // 'border-radius': '0.5em',
      outline: '1px solid var(--bg-0)',
    },
    /* the border radius of the file item */
    [`.bc${formId}-inp-wrp .filepond--item-panel`]: {
      // 'border-radius': '0.5em',
      'background-color': 'var(--bg-30)',
    },

    /* error state color */
    [`.bc${formId}-inp-wrp [data-filepond-item-state*='error'] .filepond--item-panel`]: { 'background-color': 'red' },
    [`.bc${formId}-inp-wrp [data-filepond-item-state*='invalid'] .filepond--item-panel`]: { 'background-color': 'red' },

    /* complete state color */
    [`.bc${formId}-inp-wrp [data-filepond-item-state='processing-complete'] .filepond--item-panel`]: {
      'background-color': '#34c45c',
    },

    /* the background color of the drop circle */
    [`.bc${formId}-inp-wrp .filepond--drip-blob`]: {
      'background-color': 'var(--bg-20)',
    },

    /* the text color of the file status and info labels */
    [`.bc${formId}-inp-wrp .filepond--file`]: { color: `var(--bc${formId}-fld-clr)` },

    [`.bc${formId}-inp-wrp .file-wrpr`]: {
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

    [`.bc${formId}-inp-wrp .file-details`]: {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
      padding: '0px 10px',
      width: '94%',
    },

    [`.bc${formId}-inp-wrp .file-title`]: {
      display: 'inline-block',
      'font-size': '12px',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
      color: `var(--bc${formId}-fld-clr)`,
    },

    [`.bc${formId}-inp-wrp .cross-btn`]: {
      cursor: 'pointer',
      border: 'none',
      'border-radius': '50px',
      'box-shadow': 'none',
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-h), 0.8)`,
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
