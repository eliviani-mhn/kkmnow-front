import { CountryAndStates } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import { useTranslation } from "next-i18next";
import Image from "next/image";

export const COVID_TABLE_SCHEMA = () => {
  const { t } = useTranslation("common");
  return [
    {
      name: t("covid.tab_table1"),
      config: [
        {
          header: "",
          id: "state",
          accessorKey: "state",
          enableSorting: false,
          cell: (item: any) => {
            const state = item.getValue() as string;
            return (
              <div className="flex items-center gap-2">
                <Image
                  src={`/static/images/states/${state}.jpeg`}
                  width={20}
                  height={12}
                  alt={CountryAndStates[state]}
                />
                <span className="text-sm">{CountryAndStates[state]}</span>
              </div>
            );
          },
        },
        {
          id: "deaths",
          columns: [
            {
              id: "deaths.deaths",
              header: t("covid.table_death"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => numFormat(item.deaths.deaths, "standard"),
              sortingFn: "localeNumber",
            },
            {
              id: "deaths.deaths_100k",
              header: "Per 100K",
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) =>
                item.deaths.deaths_trend && item.deaths.deaths_100k.toFixed(1),
              sortingFn: "localeNumber",
            },
            {
              id: "deaths.deaths_trend",
              header: t("covid.table_death_trend"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) =>
                item.deaths.deaths_trend && item.deaths.deaths_trend.toFixed(1),
              relative: true,
              inverse: true,
              unit: "%",
            },
          ],
        },
        {
          id: "admitted",
          columns: [
            {
              id: "admitted.admitted",
              header: t("covid.table_admission"),
              subheader: t("covid.table_past14d"),
              maxWidth: 10,
              sortDescFirst: true,
              accessorFn: (item: any) => numFormat(item.admitted.admitted, "standard"),
              sortingFn: "localeNumber",
            },
            {
              id: "admitted.util_hosp",
              header: t("covid.table_admission_util"),
              sortDescFirst: true,
              accessorFn: (item: any) =>
                item.admitted.util_hosp && item.admitted.util_hosp.toFixed(1),
              unit: "%",
            },
            {
              id: "admitted.admitted_trend",
              header: t("covid.table_admission_trend"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) =>
                item.admitted.admitted_trend !== null
                  ? item.admitted.admitted_trend.toFixed(1)
                  : item.admitted.admitted_trend,
              relative: true,
              inverse: true,
              unit: "%",
            },
          ],
        },
        {
          id: "cases",
          columns: [
            {
              id: "cases.cases",
              header: t("covid.table_cases"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => numFormat(item.cases.cases, "standard"),
              sortingFn: "localeNumber",
            },
            {
              id: "cases.cases_100k",
              header: "Per 100K",
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => item.cases.cases_100k && item.cases.cases_100k.toFixed(1),
              sortingFn: "localeNumber",
            },
            {
              id: "cases.cases_posrate",
              header: t("covid.table_cases_posrate"),
              sortDescFirst: true,
              accessorFn: (item: any) => item.cases.cases_posrate.toFixed(1),
              unit: "%",
            },
            {
              id: "cases.cases_trend",
              header: t("covid.table_cases_trend"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => item.cases.cases_trend.toFixed(1),
              relative: true,
              inverse: true,
              unit: "%",
            },
          ],
        },
      ],
    },
    {
      name: t("covid.tab_table2"),
      config: [
        {
          header: "",
          id: "state",
          accessorKey: "state",
          enableSorting: false,
          cell: (item: any) => {
            const state = item.getValue() as string;
            return (
              <div className="flex items-center gap-2">
                <Image
                  src={`/static/images/states/${state}.jpeg`}
                  width={20}
                  height={12}
                  alt={CountryAndStates[state]}
                />
                <span className="text-sm">{CountryAndStates[state]}</span>
              </div>
            );
          },
        },
        {
          id: "deaths",
          columns: [
            {
              id: "deaths.deaths",
              header: t("covid.table_death"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => numFormat(item.deaths.deaths, "standard"),
              sortingFn: "localeNumber",
            },
            {
              id: "deaths.deaths_100k",
              header: "Per 100K",
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => numFormat(item.deaths.deaths_100k, "standard"),
              sortingFn: "localeNumber",
            },
            {
              id: "deaths.deaths_trend",
              header: t("covid.table_death_trend"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) =>
                item.deaths.deaths_trend !== null
                  ? item.deaths.deaths_trend.toFixed(1)
                  : item.deaths.deaths_trend,
              relative: true,
              inverse: true,
              unit: "%",
            },
          ],
        },
      ],
    },
    {
      name: "Hosp.",
      config: [
        {
          header: "",
          id: "state",
          accessorKey: "state",
          enableSorting: false,
          cell: (item: any) => {
            const state = item.getValue() as string;
            return (
              <div className="flex items-center gap-2">
                <Image
                  src={`/static/images/states/${state}.jpeg`}
                  width={20}
                  height={12}
                  alt={CountryAndStates[state]}
                />
                <span className="text-sm">{CountryAndStates[state]}</span>
              </div>
            );
          },
        },
        {
          id: "admitted",
          columns: [
            {
              id: "admitted.admitted",
              header: t("covid.table_admission"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => numFormat(item.admitted.admitted, "standard"),
              sortingFn: "localeNumber",
            },
            {
              id: "admitted.util_hosp",
              header: t("covid.table_admission_util"),
              sortDescFirst: true,
              accessorFn: (item: any) =>
                item.admitted.util_hosp && item.admitted.util_hosp.toFixed(1),
              unit: "%",
            },
            {
              id: "admitted.admitted_trend",
              header: t("covid.table_admission_trend"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) =>
                item.admitted.admitted_trend !== null
                  ? item.admitted.admitted_trend.toFixed(1)
                  : item.admitted.admitted_trend,
              relative: true,
              inverse: true,
              unit: "%",
            },
          ],
        },
      ],
    },
    {
      name: t("covid.tab_table4"),
      config: [
        {
          header: "",
          id: "state",
          accessorKey: "state",
          enableSorting: false,
          cell: (item: any) => {
            const state = item.getValue() as string;
            return (
              <div className="flex items-center gap-2">
                <Image
                  src={`/static/images/states/${state}.jpeg`}
                  width={20}
                  height={12}
                  alt={CountryAndStates[state]}
                />
                <span className="text-sm">{CountryAndStates[state]}</span>
              </div>
            );
          },
        },
        {
          id: "cases",
          columns: [
            {
              id: "cases.cases",
              header: t("covid.table_cases"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => numFormat(item.cases.cases, "standard"),
              sortingFn: "localeNumber",
            },
            {
              id: "cases.cases_100k",
              header: "Per 100K",
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => item.cases.cases_100k && item.cases.cases_100k.toFixed(1),
              sortingFn: "localeNumber",
            },
            {
              id: "cases.cases_posrate",
              header: t("covid.table_cases_posrate"),
              sortDescFirst: true,
              accessorFn: (item: any) => item.cases.cases_posrate.toFixed(1),
              unit: "%",
            },
            {
              id: "cases.cases_trend",
              header: t("covid.table_cases_trend"),
              subheader: t("covid.table_past14d"),
              sortDescFirst: true,
              accessorFn: (item: any) => item.cases.cases_trend.toFixed(1),
              relative: true,
              inverse: true,
              unit: "%",
            },
          ],
        },
      ],
    },
  ];
};
