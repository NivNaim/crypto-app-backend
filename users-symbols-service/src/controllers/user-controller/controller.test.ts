import config from "config";

import { getUserIdFromToken } from "./controller";

describe("getUserIdFromToken", () => {
  test("should return the user ID when the token is valid", () => {
    jest.spyOn(config, "get").mockReturnValue("my-secret-token");

    const validToken = "my-valid-mock-token";
    const result = getUserIdFromToken(validToken);
    expect(result).toBe("expected-user-id");
  });
});
