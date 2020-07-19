#!/usr/bin/python3
from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.techindicators import TechIndicators
import matplotlib.pyplot as plt

API_KEY_PATH = "/home/tarun/api_keys/alpha_vantage_api_key"


def get_api_key():
    with open(API_KEY_PATH) as api_file:
        return api_file.read().rstrip("\n")


def main():
    api_key = get_api_key()
    # print("The api key is:",api_key)
    ts = TimeSeries(key=api_key, output_format='pandas')
    # data, meta_data = ts.get_intraday(symbol='NSE:TATAMOTORS',interval='5min', outputsize='full')
    # print(data)
    # data['4. close'].plot()
    # plt.title('Intraday TimeSeries BEL')
    # plt.show()
    ti = TechIndicators(key=api_key, output_format='pandas')
    data, meta_data = ti.get_bbands(
        symbol='NSE:TATAMOTORS', interval='weekly', time_period=60, nbdevup=3, nbdevdn=3)
    data.plot()
    plt.title('BBbands indicator for  TATA MOTROS stock (60 min)')
    plt.show()


def main1():
    api_key = get_api_key()
    ts = TimeSeries(key=api_key, output_format='pandas')
    data, meta_data = ts.get_daily_adjusted(symbol='TATAMOTORS.NSE')
    print(data)


def main2():
    ts = TimeSeries(key='API_KEY', output_format='pandas')
    data, meta_data = ts.get_daily_adjusted(symbol='NSE:TITAN', outputsize='full')
    data['close'].plot()
    plt.title('Daily Adjusted for the TITAN stock ')
    plt.show()

if __name__ == "__main__":
    main2()
