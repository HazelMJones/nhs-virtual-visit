import AppContainer from "./AppContainer";

describe("AppContainer", () => {
  let container;

  beforeEach(() => {
    container = new AppContainer();
  });

  it("returns getDb", () => {
    expect(container.getDb()).toBeDefined();
  });

  it("returns createVisit", () => {
    expect(container.getCreateVisit()).toBeDefined();
  });

  it("returns getTokenProvider", () => {
    expect(container.getTokenProvider()).toBeDefined();
  });

  it("returns getUserIsAuthenticated", () => {
    expect(container.getUserIsAuthenticated()).toBeDefined();
  });
});
