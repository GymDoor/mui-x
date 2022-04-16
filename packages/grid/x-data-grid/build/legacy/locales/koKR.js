import { koKR as koKRCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var koKRGrid = {
  // Root
  noRowsLabel: '행이 없습니다.',
  noResultsOverlayLabel: '결과값이 없습니다.',
  errorOverlayDefaultLabel: '오류가 발생했습니다.',
  // Density selector toolbar button text
  toolbarDensity: '라인 간격',
  toolbarDensityLabel: '라인 간격',
  toolbarDensityCompact: '좁게',
  toolbarDensityStandard: '기본',
  toolbarDensityComfortable: '넓게',
  // Columns selector toolbar button text
  toolbarColumns: '열 목록',
  toolbarColumnsLabel: '열 선택',
  // Filters toolbar button text
  toolbarFilters: '필터',
  toolbarFiltersLabel: '필터 표시',
  toolbarFiltersTooltipHide: '필터 숨기기',
  toolbarFiltersTooltipShow: '필터 표시',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return "".concat(count, "\uAC74\uC758 \uD544\uD130\uB97C \uC801\uC6A9\uC911");
  },
  // Export selector toolbar button text
  toolbarExport: '내보내기',
  toolbarExportLabel: '내보내기',
  toolbarExportCSV: 'CSV다운로드',
  toolbarExportPrint: '프린트',
  // Columns panel text
  columnsPanelTextFieldLabel: '열 검색',
  columnsPanelTextFieldPlaceholder: '열 이름',
  columnsPanelDragIconLabel: '열 정렬',
  columnsPanelShowAllButton: '모두 보기',
  columnsPanelHideAllButton: '모두 숨기기',
  // Filter panel text
  filterPanelAddFilter: '필터 추가',
  filterPanelDeleteIconLabel: '삭제',
  // filterPanelLinkOperator: 'Logic operator',
  filterPanelOperators: '연산자',
  // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: '그리고',
  filterPanelOperatorOr: '또는',
  filterPanelColumns: '목록',
  filterPanelInputLabel: '값',
  filterPanelInputPlaceholder: '값 입력',
  // Filter operators text
  filterOperatorContains: '포함하는',
  filterOperatorEquals: '값이 같은',
  filterOperatorStartsWith: '시작하는',
  filterOperatorEndsWith: '끝나는',
  filterOperatorIs: '~인',
  filterOperatorNot: '~아닌',
  filterOperatorAfter: '더 이후',
  filterOperatorOnOrAfter: '이후',
  filterOperatorBefore: '더 이전',
  filterOperatorOnOrBefore: '이전',
  filterOperatorIsEmpty: '값이 없는',
  filterOperatorIsNotEmpty: '값이 있는',
  filterOperatorIsAnyOf: '값 중 하나인',
  // Filter values text
  filterValueAny: '아무값',
  filterValueTrue: '참',
  filterValueFalse: '거짓',
  // Column menu text
  columnMenuLabel: '메뉴',
  columnMenuShowColumns: '열 표시',
  columnMenuFilter: '필터',
  columnMenuHideColumn: '열 숨기기',
  columnMenuUnsort: '정렬 해제',
  columnMenuSortAsc: '오름차순 정렬',
  columnMenuSortDesc: '내림차순 정렬',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return "".concat(count, "\uAC74\uC758 \uD544\uD130\uB97C \uC801\uC6A9\uC911");
  },
  columnHeaderFiltersLabel: '필터 표시',
  columnHeaderSortIconLabel: '정렬',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return "".concat(count, "\uD589 \uC120\uD0DD\uC911");
  },
  // Total row amount footer text
  footerTotalRows: '총 행수:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " / ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: '선택',
  // checkboxSelectionSelectAllRows: 'Select all rows',
  // checkboxSelectionUnselectAllRows: 'Unselect all rows',
  // checkboxSelectionSelectRow: 'Select row',
  // checkboxSelectionUnselectRow: 'Unselect row',
  // Boolean cell text
  booleanCellTrueLabel: '참',
  booleanCellFalseLabel: '거짓',
  // Actions cell more text
  actionsCellMore: '더보기',
  // Column pinning text
  // pinToLeft: 'Pin to left',
  // pinToRight: 'Pin to right',
  // unpin: 'Unpin',
  // Tree Data
  treeDataGroupingHeaderName: '그룹',
  treeDataExpand: '하위노드 펼치기',
  treeDataCollapse: '하위노드 접기' // Grouping columns
  // groupingColumnHeaderName: 'Group',
  // groupColumn: name => `Group by ${name}`,
  // unGroupColumn: name => `Stop grouping by ${name}`,
  // Master/detail
  // expandDetailPanel: 'Expand',
  // collapseDetailPanel: 'Collapse',

};
export var koKR = getGridLocalization(koKRGrid, koKRCore);