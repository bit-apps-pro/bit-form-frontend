import paymentFields from './paymentFields'

// This array is used to filter out field types that are not allowed to be used in logic blocks
const filterFieldTypesForLogicBlock = ['file-up', 'recaptcha', 'section', 'turnstile', 'title', 'image', 'divider', 'spacer', 'shortcode']

// This array is used to filter out field types that are not allowed to be used in TinyMCE
export const filterFieldTypesForTinyMce = ['file-up', 'recaptcha', 'turnstile', 'section', 'shortcode', 'divider', 'spacer', 'image', 'advanced-file-up', 'button']

// This array is used to filter out field types that are not allowed to be used in section field
export const filterFieldTypesForSectionField = ['repeater', 'section']

// This array is used to filter out field types that are not allowed to be used in repeater field
export const filterFieldTypesForRepeater = ['repeater', 'section', 'button', 'recaptcha', 'turnstile', 'hcaptcha', 'advanced-file-up', 'decision-box', 'gdpr', ...paymentFields]

export const filterFieldTypesForConversationalForm = ['recaptcha', 'turnstile', 'hcaptcha', 'decision-box', 'button', 'mollie']

export const nonMappableFields = ['button', 'section', 'title', 'image', 'divider', 'spacer', 'shortcode']

// This array is used to filter out field types that are allowed to be used in field mapping
export const fileUpOrMappableImageFieldTypes = ['file-up', 'advanced-file-up', 'signature']

export default filterFieldTypesForLogicBlock
