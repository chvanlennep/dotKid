import React from 'react';

import TopBarCalc from './TopBarCalc';

const PCalcScreen = ({
  children,
  style,
  isHomePage = false,
  isResus = false,
  isResults = false,
}) => {
  return (
    <TopBarCalc
      kind="child"
      style={style}
      isHomePage={isHomePage}
      isResus={isResus}
      isResults={isResults}>
      {children}
    </TopBarCalc>
  );
};
export default PCalcScreen;
