import academicAdvisorMeetingFormTemplate from './academicAdvisorMeetingFormTemplate'
import blankTemplate from './blankTemplate'
import conferenceRoomRegFormTemplate from './conferenceRoomRegFormTemplate'
import contactFormTemplate from './contactFormTemplate'
import customerComplainForm from './customerComplainForm'
import disasterReliefDonationFormAtlassian from './disasterReliefDonationFormAtlassian'
import GDPRcontactFormTemplate from './GDPRcontactFormTemplate'
import gradeBookFromTemplate from './gradeBookFromTemplate'
import loginFormTemplate from './loginFormTemplate'
import meetingRoomRegTemplate from './meetingRoomRegTemplate'
import newsletterFormTemplate from './newsletterFormTemplate'
import newsletterSignUpFormTemplate from './newsletterSignUpFormTemplate'
import repeaterFieldTestFormTemplate from './repeaterFieldTestFormTemplate'
import signUpFormTemplate from './signUpFormTemplate'
import simpleContactFormTemplate from './simpleContactFormTemplate'

export default (slug) => {
  switch (slug) {
    case 'contact_form':
    case 'contact_form_atlassian':
      return contactFormTemplate

    case 'newsletter_sing_up_form':
    case 'newsletter_sing_up_form_atlassian':
      return newsletterSignUpFormTemplate

    case 'simple_contact_form':
    case 'simple_contact_form_atlassian':
      return simpleContactFormTemplate

    case 'signup_form':
    case 'signup_form_atlassian':
      return signUpFormTemplate

    case 'newsletter_form':
    case 'newsletter_form_atlassian':
      return newsletterFormTemplate

    case 'login_form':
    case 'login_form_atlassian':
      return loginFormTemplate

    case 'meeting_room_reg':
    case 'meeting_room_reg_atlassian':
      return meetingRoomRegTemplate

    case 'conference_reg_form':
    case 'conference_reg_form_atlassian':
      return conferenceRoomRegFormTemplate

    case 'repeater_field_test_form':
    case 'repeater_field_test_form_atlassian':
      return repeaterFieldTestFormTemplate

    case 'grade_book_form':
    case 'grade_book_form_atlassian':
      return gradeBookFromTemplate

    case 'gdpf_form':
    case 'gdpf_form_atlassian':
      return GDPRcontactFormTemplate

    case 'academic_advisor_meeting_form':
    case 'academic_advisor_meeting_form_atlassian':
      return academicAdvisorMeetingFormTemplate

    case 'customer_complain_form':
    case 'customer_complain_form_atlassian':
      return customerComplainForm

    case 'disaster_relief_donation_form_atlassian':
      return disasterReliefDonationFormAtlassian
    default:
      return blankTemplate
  }
}
