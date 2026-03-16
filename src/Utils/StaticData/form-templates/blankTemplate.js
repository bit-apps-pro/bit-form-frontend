// eslint-disable-next-line import/no-cycle
import { IS_PRO } from '../../Helpers'
import { __ } from '../../i18nwrap'

export default {
  name: 'Untitled Form',
  theme: 'bitformDefault',
  formInfo: {
    formName: 'Untitled Form',
  },
  fields: {
    'fld_key-1': {
      typ: 'button',
      btnSiz: 'md',
      btnTyp: 'submit',
      txt: 'Submit',
      icn: { pos: '', url: '' },
      valid: {},
      customClasses: {},
      customAttributes: {},
    },
  },
  layouts: {
    lg: [{ h: 58, i: 'fld_key-1', w: 60, x: 0, y: 0 }],
    md: [],
    sm: [],
  },
  additionalSettings: {
    enabled: {
      empty_submission: IS_PRO,
      private_ip: false,
      blocked_ip: false,
    },
    settings: {
      empty_submission: {
        message: __('Empty form cannot be submitted.'),
      },
      blocked_ip: [{ ip: '', status: false }],
      private_ip: [{ ip: '', status: false }],
    },
  },
}
