import { useState } from "react";
import { Matches, MatchRequests } from '../components/matches.api'


export const usePagination = (limit: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = (currentItems: any) => {
    if (currentItems.length === limit) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return {
    currentPage,
    handleNextPage,
    handlePreviousPage,
  };
};