import retrieveManagerByUuidGateway from "../../../src/gateways/MsSQL/retrieveManagerByUuid";
import {
  setUpManager,
  setupOrganization,
  setUpAdmin,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveManagerByUuidGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves a manager object when given a manager uuid", async () => {
    // Arrange
    const {
      user: { id: adminId },
    } = await setUpAdmin();
    const { orgId } = await setupOrganization({ createdBy: adminId });
    const newManager = {
      email: "test@nhs.co.uk",
      password: "hashed password",
      organisationId: orgId,
      type: "manager",
    };
    const { user: expectedManager } = await setUpManager(newManager);

    // Act
    const manager = await retrieveManagerByUuidGateway(container)(
      expectedManager.uuid
    );
    // Assert
    expect(manager).toEqual(expectedManager);
  });
  it("returns manager object to be undefined if uuid is undefined", async () => {
    // Act
    const manager = await retrieveManagerByUuidGateway(container)(undefined);
    // Assert
    expect(manager).toBeUndefined();
  });
});
