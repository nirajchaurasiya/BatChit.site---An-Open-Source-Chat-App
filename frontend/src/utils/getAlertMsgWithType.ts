import { AlertMessageType } from "../types/AlertTypes";
import { SWT, allAlertMessages } from "./alertMessages";

export const getAlert = (
  status: number,
  alertType: AlertMessageType
) => {
  const alerttype =
    allAlertMessages
      .find((alert) => alert.type === alertType)
      ?.availableStatusAlerts.find((e) => e.statusCode === status)?.code ||
    SWT.code;
  return alerttype;
};
