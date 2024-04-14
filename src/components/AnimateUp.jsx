import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideInAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
`;

const slideOutAnimation = keyframes`
  0% {

    transform: translateY(0);
  }
  100% {

    transform: translateY(100%);
  }
`;

const AnimationContainer = styled.div`
  width: inherit;
  opacity: 0;
  animation: ${slideInAnimation} 1s ease-out forwards;
  animation-fill-mode: forwards;
`;

const AnimateUp = ({ children }) => {
  return (
    <AnimationContainer onAnimationEnd={() => console.log('Animation End')}>
      {children}
    </AnimationContainer>
  );
};

export default AnimateUp;
