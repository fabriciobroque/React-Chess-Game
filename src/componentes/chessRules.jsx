export const isValidMove = (piece, fromRow, fromCol, toRow, toCol, boardState, lastMove) => {
  const deltaRow = toRow - fromRow;
  const deltaCol = toCol - fromCol;
  const targetPiece = boardState[toRow][toCol];
  const isWhite = ["♙","♖","♘","♗","♕","♔"].includes(piece);

  // Roque simples
  if ((piece === "♔" || piece === "♚") && deltaRow === 0 && Math.abs(deltaCol) === 2) {
    const row = fromRow;
    const rookCol = deltaCol > 0 ? 7 : 0;
    const rook = boardState[row][rookCol];
    if ((piece === "♔" && rook !== "♖") || (piece === "♚" && rook !== "♜")) return false;
    const step = deltaCol > 0 ? 1 : -1;
    for (let c = fromCol + step; c !== rookCol; c += step) if (boardState[row][c] !== "") return false;
    return true;
  }

  // Peões
  if (piece === "♙") {
    if (deltaCol === 0 && deltaRow === -1 && targetPiece === "") return true;
    if (deltaCol === 0 && deltaRow === -2 && fromRow === 6 && boardState[fromRow-1][fromCol] === "" && targetPiece === "") return true;
    if (Math.abs(deltaCol) === 1 && deltaRow === -1 && targetPiece && !isWhite) return true;
    if (Math.abs(deltaCol) === 1 && deltaRow === -1 && !targetPiece && lastMove?.piece === "♟" &&
        lastMove.toRow === fromRow && lastMove.toCol === toCol && lastMove.fromRow === fromRow-2) return true;
    return false;
  }

  if (piece === "♟") {
    if (deltaCol === 0 && deltaRow === 1 && targetPiece === "") return true;
    if (deltaCol === 0 && deltaRow === 2 && fromRow === 1 && boardState[fromRow+1][fromCol] === "" && targetPiece === "") return true;
    if (Math.abs(deltaCol) === 1 && deltaRow === 1 && targetPiece && isWhite) return true;
    if (Math.abs(deltaCol) === 1 && deltaRow === 1 && !targetPiece && lastMove?.piece === "♙" &&
        lastMove.toRow === fromRow && lastMove.toCol === toCol && lastMove.fromRow === fromRow+2) return true;
    return false;
  }

  // Torres
  if (piece === "♖" || piece === "♜") {
    if (deltaRow === 0 || deltaCol === 0) {
      if (deltaRow === 0) {
        const step = deltaCol > 0 ? 1 : -1;
        for (let c = fromCol + step; c !== toCol; c += step) if (boardState[fromRow][c] !== "") return false;
      } else {
        const step = deltaRow > 0 ? 1 : -1;
        for (let r = fromRow + step; r !== toRow; r += step) if (boardState[r][fromCol] !== "") return false;
      }
      return true;
    }
    return false;
  }

  // Bispos
  if (piece === "♗" || piece === "♝") {
    if (Math.abs(deltaRow) === Math.abs(deltaCol)) {
      const stepRow = deltaRow > 0 ? 1 : -1;
      const stepCol = deltaCol > 0 ? 1 : -1;
      let r = fromRow + stepRow;
      let c = fromCol + stepCol;
      while (r !== toRow && c !== toCol) {
        if (boardState[r][c] !== "") return false;
        r += stepRow;
        c += stepCol;
      }
      return true;
    }
    return false;
  }

  // Rainha
  if (piece === "♕" || piece === "♛") {
    if (deltaRow === 0 || deltaCol === 0) return isValidMove(isWhite ? "♖" : "♜", fromRow, fromCol, toRow, toCol, boardState, lastMove);
    if (Math.abs(deltaRow) === Math.abs(deltaCol)) return isValidMove(isWhite ? "♗" : "♝", fromRow, fromCol, toRow, toCol, boardState, lastMove);
    return false;
  }

  // Rei
  if (piece === "♔" || piece === "♚") if (Math.abs(deltaRow) <= 1 && Math.abs(deltaCol) <= 1) return true;

  // Cavalo
  if (piece === "♘" || piece === "♞") {
    if ((Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 1) ||
        (Math.abs(deltaRow) === 1 && Math.abs(deltaCol) === 2)) return true;
    return false;
  }

  return false;
};

export const isKingInCheck = (boardState, isWhite) => {
  let kingRow, kingCol;
  const king = isWhite ? "♔" : "♚";

  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (boardState[r][c] === king) { kingRow = r; kingCol = c; }

  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c];
      if (piece && ["♙","♖","♘","♗","♕","♔","♟","♜","♞","♝","♛","♚"].includes(piece)) {
        const pieceIsWhite = ["♙","♖","♘","♗","♕","♔"].includes(piece);
        if (pieceIsWhite !== isWhite && isValidMove(piece, r, c, kingRow, kingCol, boardState, null)) return true;
      }
    }

  return false;
};

export function isEnemy(targetPiece, currentPiece) {
  if (!targetPiece) return false; // casa vazia
  const whitePieces = ["♙","♖","♘","♗","♕","♔"];
  const currentIsWhite = whitePieces.includes(currentPiece);
  const targetIsWhite = whitePieces.includes(targetPiece);
  return currentIsWhite !== targetIsWhite;
}
