import { CustomRequest } from "../types/custom-request";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import User from "../models/user";
import { IUser } from "../types/user";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "your-github-client-id",
      clientSecret: process.env.GITHUB_SECRET || "your-github-secret",
      passReqToCallback: true,
      callbackURL: `http://${process.env.APP_HOST}:${process.env.APP_PORT || 3000}/github/callback`,
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
