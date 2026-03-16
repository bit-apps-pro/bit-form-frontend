export default {
  name: 'Conference Room Registration Form',
  theme: 'bitformDefault',
  formInfo: {
    formName: 'Conference Room Registration Form',
  },
  fields: {
    'fld_key-1': {
      typ: 'button',
      btnSiz: 'md',
      btnTyp: 'submit',
      txt: 'Submit',
      icn: {
        pos: '',
        url: '',
      },
      valid: {},
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-1',
    },
    'fld_key-2': {
      typ: 'text',
      lbl: 'Firstname',
      phHide: false,
      valid: {},
      err: {},
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-2',
    },
    'fld_key-3': {
      typ: 'text',
      lbl: 'Lastname',
      phHide: false,
      valid: {},
      err: {},
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-3',
    },
    'fld_key-4': {
      typ: 'email',
      lbl: 'Email',
      phHide: false,
      pattern: '^[^$_bf_$s@]+@[^$_bf_$s@]+$_bf_$.[^$_bf_$s@]+$',
      valid: {
        req: true,
        reqShow: true,
        reqPos: 'after',
      },
      err: {
        invalid: {
          dflt: '<p style="margin:0">Please, Enter a valid email address.</p>',
          show: true,
        },
        req: {
          dflt: '<p style="margin:0">This field is required</p>',
          show: true,
          custom: true,
          msg: '<p style="margin:0">Please enter your email.</p>',
        },
      },
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-4',
    },
    'fld_key-5': {
      typ: 'radio',
      lbl: 'Which access pass would you like to purchase?',
      round: true,
      opt: [
        {
          lbl: 'Bronze-$100.00',
          check: true,
          val: '100',
        },
        {
          lbl: 'Sliver-$200.00',
          val: '200',
        },
        {
          lbl: 'Gold-$300',
          val: '300',
        },
        {
          lbl: 'Diamond-$400',
          val: '400',
        },
      ],
      valid: {
        req: true,
        reqShow: true,
        reqPos: 'after',
      },
      err: {
        req: {
          dflt: '<p style="margin:0">This field is required</p>',
          show: true,
          msg: '<p style="margin:0">This field is required</p>',
        },
      },
      optionCol: 1,
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-5',
    },
    'fld_key-6': {
      typ: 'check',
      lbl: 'Which sessions do you plan on attending?',
      opt: [
        {
          lbl: 'Session 1',
        },
        {
          lbl: 'Session 2',
        },
        {
          lbl: 'Session 3',
        },
        {
          lbl: 'Session 4',
        },
        {
          lbl: 'Session 5',
        },
      ],
      valid: {},
      err: {},
      optionCol: 1,
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-6',
    },
    'fld_key-7': {
      typ: 'radio',
      lbl: 'Will you be staying overnight?',
      round: true,
      opt: [
        {
          lbl: 'Yes',
        },
        {
          lbl: 'No',
        },
      ],
      valid: {},
      err: {},
      optionCol: 1,
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-7',
    },
    'fld_key-8': {
      typ: 'decision-box',
      adminLbl: 'Decision Box',
      adminLblHide: true,
      lbl: "<p style=\"margin: 0;\"><span style=\"color: rgba(0, 0, 0, 0.85); font-family: GeneralSans-Variable, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px;\">I would like to receive email updates regarding future conferences</span></p>",
      msg: {
        checked: 'Accepted',
        unchecked: 'Rejected',
      },
      valid: {
        req: true,
      },
      err: {
        req: {
          dflt: '<p style="margin:0">This field is required</p>',
          show: true,
        },
      },
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-8',
    },
    'fld_key-9': {
      typ: 'textarea',
      lbl: 'Comments or Questions',
      phHide: false,
      valid: {},
      err: {},
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-9',
    },
  },
  layouts: {
    lg: [
      {
        w: 30,
        h: 77,
        x: 0,
        y: 0,
        i: 'fld_key-2',
        moved: false,
        static: false,
      },
      {
        w: 30,
        h: 77,
        x: 30,
        y: 0,
        i: 'fld_key-3',
        moved: false,
        static: false,
      },
      {
        w: 60,
        h: 77,
        x: 0,
        y: 77,
        i: 'fld_key-4',
      },
      {
        w: 60,
        h: 164,
        x: 0,
        y: 154,
        i: 'fld_key-5',
      },
      {
        w: 60,
        h: 197,
        x: 0,
        y: 318,
        i: 'fld_key-6',
      },
      {
        w: 60,
        h: 98,
        x: 0,
        y: 515,
        i: 'fld_key-7',
      },
      {
        w: 60,
        h: 153,
        x: 0,
        y: 651,
        i: 'fld_key-9',
        minW: 9,
        resizeHandles: [
          'se',
          'e',
        ],
      },
      {
        w: 60,
        h: 38,
        x: 0,
        y: 613,
        i: 'fld_key-8',
      },

      {
        w: 60,
        h: 54,
        x: 0,
        y: 804,
        i: 'fld_key-1',
      },
    ],
    md: [],
    sm: [],
  },

}
