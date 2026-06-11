/* Engineering drawing-sheet aesthetic: title block header,
   mono spec labels, machined range-bar scales, safety orange. */

export const C = {
  ink: "#18222E",
  paper: "#ECEEF0",
  card: "#FFFFFF",
  steel: "#7C8794",
  line: "#CBD1D7",
  orange: "#E8590C",
  green: "#2C7A57",
  amber: "#B0750F",
  red: "#A8392E",
};

export const F = {
  display: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  body: "'IBM Plex Sans', 'Helvetica Neue', sans-serif",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
};

export function btnStyle(primary) {
  return {
    fontFamily: F.mono,
    fontSize: 11.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "8px 16px",
    border: `1px solid ${primary ? C.orange : C.line}`,
    background: primary ? C.orange : "transparent",
    color: primary ? "#fff" : C.steel,
    cursor: "pointer",
  };
}

export function inputStyle(w) {
  return {
    border: `1px solid ${C.line}`,
    padding: "7px 8px",
    fontSize: 13,
    fontFamily: F.body,
    background: "#FAFBFC",
    color: C.ink,
    width: w || "100%",
    boxSizing: "border-box",
  };
}
