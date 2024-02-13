import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinTickers } from "../api";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
const Item = styled.div<{ fontColor: string }>`
  background-color: darkslategray;
  color: ${(props) => props.fontColor};
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  padding: 10px 0px;
  border-radius: 10px;
`;

interface IChart {
  coinId: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Price({ coinId }: IChart) {
  const { isLoading, data } = useQuery<PriceData>(["priceKey", coinId], () =>
    fetchCoinTickers(coinId)
  );
  return (
    <Container>
      <Item fontColor="white">
        Price : ${data?.quotes.USD.price.toFixed(3)}
      </Item>
      <Item fontColor="yellow">
        High Price : ${data?.quotes.USD.ath_price.toFixed(3)}
      </Item>
    </Container>
  );
}

export default Price;
