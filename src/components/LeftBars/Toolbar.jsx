/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-useless-escape */
/* eslint-disable object-property-newline */
/* eslint-disable no-undef */

import { useAtomValue } from 'jotai'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { $globalMessages } from '../../GlobalStates/AppSettingsStates'
import AdvanceFileUpIcn from '../../Icons/AdvanceFileUpIcn'
import AtoZSortIcn from '../../Icons/AtoZSortIcn'
import BtnIcn from '../../Icons/BtnIcn'
import CheckBoxIcn from '../../Icons/CheckBoxIcn'
import ChevronDownIcn from '../../Icons/ChevronDownIcn'
import CloudflareIcn from '../../Icons/CloudflareIcn'
import CodeSnippetIcn from '../../Icons/CodeSnippetIcn'
import ColorPickerIcn from '../../Icons/ColorPickerIcn'
import CurrencyIcn from '../../Icons/CurrencyIcn'
import DateIcn from '../../Icons/DateIcn'
import DateTimeIcn from '../../Icons/DateTimeIcn'
import DecisionBoxIcn from '../../Icons/DecisionBoxIcn'
import DividerIcn from '../../Icons/DividerIcn'
import DropDownIcn from '../../Icons/DropDownIcn'
import EyeOffIcon from '../../Icons/EyeOffIcon'
import FileUploadIcn from '../../Icons/FileUploadIcn'
import FlagIcn from '../../Icons/FlagIcn'
import GDPRIcn from '../../Icons/GDPRIcn'
import HCaptchaIcn from '../../Icons/HCaptchaIcn'
import ImageSelectIcn from '../../Icons/ImageSelectIcn'
import ImgFldIcn from '../../Icons/ImgFldIcn'
import MailIcn from '../../Icons/MailIcn'
import MollieIcn from '../../Icons/MollieIcn'
import MonthIcn from '../../Icons/MonthIcn'
import NumberIcn from '../../Icons/NumberIcn'
import PasswordIcn from '../../Icons/PasswordIcn'
import PaypalIcn from '../../Icons/PaypalIcn'
import PhoneNumberIcn from '../../Icons/PhoneNumberIcn'
import RadioIcn from '../../Icons/RadioIcn'
import RazorPayIcn from '../../Icons/RazorPayIcn'
import ReCaptchaIcn from '../../Icons/ReCaptchaIcn'
import RepeatIcon from '../../Icons/RepeatIcon'
import ReviewStarIcn from '../../Icons/ReviewStarIcn'
import SearchIcon from '../../Icons/SearchIcon'
import SectionIcon from '../../Icons/SectionIcon'
import ShortcodeIcn from '../../Icons/ShortcodeIcn'
import SignaturePenIcn from '../../Icons/SignaturePenIcn'
import SliderIcn from '../../Icons/SliderIcn'
import SpacerIcn from '../../Icons/SpacerIcn'
import StripeIcn from '../../Icons/StripeIcn'
import TextIcn from '../../Icons/TextIcn'
import TextareaIcn from '../../Icons/TextareaIcn'
import TimeIcn from '../../Icons/TimeIcn'
import TitleIcn from '../../Icons/TitleIcn'
import UrlIcn from '../../Icons/UrlIcn'
import UserIcn from '../../Icons/UserIcn'
import WeekIcn from '../../Icons/WeekIcn'
import { IS_PRO } from '../../Utils/Helpers'
import countries from '../../Utils/StaticData/countries.json'
import currencyList from '../../Utils/StaticData/currencies.json'
import phoneNumberList from '../../Utils/StaticData/phone-number-code.json'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import Toolbars from '../../styles/Toolbars.style'
import Cooltip from '../Utilities/Cooltip'
import ProBadge from '../Utilities/ProBadge'
import RenderHtml from '../Utilities/RenderHtml'
import { searchKey } from '../style-new/styleHelpers'
import Tools from './Tools'

export const getToolsList = (globalMessages) => {
  const err = globalMessages?.err || {}
  return [
    {
      name: __('Date Time (Advanced)'),
      keywords: 'advanced date time, date-time, date time field',
      icn: <DateTimeIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      new: true,
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
      new: true,
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
      name: __('First Name'),
      keywords: 'Text, name, first name, full name',
      icn: <TextIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      // new: true,
      elm: {
        typ: 'text',
        lbl: __('First Name'),
        ph: __('First Name'),
        phHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Last Name'),
      keywords: 'Text, name, last name, full name',
      icn: <TextIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      elm: {
        typ: 'text',
        lbl: __('Last Name'),
        ph: __('Last Name'),
        phHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Text'),
      keywords: 'Text, name, input, field',
      icn: <TextIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      elm: {
        typ: 'text',
        lbl: __('Text'),
        ph: __('Placeholder...'),
        phHide: true,
        valid: {},
        err: {},
        customClasses: {}, // { key(elementkey): 'class1 class2 class3'}
        customAttributes: {}, // { key(elementKey) : [{attrKey: attrValue}, {attrKey: attrValue}]}
      },
    },
    {
      name: __('Multiline Text'),
      keywords: 'Multiline Text, Textarea, Text Area, Messages, message, comment, feedback',
      icn: <TextareaIcn size="20" />,
      pos: { h: 100, w: 60, minW: 9, i: 'shadow_block' },
      elm: {
        typ: 'textarea',
        lbl: __('Multi-Line Text'),
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
      name: __('Select'),
      keywords: 'Select, Dropdown, Drop Down, option',
      icn: <ChevronDownIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      tip: 'Select',
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
    {
      name: __('Radio Button'),
      keywords: 'Radio button, Choice, Single Choice, Radio Group',
      icn: <RadioIcn size="20" />,
      pos: { h: 140, w: 60, i: 'shadow_block' },
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
          // dropdownIcn: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
          // onChange: val => { console.log(val) },
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
      elm: {
        typ: 'file-up',
        lbl: __('File Upload'),
        btnTxt: 'Attach File',
        valid: {},
        prefixIcn: `${bits.assetsURL}/../static/file-upload/paperclip.svg`,
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
          showMaxSize: false,
          maxSize: 2,
          sizeUnit: 'MB',
          isItTotalMax: false,
          showSelectStatus: true,
          fileSelectStatus: 'No File Selected',
          allowedFileType: '',
          showFileList: false,
          fileExistMsg: 'A file allready exist',
          showFilePreview: false,
          showFileSize: false,
          duplicateAllow: false,
          accept: '',
          minFile: 0,
          maxFile: 0,
        },
      },
    },
    {
      name: __('Advance File Upload'),
      keywords: 'Advanced File Upload, Attachment, photo, image, video, audio, file, document, doc, pdf, excel, ppt',
      icn: <AdvanceFileUpIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
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
      name: __('Country'),
      keywords: 'Country, Country List, Country Dropdown, Country Select, flag',
      icn: <FlagIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
      icn: <CurrencyIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
      icn: <PhoneNumberIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
      name: __('Username'),
      keywords: 'User Name, text',
      icn: <UserIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      elm: {
        typ: 'username',
        lbl: __('Username'),
        ph: __('e.g. John Doe'),
        phHide: true,
        valid: {},
        err: { entryUnique: { dflt: err.entryUnique || 'That User Name is taken. Try another.', show: true } },
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Password'),
      keywords: 'Password, encrypted, secure',
      icn: <PasswordIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      elm: {
        typ: 'password',
        lbl: __('Password Field'),
        ph: __('Placeholder...'),
        phHide: true,
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('Slider'),
      keywords: 'Slider, range, number-range, range-slider',
      icn: <SliderIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
      name: __('Date'),
      keywords: 'Date, Date Field, month',
      icn: <DateIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
      elm: {
        typ: 'month',
        lbl: __('Month Input'),
        valid: {},
        err: {},
        customClasses: {},
        customAttributes: {},
      },
    },
    {
      name: __('URL'),
      keywords: 'URL, Link, Website, Web Address, Web URL, Web Link, Web Site',
      icn: <UrlIcn w="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
      name: __('GDPR Agreement'),
      keywords: 'Consent, GDPR, Yes/No, Agree/Disagree,GDPR agreement, decision, accept',
      icn: <GDPRIcn size="20" />,
      pos: { h: 40, w: 60, i: 'shadow_block' },
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
    {
      name: __('reCAPTCHA v2'),
      keywords: 'ReCaptcha v2, Google ReCaptcha v2, spam protection, bot protection, security',
      icn: <ReCaptchaIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      elm: {
        typ: 'recaptcha',
        valid: {},
        config: {
          theme: 'light',
          size: 'normal',
        },
      },
    },
    // {
    //   name: __('Math Captcha'),
    //   keywords: 'ReCaptcha, Math, MathCaptcha, spam protection, bot protection',
    //   icn: <MathOperatorsIcn size="22" stroke={1} />,
    //   pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
    //   elm: {
    //     typ: 'math-captcha',
    //     valid: {},
    //     config: {
    //       theme: 'light',
    //       size: 'normal',
    //     },
    //   },
    // },
    {
      name: __('Turnstile'),
      keywords: 'ReCaptcha, hCaptcha, Captcha, Turnstile, cloudflare, spam protection, bot protection',
      icn: <CloudflareIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
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
      icn: <HCaptchaIcn size="20" stroke={1} />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
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
      name: __('Repeater'),
      keywords: 'Repeater, Field Group, Group, Repeater Field',
      icn: <RepeatIcon size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
        addBtnPreIcn: `${bits.assetsURL}/../static/repeater/plusicon.svg`,
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
        removeBtnPreIcn: `${bits.assetsURL}/../static/repeater/minusicon.svg`,
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
        addToEndBtnPreIcn: `${bits.assetsURL}/../static/repeater/plusicon.svg`,
        btnPosition: 'row',
        btnAlignment: 'center',
        btnView: 'row',
        repeatDirecton: 'column',
      },
    },
    {
      name: __('Signature'),
      keywords: 'Signature Editor, Signature Field, Signature, Signature Block, Canvas, Digital Signature',
      icn: <SignaturePenIcn size="20" />,
      pos: { h: 140, w: 60, i: 'shadow_block' },
      pro: 'This field is available only in pro version',
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
      icn: <ReviewStarIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
      elm: {
        typ: 'rating',
        lbl: __('Rating'),
        opt: [
          { lbl: __('Terrible'), val: '1', img: `${bits.assetsURL}/../static/rating/star.svg` },
          { lbl: __('Bad'), val: '2', img: `${bits.assetsURL}/../static/rating/star.svg` },
          { lbl: __('Satisfied'), val: '3', img: `${bits.assetsURL}/../static/rating/star.svg` },
          { lbl: __('Good'), val: '4', img: `${bits.assetsURL}/../static/rating/star.svg` },
          { lbl: __('Excellent'), val: '5', img: `${bits.assetsURL}/../static/rating/star.svg` },
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
      icn: <ImageSelectIcn size="20" />,
      pos: { h: 140, w: 60, i: 'shadow_block' },
      elm: {
        typ: 'image-select',
        lbl: __('Image Select'),
        opt: [
          { lbl: __('Option 1'), val: '1', img: `${bits.assetsURL}/../static/image-select/placeholder-image.jpg` },
          { lbl: __('Option 2'), val: '2', img: `${bits.assetsURL}/../static/image-select/placeholder-image.jpg` },
          { lbl: __('Option 3'), val: '3', img: `${bits.assetsURL}/../static/image-select/placeholder-image.jpg` },
          { lbl: __('Option 4'), val: '4', img: `${bits.assetsURL}/../static/image-select/placeholder-image.jpg` },
        ],
        valid: {},
        err: {},
        tickImgSrc: `${bits.assetsURL}/../static/image-select/tick.svg`,
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
      name: __('Hidden Field'),
      keywords: 'hidden,Text, number, hide, hidden field, hidden text, hidden number',
      icn: <EyeOffIcon size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
      name: __('Paypal'),
      keywords: 'Paypal, payment, credit card, credit card payment',
      icn: <PaypalIcn w="20" />,
      pos: { h: 200, w: 60, i: 'shadow_block', minW: 20 },
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
        // options: {
        //   currency: 'INR',
        //   theme: {},
        //   modal: {},
        //   prefill: {},
        //   notes: {},
        // },
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
      icn: <StripeIcn size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
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
      icn: <MollieIcn size="20" stroke="5" />,
      pos: { h: 80, w: 60, i: 'shadow_block', minW: 20 },
      pro: 'This field is available only in pro version',
      // new: true,
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
      name: __('Button'),
      keywords: 'Button, Submit, Submit Button, Submit Form, click, click button',
      icn: <BtnIcn size="20" />,
      pos: { h: 60, w: 60, i: 'shadow_block' },
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
      name: __('Draft Button'),
      keywords: 'Button, Submit, Save, Save Draft, Submit Button, Submit Form, Click, Click button',
      icn: <BtnIcn size="20" />,
      pos: { h: 60, w: 60, i: 'shadow_block' },
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
    {
      name: __('Section'),
      keywords: 'Section, Field Group, Group, Section Field, Fieldset, Fieldset Group',
      icn: <SectionIcon size="20" />,
      pos: { h: 80, w: 60, i: 'shadow_block' },
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
    /* {
      name: 'Blank Block',
      icn: blank,
      pos: { h: 80, w: 30, i: 'shadow_block' },
      elm: {
        typ: 'blank',
      },
    }, */
  ]
}

function Toolbar({ setNewData }) {
  const { css } = useFela()
  const globalMessages = useAtomValue($globalMessages)
  const [searchData, setSearchData] = useState([])
  const [focusSearch, setfocusSearch] = useState(false)
  const [isSorted, setIsSorted] = useState(false)
  const toolsList = useMemo(() => getToolsList(globalMessages), [globalMessages])
  const [isScroll, setIsScroll] = useState(false)
  const searchInput = useRef(null)
  const finalTools = useMemo(() => {
    if (searchData.length) return searchData
    if (isSorted) {
      return [...toolsList].sort((a, b) => a.name.localeCompare(b.name))
    }
    return toolsList
  }, [toolsList, isSorted, searchData])

  useEffect(() => {
    window.addEventListener('keydown', searchKey)
    return () => {
      window.removeEventListener('keydown', searchKey)
    }
  }, [])

  const searchHandler = (e) => {
    const searchTerm = e.target.value.trim().toLowerCase()
    if (searchTerm) {
      const filtered = toolsList.filter(field => field.keywords.toLowerCase().includes(searchTerm)
        || field.name.toLowerCase().includes(searchTerm))
      if (filtered.length > 0) {
        setSearchData(filtered)
      }
    } else {
      setSearchData([])
    }
  }

  const sortingField = () => {
    if (!isSorted) {
      setIsSorted(true)
    } else {
      setIsSorted(false)
    }
  }
  const onScrollHandler = (e) => {
    const { scrollTop } = e.target
    if (scrollTop > 50) setIsScroll(true)
    else setIsScroll(false)
  }

  const clearSearch = () => {
    searchInput.current.value = ''
    setSearchData([])
    setfocusSearch(false)
  }

  const blurSearchInp = () => {
    setTimeout(() => {
      setfocusSearch(false)
    }, 100)
  }

  const renderThumbVertical = ({ style, ...props }) => {
    const thumbStyle = {
      ...style,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
    }
    return <div style={thumbStyle} {...props} />
  }

  const renderToolsList = useMemo(() => (
    <Scrollbars
      onScroll={onScrollHandler}
      style={{ maxWidth: 800 }}
      renderThumbVertical={renderThumbVertical}
    >
      <div className={css(Toolbars.tool_bar)}>
        {finalTools.map(tool => (
          <Tools
            key={tool.name}
            setNewData={setNewData}
            value={{ fieldData: tool.elm, fieldSize: tool.pos }}
            title={tool.name}
          >
            <div className={`${css(toolStyle.wrp)} ${css(tool.tip ? ut.w9 : ut.w10)}`} title={tool.name}>
              <span className={`${css(Toolbars.tool_icn, ut.mr1)} tool-icn`}>{tool.icn}</span>
              {tool.name}
            </div>
            {tool.tip && (
              <Cooltip className={`${css(ut.w1)} hover-tip`} icnSize={15}>
                <div className="txt-body">{tool.tip}</div>
              </Cooltip>
            )}
            {!IS_PRO && tool.pro && (
              <ProBadge width="18">
                <div className="txt-body">
                  <RenderHtml html={tool.pro} />
                </div>
              </ProBadge>
            )}
            {(IS_PRO || !tool.pro) && tool.new && (
              <ProBadge width="18" text="New" />
            )}
          </Tools>
        ))}
      </div>
    </Scrollbars>
  ), [searchData, isSorted, finalTools, toolsList])

  return (
    <div className={css(Toolbars.toolbar_wrp)}>
      <div className={css(ut.flxc, { mb: 5 }, isScroll && Toolbars.searchBar)}>
        <div className={css(Toolbars.fields_search)} style={{ width: focusSearch ? '80%' : '68%', marginTop: '2px' }}>
          <input
            ref={searchInput}
            title="Search Field"
            aria-label="Search Field"
            autoComplete="off"
            data-testid="tlbr-srch-inp"
            // placeholder="Search..."
            id="search-icon"
            type="search"
            name="searchIcn"
            onChange={searchHandler}
            onFocus={() => setfocusSearch(true)}
            onBlur={blurSearchInp}
            className={css(Toolbars.search_field)}
          />
          {!!searchData.length && (
            <span
              title="clear"
              aria-label="Clear"
              className={css(Toolbars.clear_icn)}
              role="button"
              tabIndex="-1"
              onClick={clearSearch}
              onKeyDown={clearSearch}
            >
              &nbsp;
            </span>
          )}

          <span title="search" className={css(Toolbars.search_icn)}>
            <SearchIcon size="20" />
          </span>

          {!searchData.length && (
            <div
              className={`${css(Toolbars.shortcut)} shortcut`}
              title={'Press "Ctrl+/" to focus search'}
            >
              Ctrl+/
            </div>
          )}
        </div>
        {!focusSearch
          && (
            <button
              title="Sort by ascending order"
              data-testid="tlbr-sort-btn"
              className={`${css(Toolbars.sort_btn)} ${isSorted && 'active'}`}
              type="button"
              onClick={sortingField}
              aria-label="Sort Fields"
            >
              <AtoZSortIcn size="20" />
            </button>
          )}
      </div>
      {renderToolsList}
    </div>
  )
}
export default memo(Toolbar)

const toolStyle = {
  wrp: {
    flx: 'align-center',
    ow: 'hidden',
    w: '90%',
    cg: 5,
  },
}
