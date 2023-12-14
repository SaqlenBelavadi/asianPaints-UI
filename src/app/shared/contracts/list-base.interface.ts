export interface ListBase {

  onSortChange(value: any): void;

  onPageChange(value: any): void;

  onSearchChange(searchData: any): void;

  onSearchChipDelete(data: any,index?:number): void;

  onItemClick(value: any): void;

  onFilterChange(val: any, type: any): void;
}
