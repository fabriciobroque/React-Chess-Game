import React, { useState } from "react";
import { Square } from "./Square";
import { isValidMove, isKingInCheck, isEnemy } from "./chessRules";

function Board() {
  const [boardState, setBoardState] = useState([
    ["♜","♞","♝","♛","♚","♝","♞","♜"],
    ["♟","♟","♟","♟","♟","♟","♟","♟"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["♙","♙","♙","♙","♙","♙","♙","♙"],
    ["♖","♘","♗","♕","♔","♗","♘","♖"],
  ]);

  const [selected, setSelected] = useState(null);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [whiteTurn, setWhiteTurn] = useState(true);

  const handleClick = (row, col) => {
    const clickedPiece = boardState[row][col];

    if (selected) {
      const [selRow, selCol] = selected;
      const piece = boardState[selRow][selCol];
      const pieceIsWhite = ["♙","♖","♘","♗","♕","♔"].includes(piece);

      // só permite movimento válido nas casas destacadas
      if (highlightedSquares.some(([r, c]) => r === row && c === col)) {
        const newBoard = boardState.map(r => [...r]);
        newBoard[row][col] = piece;
        newBoard[selRow][selCol] = "";

        // checa xeque
        if (isKingInCheck(newBoard, pieceIsWhite)) {
          alert("Movimento inválido: rei em xeque!");
        } else {
          setBoardState(newBoard);
          setWhiteTurn(!whiteTurn);

          // verifica xeque do adversário
          const opponentIsWhite = !pieceIsWhite;
          if (isKingInCheck(newBoard, opponentIsWhite)) {
            alert(opponentIsWhite ? "Xeque: Peças brancas!" : "Xeque: Peças pretas!");
          }
        }
      }

      setSelected(null);
      setHighlightedSquares([]);
    } else if (clickedPiece) {
      const pieceIsWhite = ["♙","♖","♘","♗","♕","♔"].includes(clickedPiece);
      if (pieceIsWhite === whiteTurn) {
        setSelected([row, col]);

        // calcular movimentos possíveis
        const moves = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (isValidMove(clickedPiece, row, col, r, c, boardState)) {
              moves.push([r, c]);
            }
          }
        }
        setHighlightedSquares(moves);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#333",
      }}
    >
      <div style={{ color: "white", fontSize: "20px", marginBottom: "10px" }}>
        Turno: {whiteTurn ? "Brancas" : "Pretas"}
      </div>

      {boardState.map((rowArr, row) => (
        <div key={row} style={{ display: "flex" }}>
          {rowArr.map((piece, col) => {
            const isBlack = (row + col) % 2 === 1;
            let highlight = null;
            if (highlightedSquares.some(([r, c]) => r === row && c === col)) {
              highlight = isEnemy(piece, boardState[selected?.[0]][selected?.[1]]) ? "red" : "green";
            }
            return (
              <Square
                key={col}
                isBlack={isBlack}
                piece={piece}
                selected={selected && selected[0] === row && selected[1] === col}
                highlight={highlight}
                onClick={() => handleClick(row, col)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export { Board };
