import pytest
import numpy as np
from math_operations import (linear_regression,
                             expected_stock_price_with_adjustment,
                             stocks_bought_weight,
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
        1680969660: 5,
        1680969960: 5,
        1680970260: 4
    }
    epoch_moment = 1680973000
    expected_value = 0.746666666585952
    predicted_value = predict_stock_value(stocks_data, epoch_moment)
    assert_almost_equal(expected_value, predicted_value, places=2)


def test_stocks_bought_weight():
    stocks = 55
    weight = stocks_bought_weight(stocks)
    expected_weight = 1 + ((5 + 55 - 50) / 50)
    assert_almost_equal(weight, expected_weight, places=2)


def test_expected_stock_price_with_adjustment():
    data_example = {
        1680969060: 5,
        1680969360: 7,
        1680969660: 5,
        1680969960: 5,
        1680970260: 6
    }
    prediction_time = 1680980260
    amount_bought = 45
    predicted_value = expected_stock_price_with_adjustment(
        data_example, prediction_time, amount_bought
    )
    expected_value = 5.6

    assert_almost_equal(predicted_value, expected_value, places=1)
