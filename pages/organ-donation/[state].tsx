/**
 * Organ Donation Page <Index>
 */
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import OrganDonationDashboard from "@dashboards/organ-donation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Metadata } from "@components/index";
import { get } from "@lib/api";
import { DateTime } from "luxon";
import { CountryAndStates, STATES } from "@lib/constants";
import { useTranslation } from "next-i18next";

const OrganDonationIndex = ({
  timeseries_pledge,
  bar_age,
  bar_time,
  bar_reasons,
  heatmap_donorrate,
  state,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  return (
    <>
      <Metadata
        title={CountryAndStates[state].concat(" - ", t("nav.megamenu.dashboards.organ_donation"))}
        keywords={""}
      />
      <OrganDonationDashboard
        timeseries_pledge={timeseries_pledge}
        bar_age={bar_age}
        bar_time={bar_time}
        bar_reasons={bar_reasons}
        heatmap_donorrate={heatmap_donorrate}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  let paths: Array<any> = [];
  STATES.filter(item => !["kvy"].includes(item.key)).forEach(state => {
    paths = paths.concat([
      {
        params: {
          state: state.key,
        },
      },
      {
        params: {
          state: state.key,
        },
        locale: "ms-MY",
      },
    ]);
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "organ_donation", state: params?.state });

  // transform:
  data.barchart_time.monthly.x = data.barchart_time.monthly.x.map((item: any) => {
    const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
  });

  return {
    props: {
      ...i18n,
      timeseries_pledge: data.timeseries,
      bar_age: data.barchart_age,
      bar_time: data.barchart_time,
      bar_reasons: data.barchart_reasons,
      heatmap_donorrate: data.heatmap_pledgerrate,
      state: params?.state,
    },
  };
};

export default OrganDonationIndex;
