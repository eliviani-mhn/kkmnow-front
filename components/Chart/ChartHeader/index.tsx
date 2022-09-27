import { CountryAndStates } from "@lib/constants";
import { FunctionComponent, ReactElement } from "react";
interface ChartHeaderProps {
  title?: string | ReactElement;
  state?: string | ReactElement;
  controls?: ReactElement;
  menu?: ReactElement;
}

const ChartHeader: FunctionComponent<ChartHeaderProps> = ({ title, menu, controls, state }) => {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {title && typeof title === "string" ? (
            <span className="text-base font-bold">{title}</span>
          ) : (
            title
          )}
          {state && typeof state === "string" ? (
            <p className="text-sm text-dim">Data for {CountryAndStates[state]}</p>
          ) : (
            <>{state}</>
          )}
        </div>

        {menu && <div className="block md:hidden">{menu}</div>}
        {controls && (
          <div className="flex items-center justify-end gap-2 md:hidden">{controls}</div>
        )}
        <div className="hidden items-center justify-end gap-2 md:flex">
          {controls}
          {menu && <div className="hidden md:block">{menu}</div>}
        </div>
      </div>
    </>
  );
};

export default ChartHeader;
