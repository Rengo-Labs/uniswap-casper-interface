
import {StyledSwitch} from "./styles";

interface SwitchProperties {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
}

export const CustomToggle: React.FC<SwitchProperties> = ({id, isChecked, onChange}: SwitchProperties) => {
  return (
      <StyledSwitch htmlFor={id}>
        <input
            data-testid="toggle_id"
            id={`label-${id}`}
            type="checkbox"
            role="switch"
            checked={isChecked}
            onChange={onChange}
            aria-checked={isChecked}
        />
      </StyledSwitch>
  );
}
