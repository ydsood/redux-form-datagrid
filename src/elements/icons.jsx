import styled from "styled-components";
import { Icon } from "semantic-ui-react";

const StyledIcon = styled(Icon)`
  transition: all 0.2s ease-in-out;
  :hover {
    transform: scale(1.2);
  }
`;
export default StyledIcon;
