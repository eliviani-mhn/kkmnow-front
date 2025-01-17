import {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  FilterFn,
  Table as ReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { ArrowLeftIcon, ArrowRightIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid";
import { rankItem } from "@tanstack/match-sorter-utils";
import { CountryAndStates } from "@lib/constants";
import Image from "next/image";
import { useTranslation } from "next-i18next";

interface TableProps {
  className?: string;
  title?: string;
  menu?: ReactElement;
  controls?: (
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>
  ) => ReactElement | ReactElement[];
  search?: (setGlobalFilter: Dispatch<SetStateAction<string>>) => ReactElement | ReactElement[];
  cellClass?: string;
  data?: any;
  config?: Array<any>;
  enablePagination?: boolean;
  enableSticky?: boolean;
}

const relativeColor = (delta: number, inverse: boolean = false) => {
  const COLOR = {
    DEFAULT: "bg-outline",
    GREEN: "bg-green-400 text-green-600",
    RED: "bg-red-400 text-red-600",
  };
  if (inverse) return delta > 1 ? COLOR.RED : delta < 0 ? COLOR.GREEN : COLOR.DEFAULT;
  else return delta > 1 ? COLOR.GREEN : delta < 0 ? COLOR.RED : COLOR.DEFAULT;
};

const scaleColor = (value: number) =>
  value >= 75 ? "bg-[#FDC7B2]" : value >= 50 ? "bg-[#FFECE4]" : "bg-transparent";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const Table: FunctionComponent<TableProps> = ({
  className = "",
  title,
  menu,
  data = dummy,
  config = dummyConfig,
  controls,
  search,
  enablePagination = false,
  enableSticky,
  cellClass = "text-right",
}) => {
  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => config, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { t } = useTranslation();

  const sortTooltip = (sortDir: "asc" | "desc" | false) => {
    if (sortDir === false) return "Sort";
    else if (sortDir === "desc") return "Desc order";
    else if (sortDir === "asc") return "Asc order";

    return undefined;
  };
  const ReactTableProps: any = {
    data,
    columns,
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
      globalFilter: globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    sortingFns: {
      localeNumber: (row_a: any, row_b: any, column_id: any): number => {
        const [a, b] = [
          Number(row_a.getValue(column_id).replace(",", "")),
          Number(row_b.getValue(column_id).replace(",", "")),
        ];
        return a > b ? 1 : -1;
      },
    },
    debugTable: false,
  };

  const table = useReactTable(ReactTableProps);

  useEffect(() => {
    enablePagination && table.setPageSize(15);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <span className="text-base font-bold">{title ?? ""}</span>
        {menu && <div className="flex items-center justify-end gap-2">{menu}</div>}
      </div>

      {(search || controls) && (
        <div className="flex w-full flex-wrap items-center justify-between gap-4 pb-4">
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
            {controls && controls(setColumnFilters)}
          </div>
          {search && search(setGlobalFilter)}
        </div>
      )}
      <div className="table-responsive">
        <table className={`table ${className} ${enableSticky ? "table-sticky-first" : ""}`}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: [
                              header.subHeaders.length < 1
                                ? "select-none flex gap-1 text-sm justify-between text-left px-2"
                                : !header.column.columnDef.header
                                ? "hidden"
                                : "text-end pr-2",
                              header.column.getCanSort() ? "cursor-pointer" : "",
                            ].join(" "),
                            onClick: header.column.getCanSort()
                              ? header.column.getToggleSortingHandler()
                              : undefined,
                          }}
                        >
                          <div>
                            <p className="font-medium text-black">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </p>
                            {header.column.columnDef?.subheader && (
                              <p className="text-left text-dim">
                                {header.column.columnDef?.subheader}
                              </p>
                            )}
                          </div>
                          {header.subHeaders.length < 1 && (
                            <span
                              className="inline-block"
                              title={sortTooltip(header.column.getIsSorted())}
                            >
                              {{
                                asc: <ArrowUpIcon className="inline-block h-4 w-auto text-black" />,
                                desc: (
                                  <ArrowDownIcon className="inline-block h-4 w-auto text-black" />
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                              {header.column.getCanSort() && !header.column.getIsSorted() ? (
                                <ArrowsUpDownIcon className="inline-block h-4 w-auto text-dim" />
                              ) : (
                                ""
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell: any, index: number) => {
                      const lastCellInGroup = cell.column.parent
                        ? cell.column.parent?.columns[cell.column.parent?.columns.length - 1]
                        : cell.column;

                      const classNames = [
                        ...(cell.row.original.state === "mys" ? ["bg-outline"] : []),
                        ...(lastCellInGroup.id === cell.column.id
                          ? ["text-xs border-r-black"]
                          : []),
                        ...(cell.column.columnDef.relative
                          ? [
                              relativeColor(
                                cell.getValue() as number,
                                cell.column.columnDef.inverse
                              ),
                              "bg-opacity-20",
                            ]
                          : []),
                        ...(cell.column.columnDef.scale
                          ? [scaleColor(cell.getValue() as number)]
                          : []),
                        ...(cell.getValue() === null ? ["bg-outline"] : []),
                        index !== 0 ? cellClass : "",
                      ].join(" ");

                      const unit = cell.column.columnDef.unit ?? undefined;

                      return (
                        <td key={cell.id} className={classNames}>
                          <div>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            {cell.getValue() !== null ? unit : "-"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="border-r border-black">
                  <div>{t("common.no_entries")}. </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {enablePagination && (
        <div className="mt-5 flex items-center justify-center gap-4 text-sm">
          <button
            className="flex flex-row gap-2 rounded border py-1 px-2 disabled:bg-slate-100 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeftIcon className="h-5 w-4 text-dim" />
            {t("common.previous")}
          </button>

          <span className="flex items-center gap-1 text-center text-sm">
            {t("common.page_of", {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
            {/* <div>Page</div>
            <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{" "}
            {table.getPageCount()} */}
          </span>
          <button
            className="flex flex-row gap-2 rounded border py-1 px-2 disabled:bg-slate-100 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("common.next")} <ArrowRightIcon className="h-5 w-4 text-dim" />
          </button>
        </div>
      )}
    </>
  );
};

const dummyConfig = [
  {
    header: "",
    id: "state",
    accessorKey: "state",
    enableSorting: false,
    cell: (item: any) => {
      const state = item.getValue() as string;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={`/static/images/states/${state}.jpeg`}
            width={28}
            height={16}
            alt={CountryAndStates[state]}
          />
          <span>{CountryAndStates[state]}</span>
        </div>
      );
    },
  },
  {
    id: "total",
    header: "Total",
    columns: [
      {
        id: "total.perc_1dose",
        header: "% 1 Dose",
        subHeaders: "hello",
        accessorFn: (item: any) => item.total.perc_1dose,
      },
      {
        id: "total.perc_2dose",
        header: "% 2 Doses",
        accessorFn: (item: any) => item.total.perc_2dose,
      },
      {
        id: "perc_1booster",
        header: "% 1 Booster",
        accessorFn: (item: any) => item.total.perc_1booster,
      },
    ],
  },
  {
    id: "adult",
    header: "Adults",
    columns: [
      {
        id: "adult.perc_1dose",
        header: "% 1 Dose",
        accessorFn: (item: any) => item.adult.perc_1dose,
      },
      {
        id: "adult.perc_2dose",
        header: "% 2 Doses",
        accessorFn: (item: any) => item.adult.perc_2dose,
      },
      {
        id: "adult.perc_1booster",
        header: "% 1 Booster",
        accessorFn: (item: any) => item.adult.perc_1booster,
      },
    ],
  },
  {
    id: "adolescent",
    header: "Adolescent",
    columns: [
      {
        id: "adolescent.perc_1dose",
        header: "% 1 Dose",
        accessorFn: (item: any) => item.adolescent.perc_1dose,
      },
      {
        id: "adolescent.perc_2dose",
        header: "% 2 Doses",
        accessorFn: (item: any) => item.adolescent.perc_2dose,
      },
    ],
  },
  {
    id: "children",
    header: "Children",
    columns: [
      {
        id: "children.perc_1dose",
        header: "% 1 Dose",
        accessorFn: (item: any) => item.children.perc_1dose,
      },
      {
        id: "children.perc_2dose",
        header: "% 2 Doses",
        accessorFn: (item: any) => item.children.perc_2dose,
      },
    ],
  },
];

const dummy = Array(Object.keys(CountryAndStates).length)
  .fill(0)
  .map((_, index) => {
    const state = Object.keys(CountryAndStates)[index];
    return {
      id: index,
      state: state,
      total: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
        perc_1booster: Math.floor(Math.random() * 10) + 1,
      },
      adult: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
        perc_1booster: Math.floor(Math.random() * 10) + 1,
      },
      adolescent: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
      },
      children: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
      },
      highlight: state === "mys",
    };
  });

export default Table;
