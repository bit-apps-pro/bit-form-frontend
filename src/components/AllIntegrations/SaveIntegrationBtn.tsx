import { __ } from '../../Utils/i18nwrap';
import Btn from '../Utilities/Btn';

interface SaveIntegrationBtnProps {
  onClick: () => void;
}

export default function SaveIntegrationBtn({ onClick }: SaveIntegrationBtnProps) {
  console.log('SaveIntegration button called')
  return (
    <Btn variant="success" onClick={onClick}>
      {__('Save')}
    </Btn>
  );
}
