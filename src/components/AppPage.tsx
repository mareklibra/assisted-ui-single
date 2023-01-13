import React from 'react';
import {
  Masthead,
  MastheadBrand,
  MastheadMain,
  Page,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';

export const AppPage: React.FC = ({ children }) => {
  const header = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand href="https://patternfly.org" target="_blank">
          TODO: Logo
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  return (
    <Page header={header} style={{ height: '100vh', width: '100vw', background: 'transparent' }}>
      <PageSection isFilled variant={PageSectionVariants.light}>
        {children}
      </PageSection>
    </Page>
  );
};
