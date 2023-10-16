import pytest
from utils import convert_str_to_typed


def test_convert_str_to_int():
    assert type(convert_str_to_typed("123")) is int


def test_convert_str_to_float():
    assert type(convert_str_to_typed("12.5")) is float


def test_convert_str_to_float_2():
    assert type(convert_str_to_typed("125.")) is float


def test_convert_str_to_float_3():
    assert type(convert_str_to_typed(".125")) is float


def test_convert_str_to_bool_true_lower():
    assert type(convert_str_to_typed("true")) is bool


def test_convert_str_to_bool_true_title():
    assert type(convert_str_to_typed("True")) is bool


def test_convert_str_to_bool_true_upper():
    assert type(convert_str_to_typed("TRUE")) is bool


def test_convert_str_to_bool_false():
    assert type(convert_str_to_typed("false")) is bool


def test_convert_str_to_same_str():
    assert type(convert_str_to_typed("Some Text")) is str


def test_convert_str_to_same_str_with_dot():
    assert type(convert_str_to_typed("Some.Text")) is str


def test_convert_str_to_none():
    assert convert_str_to_typed("None") is None


def test_convert_str_with_leading_zero():
    # No debe considerarse un int.
    assert type(convert_str_to_typed("0123")) is str


def test_convert_str_with_multiple_dots():
    assert type(convert_str_to_typed("1.2.3")) is str
