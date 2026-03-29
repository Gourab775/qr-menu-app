/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const TableContext = createContext(null);

export function TableProvider({ children, tableId }) {
  const [currentTableId, setCurrentTableId] = useState(() => {
    if (tableId) {
      sessionStorage.setItem("tableId", tableId);
      return tableId;
    }
    return sessionStorage.getItem("tableId") || null;
  });

  return (
    <TableContext.Provider value={{ tableId: currentTableId, setTableId: setCurrentTableId }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    return { tableId: null, setTableId: () => {} };
  }
  return context;
}
