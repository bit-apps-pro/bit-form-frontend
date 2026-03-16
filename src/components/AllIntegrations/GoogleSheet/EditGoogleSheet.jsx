/* eslint-disable no-param-reassign */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { __ } from "../../../Utils/i18nwrap";
import SnackMsg from "../../Utilities/SnackMsg";
import { saveIntegConfig } from "../IntegrationHelpers/GoogleIntegrationHelpers";
import IntegrationStepThree from "../IntegrationHelpers/IntegrationStepThree";
import { handleInput } from "./GoogleSheetCommonFunc";
import GoogleSheetIntegLayout from "./GoogleSheetIntegLayout";
import Modal from "../../Utilities/Modal";
import GoogleSheetAuthorization from "./GoogleSheetAuthorization";

function EditGoogleRecruit({
  formFields,
  setIntegration,
  integrations,
  allIntegURL,
}) {
  const history = useNavigate();
  const { id, formID } = useParams();
  const [showMdl, setShowMdl] = useState(false);
  const [step, setStep] = useState(1);
  const [sheetConf, setSheetConf] = useState({ ...integrations[id] });
  const [isLoading, setisLoading] = useState(false);
  const [snack, setSnackbar] = useState({ show: false });

  const authorizedAction = () => {
    setTimeout(() => {
      history(`${allIntegURL}/new/${sheetConf.type}`);
    }, 1000);
    setShowMdl(false);
  };
  return (
    <div style={{ width: 900 }}>
      <Modal
        title={__("Authorize New Google App")}
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <GoogleSheetAuthorization
          formID={formID}
          sheetConf={sheetConf}
          setSheetConf={setSheetConf}
          step={step}
          setstep={setStep}
          setSnackbar={setSnackbar}
          isLoading={isLoading}
          setisLoading={setisLoading}
          allIntegURL={allIntegURL}
          authorizedAction={authorizedAction}
        />
      </Modal>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-150 d-in-b">{__("Integration Name:")}</b>
        <input
          className="btcd-paper-inp w-6"
          onChange={(e) => handleInput(e, sheetConf, setSheetConf)}
          name="name"
          value={sheetConf.name}
          type="text"
          placeholder={__("Integration Name...")}
        />
      </div>
      <br />
      <br />

      <GoogleSheetIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) =>
          handleInput(
            e,
            sheetConf,
            setSheetConf,
            formID,
            setisLoading,
            setSnackbar,
          )
        }
        sheetConf={sheetConf}
        setSheetConf={setSheetConf}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
        setShowMdl={setShowMdl}
      />

      <IntegrationStepThree
        edit
        saveConfig={() =>
          saveIntegConfig(
            integrations,
            setIntegration,
            allIntegURL,
            sheetConf,
            history,
            id,
            1,
          )
        }
        disabled={
          sheetConf.spreadsheetId === "" ||
          sheetConf.worksheetName === "" ||
          sheetConf.field_map.length < 1
        }
      />
      <br />
    </div>
  );
}

export default EditGoogleRecruit;
