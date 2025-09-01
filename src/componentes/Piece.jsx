import React from "react";

function Piece({ piece, isBlack }) {
  if (!piece) return null;

  let pieceColor = "black";
  if (["♜","♞","♝","♛","♚"].includes(piece)) pieceColor = "white";

  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: isBlack ? "#b58863" : "#f0d9b5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: pieceColor,
        fontSize: "32px",
      }}
    >
      {piece}
    </div>
  );
}

export { Piece };
