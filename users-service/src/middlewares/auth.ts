import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import config from "config";

import User from "../models/user";
import { CustomRequest } from "../types/custom-request";

passport.use(
  new GitHubStrategy(
    {
      clientID: config.get("github.clientId"),
      clientSecret: config.get("github.secret"),
      callbackURL: `http://${config.get("app.host")}:${config.get(
        "app.port"
      )}/github/callback`,
      passReqToCallback: true,
    },
    async (
      req: CustomRequest,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: Error, user?: User | boolean) => void
    ) => {
      try {
        const user = new User(req.db);
        let authenticatedUser = await user.findByGithubId({
          githubId: profile.id.toString(),
        });
        if (authenticatedUser.length === 0) {
          const insert = await user.add({
            githubId: profile.id.toString(),
          });
          authenticatedUser = await user.findByPK({
            id: insert.id,
          });
        }
        return done(null, authenticatedUser[0]);
      } catch (err) {
        return done(null, false);
      }
    }
  )
);

passport.serializeUser((user: User, done: (err: Error, user: User) => void) => {
  done(null, user);
});

passport.deserializeUser(
  (user: User, done: (err: Error, user: User) => void) => {
    done(null, user);
  }
);

export default passport;
