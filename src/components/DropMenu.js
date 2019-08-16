//see https://www.kirupa.com/react/smooth_sliding_menu_react_motion.htm for basis
//see https://blog.campvanilla.com/reactjs-dropdown-menus-b6e06ae3a8fe for how to solve clicking inside dropdown
import React, { useState } from "react";
import "./DropMenu.css";

const DropMenu = props => {
  let visibility = "hide";

  if (props.menuVisibility) {
    visibility = "show";
  }

  const [place, setPlace] = useState("");
  const [tag, setTag] = useState("");

  const handleChange = event => {
    setPlace(event.target.value);
  };
  const handleChange2 = event => {
    setTag(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    let tagTitle, url;
    if (tag) {
      tagTitle = tag + "/";
    } else {
      tagTitle = "";
    }
    if (place) {
      url = "/" + place + "/" + tagTitle;
    } else {
      url = "/all/" + tagTitle;
    }
    alert(`You chose ${place} and ${tag}. URL: ${url}`);
  };

  return (
    <div
      id="flyoutMenu"
      onMouseDown={props.handleMouseDown}
      className={visibility}
    >
      <form onSubmit={handleSubmit}>
        <p>Select place:</p>

        <ul>
          <li>
            <label>
              <input
                type="radio"
                value="all"
                checked={place === "all"}
                onChange={handleChange}
              />
              All
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="jaco"
                checked={place === "jaco"}
                onChange={handleChange}
              />
              Jaco
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="la%20fortuna"
                checked={place === "la%20fortuna"}
                onChange={handleChange}
              />
              La Fortuna
            </label>
          </li>
        </ul>

        <p>Select category:</p>

        <ul>
          <li>
            <label>
              <input
                type="radio"
                value="combo"
                checked={tag === "combo"}
                onChange={handleChange2}
              />
              Combo
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="adventure"
                checked={tag === "adventure"}
                onChange={handleChange2}
              />
              Adventure
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="rainforest"
                checked={tag === "rainforest"}
                onChange={handleChange2}
              />
              Rainforest
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="nature"
                checked={tag === "nature"}
                onChange={handleChange2}
              />
              Nature
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="canopy"
                checked={tag === "canopy"}
                onChange={handleChange2}
              />
              Canopy
            </label>
          </li>
        </ul>

        <button type="submit">Select</button>
      </form>
    </div>
  );
};

export default DropMenu;
