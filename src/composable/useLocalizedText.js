
//TODO: convert to composable
import { useLanguage } from "./useLanguage";

export function localized(TextTolocalize) {


  const { t } = useLanguage();

  return t(TextTolocalize)
};

