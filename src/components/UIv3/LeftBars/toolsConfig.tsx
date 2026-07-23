// toolsConfig.tsx
import AddressIcn from '../../../Icons/AddressIcn'
import AdvanceFileUpIcn from '../../../Icons/AdvanceFileUpIcn'
import BtnIcn from '../../../Icons/BtnIcn'
import CheckBoxIcn from '../../../Icons/CheckBoxIcn'
import ChevronDownIcn from '../../../Icons/ChevronDownIcn'
import CloudflareIcn from '../../../Icons/CloudflareIcn'
import CodeSnippetIcn from '../../../Icons/CodeSnippetIcn'
import ColorPickerIcn from '../../../Icons/ColorPickerIcn'
import CurrencyIcn from '../../../Icons/CurrencyIcn'
import DateIcn from '../../../Icons/DateIcn'
import DateTimeIcn from '../../../Icons/DateTimeIcn'
import DecisionBoxIcn from '../../../Icons/DecisionBoxIcn'
import DividerIcn from '../../../Icons/DividerIcn'
import DropDownIcn from '../../../Icons/DropDownIcn'
import EmailOTPIcn from '../../../Icons/EmailOTPIcn'
import EyeOffIcon from '../../../Icons/EyeOffIcon'
import FileUploadIcn from '../../../Icons/FileUploadIcn'
import FlagIcn from '../../../Icons/FlagIcn'
import GDPRIcn from '../../../Icons/GDPRIcn'
import HCaptchaIcn from '../../../Icons/HCaptchaIcn'
import ImageSelectIcn from '../../../Icons/ImageSelectIcn'
import ImgFldIcn from '../../../Icons/ImgFldIcn'
import MailIcn from '../../../Icons/MailIcn'
import MollieIcn from '../../../Icons/MollieIcn'
import MonthIcn from '../../../Icons/MonthIcn'
import NumberIcn from '../../../Icons/NumberIcn'
import PasswordIcn from '../../../Icons/PasswordIcn'
import PaypalIcn from '../../../Icons/PaypalIcn'
import PhoneNumberIcn from '../../../Icons/PhoneNumberIcn'
import RadioIcn from '../../../Icons/RadioIcn'
import RazorPayIcn from '../../../Icons/RazorPayIcn'
import ReCaptchaIcn from '../../../Icons/ReCaptchaIcn'
import RepeatIcon from '../../../Icons/RepeatIcon'
import ReviewStarIcn from '../../../Icons/ReviewStarIcn'
import SectionIcon from '../../../Icons/SectionIcon'
import ShortcodeIcn from '../../../Icons/ShortcodeIcn'
import SignaturePenIcn from '../../../Icons/SignaturePenIcn'
import SliderIcn from '../../../Icons/SliderIcn'
import SpacerIcn from '../../../Icons/SpacerIcn'
import StripeIcn from '../../../Icons/StripeIcn'
import TextIcn from '../../../Icons/TextIcn'
import TextareaIcn from '../../../Icons/TextareaIcn'
import TimeIcn from '../../../Icons/TimeIcn'
import TitleIcn from '../../../Icons/TitleIcn'
import UrlIcn from '../../../Icons/UrlIcn'
import UserIcn from '../../../Icons/UserIcn'
import WeekIcn from '../../../Icons/WeekIcn'
import { IS_PRO } from '../../../Utils/Helpers'
import countries from '../../../Utils/StaticData/countries.json'
import currencyList from '../../../Utils/StaticData/currencies.json'
import phoneNumberList from '../../../Utils/StaticData/phone-number-code.json'
import { __ } from '../../../Utils/i18nwrap'
import { GlobalMessages, ToolConfig } from '../Types/toolbar.types'

// export interface ToolConfig {
//   name: string
//   keywords: string
//   icn: ReactNode
//   pos: {
//     h: number
//     w: number
//     minW?: number
//     x?: number
//     i: string
//   }
//   new?: boolean
//   pro?: string
//   elm: Record<string, any>
//   category: 'basic' | 'advanced' | 'payment'
// }

// export interface GlobalMessages {
//   err?: {
//     [key: string]: {
//       [key: string]: string
//     }
//   }
// }

export const getToolsList = (globalMessages: GlobalMessages): ToolConfig[] => {
  const err = globalMessages?.err || {}
  const staticURL = `${bits.rootURL}/static`

  return [
    // Basic Fields
    {
      name: __('Text'),
      keywords: 'Text, name, input, field',
      icn: <TextIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'text',
        lbl: __('Text'),
        // ph: __('Placeholder...'),
        // phHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Multiline Text'),
      keywords: 'Multiline Text, Textarea, Text Area, Messages, message, comment, feedback',
      icn: <TextareaIcn size="20" />,
      pos: { h: 145, w: 60, minW: 9, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'textarea',
        lbl: __('Multi-Line Text'),
        // ph: __('Placeholder...'),
        // phHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {
          fld: [{ key: 'rows', value: '4' }],
        },
      },
    },
    {
      name: __('Name'),
      keywords: 'name, full name, text, first name, last name, middle name, prefix, suffix, given name, family name',
      icn: <UserIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'name',
        lbl: __('Name'),
        ph: __('Placeholder...'),
        phHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Email'),
      keywords: 'Email, Email Address',
      icn: <MailIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'email',
        lbl: __('Email'),
        ph: __('example@mail.com'),
        phHide: true,
        pattern: '^[^$_bf_$s@]+@[^$_bf_$s@]+$_bf_$.[^$_bf_$s@]+$',
        valid: {},
        err: {
          invalid: {
            dflt: err.email?.invalid || '<p style="margin:0">Please, Enter a valid email address.</p>',
            show: true,
          },
          req: {
            dflt: err.req || `<p style="margin:0">${__('This field is required')}</p>`,
            show: true,
            custom: true,
          },
        },
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Number'),
      keywords: 'Number, Numeric, Numeric Field, Calculator',
      icn: <NumberIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'number',
        lbl: __('Number'),
        ph: __('e.g. 123'),
        phHide: true,
        valid: {},
        err: { invalid: { dflt: err.number?.invalid || "<p style='margin:0'>Number is invalid</p>", show: true } },
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Username'),
      keywords: 'User Name, text',
      icn: <UserIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'username',
        lbl: __('Username'),
        ph: __('e.g. John Doe'),
        phHide: true,
        valid: {},
        err: { entryUnique: { dflt: err.entryUnique || 'That User Name is taken. Try another.', show: true } },
        customAttributes: {},
      },
    },
    {
      name: __('Password'),
      keywords: 'Password, encrypted, secure',
      icn: <PasswordIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'password',
        lbl: __('Password'),
        ph: __('Placeholder...'),
        phHide: true,
        valid: {},
        err: {},
        config: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Slider'),
      keywords: 'Slider, range, number-range, range-slider',
      icn: <SliderIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'range',
        lbl: __('Slider'),
        phHide: true,
        hlpTxtHide: true,
        showValue: true,
        showMinMaxTip: true,
        valTxt: 'Value: ',
        valPos: 'bottom-left',
        valAlign: 'end',
        mn: '0',
        mx: '100',
        step: '1',
        valid: {},
        err: { mn: { dflt: err.mn || '<p style="margin:0">Minimum value is 0</p>', show: true }, mx: { dflt: err.mx || '<p style="margin:0">Maximum value is 100</p>', show: true } },
        customClasses: {}, // { key(elementkey): 'class1 class2 class3'}
        customAttributes: {}, // { key(elementKey) : [{attrKey: attrValue}, {attrKey: attrValue}]}
      },
    },
    {
      name: __('URL'),
      keywords: 'URL, Link, Website, Web Address, Web URL, Web Link, Web Site',
      icn: <UrlIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'url',
        attr: {
          title: 'https://www.example.com  or  www.example.com',
          // eslint-disable-next-line max-len
          pattern: '^(?:(?:https?|ftp):$_bf_$/$_bf_$/)?(?:(?!(?:10|127)(?:$_bf_$.$_bf_$d{1,3}){3})(?!(?:169$_bf_$.254|192$_bf_$.168)(?:$_bf_$.$_bf_$d{1,3}){2})(?!172$_bf_$.(?:1[6-9]|2$_bf_$d|3[0-1])(?:$_bf_$.$_bf_$d{1,3}){2})(?:[1-9]$_bf_$d?|1$_bf_$d$_bf_$d|2[01]$_bf_$d|22[0-3])(?:$_bf_$.(?:1?$_bf_$d{1,2}|2[0-4]$_bf_$d|25[0-5])){2}(?:$_bf_$.(?:[1-9]$_bf_$d?|1$_bf_$d$_bf_$d|2[0-4]$_bf_$d|25[0-4]))|(?:(?:[a-z$_bf_$u00a1-$_bf_$uffff0-9]-*)*[a-z$_bf_$u00a1-$_bf_$uffff0-9]+)(?:$_bf_$.(?:[a-z$_bf_$u00a1-$_bf_$uffff0-9]-*)*[a-z$_bf_$u00a1-$_bf_$uffff0-9]+)*(?:$_bf_$.(?:[a-z$_bf_$u00a1-$_bf_$uffff]{2,})))(?::$_bf_$d{2,5})?(?:$_bf_$/$_bf_$S*)?$',
        },
        lbl: __('URL'),
        ph: __('https://www.example.com'),
        phHide: true,
        valid: {},
        err: { invalid: { dflt: err.url?.invalid || '<p style="margin:0">URL is invalid</p>', show: true } },
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Color Picker'),
      keywords: 'Color Picker, Color Select, Color Picker Field, Color Select Field',
      icn: <ColorPickerIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'color',
        lbl: __('Color Picker'),
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },

    {
      name: __('reCAPTCHA v2'),
      keywords: 'ReCaptcha v2, Google ReCaptcha v2, spam protection, bot protection, security',
      icn: <ReCaptchaIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      category: 'captcha',
      elm: {
        typ: 'recaptcha',
        valid: {},
        config: {
          theme: 'light',
          size: 'normal',
        },
      },
    },
    {
      name: __('Turnstile'),
      keywords: 'ReCaptcha, hCaptcha, Captcha, Turnstile, cloudflare, spam protection, bot protection',
      icn: <CloudflareIcn size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      category: 'captcha',
      elm: {
        typ: 'turnstile',
        valid: {},
        layout: {
          autoHeight: 1,
        },
        config: {
          theme: 'auto',
          size: 'normal',
          language: 'auto',
          appearance: 'always',
        },
      },
    },
    {
      name: __('hCaptcha'),
      keywords: 'ReCaptcha, hCaptcha, Captcha, spam protection, bot protection',
      icn: <HCaptchaIcn size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      category: 'captcha',
      elm: {
        typ: 'hcaptcha',
        valid: {},
        layout: {
          autoHeight: 1,
        },
        config: {
          mode: 'visible',
          theme: 'light',
          size: 'normal',
        },
      },
    },
    {
      name: __('Email OTP'),
      keywords: 'Email OTP, OTP, One Time Password, Verification, Email Verification, Security',
      icn: <EmailOTPIcn size={20} stroke={2} />,
      pos: { h: 120, w: 60, i: 'shadow_block', minW: 20 },
      category: 'captcha',
      pro: 'This field is available only in pro version',
      elm: {
        typ: 'email-otp',
        lbl: __('Email OTP'),
        subtitle: __('A verification code will be sent to the specified email address.'),
        subtitleHide: true,
        valid: {},
        err: {
          notVerified: { show: true, custom: false, msg: '', dflt: __('Please verify your email OTP before submitting.') },
        },
        config: {
          receiverEmailType: 'dynamic',
          receiverEmail: '',
          receiverEmailFld: '',
          otpLength: 6,
          resendDelay: 60,
          expiryDelay: 15,
          emailTemplate: `<p>Hello,</p>
                          <p>We received a request to verify your action.</p>
                          <p>Your One-Time Password (OTP) is: <strong>\${bf_otp_code}</strong></p>
                          <p>This code is valid for <strong>\${bf_expiry_minutes}</strong> minutes and can only be used once.</p>
                          <p>If you did not initiate this request, please ignore this email.</p>
                          <p>Thank you</p>`,
          sendBtnTxt: __('Send OTP'),
          resendBtnTxt: __('Resend OTP'),
          verifyBtnTxt: __('Verify OTP'),
          // eslint-disable-next-line no-template-curly-in-string
          waitTxt: __('Resend available in ${bf_resend_countdown}s.'),
          maxAttempts: 5,
          sendOnValidate: true,
          autoVerifyOnInput: true,
        },
      },
    },
    {
      name: __('Repeater'),
      keywords: 'Repeater, Field Group, Group, Repeater Field',
      icn: <RepeatIcon size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'repeater',
        lbl: __('Repeater'),
        layout: {
          autoHeight: 1,
        },
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
        addBtn: {
          show: true,
          btnTyp: 'button',
          btnSiz: 'md',
          txt: __(''),
          icn: {
            pos: '',
            url: '',
          },
        },
        addBtnPreIcn: `${staticURL}/repeater/plusicon.svg`,
        removeBtn: {
          show: true,
          btnTyp: 'button',
          btnSiz: 'md',
          txt: __(''),
          icn: {
            pos: '',
            url: '',
          },
        },
        removeBtnPreIcn: `${staticURL}/repeater/minusicon.svg`,
        addToEndBtn: {
          btnAlignment: 'start',
          show: false,
          btnTyp: 'button',
          btnSiz: 'md',
          txt: __('Add New'),
          icn: {
            pos: '',
            url: '',
          },
        },
        addToEndBtnPreIcn: `${staticURL}/repeater/plusicon.svg`,
        btnPosition: 'row',
        btnAlignment: 'center',
        btnView: 'row',
        repeatDirecton: 'column',
      },
    },
    {
      name: __('Signature'),
      keywords: 'Signature Editor, Signature Field, Signature, Signature Block, Canvas, Digital Signature',
      icn: <SignaturePenIcn size={20} />,
      pos: { h: 140, w: 60, i: 'shadow_block' },
      pro: 'This field is available only in pro version',
      category: 'advanced',
      elm: {
        typ: 'signature',
        adminLbl: __('Signature'),
        lbl: __('Signature'),
        adminLblHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
        btnAlign: 'start',
        config: {
          maxWidth: 2.5,
          penColor: '#000000',
          backgroundColor: '#ffffff',
          imgTyp: 'image/png',
        },
        clrBtnHide: false,
        clrBtn: __('Clear'),
        clrPreIcn: '',
        clrSufIcn: '',

        btnDir: false,

        undoBtnHide: false,
        undoBtn: __('Undo'),
        undoPreIcn: '',
        undoSufIcn: '',

        redoBtnHide: false,
        redoBtn: __('Redo'),
        redoPreIcn: '',
        redoSufIcn: '',
      },
    },
    {
      name: __('Rating'),
      keywords: 'Check Box, Mark, Rating, Star, Review, Tick, Option, Select, Choice, Multiple, Multiple Choice, Multiple Select, Multiple Option',
      icn: <ReviewStarIcn size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'rating',
        lbl: __('Rating'),
        opt: [
          { lbl: __('Terrible'), val: '1', img: `${staticURL}/rating/star.svg` },
          { lbl: __('Bad'), val: '2', img: `${staticURL}/rating/star.svg` },
          { lbl: __('Satisfied'), val: '3', img: `${staticURL}/rating/star.svg` },
          { lbl: __('Good'), val: '4', img: `${staticURL}/rating/star.svg` },
          { lbl: __('Excellent'), val: '5', img: `${staticURL}/rating/star.svg` },
        ],
        ratingPos: 'start',
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
        showReviewLblOnHover: false,
        showReviewLblOnSelect: false,
        selectedRating: false,
      },
    },
    {
      name: __('Image Select'),
      keywords: 'Image, Image select, Radio button, Choice, Single Choice, Radio Group, Check Box, Mark, Option, Select, Choice, Multiple, Multiple Choice, Multiple Select, Multiple Option',
      icn: <ImageSelectIcn size={20} />,
      pos: { h: 140, w: 60, i: 'shadow_block' },
      category: 'option',
      elm: {
        typ: 'image-select',
        lbl: __('Image Select'),
        opt: [
          { lbl: __('Option 1'), val: '1', img: `${staticURL}/placeholder-image.svg` },
          { lbl: __('Option 2'), val: '2', img: `${staticURL}/placeholder-image.svg` },
          { lbl: __('Option 3'), val: '3', img: `${staticURL}/placeholder-image.svg` },
          { lbl: __('Option 4'), val: '4', img: `${staticURL}/placeholder-image.svg` },
        ],
        valid: {},
        err: {},
        tickImgSrc: `${staticURL}/image-select/tick.svg`,
        itemSize: 200,
        layout: {
          autoHeight: 1,
        },
        tickPosition: 'top-left',
        optLblHide: false,
        inpType: 'radio',
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Select'),
      keywords: 'Select, Dropdown, Drop Down, option',
      icn: <ChevronDownIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'option',
      elm: {
        typ: 'html-select',
        lbl: __('Select'),
        opt: [
          { lbl: 'Option 1' },
          { lbl: 'Option 2' },
          { lbl: 'Option 3' },
        ],
        ph: 'Select an option...',
        phHide: false,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    // Button Fields
    {
      name: __('Button'),
      keywords: 'Button, Submit, Submit Button, Submit Form, click, click button',
      icn: <BtnIcn size="20" />,
      pos: { h: 60, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'button',
        btnTyp: 'button',
        btnSiz: 'md',
        txt: __('Button'),
        align: 'start',
        icn: {
          pos: '',
          url: '',
        },
        valid: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Section'),
      keywords: 'Section, Field Group, Group, Section Field, Fieldset, Fieldset Group',
      icn: <SectionIcon size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'section',
        lbl: __('Section'),
        layout: {
          autoHeight: 1,
        },
        valid: {},
        err: {},
        customClasses: {}, // { key(elementkey): 'class1 class2 class3'}
        customAttributes: {}, // { key(elementKey) : [{attrKey: attrValue}, {attrKey: attrValue}]}
      },
    },
    {
      name: __('Title'),
      keywords: 'title, heading, heading 1, heading 2, heading 3, heading 4, heading 5, heading 6',
      icn: <TitleIcn w="20" />,
      pos: { h: 48, w: 60, i: 'shadow_block' },
      category: 'element',
      elm: {
        typ: 'title',
        adminLbl: __('Title'),
        adminLblHide: true,
        titleImg: '',
        logoHide: true,
        title: 'Your Title Here',
        titleHide: false,
        subtitleHide: true,
        titleTag: 'h1',
        subTitleTag: 'h5',
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Image'),
      keywords: 'image, picture, photo, logo, icon, avatar, profile picture, profile photo',
      icn: <ImgFldIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'element',
      elm: {
        typ: 'image',
        adminLbl: __('Image'),
        adminLblHide: true,
        alt: '',
        valid: {},
        height: '',
        width: '',
        img: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Divider'),
      keywords: 'divider, line, horizontal line, horizontal divider',
      icn: <DividerIcn w="20" />,
      pos: { h: 40, w: 60, i: 'shadow_block' },
      category: 'element',
      elm: {
        typ: 'divider',
        adminLbl: __('Divider'),
        adminLblHide: true,
        valid: {},
        divider: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('HTML'),
      keywords: 'HTML, HTML Code, HTML Block, HTML Element, HTML Field, HTML Editor',
      icn: <CodeSnippetIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'element',
      elm: {
        typ: 'html',
        adminLbl: __('HTML'),
        layout: {
          autoHeight: 1,
        },
        adminLblHide: true,
        content: '<b>Html Field</b><p style="margin:0"><span style="font-size: 12pt">Add html content on editor</span></p>',
        valid: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Radio Button'),
      keywords: 'Radio button, Choice, Single Choice, Radio Group',
      icn: <RadioIcn size="20" />,
      pos: { h: 140, w: 60, i: 'shadow_block' },
      category: 'option',
      elm: {
        typ: 'radio',
        lbl: __('Radio'),
        round: true,
        opt: [
          { lbl: __('Option 1') },
          { lbl: __('Option 2') },
          { lbl: __('Option 3') },
        ],
        valid: {},
        err: {},
        optionCol: 1,
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Checkbox'),
      keywords: 'Check Box, Mark, Tick, Option, Select, Choice, Multiple, Multiple Choice, Multiple Select, Multiple Option',
      icn: <CheckBoxIcn w="20" />,
      pos: { h: 140, w: 60, i: 'shadow_block' },
      category: 'option',
      elm: {
        typ: 'check',
        lbl: __('Check Boxs'),
        opt: [
          { lbl: __('Option 1') },
          { lbl: __('Option 2') },
          { lbl: __('Option 3') },
        ],
        valid: {},
        err: {},
        optionCol: 1,
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Dropdown'),
      keywords: 'Dropdown, Select, Drop Down, Multiple Select, Multiple Choice, Multiple Option',
      icn: <DropDownIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'select',
        lbl: __('Dropdown'),
        phHide: true,
        ph: 'Select an Option',
        optionsList: [
          {
            'List-1': [
              { lbl: 'Option 1 1' },
              { lbl: 'Option 1 2' },
              { lbl: 'Option 1 3' },
            ],
          },
        ],
        config: {
          selectedOptImage: false,
          selectedOptClearable: true,
          searchClearable: true,
          showSearch: true,
          optionIcon: false,
          placeholder: 'Select an option',
          showSearchPh: true,
          searchPlaceholder: 'Search options..',
          maxHeight: 400,
          multipleSelect: true,
          showChip: true,
          selectedOptImgSrc: 'test.png',
          closeOnSelect: false,
          activeList: 0,
          allowCustomOption: false,
        },
        valid: {},
        err: {
          mn: {
            dflt: err.select?.mn || '<p style="margin:0">You must select the minimum required options.</p>',
            show: true,
          },
          mx: {
            dflt: err.select?.mx || '<p style="margin:0">You can select up to the maximum allowed options.</p>',
            show: true,
          },
        },
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('File Upload'),
      keywords: 'File Upload, Attachment, photo, image, video, audio, file, document, doc, pdf, excel, ppt',
      icn: <FileUploadIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      category: 'basic',
      elm: {
        typ: 'file-up',
        lbl: __('File Upload'),
        btnTxt: 'Attach File',
        valid: {},
        prefixIcn: `${staticURL}/file-upload/paperclip.svg`,
        err: {
          maxSize: {
            dflt: err.maxSize || '<p style="margin:0">File Size is Exceeded</p>',
            show: true,
          },
          minFile: {
            dflt: err.minFile || '<p style="margin:0">Minimum 0 file required</p>',
            show: true,
          },
          maxFile: {
            dflt: err.maxFile || '<p style="margin:0">Maximum 0 file can uploaded</p>',
            show: true,
          },
        },
        customClasses: {},
        customAttributes: {},
        config: {
          multiple: true,
          allowMaxSize: true,
          showMaxSize: IS_PRO,
          maxSize: 2,
          sizeUnit: 'MB',
          isItTotalMax: false,
          showSelectStatus: true,
          fileSelectStatus: 'No File Selected',
          allowedFileType: '',
          showFileList: true,
          fileExistMsg: 'A file allready exist',
          showFilePreview: true,
          showFileSize: true,
          duplicateAllow: false,
          accept: '',
          minFile: 0,
          maxFile: 0,
        },
      },
    },

    {
      name: __('Date'),
      keywords: 'Date, Date Field, month',
      icn: <DateIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'date',
        lbl: __('Pick A Date'),
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Time'),
      keywords: 'Time, Time Picker, Time Select, minutes, hours',
      icn: <TimeIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'time',
        lbl: __('Select Time'),
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Date-Time'),
      keywords: 'Date-Time, Date, Time, day, month, year',
      icn: <DateTimeIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'datetime-local',
        lbl: __('Select Date-Time'),
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Week'),
      keywords: 'Week, Date, day',
      icn: <WeekIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'week',
        lbl: __('Select Week'),
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Month'),
      keywords: 'Month, Date',
      icn: <MonthIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'month',
        lbl: __('Month Input'),
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    // Advanced Fields
    {
      name: __('Date Time (Advanced)'),
      keywords: 'advanced date time, date-time, date time field',
      icn: <DateTimeIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'advanced',
      pro: 'This field is available only in pro version',
      elm: {
        typ: 'advanced-datetime',
        lbl: __('Advanced Date Time'),
        ph: __('Please Select a Date'),
        phHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
        config: {
          mode: 'single',
          dateFormat: 'Y-m-d',
          disableMobile: true,
        },
      },
    },
    {
      name: __('Spacer'),
      keywords: 'Gap, Spacer, Space, Empty Space, Blank Space, Vertical Space, Horizontal Space',
      icn: <SpacerIcn size="22" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'element',
      elm: {
        typ: 'spacer',
        adminLbl: __('Spacer'),
        adminLblHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Advance File Upload'),
      keywords: 'Advanced File Upload, Attachment, photo, image, video, audio, file, document, doc, pdf, excel, ppt',
      icn: <AdvanceFileUpIcn size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      category: 'advanced',
      pro: 'This field is available only in pro version',
      elm: {
        typ: 'advanced-file-up',
        lbl: __('Advanced File Upload'),
        layout: {
          autoHeight: 1,
        },
        upBtnTxt: 'Attach File',
        valid: {},
        config: {
          credits: false,
          allowDrop: true,
          allowPaste: true,
          allowMultiple: false,
          allowReplace: true,
          allowReorder: false,
          allowBrowse: true,
          allowRevert: true,
          allowRemove: true,
          forceRevert: true,
          instantUpload: false,
          dropOnElement: false,
          allowFileSizeValidation: false,
          allowFileTypeValidation: false,
          allowPreview: false,
          allowImageCrop: false,
          allowImagePreview: false,
          allowImageResize: false,
          allowImageTransform: false,
          allowImageValidateSize: false,
          styleButtonRemoveItemPosition: 'left',
          styleButtonProcessItemPosition: 'right',
          styleLoadIndicatorPosition: 'right',
          styleProgressIndicatorPosition: 'right',
          maxParallelUploads: 2,
        },
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Address'),
      keywords: 'Address, Street, City, State, ZIP, Country, Postal',
      icn: <AddressIcn size="20" />,
      pos: { h: 240, w: 60, i: 'shadow_block' },
      new: true,
      category: 'advanced',
      elm: {
        typ: 'address',
        lbl: __('Address'),
        layout: {
          autoHeight: 1,
        },
        valid: {},
        err: {},
        config: {
          scheme: 'international', // 'international'|'us'|'ca'|'uk'|'au'|'custom'
          defaultCountry: '',
          autocomplete: 'none', // 'none'|'mapbox'|'google'|'nominatim' (Pro)
          autocompleteApiKey: '',
          autoLocate: 'disable', // 'page-load'|'on-click'|'disable'
          showMap: 'none', // 'none'|'preview'|'interactive'
          saveCoordinates: false,
          zipValidation: 'auto', // 'auto'|'off'|'custom'
          zipCustomRegex: '',
        },
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Country'),
      keywords: 'Country, Country List, Country Dropdown, Country Select, flag',
      icn: <FlagIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'country',
        lbl: __('Country'),
        mul: false,
        phHide: true,
        ph: 'Select a Country',
        config: {
          selectedFlagImage: IS_PRO,
          selectedCountryClearable: true,
          searchClearable: true,
          optionFlagImage: IS_PRO,
          detectCountryByIp: false,
          detectCountryByGeo: false,
          defaultValue: '',
          showSearchPh: true,
          searchPlaceholder: 'Search for countries',
          noCountryFoundText: 'No Country Found',
        },
        options: countries,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Currency'),
      keywords: 'Currency, Currency Field, Amount, Price',
      icn: <CurrencyIcn size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'currency',
        lbl: __('Currency'),
        ph: __('Enter Amount..'),
        phHide: true,
        inputFormatOptions: {
          formatter: 'browser',
          showCurrencySymbol: true,
          decimalSeparator: '.',
        },
        valueFormatOptions: {
          formatter: 'browser',
          showCurrencySymbol: true,
          decimalSeparator: '.',
        },
        config: {
          selectedFlagImage: IS_PRO,
          selectedCurrencyClearable: true,
          searchClearable: true,
          optionFlagImage: IS_PRO,
          defaultCurrencyKey: '',
          showSearchPh: true,
          searchPlaceholder: 'Search for countries',
          noCurrencyFoundText: 'No Currency Found',
        },
        options: currencyList,
        valid: {},
        err: {
          minValue: {
            dflt: err.minValue || '<p style="margin:0">Minimum required amount not met.</p>',
            show: true,
          },
          maxValue: {
            dflt: err.maxValue || '<p style="margin:0">The entered amount exceeds the maximum limit.</p>',
            show: true,
          },
        },
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Phone Number'),
      keywords: 'Phone number, Number',
      icn: <PhoneNumberIcn size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'phone-number',
        lbl: __('Phone Number'),
        ph: __('Enter Phone Number'),
        phHide: true,
        config: {
          selectedFlagImage: IS_PRO,
          selectedCountryClearable: true,
          searchClearable: true,
          optionFlagImage: IS_PRO,
          defaultCountryKey: '',
          showSearchPh: true,
          searchPlaceholder: 'Search for countries',
          noCountryFoundText: 'No Country Found',
          inputFormat: '+c #### ### ###',
          valueFormat: '+c #### ### ###',
        },
        options: phoneNumberList,
        valid: {},
        err: { invalid: { dflt: err['phone-number']?.invalid || '<p style="margin:0">Please enter a valid phone number</p>', show: true } },
        customClasses: {},
        customAttributes: {},
      },
    },

    {
      name: __('Hidden Field'),
      keywords: 'hidden,Text, number, hide, hidden field, hidden text, hidden number',
      icn: <EyeOffIcon size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'hidden',
        lbl: __('Hidden Field'),
        ph: __('Set Default Value'),
        phHide: true,
        valid: { hide: true },
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('GDPR Agreement'),
      keywords: 'Consent, GDPR, Yes/No, Agree/Disagree,GDPR agreement, decision, accept',
      icn: <GDPRIcn size="20" />,
      pos: { h: 40, w: 60, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'gdpr',
        adminLbl: __('GDPR Agreement'),
        adminLblHide: true,
        lbl: `<p style="margin:0"><span style="font-size: 12pt">${__('I consent to having this website store my submitted information so they can respond to my inquiry. Learn more in ')}<a title="Privacy Policy" href="https://yoursite-example.com/privacy" target="_blank" rel="noopener">${__('Our Privacy Policy.')}</a></span></p>`,
        msg: {
          checked: 'Consented',
          unchecked: 'dissented',
        },
        valid: { req: true },
        err: { req: { dflt: '<p style="margin:0">Please provide consent.</p>', show: true } },
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Decision Box'),
      keywords: 'Decision box, GDPR, Yes/No, Agree/Disagree, concent',
      icn: <DecisionBoxIcn size="20" />,
      pos: { h: 40, w: 60, i: 'shadow_block' },
      category: 'basic',
      elm: {
        typ: 'decision-box',
        adminLbl: __('Decision Box'),
        adminLblHide: true,
        lbl: `<p style="margin:0"><span style="font-size: 12pt">${__('Decision Box')}</span></p>`,
        msg: {
          checked: 'Accepted',
          unchecked: 'Rejected',
        },
        valid: { req: true },
        err: { req: { dflt: err.req || `<p style="margin:0">${__('This field is required')}</p>`, show: true } },
        customClasses: {},
        customAttributes: {},
      },
    },

    // Payment Fields
    {
      name: __('Paypal'),
      keywords: 'Paypal, payment, credit card, credit card payment',
      icn: <PaypalIcn w="20" />,
      pos: { h: 200, w: 60, i: 'shadow_block', minW: 20 },
      category: 'payment',
      pro: 'This field is available only in pro version',
      elm: {
        typ: 'paypal',
        adminLbl: __('Paypal'),
        currency: 'USD',
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: '55',
        },
        valid: {},
      },
    },
    {
      name: __('Razorpay'),
      keywords: 'Razorpay, payment, credit card, credit card payment',
      icn: <RazorPayIcn w="20" h="23" />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      category: 'payment',
      pro: 'This field is available only in pro version',
      elm: {
        typ: 'razorpay',
        lbl: __('Razorpay'),
        btnSiz: 'md',
        fulW: false,
        subTitl: true,
        align: 'center',
        btnTxt: 'Pay Now',
        btnTheme: 'dark',
        options: {
          name: 'Razorpay',
          description: '',
          currency: 'INR',
          amount: 0,
          amountType: 'fixed',
          theme: {},
          prefill: {},
          modal: { confirm_close: false },
        },
        valid: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Stripe'),
      keywords: 'Stripe, payment, credit card, credit card payment',
      icn: <StripeIcn size={20} />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      category: 'payment',
      pro: 'This field is available only in pro version',
      elm: {
        typ: 'stripe',
        adminLbl: __('Stripe'),
        err: {},
        txt: __('Pay with Stripe'),
        layout: {
          autoHeight: 1,
        },
        config: {
          payBtnTxt: __('Pay now'),
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
          amount: 50,
          options: {
            mode: 'payment',
            currency: 'usd',
            locale: 'en',
            payment_method_types: ['card'],
          },
          theme: {
            name: 'stripe',
            style: {
              theme: 'stripe',
            },
          },
        },
      },
    },
    {
      name: __('Mollie'),
      keywords: 'Mollie, payment, credit card, credit card payment',
      icn: <MollieIcn size={20} stroke={5} />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      category: 'payment',
      pro: 'This field is available only in pro version',
      elm: {
        typ: 'mollie',
        adminLbl: __('Mollie'),
        err: {},
        txt: __('Pay with Mollie'),
        btnFulW: true,
        btnAlign: 'center',
        txtAlign: 'center',
        config: {
          currency: 'EUR',
          amount: '10.00',
          description: 'Order #12345',
          payment_method: ['creditcard'],
          redirect_url: '',
        },
      },
    },
    {
      name: __('Shortcode'),
      keywords: 'Shortcode, Shortcode Block, Shortcode Element, Shortcode Field, Shortcode Editor, embed, Embed Code',
      icn: <ShortcodeIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      pro: 'This field is available only in pro version',
      category: 'advanced',
      elm: {
        typ: 'shortcode',
        adminLbl: __('Shortcode'),
        adminLblHide: true,
        content: '[type_your_shortcode_here]',
        layout: {
          autoHeight: 1,
        },
        valid: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Draft Button'),
      keywords: 'Button, Submit, Save, Save Draft, Submit Button, Submit Form, Click, Click button',
      icn: <BtnIcn size="20" />,
      pos: { h: 60, w: 60, i: 'shadow_block' },
      category: 'advanced',
      pro: 'This field is available only in pro version',
      elm: {
        typ: 'button',
        btnTyp: 'save-draft',
        btnSiz: 'md',
        txt: __('Save Draft'),
        align: 'start',
        icn: {
          pos: '',
          url: '',
        },
        valid: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Next Step'),
      keywords: 'Button, Next, Next Step, Next Button',
      icn: <BtnIcn size="23" />,
      pos: { h: 60, w: 30, x: 30, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'button',
        btnTyp: 'next-step',
        btnSiz: 'md',
        txt: __('Next'),
        align: 'end',
        icn: {
          pos: '',
          url: '',
        },
        valid: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Previous Step'),
      keywords: 'Button, Previous, Previous Step, Previous Button',
      icn: <BtnIcn size="23" />,
      pos: { h: 60, w: 30, i: 'shadow_block' },
      category: 'advanced',
      elm: {
        typ: 'button',
        btnTyp: 'previous-step',
        btnSiz: 'md',
        txt: __('Previous'),
        align: 'start',
        icn: {
          pos: '',
          url: '',
        },
        valid: {},
        customClasses: {},
        customAttributes: {},
      },
    },
  ]
}
