import React from "react";

const ToggleSwitch = (props) => {
  return (
    <div>
      <i class="fa-solid fa-sun fa-lg" style={{ verticalAlign: "middle" }}></i>
      <label class="switch">
        <input type="checkbox" onClick={props.setTheme} />
        <span class="slider round"></span>
      </label>
      <i class="fa-solid fa-moon fa-lg" style={{ verticalAlign: "middle" }}></i>
    </div>
  );
};

export default ToggleSwitch;
