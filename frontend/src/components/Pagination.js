import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Pagination = ({ pages, page, isAdmin = false, keyword = '' }) => {
  const navigate = useNavigate();

  if (!pages || pages <= 1) return null;

  const currentPage = Number(page);

  const goToPage = (pageNumber) => {
    if (isAdmin) {
      navigate(`/admin/productlist/${pageNumber}`);
    } else if (keyword) {
      navigate(`/search/${keyword}/page/${pageNumber}`);
    } else {
      navigate(`/page/${pageNumber}`);
    }
  };

  return (
    <BSPagination className="justify-content-center my-3">
      {[...Array(pages).keys()].map((x) => (
        <BSPagination.Item
          key={x + 1}
          active={x + 1 === currentPage}
          onClick={() => goToPage(x + 1)}
        >
          {x + 1}
        </BSPagination.Item>
      ))}
    </BSPagination>
  );
};

export default Pagination;