/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

const TableContext = createContext(null);

export function TableProvider({ children, tableId }) {
  const [currentTableId, setCurrentTableId] = useState(() => {
    if (tableId) {
      sessionStorage.setItem("tableId", tableId);
      return tableId;
    }
    return sessionStorage.getItem("tableId") || null;
  });

  const updateTableId = useCallback((newTableId) => {
    setCurrentTableId(newTableId);
    if (newTableId) {
      sessionStorage.setItem("tableId", newTableId);
    } else {
      sessionStorage.removeItem("tableId");
    }
  }, []);

  return (
    <TableContext.Provider value={{ tableId: currentTableId, setTableId: updateTableId }}>
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
