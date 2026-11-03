import { SignInPage } from '@backstage/core-components';
import {
  createFrontendModule,
  githubAuthApiRef,
} from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';

// Replaces the app's default sign-in page (guest only) with GitHub.
export const signInModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    SignInPageBlueprint.make({
      params: {
        loader: async () => props => (
          <SignInPage
            {...props}
            providers={[
              {
                id: 'github-auth-provider',
                title: 'GitHub',
                message: 'Sign in with your GitHub account',
                apiRef: githubAuthApiRef,
              },
            ]}
          />
        ),
      },
    }),
  ],
});
