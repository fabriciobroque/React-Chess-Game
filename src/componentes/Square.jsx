import React from "react";

function Square({ isBlack, piece, selected, highlight, onClick }) {
  let bgColor = selected
    ? "yellow"
    : highlight === "green"
    ? "lightgreen"
    : highlight === "red"
    ? "#f08080"
    : isBlack
    ? "#769656"
    : "#eeeed2";

  return (
    <div
      onClick={onClick}
      style={{
        width: "70px",
        height: "70px",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
        cursor: piece ? "pointer" : "default",
        border: selected ? "3px solid gold" : "1px solid #333",
        userSelect: "none",
      }}
    >
      {piece}
    </div>
  );
}

export { Square };
