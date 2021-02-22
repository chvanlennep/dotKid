import React from 'react';
import BinarySelector from './BinarySelector';

const SexInputButton = ({kind}) => {
  return (
    <BinarySelector
      kind={kind}
      name="sex"
      userLabel="Sex"
      trueValue="Male"
      falseValue="Female"
      iconName="all-inclusive"
    />
  );
};

export default SexInputButton;
