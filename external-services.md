# Bit Form – External Services & Privacy

This document lists the third-party and external services that Bit Form may connect to when you use specific features or integrations. For each service, we describe what it does, what data is sent, when it is sent, and provide links to the service's Terms of Use and Privacy Policy.

---

## Overview

Bit Form connects to external services only when:

1. **You enable a specific integration** (e.g., Zoho CRM, Mailchimp, Google Sheets)
2. **You use a built-in feature** that requires external processing (e.g., spam protection, icon search)
3. **You opt in** to optional features (e.g., telemetry)

If you do not enable integrations or use those features, the plugin does not send data to external servers (except as noted below for captcha/icon search when those features are enabled).

---

## Built-in Features (Free Plugin)

### 1. Icon Search (icons.bitapps.pro)

| Item                 | Details                                                                               |
| -------------------- | ------------------------------------------------------------------------------------- |
| **What it does**     | Provides icon search results in the form builder's icon picker (admin only).          |
| **When it connects** | When you open the icon picker and search for icons, or when icons load in the picker. |
| **Data sent**        | Search query, pagination parameters, and your site URL (for API authentication).      |
| **Terms of Use**     | [Bit Apps Terms of Service](https://bitapps.pro/terms-of-service/)                    |
| **Privacy Policy**   | [Bit Apps Privacy Policy](https://bitapps.pro/privacy-policy/)                        |

---

### 2. Google reCAPTCHA

| Item                 | Details                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **What it does**     | Validates that form submissions are from humans, not bots (spam protection).                                        |
| **When it connects** | When a form with reCAPTCHA v2 or v3 is displayed or submitted.                                                      |
| **Data sent**        | Token from reCAPTCHA widget, user IP, form submission context. Google may collect additional data per its policies. |
| **Terms of Use**     | [Google Terms of Service](https://policies.google.com/terms)                                                        |
| **Privacy Policy**   | [Google Privacy Policy](https://policies.google.com/privacy)                                                        |

---

### 3. hCaptcha

| Item                 | Details                                                       |
| -------------------- | ------------------------------------------------------------- |
| **What it does**     | Alternative CAPTCHA service for spam protection.              |
| **When it connects** | When a form with hCaptcha is displayed or submitted.          |
| **Data sent**        | Token from hCaptcha widget, user IP, form submission context. |
| **Terms of Use**     | [hCaptcha Terms of Service](https://www.hcaptcha.com/terms)   |
| **Privacy Policy**   | [hCaptcha Privacy Policy](https://www.hcaptcha.com/privacy)   |

---

### 4. Cloudflare Turnstile

| Item                 | Details                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| **What it does**     | Invisible CAPTCHA alternative for spam protection.                     |
| **When it connects** | When a form with Cloudflare Turnstile is displayed or submitted.       |
| **Data sent**        | Token from Turnstile widget, user IP, form submission context.         |
| **Terms of Use**     | [Cloudflare Terms of Service](https://www.cloudflare.com/terms/)       |
| **Privacy Policy**   | [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/) |

---

### 5. Placeholder Images (fakeimg.pl)

| Item                 | Details                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **What it does**     | Generates placeholder images for the Image field when no custom image is set.              |
| **When it connects** | When a form with an Image field using the default placeholder is rendered on the frontend. |
| **Data sent**        | Dimensions (width/height) in the image URL.                                                |
| **Terms of Use**     | [fakeimg.pl](https://fakeimg.pl/) – third-party service; review their site for terms.      |
| **Privacy Policy**   | See service website.                                                                       |

---

### 6. Telemetry (wp-api.bitapps.pro) – Opt-in Only

| Item                 | Details                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **What it does**     | Collects anonymous usage data to improve the plugin (e.g., PHP version, WordPress version, plugin version). |
| **When it connects** | Only after you explicitly opt in via the plugin settings. Off by default.                                   |
| **Data sent**        | Basic environment info (PHP version, WP version, plugin version, etc.).                                     |
| **Terms of Use**     | [Bit Apps Terms of Service](https://bitapps.pro/terms-of-service/)                                          |
| **Privacy Policy**   | [Bit Apps Privacy Policy](https://bitapps.pro/privacy-policy/)                                              |

---

## Integrations (When You Enable Them)

The following services are used **only when you configure and enable** the corresponding integration in Bit Form.

### Email Marketing & CRM

| Service                | Purpose                            | Data Sent                                  | Terms                                                                    | Privacy                                                                  |
| ---------------------- | ---------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **GetGist**            | Add contacts to GetGist lists      | Form field values mapped to GetGist fields | [GetGist Terms](https://www.getgist.com/terms)                           | [GetGist Privacy](https://www.getgist.com/privacy)                       |
| **Mailchimp**          | Add subscribers to Mailchimp lists | Form field values (email, name, etc.)      | [Mailchimp Terms](https://mailchimp.com/legal/terms/)                    | [Mailchimp Privacy](https://mailchimp.com/legal/privacy/)                |
| **Brevo (SendinBlue)** | Email marketing, CRM               | Form field values                          | [Brevo Terms](https://www.brevo.com/legal/termsofuse/)                   | [Brevo Privacy](https://www.brevo.com/legal/privacypolicy/)              |
| **ActiveCampaign**     | CRM, email automation              | Form field values                          | [ActiveCampaign Terms](https://www.activecampaign.com/terms-of-service/) | [ActiveCampaign Privacy](https://www.activecampaign.com/privacy-policy/) |
| **MailerLite**         | Email marketing                    | Form field values                          | [MailerLite Terms](https://www.mailerlite.com/legal/terms-of-service)    | [MailerLite Privacy](https://www.mailerlite.com/legal/privacy-policy)    |
| **Elastic Email**      | Email delivery, lists              | Form field values, API key                 | [Elastic Email Terms](https://elasticemail.com/terms)                    | [Elastic Email Privacy](https://elasticemail.com/privacy-policy)         |
| **HubSpot**            | CRM, marketing automation          | Form field values                          | [HubSpot Terms](https://legal.hubspot.com/terms-of-service)              | [HubSpot Privacy](https://legal.hubspot.com/privacy-policy)              |
| **Fluent CRM**         | Email marketing (self-hosted)      | Form field values                          | N/A (self-hosted)                                                        | N/A                                                                      |
| **Acumbamail**         | Email marketing                    | Form field values                          | [Acumbamail Terms](https://acumbamail.com/terminos-condiciones/)         | [Acumbamail Privacy](https://acumbamail.com/politica-privacidad/)        |
| **Rapidmail**          | Email marketing                    | Form field values                          | [Rapidmail Terms](https://www.rapidmail.de/agb)                          | [Rapidmail Privacy](https://www.rapidmail.de/datenschutz)                |
| **Autonami**           | Marketing automation               | Form field values                          | [Autonami](https://autonami.io/)                                         | See service website                                                      |
| **Groundhogg**         | Marketing automation               | Form field values                          | [Groundhogg](https://www.groundhogg.io/)                                 | See service website                                                      |
| **Encharge**           | Email marketing                    | Form field values                          | [Encharge Terms](https://encharge.io/terms/)                             | [Encharge Privacy](https://encharge.io/privacy-policy/)                  |
| **SendFox**            | Email marketing                    | Form field values                          | [SendFox](https://sendfox.com/)                                          | See service website                                                      |
| **Mail Poet**          | Email (WordPress plugin)           | Form field values                          | [Mail Poet](https://www.mailpoet.com/terms-of-use/)                      | [Mail Poet Privacy](https://www.mailpoet.com/privacy-notice/)            |

### Zoho Services

| Service               | Purpose             | Data Sent                                     | Terms                                         | Privacy                                           |
| --------------------- | ------------------- | --------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| **Zoho CRM**          | CRM records         | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Sheet**        | Spreadsheet data    | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho WorkDrive**    | File storage        | Form field values, file uploads, OAuth tokens | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Recruit**      | Recruitment CRM     | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Campaigns**    | Email campaigns     | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Sign**         | E-signatures        | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Mail**         | Email               | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Desk**         | Customer support    | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Creator**      | App builder         | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Bigin**        | CRM                 | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Analytics**    | Analytics           | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho MarketingHub** | Marketing           | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Projects**     | Project management  | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |
| **Zoho Flow**         | Workflow automation | Form field values, OAuth tokens               | [Zoho Terms](https://www.zoho.com/terms.html) | [Zoho Privacy](https://www.zoho.com/privacy.html) |

### File Storage & Collaboration

| Service           | Purpose          | Data Sent                                     | Terms                                                                 | Privacy                                                                   |
| ----------------- | ---------------- | --------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Google Sheets** | Spreadsheet data | Form field values, OAuth tokens               | [Google Terms](https://policies.google.com/terms)                     | [Google Privacy](https://policies.google.com/privacy)                     |
| **Dropbox**       | File storage     | Form field values, file uploads, OAuth tokens | [Dropbox Terms](https://www.dropbox.com/terms)                        | [Dropbox Privacy](https://www.dropbox.com/privacy)                        |
| **OneDrive**      | File storage     | Form field values, file uploads, OAuth tokens | [Microsoft Terms](https://www.microsoft.com/en-us/servicesagreement/) | [Microsoft Privacy](https://privacy.microsoft.com/en-us/privacystatement) |

### Messaging & Notifications

| Service              | Purpose                          | Data Sent                                  | Terms                                            | Privacy                                                |
| -------------------- | -------------------------------- | ------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------ |
| **Telegram Bot API** | Send messages/files via Telegram | Form field values, file uploads, bot token | [Telegram Terms](https://telegram.org/tos)       | [Telegram Privacy](https://telegram.org/privacy)       |
| **Twilio**           | SMS, voice                       | Form field values, phone numbers           | [Twilio Terms](https://www.twilio.com/legal/tos) | [Twilio Privacy](https://www.twilio.com/legal/privacy) |

### Automation & Webhooks

| Service                       | Purpose                       | Data Sent                                | Terms                                                  | Privacy                                                |
| ----------------------------- | ----------------------------- | ---------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| **Webhooks**                  | Send form data to custom URLs | Form field values to your configured URL | Defined by you                                         | Defined by you                                         |
| **Zapier**                    | Connect to 5000+ apps         | Form field values                        | [Zapier Terms](https://zapier.com/terms)               | [Zapier Privacy](https://zapier.com/privacy)           |
| **Make (Integromat)**         | Workflow automation           | Form field values                        | [Make Terms](https://www.make.com/en/terms-of-service) | [Make Privacy](https://www.make.com/en/privacy-notice) |
| **Integrately**               | Workflow automation           | Form field values                        | [Integrately](https://integrately.com/)                | See service website                                    |
| **Pabbly**                    | Workflow automation           | Form field values                        | [Pabbly](https://www.pabbly.com/terms)                 | See service website                                    |
| **n8n**                       | Workflow automation           | Form field values                        | [n8n Terms](https://n8n.io/terms/)                     | [n8n Privacy](https://n8n.io/privacy/)                 |
| **IFTTT**                     | Applets                       | Form field values                        | [IFTTT Terms](https://ifttt.com/terms)                 | [IFTTT Privacy](https://ifttt.com/privacy)             |
| **WP Webhooks**               | WordPress automation          | Form field values                        | N/A (WordPress plugin)                                 | N/A                                                    |
| **Uncanny Automator**         | WordPress automation          | Form field values                        | N/A (WordPress plugin)                                 | N/A                                                    |
| **Thrive Automator**          | WordPress automation          | Form field values                        | N/A (WordPress plugin)                                 | N/A                                                    |
| **SureTriggers**              | WordPress automation          | Form field values                        | N/A (WordPress plugin)                                 | N/A                                                    |
| **FlowMattic**                | WordPress automation          | Form field values                        | N/A (WordPress plugin)                                 | N/A                                                    |
| **AutomatorWP**               | WordPress automation          | Form field values                        | N/A (WordPress plugin)                                 | N/A                                                    |
| **Advanced Form Integration** | Custom integrations           | Form field values                        | Depends on target                                      | Depends on target                                      |

### WordPress-Specific

| Service         | Purpose                  | Data Sent                             | Terms                                                    | Privacy        |
| --------------- | ------------------------ | ------------------------------------- | -------------------------------------------------------- | -------------- |
| **ACF**         | Custom fields            | Form field values                     | N/A (WordPress plugin)                                   | N/A            |
| **Pods**        | Custom post types/fields | Form field values                     | N/A (WordPress plugin)                                   | N/A            |
| **Meta Box**    | Custom fields            | Form field values                     | N/A (WordPress plugin)                                   | N/A            |
| **WooCommerce** | E-commerce               | Form field values, product/order data | [WooCommerce](https://woocommerce.com/terms-conditions/) | See Automattic |

---

## Payment Gateways (Bit Form Pro)

| Service      | Purpose                     | Data Sent                                      | Terms                                                                       | Privacy                                                                 |
| ------------ | --------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **PayPal**   | Payment processing          | Form field values, payment amounts, payer info | [PayPal Terms](https://www.paypal.com/us/webapps/mpp/ua/useragreement-full) | [PayPal Privacy](https://www.paypal.com/us/webapps/mpp/ua/privacy-full) |
| **Stripe**   | Payment processing          | Form field values, payment card tokens         | [Stripe Terms](https://stripe.com/legal)                                    | [Stripe Privacy](https://stripe.com/privacy)                            |
| **Razorpay** | Payment processing (India)  | Form field values, payment data                | [Razorpay Terms](https://razorpay.com/terms/)                               | [Razorpay Privacy](https://razorpay.com/privacy-policy/)                |
| **Mollie**   | Payment processing (Europe) | Form field values, payment data                | [Mollie Terms](https://www.mollie.com/en/terms)                             | [Mollie Privacy](https://www.mollie.com/en/privacy)                     |

---

## Questions or Updates

If you have questions about how Bit Form uses external services or need to report an issue, please contact us through [Bit Form support](https://bit-form.com/) or [Bit Apps](https://bitapps.pro/).

This document may be updated as we add or change integrations. The latest version is available in the plugin repository and on our documentation site.
