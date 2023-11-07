export interface SearchProps {
  isSearch: boolean;
  setIsSearch: (value: boolean) => void;
  searchText: string;
  setSearchText: (value: string) => void;
  handleSearchResult: (value: [number, number]) => void;
}
