import withContainer from "../../src/middleware/withContainer";
import validateVisit from "../../src/helpers/validateVisit";
import {
  NEW_NOTIFICATION,
  UPDATED_NOTIFICATION,
} from "../../src/usecases/sendBookingNotification";

const determineNotificationType = (
  sideA,
  sideB,
  sideAContact,
  sideBContact
) => {
  let diff = false;
  for (var i = 0; i < sideA.length; i++) {
    if (sideA[i] != sideB[i]) diff = true;
  }

  if (!diff) return false;

  return sideAContact !== sideBContact
    ? NEW_NOTIFICATION
    : UPDATED_NOTIFICATION;
};

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    const respond = (status, response) => {
      res.status(status);
      response ? res.end(JSON.stringify(response)) : res.end();
    };

    if (method !== "PATCH") {
      respond(405);
      return;
    }

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers.cookie
    );

    if (!userIsAuthenticatedResponse) {
      respond(401, { err: "Unauthorized" });
      return;
    }

    if (!body.callId) {
      respond(400, { err: { callId: "callId must be present" } });
      return;
    }

    const { validVisit, errors } = validateVisit({
      patientName: body.patientName,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactNumber: body.contactNumber,
      callTime: body.callTime,
    });

    if (!validVisit) {
      respond(400, { err: errors });
      return;
    }

    const { scheduledCall } = await container.getRetrieveVisitByCallId()(
      body.callId
    );
    if (!scheduledCall) {
      respond(404, { err: "call does not exist" });
      return;
    }

    const updatedCall = {
      callId: body.callId,
      patientName: body.patientName,
      recipientName: body.contactName,
      recipientEmail: body.contactEmail,
      recipientNumber: body.contactNumber,
      callTime: body.callTime,
    };

    try {
      await container.getUpdateVisitByCallId()(updatedCall);
      respond(200, { success: true });
    } catch (updateError) {
      console.log(updateError);
      respond(500, { err: "Failed to update visit" });
      return;
    }

    try {
      const { ward } = await container.getRetrieveWardById()(
        userIsAuthenticatedResponse.wardId,
        userIsAuthenticatedResponse.trustId
      );

      const sendNotification = async (type) => {
        const notificationType = determineNotificationType(
          [
            updatedCall.callId,
            updatedCall.callTime,
            updatedCall.recipientEmail,
            updatedCall.recipientNumber,
          ],
          [
            scheduledCall.callId,
            scheduledCall.callTime,
            scheduledCall.recipientEmail,
            scheduledCall.recipientNumber,
          ],
          type == "email"
            ? updatedCall.recipientEmail
            : updatedCall.recipientNumber,
          type == "email"
            ? scheduledCall.recipientEmail
            : scheduledCall.recipientNumber
        );
        if (!notificationType) return;

        const sendBookingNotification = container.getSendBookingNotification();
        return await sendBookingNotification({
          mobileNumber: type == "number" ? body.contactNumber : undefined,
          emailAddress: type == "email" ? body.contactEmail : undefined,
          wardName: ward.name,
          hospitalName: ward.hospitalName,
          visitDateAndTime: body.callTime,
          notificationType: notificationType,
        });
      };

      if (updatedCall.recipientEmail) {
        const {
          success: emailSuccess,
          errors: emailErrors,
        } = await sendNotification("email");
        if (!emailSuccess) {
          respond(500, { err: emailErrors });
          return;
        }
      }

      if (updatedCall.recipientNumber) {
        const {
          success: numberSuccess,
          errors: numberErrors,
        } = await sendNotification("number");
        if (!numberSuccess) {
          respond(500, { err: numberErrors });
          return;
        }
      }
    } catch (notificationError) {
      console.log(notificationError);
      respond(500, { err: "Failed to send notification" });
      return;
    }
  }
);
