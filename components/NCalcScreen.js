import React from 'react';
import TopBarCalc from './TopBarCalc';

const NCalcScreen = ({
  children,
  style,
  isHomePage = false,
  isResus = false,
  isResults = false,
}) => {
  return (
    <TopBarCalc
      kind="neonate"
      style={style}
      isHomePage={isHomePage}
      isResus={isResus}
      isResults={isResults}>
      {children}
    </TopBarCalc>
  );
};
export default NCalcScreen;
