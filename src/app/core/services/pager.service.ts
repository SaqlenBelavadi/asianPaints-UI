/**
 * @author Thanseer KA <thanseer.aliyar@speridian.com>
 * @description custom paginator
 *
 */
export class PagerService {
  getPager(
    totalItems: number,
    currentPage: number = 1,
    pageSize: number = 20,
    limit = 5 // this for shwoing in frontend
  ) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const halfLimit = Math.floor(limit / 2);
    let startPage: number;
    let endPage: number;

    if (totalPages <= limit) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= halfLimit) {
        startPage = 1;
        endPage = limit;
      } else if (currentPage + halfLimit >= totalPages) {
        startPage = totalPages - limit + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfLimit;
        endPage = currentPage + halfLimit;
      }
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }
}
