import AppContainer from "../containers/AppContainer";
import {
  setupTrust,
  setupWardWithinHospitalAndTrust,
} from "../testUtils/factories";

describe("retrieveWardVisitTotalsStartDateByTrustId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the date of when reporting started for a trust", async () => {
    // A trust with ward visit totals
    const {
      wardId: wardId1,
      trustId: trustId1,
    } = await setupWardWithinHospitalAndTrust({ index: 1 });

    await container.getUpdateWardVisitTotals()({
      wardId: wardId1,
      date: new Date("2020-12-01T23:00:00.000Z"),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: wardId1,
      date: new Date("2020-06-01T23:00:00.000Z"),
    });

    // Another trust with ward visit totals
    const { wardId: wardId2 } = await setupWardWithinHospitalAndTrust({
      index: 2,
    });

    await container.getUpdateWardVisitTotals()({
      wardId: wardId2,
      date: new Date("2020-01-01T23:00:00.000Z"),
    });

    const {
      startDate,
      error,
    } = await container.getRetrieveWardVisitTotalsStartDateByTrustId()(
      trustId1
    );

    expect(startDate).toEqual(new Date("2020-06-01T23:00:00.000Z"));
    expect(error).toBeNull();
  });

  it("returns null if there are no ward visit totals for a trust", async () => {
    const { trustId } = await setupTrust();

    const {
      startDate,
      error,
    } = await container.getRetrieveWardVisitTotalsStartDateByTrustId()(trustId);

    expect(startDate).toBeNull();
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const {
      error,
    } = await container.getRetrieveWardVisitTotalsStartDateByTrustId()();

    expect(error).not.toBeNull();
  });
});
