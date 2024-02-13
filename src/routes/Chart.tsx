import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface IChart {
  coinId: string;
}

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: 0;
}

function Chart({ coinId }: IChart) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              name: "Price",
              data:
                data?.map((price) => ({
                  x: new Date(price.time_open * 1000),
                  y: [
                    parseFloat(price.open).toFixed(2),
                    parseFloat(price.high).toFixed(2),
                    parseFloat(price.low).toFixed(2),
                    parseFloat(price.close).toFixed(2),
                  ],
                })) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: "smooth",
              width: 3,
            },
            xaxis: {
              type: "datetime",
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#FF6363",
                  downward: "#0984e3",
                },
              },
            },
            tooltip: {
              custom: ({ dataPointIndex, w }) => {
                const data = w.config.series[0].data[dataPointIndex];
                const date = new Date(data.x).toLocaleDateString("ko-KR", {
                  month: "numeric",
                  day: "numeric",
                });
                const open = parseFloat(data.y[0]).toFixed(2);
                const high = parseFloat(data.y[1]).toFixed(2);
                const left = parseFloat(data.y[2]).toFixed(2);
                const close = parseFloat(data.y[3]).toFixed(2);

                return `
                <div class="apexcharts-tooltip-title">${date}</div>
                <div class="apexcharts-tooltip-box apexcharts-tooltip-candlestick">
                  <div>Open: <span>${open}</span></div>
                  <div>High: <span>${high}</span></div>
                  <div>Left: <span>${left}</span></div>
                  <div>Close: <span>${close}</span></div>
                </div>`;
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
