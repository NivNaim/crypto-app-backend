import { CustomRequest } from "./../types/custom-request.d";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import config from "config";

import User from "../models/user";
import { IUser } from "../types/user";

passport.use(
  new GitHubStrategy(
    {
      clientID: config.get("github.clientId"),
      clientSecret: config.get("github.secret"),
      passReqToCallback: true,
      callbackURL: `http://${config.get("app.host")}:${config.get(
        "app.port"
      )}/github/callback`,
    },
    async (
      req: CustomRequest,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: Error, user?: IUser | boolean) => void
    ) => {
      try {
        let authenticatedUser = await User.findOne({
          github_id: profile.id.toString(),
        });
        if (!authenticatedUser) {
          authenticatedUser = await User.create({
            github_id: profile.id.toString(),
          });
        }
        req.user = authenticatedUser;
        return done(null, authenticatedUser);
      } catch (err) {
        return done(null, false);
      }
    }
  )
);

passport.serializeUser(
  (user: IUser, done: (err: Error | null, id: string) => void) => {
    done(null, user.id);
  }
);

passport.deserializeUser(
  async (id: string, done: (err: Error | null, user?: IUser) => void) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
);

export default passport;
