import pytest
import numpy as np
from math_operations import (linear_regression,
                             expected_stock_price_with_adjustment,
                             adjusted_slope_price, stocks_bought_weight,
                             predict_stock_value)


def assert_almost_equal(actual, expected, places=2):
    assert round(actual, places) == round(expected, places)


def test_linear_regression():
    x = np.array([1, 2, 3, 4, 5])
    y = np.array([2, 4, 5, 4, 5])
    m, b = linear_regression(x, y)
    assert_almost_equal(m, 0.6, places=2)
    assert_almost_equal(b, 2.2, places=2)


def test_predict_stock_value():
    stocks_data = {
        1680969060: 5,
        1680969360: 7,
        1680969660: 546,
        1680969960: 115,
        1680970260: 41
    }
    epoch_moment = 1680970000
    predicted_value = predict_stock_value(stocks_data, epoch_moment)
    assert isinstance(predicted_value, float)


def test_stocks_bought_weight():
    stocks = 55
    weight = stocks_bought_weight(stocks)
    expected_weight = 1 / ((5 + 55 - 50) / 50)
    assert_almost_equal(weight, expected_weight, places=2)


def test_adjusted_slope_price():
    data_example = {
        1680969060: 5,
        1680969360: 7
    }
    stocks = 55
    adj_slope = adjusted_slope_price(data_example, stocks)
    assert isinstance(adj_slope, float)


def test_expected_stock_price_with_adjustment():
    data_example = {
        1680969060: 5,
        1680969360: 7
    }
    current = 10.0
    adj_slope = 1.2
    expected_value = expected_stock_price_with_adjustment(data_example,
                                                          adj_slope,
                                                          current)
    assert isinstance(expected_value, float)
