export default function bitformInit(contentId = null) {
  if (typeof hidden_token_field !== 'undefined') hidden_token_field(contentId)
  if (typeof initAllCustomFlds !== 'undefined') initAllCustomFlds(contentId)
  if (typeof initAddOtherOpt !== 'undefined') initAddOtherOpt(contentId)
  if (typeof setSliderFieldValue !== 'undefined') setSliderFieldValue(contentId)
  if (typeof setBitInputMaskToInput !== 'undefined') setBitInputMaskToInput(contentId)
  if (typeof initCheckDisableOnMax !== 'undefined') initCheckDisableOnMax(contentId)
  if (typeof validate_focus !== 'undefined') validate_focus(contentId)
  if (typeof submit_form !== 'undefined') submit_form(contentId)
  if (typeof bit_form_abandonment !== 'undefined') bit_form_abandonment(contentId)
  if (typeof setFieldValues !== 'undefined') setFieldValues(contentId)
  if (typeof bit_multi_step_form !== 'undefined') bit_multi_step_form(contentId)
  if (typeof bit_conversational_form !== 'undefined') bit_conversational_form(contentId)
}

document.addEventListener('DOMContentLoaded', () => {
  bitformInit()
})
