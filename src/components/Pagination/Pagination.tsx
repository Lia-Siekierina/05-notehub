import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = ReactPaginateModule as unknown as
  | ModuleWithDefault<ComponentType<ReactPaginateProps>>
  | ComponentType<ReactPaginateProps>;

const ReactPaginateComponent =
  "default" in ReactPaginate ? ReactPaginate.default : ReactPaginate;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <ReactPaginateComponent
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="←"
      nextLabel="→"
    />
  );
};

export default Pagination;
