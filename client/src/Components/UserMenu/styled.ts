import styled from 'styled-components';

const BtnContainer = styled.div`
  button {
    color: ${(props) => props.theme.textColor};
  }
`;

export default {
  BtnContainer,
};
