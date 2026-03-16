export type IconSettingsProps = {
  id: string;
  classNames?: string;
  alt?: string;
  label?: string;
  iconSrc?: string;
  setIconHandler: (src: string) => void;
  removeIconHandler?: () => void;
  uploadLbl?: string;
  selected?: string;
};