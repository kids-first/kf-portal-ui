import useFeatureToggle from "hooks/useFeatureToggle";
import { Alert, AlertProps } from "antd";
import parseHTML from "html-react-parser";

type OwnProps = Omit<AlertProps, "afterClose"> & {
  featureToggleKey: string;
};

const NotificationBanner = ({ featureToggleKey, ...rest }: OwnProps) => {
  const { isEnabled, hideFeature } = useFeatureToggle(featureToggleKey);

  return (
    <>
      {isEnabled && (
        <Alert
          {...rest}
          message={
            typeof rest.message === "string"
              ? parseHTML(rest.message)
              : rest.message
          }
          afterClose={hideFeature}
        />
      )}
    </>
  );
};

export default NotificationBanner;
