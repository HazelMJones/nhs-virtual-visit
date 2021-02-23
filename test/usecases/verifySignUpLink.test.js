import verifySignUpLink from "../../src/usecases/verifySignUpLink";

describe("verifySignUpLink", () => {
  let getVerifySignUpLinkGateway;
  let getTokenProvider;
  let token;

  beforeEach(() => {
    getVerifySignUpLinkGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        user: {
          id: 1,
          verified: false,
          status: 0,
          type: "resetPassword",
        },
        error: null,
      });
    });
    getTokenProvider = jest.fn(() => {
      return {
        verifyTokenFromLink: jest.fn().mockReturnValue({
          decryptedToken: {
            hash: "hash",
            uuid: "uuid",
          },
          errorToken: null,
        }),
      };
    });
    token = "valid token";
  });

  it("returns an error if no token is passed in", async () => {
    token = "";

    const { user, error } = await verifySignUpLink({
      getVerifySignUpLinkGateway,
      getTokenProvider,
    })(token);

    expect(user).toBeNull();
    expect(error).toEqual("token is not defined");
  });

  it("returns an error if the token is not valid", async () => {
    token = "Invalid token";

    getTokenProvider = jest.fn(() => {
      return {
        verifyTokenFromLink: jest.fn().mockReturnValue({
          decryptedToken: null,
          errorToken: "There is an error",
        }),
      };
    });

    const { user, error } = await verifySignUpLink({
      getVerifySignUpLinkGateway,
      getTokenProvider,
    })(token);

    expect(user).toBeNull();
    expect(error).toEqual("Link is incorrect or expired.");
  });

  describe("verifySignUpLink when the type is 'authoriseUser'", () => {
    it("returns a user if the link hasn't been verified, and the user status is 0 for authoriseUser", async () => {
      const getVerifySignUpLinkGatewaySpy = jest.fn().mockReturnValue({
        user: {
          id: 1,
          verified: false,
          status: 0,
          type: "authoriseUser"
        },
        error: null,
      });
  
      getVerifySignUpLinkGateway = jest.fn(() => {
        return getVerifySignUpLinkGatewaySpy;
      });
  
      const { user, error } = await verifySignUpLink({
        getVerifySignUpLinkGateway,
        getTokenProvider,
      })(token);
  
      const expectedResponse = { id: 1, status: 0, verified: false, type: "authoriseUser" };
  
      expect(user).toEqual(expectedResponse);
      expect(error).toBeNull();
      expect(getVerifySignUpLinkGatewaySpy).toHaveBeenCalledWith({
        hash: "hash",
        uuid: "uuid",
      });
    });

    it("returns an error if the link has already been verified for authoriseUser", async () => {
      getVerifySignUpLinkGateway = jest.fn(() => {
        return jest.fn().mockReturnValue({
          user: {
            id: 1,
            verified: true,
            status: 0,
            type: "authoriseUser"
          },
          error: null,
        });
      });
  
      const { user, error } = await verifySignUpLink({
        getVerifySignUpLinkGateway,
        getTokenProvider,
      })(token);
  
      expect(user).toBeNull();
      expect(error).toEqual("Link is invalid. Please sign up again");
    });
    
    it("returns an error if the user status is already active for authoriseUser", async () => {
      getVerifySignUpLinkGateway = jest.fn(() => {
        return jest.fn().mockReturnValue({
          user: {
            id: 1,
            verified: false,
            status: 1,
            type: "authoriseUser",
          },
          error: null,
        });
      });
  
      const { user, error } = await verifySignUpLink({
        getVerifySignUpLinkGateway,
        getTokenProvider,
      })(token);
  
      expect(user).toBeNull();
      expect(error).toEqual("User account has been activated");
    });
  });

  describe("verifySignUpLink when the type is 'confirmRegistration'", () => {
    it("returns a user if the link hasn't been verified, and the user status is 0 for confirmRegistration", async () => {
      const getVerifySignUpLinkGatewaySpy = jest.fn().mockReturnValue({
        user: {
          id: 1,
          verified: false,
          status: 0,
          type: "confirmRegistration"
        },
        error: null,
      });
  
      getVerifySignUpLinkGateway = jest.fn(() => {
        return getVerifySignUpLinkGatewaySpy;
      });
  
      const { user, error } = await verifySignUpLink({
        getVerifySignUpLinkGateway,
        getTokenProvider,
      })(token);
  
      const expectedResponse = { id: 1, status: 0, verified: false, type: "confirmRegistration" };
  
      expect(user).toEqual(expectedResponse);
      expect(error).toBeNull();
      expect(getVerifySignUpLinkGatewaySpy).toHaveBeenCalledWith({
        hash: "hash",
        uuid: "uuid",
      });
    });

    it("returns an error if the link has already been verified for confirmRegistration", async () => {
      getVerifySignUpLinkGateway = jest.fn(() => {
        return jest.fn().mockReturnValue({
          user: {
            id: 1,
            verified: true,
            status: 0,
            type: "confirmRegistration"
          },
          error: null,
        });
      });
  
      const { user, error } = await verifySignUpLink({
        getVerifySignUpLinkGateway,
        getTokenProvider,
      })(token);
  
      expect(user).toBeNull();
      expect(error).toEqual("Link is invalid. Please sign up again");
    });

    it("returns an error if the user status is already active for confirmRegistration", async () => {
      getVerifySignUpLinkGateway = jest.fn(() => {
        return jest.fn().mockReturnValue({
          user: {
            id: 1,
            verified: false,
            status: 1,
            type: "confirmRegistration"
          },
          error: null,
        });
      });
  
      const { user, error } = await verifySignUpLink({
        getVerifySignUpLinkGateway,
        getTokenProvider,
      })(token);
  
      expect(user).toBeNull();
      expect(error).toEqual("User account has been activated");
    });
  });

  describe("verifySignUpLink when the type is 'resetPassword'", () => {
    it("returns a user if the link hasn't been verified for resetPassword", async () => {
      const getVerifySignUpLinkGatewaySpy = jest.fn().mockReturnValue({
        user: {
          id: 1,
          verified: false,
          status: 1,
          type: "resetPassword"
        },
        error: null,
      });
  
      getVerifySignUpLinkGateway = jest.fn(() => {
        return getVerifySignUpLinkGatewaySpy;
      });
  
      const { user, error } = await verifySignUpLink({
        getVerifySignUpLinkGateway,
        getTokenProvider,
      })(token);
  
      const expectedResponse = { id: 1, status: 1, verified: false, type: "resetPassword" };
  
      expect(user).toEqual(expectedResponse);
      expect(error).toBeNull();
      expect(getVerifySignUpLinkGatewaySpy).toHaveBeenCalledWith({
        hash: "hash",
        uuid: "uuid",
      });
    });

    it("returns an error if the link has already been verified for resetPassword", async () => {
      getVerifySignUpLinkGateway = jest.fn(() => {
        return jest.fn().mockReturnValue({
          user: {
            id: 1,
            verified: true,
            status: 1,
            type: "resetPassword"
          },
          error: null,
        });
      });
  
      const { user, error } = await verifySignUpLink({
        getVerifySignUpLinkGateway,
        getTokenProvider,
      })(token);
  
      expect(user).toBeNull();
      expect(error).toEqual("Link is invalid. Please sign up again");
    });
  });
  

  it("returns an error if there is problem with the database call", async () => {
    getVerifySignUpLinkGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        user: null,
        error: "error",
      });
    });

    const { user, error } = await verifySignUpLink({
      getVerifySignUpLinkGateway,
      getTokenProvider,
    })(token);

    expect(user).toBeNull();
    expect(error).toEqual("error");
  });
});
